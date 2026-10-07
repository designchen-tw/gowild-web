/**
 * Cloudflare Worker: serves CWA forecast data and protects the authorization key.
 * Configure CWA_API_KEY as a Worker Secret. Never put the key in this file.
 * Optional variable ALLOWED_ORIGINS: comma-separated origin allowlist.
 */

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
      "/api/longdong": { current: "F-B0053-005", weekly: ["F-B0053-001", "F-B0053-003"], conditionLocationId: "A01800", lat: 25.111, lon: 121.919, stationId: "C0A950" },
      "/api/kenting": { current: "F-D0047-033", weekly: ["F-D0047-035"], conditionLocationName: "恆春鎮", lat: 21.926, lon: 120.829 },
      "/api/defulan": { current: "F-D0047-073", weekly: ["F-D0047-075"], conditionLocationName: "和平區", lat: 24.174, lon: 120.974 }
    };
    const route = routes[url.pathname];
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
    const cacheKey = new Request(`${url.origin}${url.pathname}?schema=climbing-conditions-v20`, { method: "GET" });
    const cached = await cache.match(cacheKey);
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
      let humidity = numberValue(pick(weather, ["RelativeHumidity", "RH", "HUMD"]));
      if (humidity !== null && humidity >= 0 && humidity <= 1) humidity *= 100;
      return {
        stationId: selected.id,
        stationName: row.StationName ?? row.stationName ?? row.LocationName ?? row.locationName ?? "",
        distanceKm: Number.isFinite(selected.distance) ? Math.round(selected.distance * 10) / 10 : null,
        humidity,
        temperature: numberValue(pick(weather, ["AirTemperature", "Temperature", "TEMP"])),
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
      const past3 = rainfall.Past3hr ?? rainfall.past3hr ?? {};
      const past6 = rainfall.Past6hr ?? rainfall.past6hr ?? {};
      return {
        stationId: selected.id,
        stationName: row.StationName ?? row.stationName ?? row.LocationName ?? row.locationName ?? "",
        distanceKm: Number.isFinite(selected.distance) ? Math.round(selected.distance * 10) / 10 : null,
        past3hr: numberValue(pick(past3, ["Precipitation"])),
        past6hr: numberValue(pick(past6, ["Precipitation"]))
      };
    };
    const directionDegrees = value => {
      const numeric = numberValue(value);
      if (numeric !== null) return numeric;
      const directions = { "北": 0, "東北": 45, "東": 90, "東南": 135, "南": 180, "西南": 225, "西": 270, "西北": 315 };
      return directions[String(value ?? "").replace(/風|風向/g, "")] ?? null;
    };
    const normalizeForecastConditions = (data, route) => {
      let location = null;
      walkData(data, row => {
        const id = row.LocationId ?? row.LocationID ?? row.locationId ?? row.locationID;
        const name = String(row.LocationName ?? row.locationName ?? "");
        if ((route.conditionLocationId && String(id) === route.conditionLocationId) || (route.conditionLocationName && name.includes(route.conditionLocationName))) location = row;
      });
      if (!location) return { humidity: null, feels: null, windDirection: null, windSpeed: null };
      const best = { humidity: Infinity, feels: Infinity, windDirection: Infinity, windSpeed: Infinity };
      const result = { humidity: null, feels: null, windDirection: null, windSpeed: null };
      walkData(location, element => {
        const name = String(element.ElementName ?? element.elementName ?? "");
        if (!name || !(element.Time || element.time)) return;
        for (const period of (element.Time ?? element.time)) {
          const timestamp = Date.parse(period.StartTime ?? period.startTime ?? period.DataTime ?? period.dataTime ?? "");
          const distance = Number.isFinite(timestamp) ? Math.abs(timestamp - Date.now()) : 1e15;
          const raw = period.ElementValue ?? period.elementValue ?? period.Parameter ?? period.parameter;
          let key = null, value = null;
          if (/RelativeHumidity|相對濕度|^RH$|^HUMD$/i.test(name)) { key = "humidity"; value = numberValue(raw); }
          else if (/ApparentTemperature|體感溫度|^AT$|^MaxAT$|^MinAT$/i.test(name)) { key = "feels"; value = numberValue(raw); }
          else if (/WindDirection|風向|^WD$/i.test(name)) { key = "windDirection"; value = directionDegrees(raw); }
          else if (/WindSpeed|風速|^WS$/i.test(name)) { key = "windSpeed"; value = numberValue(raw); }
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
      const [threeHourResult, weeklyResult, tideResult, stationResult, hourlyRainResult] = await Promise.allSettled([
        fetchProduct(route.current), fetchWeeklyProduct(),
        url.pathname === "/api/longdong" ? fetchProduct("F-A0021-001", { LocationId: "A01400" }) : Promise.resolve(null),
        fetchObservationProduct("O-A0001-001"), fetchObservationProduct("O-A0002-001")
      ]);
      if (threeHourResult.status === "rejected") throw threeHourResult.reason;
      const weekly = weeklyResult.status === "fulfilled" ? weeklyResult.value : null;
      const weeklyError = weeklyResult.status === "rejected" ? weeklyResult.reason.message : null;
      const payload = JSON.stringify({
        threeHour: threeHourResult.value,
        fiveDay: weekly?.data || null,
        fiveDayProduct: weekly?.product || null,
        weeklyError,
        tides: tideResult.status === "fulfilled" ? tideResult.value : null,
        station: stationResult.status === "fulfilled" ? normalizeStation(stationResult.value, route) : null,
        hourlyRain: hourlyRainResult.status === "fulfilled" ? normalizeRain(hourlyRainResult.value, route) : null,
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
  }
};
