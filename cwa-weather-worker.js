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
      "/api/longdong": { current: "F-B0053-005", weekly: ["F-B0053-001", "F-B0053-003"] },
      "/api/kenting": { current: "F-D0047-033", weekly: ["F-D0047-035"] },
      "/api/defulan": { current: "F-D0047-073", weekly: ["F-D0047-075"] }
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
    const cacheKey = new Request(`${url.origin}${url.pathname}?schema=climbing-conditions-v18`, { method: "GET" });
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
    const normalizeStation = data => {
      let found = null;
      walkData(data, row => {
        const id = row.StationId ?? row.StationID ?? row.stationId ?? row.stationID;
        if (String(id) !== "C0A950") return;
        const weather = row.WeatherElement ?? row.weatherElement ?? {};
        const rain = row.RainfallElement ?? row.rainfallElement ?? {};
        const past3 = rain.Past3hr ?? rain.past3hr ?? {};
        const past6 = rain.Past6hr ?? rain.past6hr ?? {};
        found = {
          stationId: "C0A950",
          humidity: numberValue(pick(weather, ["RelativeHumidity", "RH", "HUMD"])),
          temperature: numberValue(pick(weather, ["AirTemperature", "Temperature"])),
          past3hr: numberValue(pick(past3, ["Precipitation"])),
          past6hr: numberValue(pick(past6, ["Precipitation"])),
          observedAt: pick(row, ["DateTime"])
        };
      });
      return found;
    };
    const normalizeForecastConditions = data => {
      let location = null;
      walkData(data, row => {
        const id = row.LocationId ?? row.LocationID ?? row.locationId ?? row.locationID;
        if (String(id) === "A01800") location = row;
      });
      if (!location) return { humidity: null, feels: null };
      let humidity = null, feels = null, bestHumidity = Infinity, bestFeels = Infinity;
      walkData(location, el => {
        const name = String(el.ElementName ?? el.elementName ?? "");
        if (!name || !(el.Time || el.time)) return;
        for (const period of (el.Time ?? el.time)) {
          const time = Date.parse(period.StartTime ?? period.startTime ?? period.DataTime ?? period.dataTime ?? "");
          const distance = Number.isFinite(time) ? Math.abs(time - Date.now()) : 1e15;
          const value = numberValue(period.ElementValue ?? period.elementValue ?? period.Parameter ?? period.parameter);
          if (value === null) continue;
          if (/RelativeHumidity|相對濕度|^RH$|^HUMD$/i.test(name) && distance < bestHumidity) { humidity = value; bestHumidity = distance; }
          if (/ApparentTemperature|體感溫度|^AT$|^MaxAT$|^MinAT$/i.test(name) && distance < bestFeels) { feels = value; bestFeels = distance; }
        }
      });
      return { humidity, feels };
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
        url.pathname === "/api/longdong" ? fetchProduct("O-A0001-001") : Promise.resolve(null),
        url.pathname === "/api/longdong" ? fetchProduct("O-A0002-001") : Promise.resolve(null)
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
        station: stationResult.status === "fulfilled" ? normalizeStation(stationResult.value) : null,
        hourlyRain: hourlyRainResult.status === "fulfilled" ? normalizeStation(hourlyRainResult.value) : null,
        conditionsForecast: normalizeForecastConditions(threeHourResult.value),
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
