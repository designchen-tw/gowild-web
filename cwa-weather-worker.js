/**
 * Cloudflare Worker: serves CWA forecast data and protects the authorization key.
 * Configure CWA_API_KEY as a Worker Secret. Never put the key in this file.
 * Optional variable ALLOWED_ORIGINS: comma-separated origin allowlist.
 * Optional KV binding CONDITIONS_HISTORY: station wind/heat and Longdong tide history.
 * The hourly Cron prewarms Longdong, Kenting, Defulan and Guanziling station samples.
 */

// Public CWA marine table: column meanings are fixed by OBS_Marine.html.
// Parse only the Longdong buoy row; '-' is missing, never a calm/zero wave.
export function normalizeLongdongWaveHTML(html, nowMs = Date.now()) {
  const sourceUrl = 'https://www.cwa.gov.tw/V8/C/M/OBS_Marine.html?seas=OSea01&page=0';
  const base = { stationId: '46694A', stationName: '龍洞浮標', stationNameEn: 'Longdong buoy', sourceType: 'observation', sourceUrl, observedAt: null, height: null, meanPeriod: null, direction: null, status: 'unavailable' };
  const row = (String(html).match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) || []).find(row => /stations_profile\(['"]46694A['"]\)/.test(row));
  if (!row) return base;
  const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(match => match[1]);
  if (cells.length !== 12) return base;
  const plain = value => String(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ').replace(/\s+/g, ' ').trim();
  const numeric = value => { const text = plain(value); if (!/^\d+(?:\.\d+)?$/.test(text)) return null; const n = Number(text); return Number.isFinite(n) ? n : null; };
  const match = plain(row.match(/<th\b[^>]*>([\s\S]*?)<\/th>/i)?.[1] || '').match(/(\d{1,2})日\s*(\d{1,2})時/);
  if (match) {
    const local = new Date(nowMs + 8 * 3600000), day = Number(match[1]), hour = Number(match[2]);
    const candidates = [-1, 0, 1].map(offset => {
      const anchor = new Date(Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + offset, 1));
      const stamp = Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), day, hour) - 8 * 3600000;
      const check = new Date(stamp + 8 * 3600000);
      return check.getUTCDate() === day && hour <= 23 ? stamp : NaN;
    }).filter(Number.isFinite).sort((a, b) => Math.abs(a - nowMs) - Math.abs(b - nowMs));
    if (candidates.length) base.observedAt = new Date(candidates[0]).toISOString();
  }
  const height = numeric(cells[1]), period = numeric(cells[3]);
  const directionText = plain(cells[2].match(/<span\b[^>]*class=["'][^"']*sr-only[^"']*["'][^>]*>([\s\S]*?)<\/span>/i)?.[1] || cells[2]);
  const names = ['北北東','東北東','東南東','南南東','南南西','西南西','西北西','北北西','東北','東南','西南','西北','北','東','南','西'];
  base.direction = names.find(name => directionText.startsWith(name)) || null;
  base.meanPeriod = period !== null && period > 0 && period <= 60 ? period : null;
  const stamp = Date.parse(base.observedAt), age = nowMs - stamp;
  if (!Number.isFinite(stamp) || age < -15 * 60000 || age > 3 * 3600000) { base.status = Number.isFinite(stamp) ? 'stale' : 'unavailable'; return base; }
  if (height !== null && height <= 40) { base.height = height; base.status = 'available'; }
  return base;
}

export function extractLongdongTideEvents(data) {
  const result = [];
  const visit = (value, inStation = false) => {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach(item => visit(item, inStation)); return; }
    const id = value.LocationId || value.locationId;
    const selected = id ? String(id) === 'A01400' : inStation;
    if (selected) {
      const raw = value.DateTime || value.dateTime, label = String(value.Tide || value.tide || '');
      if (raw && /滿潮|乾潮|高潮|低潮|high|low/i.test(label)) {
        const time = /(?:Z|[+-]\d{2}:?\d{2})$/i.test(raw) ? raw : String(raw).replace(' ', 'T') + '+08:00';
        if (Number.isFinite(Date.parse(time))) result.push({ time, kind: /滿潮|高潮|high/i.test(label) ? 'high' : 'low' });
      }
    }
    Object.values(value).forEach(item => visit(item, selected));
  };
  visit(data); return result;
}

export function mergeLongdongTideEvents(previous, current, nowMs = Date.now()) {
  const map = new Map(), incoming = Array.isArray(current) ? current : [];
  const stamps = incoming.map(row => Date.parse(row?.time)).filter(Number.isFinite);
  const boundary = stamps.length ? Math.floor((Math.min(...stamps) + 8 * 3600000) / 86400000) * 86400000 - 8 * 3600000 : Infinity;
  const retained = (Array.isArray(previous) ? previous : []).filter(row => Date.parse(row?.time) < boundary);
  for (const row of [...retained, ...incoming]) {
    const stamp = Date.parse(row?.time);
    if (['high', 'low'].includes(row?.kind) && Number.isFinite(stamp) && stamp >= nowMs - 48 * 3600000 && stamp <= nowMs + 35 * 86400000) map.set(`${stamp}:${row.kind}`, { time: new Date(stamp).toISOString(), kind: row.kind });
  }
  return [...map.values()].sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
}

// Existing hourly Cron performs at most one extra tide download per Taipei day.
export async function prewarmLongdongTides(env, nowMs = Date.now()) {
  if (!env.CWA_API_KEY || !env.CONDITIONS_HISTORY) return;
  const day = new Date(nowMs + 8 * 3600000).toISOString().slice(0, 10);
  const checkedKey = 'longdong:tide-prewarm-day:v1';
  if (await env.CONDITIONS_HISTORY.get(checkedKey) === day) return;
  const address = new URL('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-A0021-001');
  address.searchParams.set('format', 'JSON'); address.searchParams.set('LocationId', 'A01400');
  let response, data = null;
  try {
    response = await fetch(address, { headers: { Accept: 'application/json', Authorization: env.CWA_API_KEY }, signal: AbortSignal.timeout(8000) });
    data = response.ok ? await response.json().catch(() => null) : null;
  } catch { /* Try the official File API when REST is unavailable. */ }
  if (!extractLongdongTideEvents(data).length) {
    const fallback = new URL('https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-A0021-001');
    fallback.searchParams.set('Authorization', env.CWA_API_KEY); fallback.searchParams.set('format', 'JSON'); fallback.searchParams.set('downloadType', 'WEB'); fallback.searchParams.set('LocationId', 'A01400');
    response = await fetch(fallback, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
    data = response.ok ? await response.json().catch(() => null) : null;
  }
  const current = extractLongdongTideEvents(data); if (!current.length) return;
  const key = 'longdong:tide-events:v1', previous = await env.CONDITIONS_HISTORY.get(key, 'json');
  await env.CONDITIONS_HISTORY.put(key, JSON.stringify(mergeLongdongTideEvents(previous, current, nowMs)), { expirationTtl: 40 * 86400 });
  await env.CONDITIONS_HISTORY.put(checkedKey, day, { expirationTtl: 2 * 86400 });
}

const marineInflight = new Map();
const DEFAULT_ORIGINS = ["https://gowild.one", "https://www.gowild.one"];

function corsHeaders(origin, allowed) {
  return {
    "Access-Control-Allow-Origin": origin && allowed.includes(origin) ? origin : "https://gowild.one",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const allowed = (env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(","))
      .split(",").map(value => value.trim()).filter(Boolean);
    const headers = corsHeaders(origin, allowed);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
    const routes = {
      "/api/longdong": { current: "F-B0053-005", weekly: ["F-B0053-001", "F-B0053-003"], conditionLocationName: "龍洞灣公園", lat: 25.111, lon: 121.919, stationId: "C0A950" },
      "/api/kenting": { current: "F-D0047-033", weekly: ["F-D0047-035"], conditionLocationName: "恆春鎮", lat: 21.926, lon: 120.829 },
      "/api/defulan": { current: "F-D0047-073", weekly: ["F-D0047-075"], conditionLocationName: "和平區", lat: 24.174, lon: 120.974 },
      "/api/guanziling": { current: "F-D0047-077", weekly: ["F-D0047-079"], conditionLocationName: "白河區", lat: 23.3283185, lon: 120.4889894, stationId: "C0X240" }
    };
    const waveOnly = url.pathname === "/api/longdong/wave";
    const route = routes[waveOnly ? "/api/longdong" : url.pathname];
    if (request.method !== "GET" || !route) {
      return Response.json({ error: "Not found" }, { status: 404, headers });
    }
    if (!origin || !allowed.includes(origin)) {
      return Response.json({ error: "Origin not allowed" }, { status: 403, headers });
    }
    if (!env.CWA_API_KEY) {
      return Response.json({ error: "Weather service is not configured" }, { status: 503, headers });
    }

    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}${url.pathname}?schema=climbing-conditions-v26`, { method: "GET" });
    const cached = waveOnly ? null : await cache.match(cacheKey);
    if (cached) {
      const responseHeaders = new Headers(cached.headers);
      for (const [key, value] of Object.entries(headers)) responseHeaders.set(key, value);
      return new Response(cached.body, { status: cached.status, headers: responseHeaders });
    }

    const fetchProduct = async (product, params = {}) => {
      const readJson = async response => {
        const body = await response.text();
        let json;
        try { json = JSON.parse(body); } catch { json = null; }
        const reason = json?.error?.message || json?.message || json?.result?.message || body.slice(0, 240);
        if (!response.ok) throw new Error(`HTTP ${response.status}${reason ? `: ${reason}` : ""}`);
        if (!json) throw new Error("returned invalid JSON");
        if (json.success === "false" || json.success === false) {
          throw new Error(json?.error?.message || json?.message || json?.result?.message || "request rejected");
        }
        return json;
      };

      const restUrl = new URL(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/${product}`);
      restUrl.searchParams.set("format", "JSON");
      for (const [key, value] of Object.entries(params)) restUrl.searchParams.set(key, value);
      try {
        const response = await fetch(restUrl, {
          headers: { Accept: "application/json", Authorization: env.CWA_API_KEY }
        });
        return await readJson(response);
      } catch (restError) {
        const fileUrl = new URL(`https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/${product}`);
        fileUrl.searchParams.set("Authorization", env.CWA_API_KEY);
        fileUrl.searchParams.set("downloadType", "WEB");
        fileUrl.searchParams.set("format", "JSON");
        for (const [key, value] of Object.entries(params)) fileUrl.searchParams.set(key, value);
        try {
          const response = await fetch(fileUrl, { headers: { Accept: "application/json" } });
          return await readJson(response);
        } catch (fileError) {
          throw new Error(`CWA ${product}: REST ${restError.message}; File API ${fileError.message}`);
        }
      }
    };

    const fetchObservationProduct = async product => {
      const observationKey = new Request(`${url.origin}/_cwa-cache/${product}?schema=observation-v1`, { method: "GET" });
      const cachedObservation = await cache.match(observationKey);
      if (cachedObservation) return cachedObservation.json();
      const data = await fetchProduct(product);
      const response = Response.json(data, { headers: { "Cache-Control": "public, max-age=600" } });
      ctx.waitUntil(cache.put(observationKey, response.clone()));
      return data;
    };

    const readLongdongWave = async () => {
      const key = new Request(`${url.origin}/_cwa-cache/longdong-wave?schema=marine-v2`);
      const fresh = value => value?.status === 'available' && Number.isFinite(value.height) && value.height >= 0 && value.height <= 40 && Date.now() - Date.parse(value.observedAt) >= -900000 && Date.now() - Date.parse(value.observedAt) <= 10800000;
      const saved = await cache.match(key);
      if (saved) { const value = await saved.json(); if (fresh(value)) return value; }
      const historyKey = 'longdong:last-valid-wave:v1';
      let previous = null;
      if (env.CONDITIONS_HISTORY) try { previous = await env.CONDITIONS_HISTORY.get(historyKey, 'json'); } catch {}
      let wave = null, failure = null;
      try {
        const response = await fetch('https://www.cwa.gov.tw/V8/C/M/OBS_Marine/48hrsSeaObs_MOD/OSea01.html', {
          headers: { Accept: 'text/html' }, signal: AbortSignal.timeout(8000)
        });
        if (!response.ok) throw new Error(`CWA marine HTTP ${response.status}`);
        wave = normalizeLongdongWaveHTML(await response.text());
      } catch (error) { failure = error; }
      if (fresh(wave)) {
        ctx.waitUntil(cache.put(key, Response.json(wave, { headers: { 'Cache-Control': 'public, max-age=900' } })));
        if (env.CONDITIONS_HISTORY && (!fresh(previous) || Date.parse(wave.observedAt) > Date.parse(previous.observedAt))) {
          ctx.waitUntil(env.CONDITIONS_HISTORY.put(historyKey, JSON.stringify(wave), { expirationTtl: 6 * 3600 }));
        }
        return wave;
      }
      // Preserve the actual observation time; never refresh a stale record's age.
      if (fresh(previous)) {
        const fallback = { ...previous, fallback: true };
        ctx.waitUntil(cache.put(key, Response.json(fallback, { headers: { 'Cache-Control': 'public, max-age=900' } })));
        return fallback;
      }
      // Missing or failed observations must not become a 15-minute marine cache.
      if (failure) throw failure;
      return wave;
    };
    const fetchLongdongWave = () => {
      if (marineInflight.has(url.origin)) return marineInflight.get(url.origin);
      const task = readLongdongWave().finally(() => marineInflight.delete(url.origin));
      marineInflight.set(url.origin, task); return task;
    };
    if (waveOnly) {
      try {
        const wave = await fetchLongdongWave();
        return Response.json({ wave, fetchedAt: new Date().toISOString() }, {
          headers: { ...headers, 'Cache-Control': wave?.status === 'available' ? 'public, max-age=900' : 'no-store', 'X-Content-Type-Options': 'nosniff' }
        });
      } catch {
        return Response.json({ wave: null, error: 'Wave observations unavailable' }, { status: 502, headers: { ...headers, 'Cache-Control': 'no-store' } });
      }
    }
    const retainLongdongTides = async data => {
      const current = extractLongdongTideEvents(data), key = 'longdong:tide-events:v1';
      if (!env.CONDITIONS_HISTORY) return { events: mergeLongdongTideEvents([], current), retained: false };
      try {
        const previous = await env.CONDITIONS_HISTORY.get(key, 'json');
        const events = mergeLongdongTideEvents(previous, current);
        // Write only when event history changes; avoid a KV write per visitor.
        const signature = JSON.stringify(events);
        if (signature !== JSON.stringify(previous || [])) ctx.waitUntil(env.CONDITIONS_HISTORY.put(key, signature, { expirationTtl: 40 * 86400 }));
        return { events, retained: true };
      } catch { return { events: mergeLongdongTideEvents([], current), retained: false }; }
    };

    const walkData = (value, fn) => {
      if (!value) return;
      if (Array.isArray(value)) { value.forEach(item => walkData(item, fn)); return; }
      if (typeof value !== "object") return;
      fn(value); Object.values(value).forEach(item => walkData(item, fn));
    };
    const pick = (root, names) => {
      let found = null; const wanted = new Set(names.map(x => x.toLowerCase()));
      const visit = value => {
        if (found !== null || !value || typeof value !== "object") return;
        for (const [key, item] of Object.entries(value)) if (wanted.has(key.toLowerCase())) { found = item; return; }
        for (const item of Object.values(value)) visit(item);
      };
      visit(root); return found;
    };
    const numberValue = value => {
      if (Array.isArray(value)) { for (const item of value) { const n = numberValue(item); if (n !== null) return n; } return null; }
      if (value && typeof value === "object") value = value.ElementValue ?? value.elementValue ?? value.Value ?? value.value ?? value.Precipitation ?? value.precipitation;
      if (value === "T") return 0;
      const match = String(value ?? "").match(/-?\d+(?:\.\d+)?/);
      if (!match) return null;
      const n = Number(match[0]); return n === -98 ? 0 : n <= -90 ? null : n;
    };
    const rainfallValue = value => {
      if (Array.isArray(value)) return value.map(rainfallValue).find(item => item !== null) ?? null;
      if (value && typeof value === "object") return rainfallValue(value.ElementValue ?? value.elementValue ?? value.Value ?? value.value ?? value.Precipitation ?? value.precipitation);
      return value === "T" ? 0.05 : numberValue(value);
    };
    const stationPosition = row => {
      const geo = row.GeoInfo ?? row.geoInfo ?? {};
      const raw = geo.Coordinates ?? geo.coordinates ?? row.Coordinates ?? row.coordinates ?? [];
      const list = Array.isArray(raw) ? raw : [raw];
      const coordinate = list.find(item => /WGS.?84/i.test(String(item?.CoordinateName ?? item?.coordinateName ?? ""))) || list[0] || {};
      const lat = numberValue(coordinate.StationLatitude ?? coordinate.stationLatitude ?? coordinate.Latitude ?? coordinate.latitude ?? row.StationLatitude ?? row.stationLatitude ?? row.lat);
      const lon = numberValue(coordinate.StationLongitude ?? coordinate.stationLongitude ?? coordinate.Longitude ?? coordinate.longitude ?? row.StationLongitude ?? row.stationLongitude ?? row.lon);
      return lat === null || lon === null ? null : { lat, lon };
    };
    const stationDistance = (position, route) => {
      if (!position) return Infinity;
      const rad = value => value * Math.PI / 180;
      const dLat = rad(position.lat - route.lat), dLon = rad(position.lon - route.lon);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(route.lat)) * Math.cos(rad(position.lat)) * Math.sin(dLon / 2) ** 2;
      return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const stationRows = (data, route, kind) => {
      const rows = [];
      walkData(data, row => {
        const id = row.StationId ?? row.StationID ?? row.stationId ?? row.stationID;
        const weather = row.WeatherElement ?? row.weatherElement;
        const rainfall = row.RainfallElement ?? row.rainfallElement;
        if (!id || (kind === "weather" ? !weather : !rainfall)) return;
        const position = stationPosition(row);
        rows.push({ row, id: String(id), position, distance: stationDistance(position, route) });
      });
      if (route.stationId) {
        const preferred = rows.find(item => item.id === route.stationId);
        if (preferred) return preferred;
      }
      return rows.filter(item => Number.isFinite(item.distance) && item.distance <= 60).sort((a, b) => a.distance - b.distance)[0] || null;
    };
    const normalizeStation = (data, route) => {
      const selected = stationRows(data, route, "weather");
      if (!selected) return null;
      const row = selected.row;
      const weather = row.WeatherElement ?? row.weatherElement ?? {};
      const temperatureValue = value => {
        const raw = value && typeof value === "object" ? pick(value, ["AirTemperature", "Temperature", "TEMP", "Value"]) : value;
        const match = String(raw ?? "").match(/-?\d+(?:\.\d+)?/);
        const number = match ? Number(match[0]) : null;
        return number !== null && number >= -30 && number <= 50 ? number : null;
      };
      let humidity = numberValue(pick(weather, ["RelativeHumidity", "RH", "HUMD"]));
      if (humidity !== null && humidity >= 0 && humidity <= 1) humidity *= 100;
      return {
        stationId: selected.id,
        stationName: row.StationName ?? row.stationName ?? row.LocationName ?? row.locationName ?? "",
        distanceKm: Number.isFinite(selected.distance) ? Math.round(selected.distance * 10) / 10 : null,
        humidity,
        temperature: temperatureValue(pick(weather, ["AirTemperature", "Temperature", "TEMP"])),
        dailyHigh: temperatureValue(pick(weather, ["DailyHigh"])),
        dailyLow: temperatureValue(pick(weather, ["DailyLow"])),
        windDirection: numberValue(pick(weather, ["WindDirection", "WD"])),
        windSpeed: numberValue(pick(weather, ["WindSpeed", "WS"])),
        observedAt: pick(row, ["DateTime"])
      };
    };
    const normalizeRain = (data, route) => {
      const selected = stationRows(data, route, "rain");
      if (!selected) return null;
      const row = selected.row;
      const rainfall = row.RainfallElement ?? row.rainfallElement ?? {};
      const past1 = rainfall.Past1hr ?? rainfall.past1hr ?? {};
      const past3 = rainfall.Past3hr ?? rainfall.past3hr ?? {};
      const past6 = rainfall.Past6hr ?? rainfall.past6hr ?? {};
      const past12 = rainfall.Past12hr ?? rainfall.past12hr ?? {};
      const past24 = rainfall.Past24hr ?? rainfall.past24hr ?? {};
      const past2days = rainfall.Past2days ?? rainfall.past2days ?? {};
      return {
        stationId: selected.id,
        stationName: row.StationName ?? row.stationName ?? row.LocationName ?? row.locationName ?? "",
        distanceKm: Number.isFinite(selected.distance) ? Math.round(selected.distance * 10) / 10 : null,
        past1hr: rainfallValue(pick(past1, ["Precipitation"])),
        past3hr: rainfallValue(pick(past3, ["Precipitation"])),
        past6hr: rainfallValue(pick(past6, ["Precipitation"])),
        past12hr: rainfallValue(pick(past12, ["Precipitation"])),
        past24hr: rainfallValue(pick(past24, ["Precipitation"])),
        past2days: rainfallValue(pick(past2days, ["Precipitation"]))
      };
    };
    const conditionHistory = async (station, area) => {
      if (!env.CONDITIONS_HISTORY || !station?.observedAt) return null;
      const observed = Date.parse(station.observedAt);
      if (!Number.isFinite(observed) || Math.abs(Date.now() - observed) > 2 * 3600000) return null;
      const key = `${area}:observations:v1:${station.stationId}`;
      try {
        const saved = await env.CONDITIONS_HISTORY.get(key, "json");
        const samples = (Array.isArray(saved) ? saved : []).filter(row => Number.isFinite(row?.t) && row.t >= Date.now() - 75 * 3600000);
        if (!samples.some(row => row.t === observed)) {
          samples.push({ t: observed, temperature: station.temperature, dailyHigh: station.dailyHigh, humidity: station.humidity, windSpeed: station.windSpeed, windDirection: station.windDirection });
          samples.sort((a, b) => a.t - b.t);
          ctx.waitUntil(env.CONDITIONS_HISTORY.put(key, JSON.stringify(samples), { expirationTtl: 4 * 86400 }));
        }
        const recent = samples.filter(row => row.t >= observed - 3 * 3600000 && row.t <= observed && Number.isFinite(row.windSpeed));
        const covered = recent.length >= 3 && recent.at(-1).t - recent[0].t >= 2 * 3600000;
        const wind3hAvg = covered ? recent.reduce((sum, row) => sum + row.windSpeed, 0) / recent.length : null;
        const directions = recent.filter(row => Number.isFinite(row.windDirection) && row.windDirection >= 0 && row.windDirection <= 360 && row.windSpeed > 0);
        const x = directions.reduce((sum, row) => sum + row.windSpeed * Math.sin(row.windDirection * Math.PI / 180), 0);
        const y = directions.reduce((sum, row) => sum + row.windSpeed * Math.cos(row.windDirection * Math.PI / 180), 0);
        const wind3hDirection = covered && directions.length >= 2 && Math.hypot(x, y) > 0.1 ? (Math.atan2(x, y) * 180 / Math.PI + 360) % 360 : null;
        const validTemperatures = recent.filter(row => Number.isFinite(row.temperature));
        const tempTrend3h = covered && validTemperatures.length >= 2 ? validTemperatures.at(-1).temperature - validTemperatures[0].temperature : null;
        const dayKey = time => {
          const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(time);
          const get = type => parts.find(part => part.type === type)?.value;
          return `${get("year")}-${get("month")}-${get("day")}`;
        };
        const previousDays = [1, 2].map(offset => dayKey(new Date(observed - offset * 86400000)));
        const hotDays = previousDays.every(day => samples.some(row => dayKey(row.t) === day && (Number.isFinite(row.dailyHigh) && row.dailyHigh >= 32 || Number.isFinite(row.temperature) && row.temperature >= 32))) ? 2 : null;
        return { wind3hAvg, wind3hDirection, tempTrend3h, hotDays, sampleCount: recent.length };
      } catch {
        return null;
      }
    };
    const directionDegrees = value => {
      const raw = value && typeof value === "object" ? pick(value, ["WindDirection", "WD", "ElementValue", "Value"]) : value;
      const numeric = numberValue(raw);
      if (numeric !== null) return numeric;
      const directions = { "北": 0, "北北東": 22.5, "東北": 45, "東北東": 67.5, "東": 90, "東南東": 112.5, "東南": 135, "南南東": 157.5, "南": 180, "南南西": 202.5, "西南": 225, "西南西": 247.5, "西": 270, "西北西": 292.5, "西北": 315, "北北西": 337.5 };
      return directions[String(raw ?? "").replace(/偏|風|風向|\s/g, "")] ?? null;
    };
    const normalizeForecastConditions = (data, route) => {
      let location = null;
      walkData(data, row => {
        const id = row.LocationId ?? row.LocationID ?? row.locationId ?? row.locationID ?? row.ParameterSet?.Parameter?.ParameterValue;
        const name = String(row.LocationName ?? row.locationName ?? "");
        if (!location && ((route.conditionLocationId && String(id) === route.conditionLocationId) || (route.conditionLocationName && name.includes(route.conditionLocationName)))) location = row;
      });
      if (!location) return { humidity: null, temperature: null, dewPoint: null, feels: null, windDirection: null, windSpeed: null };
      const best = { humidity: Infinity, temperature: Infinity, dewPoint: Infinity, feels: Infinity, windDirection: Infinity, windSpeed: Infinity };
      const result = { humidity: null, temperature: null, dewPoint: null, feels: null, windDirection: null, windSpeed: null, locationName: location.LocationName ?? location.locationName ?? "" };
      walkData(location, element => {
        const name = String(element.ElementName ?? element.elementName ?? "");
        if (!name || !(element.Time || element.time)) return;
        for (const period of (element.Time ?? element.time)) {
          const timestamp = Date.parse(period.StartTime ?? period.startTime ?? period.DataTime ?? period.dataTime ?? "");
          const distance = Number.isFinite(timestamp) ? Math.abs(timestamp - Date.now()) : 1e15;
          const raw = period.ElementValue ?? period.elementValue ?? period.Parameter ?? period.parameter;
          let key = null, value = null;
          if (/RelativeHumidity|相對濕度|^RH$|^HUMD$/i.test(name)) { key = "humidity"; value = numberValue(pick(raw, ["RelativeHumidity", "RH", "HUMD"]) ?? raw); }
          else if (/^Temperature$|^溫度$|^TEMP$/i.test(name)) { key = "temperature"; value = numberValue(pick(raw, ["Temperature", "AirTemperature", "TEMP"]) ?? raw); }
          else if (/DewPoint|露點/i.test(name)) { key = "dewPoint"; value = numberValue(pick(raw, ["DewPoint"]) ?? raw); }
          else if (/ApparentTemperature|體感溫度|^AT$|^MaxAT$|^MinAT$/i.test(name)) { key = "feels"; value = numberValue(pick(raw, ["ApparentTemperature", "AT"]) ?? raw); }
          else if (/WindDirection|風向|^WD$/i.test(name)) { key = "windDirection"; value = directionDegrees(raw); }
          else if (/WindSpeed|風速|^WS$/i.test(name)) { key = "windSpeed"; value = numberValue(pick(raw, ["WindSpeed", "WS"]) ?? raw); }
          if (key && value !== null && distance < best[key]) { result[key] = value; best[key] = distance; }
        }
      });
      if (result.humidity !== null && result.humidity >= 0 && result.humidity <= 1) result.humidity *= 100;
      return result;
    };
    const fetchWeeklyProduct = async () => {
      const failures = [];
      for (const product of route.weekly) {
        try { return { product, data: await fetchProduct(product) }; }
        catch (error) { failures.push(error.message); }
      }
      throw new Error(`Weekly forecast unavailable. ${failures.join(" | ")}`);
    };

    try {
      const [threeHourResult, weeklyResult, tideResult, stationResult, hourlyRainResult, waveResult] = await Promise.allSettled([
        fetchProduct(route.current), fetchWeeklyProduct(),
        url.pathname === "/api/longdong" ? fetchProduct("F-A0021-001", { LocationId: "A01400" }) : Promise.resolve(null),
        fetchObservationProduct("O-A0001-001"), fetchObservationProduct("O-A0002-001"),
        url.pathname === "/api/longdong" ? fetchLongdongWave() : Promise.resolve(null)
      ]);
      if (threeHourResult.status === "rejected") throw threeHourResult.reason;
      const weekly = weeklyResult.status === "fulfilled" ? weeklyResult.value : null;
      const weeklyError = weeklyResult.status === "rejected" ? weeklyResult.reason.message : null;
      const station = stationResult.status === "fulfilled" ? normalizeStation(stationResult.value, route) : null;
      const history = await conditionHistory(station, url.pathname.slice(5));
      const tideHistory = url.pathname === "/api/longdong" ? await retainLongdongTides(tideResult.status === "fulfilled" ? tideResult.value : null) : null;
      const payload = JSON.stringify({
        threeHour: threeHourResult.value,
        fiveDay: weekly?.data || null,
        fiveDayProduct: weekly?.product || null,
        weeklyError,
        tides: tideResult.status === "fulfilled" ? tideResult.value : null,
        tideHistory,
        wave: waveResult.status === "fulfilled" ? waveResult.value : null,
        waveError: waveResult.status === "rejected" ? "Wave observations unavailable" : null,
        station,
        hourlyRain: hourlyRainResult.status === "fulfilled" ? normalizeRain(hourlyRainResult.value, route) : null,
        conditionHistory: history,
        conditionsForecast: normalizeForecastConditions(threeHourResult.value, route),
        conditionsError: [tideResult, stationResult, hourlyRainResult].filter(x => x.status === "rejected").map(x => x.reason?.message).join("; ") || null,
        fetchedAt: new Date().toISOString()
      });
      const response = new Response(payload, {
        headers: {
          ...headers,
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=900",
          "X-Content-Type-Options": "nosniff"
        }
      });
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (error) {
      return Response.json({ error: "Unable to load CWA forecast", detail: error.message }, {
        status: 502, headers: { ...headers, "Cache-Control": "no-store" }
      });
    }
  },
  async scheduled(_event, env) {
    if (!env.CWA_API_KEY || !env.CONDITIONS_HISTORY) return;
    try { await prewarmLongdongTides(env); } catch { console.warn("Tide history prewarm unavailable"); }
    try {
      const rest = "https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0001-001?format=JSON";
      const file = `https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/O-A0001-001?Authorization=${encodeURIComponent(env.CWA_API_KEY)}&downloadType=WEB&format=JSON`;
      let response = await fetch(rest, { headers: { Accept: "application/json", Authorization: env.CWA_API_KEY } });
      let data = response.ok ? await response.json().catch(() => null) : null;
      if (!data || data.success === false || data.success === "false") {
        response = await fetch(file, { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`CWA observation HTTP ${response.status}`);
        data = await response.json();
      }
      const stations = [];
      const walk = value => {
        if (!value || typeof value !== "object") return;
        if (Array.isArray(value)) { value.forEach(walk); return; }
        if ((value.StationId ?? value.StationID ?? value.stationId ?? value.stationID) && (value.WeatherElement || value.weatherElement)) {
          stations.push(value);
        }
        Object.values(value).forEach(walk);
      };
      walk(data);
      const pick = (object, names) => {
        if (!object || typeof object !== "object") return null;
        for (const name of names) if (object[name] != null) return object[name];
        for (const value of Object.values(object)) { const found = pick(value, names); if (found != null) return found; }
        return null;
      };
      const number = value => {
        if (Array.isArray(value)) return number(value[0]);
        if (value && typeof value === "object") return number(value.ElementValue ?? value.elementValue ?? value.Value ?? value.value);
        const parsed = Number(value);
        return value != null && value !== "" && Number.isFinite(parsed) && parsed > -90 ? parsed : null;
      };
      const position = row => {
        const geo = row.GeoInfo ?? row.geoInfo ?? {};
        const raw = geo.Coordinates ?? geo.coordinates ?? row.Coordinates ?? row.coordinates ?? [];
        const list = Array.isArray(raw) ? raw : [raw];
        const coordinate = list.find(item => /WGS.?84/i.test(String(item?.CoordinateName ?? item?.coordinateName ?? ""))) || list[0] || {};
        const lat = number(coordinate.StationLatitude ?? coordinate.stationLatitude ?? coordinate.Latitude ?? coordinate.latitude ?? row.StationLatitude ?? row.stationLatitude ?? row.lat);
        const lon = number(coordinate.StationLongitude ?? coordinate.stationLongitude ?? coordinate.Longitude ?? coordinate.longitude ?? row.StationLongitude ?? row.stationLongitude ?? row.lon);
        return lat === null || lon === null ? null : { lat, lon };
      };
      const distance = (point, target) => {
        if (!point) return Infinity;
        const rad = value => value * Math.PI / 180;
        const dLat = rad(point.lat - target.lat), dLon = rad(point.lon - target.lon);
        const a = Math.sin(dLat / 2) ** 2 + Math.cos(rad(target.lat)) * Math.cos(rad(point.lat)) * Math.sin(dLon / 2) ** 2;
        return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      };
      const targets = [
        { area: "longdong", stationId: "C0A950", lat: 25.111, lon: 121.919 },
        { area: "kenting", lat: 21.926, lon: 120.829 },
        { area: "defulan", lat: 24.174, lon: 120.974 },
        { area: "guanziling", stationId: "C0X240", lat: 23.3283185, lon: 120.4889894 }
      ];
      for (const target of targets) {
        const station = stations.find(row => String(row.StationId ?? row.StationID ?? row.stationId ?? row.stationID ?? "") === target.stationId) ||
          stations.map(row => ({ row, km: distance(position(row), target) })).filter(item => item.km <= 60).sort((a, b) => a.km - b.km)[0]?.row;
        if (!station) continue;
        const weather = station.WeatherElement ?? station.weatherElement;
        const observed = Date.parse(station.ObsTime?.DateTime ?? station.obsTime?.DateTime ?? "");
        if (!Number.isFinite(observed) || Math.abs(Date.now() - observed) > 2 * 3600000) continue;
        let humidity = number(pick(weather, ["RelativeHumidity", "RH", "HUMD"]));
        if (humidity !== null && humidity <= 1) humidity *= 100;
        const high = pick(weather, ["DailyHigh"]);
        const sample = {
          t: observed,
          temperature: number(pick(weather, ["AirTemperature", "Temperature", "TEMP"])),
          dailyHigh: number(pick(high, ["AirTemperature", "Temperature"])),
          humidity,
          windSpeed: number(pick(weather, ["WindSpeed", "WS"])),
          windDirection: number(pick(weather, ["WindDirection", "WD"]))
        };
        const id = String(station.StationId ?? station.StationID ?? station.stationId ?? station.stationID);
        const key = target.area + ":observations:v1:" + id;
        const saved = await env.CONDITIONS_HISTORY.get(key, "json");
        const samples = (Array.isArray(saved) ? saved : []).filter(row => Number.isFinite(row?.t) && row.t >= Date.now() - 75 * 3600000);
        if (!samples.some(row => row.t === observed)) {
          samples.push(sample);
          samples.sort((a, b) => a.t - b.t);
          await env.CONDITIONS_HISTORY.put(key, JSON.stringify(samples), { expirationTtl: 4 * 86400 });
        }
      }
    } catch (error) {
      console.warn("Longdong condition history unavailable:", error.message);
    }
  }
};
