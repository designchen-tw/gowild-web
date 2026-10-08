(() => {
  const roots = [...document.querySelectorAll("[data-condition-endpoint][data-condition-lat][data-condition-lon]")];
  if (!roots.length) return;

  const requests = window.__gowildCwaRequests || (window.__gowildCwaRequests = new Map());
  window.__gowildCwaRequest = window.__gowildCwaRequest || (endpoint => {
    const path = endpoint.startsWith("/") ? endpoint : "/" + endpoint;
    if (!requests.has(path)) {
      const request = fetch("https://cwa-weather.designchenme.workers.dev" + path, {
        headers: { Accept: "application/json" }
      }).then(async response => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.detail || data.error || "Weather API " + response.status);
        return data;
      }).catch(error => {
        requests.delete(path);
        throw error;
      });
      requests.set(path, request);
    }
    return requests.get(path);
  });

  const css = document.createElement("style");
  css.textContent = ".gw-condition-panel{--gw-coral:#f0b8a2;--gw-sand:#e7d39a;--gw-blue:#9fc6dc;--gw-white:#f5f5f5;max-width:1080px;margin:24px auto 0;padding:0 24px;border:0;border-radius:0;background:transparent;color:var(--gw-white)}.gw-condition-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.gw-condition-title{margin:0;color:rgba(245,245,245,.48);font-size:var(--gw-type-label,14px);font-weight:400;line-height:1.45}.gw-condition-updated{color:rgba(245,245,245,.42);font-size:var(--gw-type-label,14px);line-height:1.45}.gw-condition-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.gw-condition-grid article{display:flex;min-width:0;min-height:110px;flex-direction:column;justify-content:space-between;gap:7px;padding:13px;border:1px solid rgba(255,255,255,.1);border-radius:12px;background:rgba(0,0,0,.28)}.gw-condition-grid .gw-condition-wind{min-height:118px}.gw-condition-grid small{color:rgba(245,245,245,.48);font-size:var(--gw-type-label,14px);line-height:1.45;letter-spacing:0}.gw-condition-grid strong{color:var(--gw-white);font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3;letter-spacing:-.01em}.gw-condition-grid span{color:rgba(245,245,245,.56);font-size:var(--gw-type-label,14px);line-height:1.45}.gw-condition-wind-main{display:flex;min-width:0;align-items:center;gap:6px}.gw-condition-wind-main strong{font-size:var(--gw-type-value,20px);white-space:normal;overflow-wrap:anywhere}.gw-condition-wind-main b{margin-left:0;color:rgba(245,245,245,.82);font-size:var(--gw-type-value,20px);font-weight:600;line-height:1.3;white-space:nowrap}.gw-condition-wind-arrow{display:grid;width:22px;height:22px;flex:none;place-items:center;color:var(--gw-white)}.gw-condition-wind-arrow svg{width:20px;height:20px;fill:currentColor;transform:rotate(var(--wind-angle,0deg));transition:transform .25s ease}.gw-condition-wind-meter{height:3px;overflow:hidden;border-radius:4px;background:rgba(245,245,245,.12)}.gw-condition-wind-meter i{display:block;width:0;height:100%;border-radius:inherit;background:var(--gw-blue);transition:width .25s ease}.gw-condition-wind[data-level=noticeable] .gw-condition-wind-meter i{background:var(--gw-sand)}.gw-condition-wind[data-level=strong] .gw-condition-wind-meter i,.gw-condition-wind[data-level=high] .gw-condition-wind-meter i{background:var(--gw-coral)}.gw-condition-wind[data-level=light] [data-wind-feel],.gw-condition-wind[data-level=light] [data-wind-speed]{color:var(--gw-blue)}.gw-condition-wind[data-level=noticeable] [data-wind-feel],.gw-condition-wind[data-level=noticeable] [data-wind-speed]{color:var(--gw-sand)}.gw-condition-wind[data-level=strong] [data-wind-feel],.gw-condition-wind[data-level=high] [data-wind-feel],.gw-condition-wind[data-level=strong] [data-wind-speed],.gw-condition-wind[data-level=high] [data-wind-speed]{color:var(--gw-coral)}.gw-condition-rock strong[data-level=wet]{color:var(--gw-coral)}.gw-condition-rock strong[data-level=damp]{color:var(--gw-sand)}.gw-condition-rock strong[data-level=dry]{color:var(--gw-blue)}.gw-condition-wind[data-level=unknown] [data-wind-feel],.gw-condition-wind[data-level=unknown] [data-wind-speed],.gw-condition-rock strong[data-level=unknown]{color:var(--gw-white)}.gw-condition-disclaimer{margin:12px 0 0;color:rgba(245,245,245,.48);font-size:11px;line-height:1.6}@media(max-width:980px){.gw-condition-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:760px){.gw-condition-title{font-size:var(--gw-type-label,14px)}.gw-condition-panel{margin-top:20px;padding:0 12px}.gw-condition-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.gw-condition-grid article:not(.gw-condition-rock){min-height:118px}.gw-condition-grid .gw-condition-rock{grid-column:1/-1;min-height:132px}}@media(max-width:380px){.gw-condition-grid strong{font-size:var(--gw-type-value,16px)}.gw-condition-grid article{padding:11px}}";
  document.head.appendChild(css);

  const number = value => {
    if (value === null || value === undefined || value === "") return null;
    const match = String(value).match(/-?\d+(?:\.\d+)?/);
    if (!match) return null;
    const result = Number(match[0]);
    return result <= -90 ? null : result;
  };
  const solarTime = (date, latitude, longitude, isSunrise) => {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
    }).formatToParts(date);
    const get = type => Number(parts.find(part => part.type === type)?.value);
    const year = get("year"), month = get("month"), day = get("day");
    const n = Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
    const lngHour = longitude / 15;
    const t = n + ((isSunrise ? 6 : 18) - lngHour) / 24;
    const rad = degrees => degrees * Math.PI / 180;
    const deg = radians => radians * 180 / Math.PI;
    const wrap = value => ((value % 360) + 360) % 360;
    const m = .9856 * t - 3.289;
    const l = wrap(m + 1.916 * Math.sin(rad(m)) + .020 * Math.sin(2 * rad(m)) + 282.634);
    let ra = wrap(deg(Math.atan(.91764 * Math.tan(rad(l)))));
    ra += Math.floor(l / 90) * 90 - Math.floor(ra / 90) * 90;
    ra /= 15;
    const sinDec = .39782 * Math.sin(rad(l));
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH = (Math.cos(rad(90.833)) - sinDec * Math.sin(rad(latitude))) / (cosDec * Math.cos(rad(latitude)));
    if (cosH < -1 || cosH > 1) return "--:--";
    const h = (isSunrise ? 360 - deg(Math.acos(cosH)) : deg(Math.acos(cosH))) / 15;
    const utcHour = h + ra - .06571 * t - 6.622 - lngHour;
    const instant = new Date(Date.UTC(year, month - 1, day) + utcHour * 3600000);
    return new Intl.DateTimeFormat("zh-TW", {
      timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
    }).format(instant);
  };
  const bearing = value => {
    const numeric = number(value);
    if (numeric !== null) return ((numeric % 360) + 360) % 360;
    const directions = { "北": 0, "東北": 45, "東": 90, "東南": 135, "南": 180, "西南": 225, "西": 270, "西北": 315 };
    const text = String(value || "").replace(/風|風向/g, "");
    return directions[text] ?? null;
  };
  const apparentTemperature = (temperature, humidity, windSpeed) => {
    if (temperature === null || humidity === null || windSpeed === null) return null;
    const vapor = humidity / 100 * 6.105 * Math.exp(17.27 * temperature / (237.7 + temperature));
    return temperature + .33 * vapor - .7 * windSpeed - 4;
  };

  roots.forEach(root => {
    const prefix = root.hasAttribute("data-kd-detail") ? "kd" : "df";
    const facts = root.querySelector("." + prefix + "-detail__facts");
    if (!facts || root.dataset.conditionReady) return;
    root.dataset.conditionReady = "true";

    const panel = document.createElement("section");
    panel.className = "gw-condition-panel";
    panel.setAttribute("aria-label", "Climbing conditions");
    panel.innerHTML = '<div class="gw-condition-head"><h2 class="gw-condition-title" data-en="CLIMBING CONDITIONS">攀登現況</h2><span class="gw-condition-updated">--</span></div><div class="gw-condition-grid"><article><small data-en="SUNRISE / SUNSET">日出／日落</small><strong data-sun>--:-- / --:--</strong><span data-en="Calculated local solar time">當地日照時間</span></article><article><small data-en="RELATIVE HUMIDITY">相對濕度</small><strong data-humidity>--%</strong><span data-humidity-source>氣象署觀測</span></article><article><small data-en="FEELS LIKE">體感溫度</small><strong data-feels>--°</strong><span data-en="Estimated apparent temperature">推估體感溫度</span></article><article class="gw-condition-wind" data-level="unknown"><small data-en="WIND DIRECTION · SPEED">風向・風速</small><div class="gw-condition-wind-main"><span class="gw-condition-wind-arrow" data-wind-arrow aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2 5 10h5v12h4V10h5z"/></svg></span><strong data-wind-direction>資料暫缺</strong><b data-wind-speed>-- m/s</b></div><div class="gw-condition-wind-meter" aria-hidden="true"><i data-wind-meter></i></div><span data-wind-feel>風速資料暫缺</span><span data-en="Station mean wind; local gusts may be stronger.">氣象站平均風速，岩場陣風可能更強</span></article><article class="gw-condition-rock"><small data-en="ROCK DRYNESS · ESTIMATE">岩面乾燥度・推估</small><strong data-rock data-level="unknown">資料不足</strong><span data-rock-note>依近期雨量與濕度估算</span></article></div><p class="gw-condition-disclaimer" data-en="Rock dryness is estimated from nearby station rain and humidity; it is not a direct rock-surface measurement. Confirm conditions on site.">乾燥度依附近氣象站雨量與濕度推估，並非岩面直接量測；請以現場狀況為準。</p>';
    facts.insertAdjacentElement("afterend", panel);

    const lang = () => root.dataset.language === "en" ? "en" : "zh";
    const localize = () => {
      const english = lang() === "en";
      panel.querySelectorAll("[data-en]").forEach(element => {
        if (!element.dataset.zh) element.dataset.zh = element.textContent;
        element.textContent = english ? element.dataset.en : element.dataset.zh;
      });
      if (latest) render(latest);
    };
    const compassZh = ["北風", "東北風", "東風", "東南風", "南風", "西南風", "西風", "西北風"];
    const compassEn = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    let latest = null;
    const render = data => {
      latest = data;
      const english = lang() === "en";
      const station = data.station || {};
      const forecast = data.conditionsForecast || {};
      let humidity = number(station.humidity);
      if (humidity === null) humidity = number(forecast.humidity);
      if (humidity !== null && humidity >= 0 && humidity <= 1) humidity *= 100;
      const temperature = number(station.temperature);
      const windSpeed = number(station.windSpeed) ?? number(forecast.windSpeed);
      const windDirection = bearing(station.windDirection ?? forecast.windDirection);
      let feels = number(forecast.feels);
      if (feels === null) feels = apparentTemperature(temperature, humidity, windSpeed);

      const latitude = Number(root.dataset.conditionLat);
      const longitude = Number(root.dataset.conditionLon);
      const now = new Date();
      panel.querySelector("[data-sun]").textContent =
        solarTime(now, latitude, longitude, true) + " / " + solarTime(now, latitude, longitude, false);
      panel.querySelector("[data-humidity]").textContent = humidity === null ? "--%" : Math.round(humidity) + "%";
      panel.querySelector("[data-feels]").textContent = feels === null ? "--°" : Math.round(feels) + "°";

      const source = panel.querySelector("[data-humidity-source]");
      source.textContent = station.stationName
        ? (english ? station.stationName + " station" : station.stationName + "站觀測")
        : (humidity === null ? (english ? "CWA data unavailable" : "氣象署資料暫缺") : (english ? "CWA forecast" : "氣象署預報"));

      const windCard = panel.querySelector(".gw-condition-wind");
      let level = "unknown", zhFeel = "資料暫缺", enFeel = "Unavailable";
      if (windSpeed !== null) {
        if (windSpeed < 1.5) { level = "light"; zhFeel = windSpeed < .3 ? "無風" : "微風"; enFeel = windSpeed < .3 ? "Calm" : "Light"; }
        else if (windSpeed < 4) { level = "noticeable"; zhFeel = "有感風"; enFeel = "Noticeable"; }
        else if (windSpeed < 7) { level = "strong"; zhFeel = "偏強風"; enFeel = "Strong"; }
        else { level = "high"; zhFeel = "強風"; enFeel = "High wind"; }
      }
      windCard.dataset.level = level;
      const directionIndex = windDirection === null ? null : Math.round(windDirection / 45) % 8;
      const calm = windSpeed !== null && windSpeed < .3;
      panel.querySelector("[data-wind-direction]").textContent = calm
        ? (english ? "Calm" : "無風")
        : directionIndex === null
          ? (english ? "Direction unavailable" : "風向暫缺")
          : (english ? compassEn[directionIndex] + " wind" : compassZh[directionIndex]);
      panel.querySelector("[data-wind-speed]").textContent = windSpeed === null ? "-- m/s" : (Math.round(windSpeed * 10) / 10) + " m/s";
      panel.querySelector("[data-wind-feel]").textContent = english ? enFeel : zhFeel;
      if (windDirection !== null) panel.querySelector("[data-wind-arrow]").style.setProperty("--wind-angle", windDirection + "deg");
      panel.querySelector("[data-wind-meter]").style.width = windSpeed === null ? "0%" : Math.min(100, Math.max(0, windSpeed / 10 * 100)) + "%";

      const rain = number(data.hourlyRain?.past3hr);
      let rockLevel = "unknown", rockZh = "資料不足", rockEn = "Insufficient data";
      if (rain !== null && rain >= 1) { rockLevel = "wet"; rockZh = "雨後偏濕"; rockEn = "Likely wet after rain"; }
      else if ((rain !== null && rain > 0) || (humidity !== null && humidity >= 88)) { rockLevel = "damp"; rockZh = "仍可能潮濕"; rockEn = "May remain damp"; }
      else if (rain === 0 && humidity !== null && humidity < 80) { rockLevel = "dry"; rockZh = "可能偏乾"; rockEn = "Likely drier"; }
      const rock = panel.querySelector("[data-rock]");
      rock.dataset.level = rockLevel;
      rock.textContent = english ? rockEn : rockZh;
      panel.querySelector("[data-rock-note]").textContent = english
        ? "Based on recent rain and humidity"
        : "依近期雨量與濕度估算";

      const updated = new Intl.DateTimeFormat(english ? "en-GB" : "zh-TW", {
        timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
      }).format(new Date(data.fetchedAt || Date.now()));
      panel.querySelector(".gw-condition-updated").textContent = (english ? "Updated " : "更新 ") + updated;
    };

    document.addEventListener(root.dataset.conditionLanguageEvent || "ld-language-change", localize);
    localize();
    window.__gowildCwaRequest(root.dataset.conditionEndpoint)
      .then(render)
      .catch(() => {
        panel.querySelector("[data-humidity-source]").textContent = lang() === "en" ? "CWA data unavailable" : "氣象署資料暫缺";
        panel.querySelector("[data-feels]").textContent = "--°";
        panel.querySelector("[data-wind-direction]").textContent = lang() === "en" ? "Unavailable" : "資料暫缺";
        panel.querySelector("[data-wind-feel]").textContent = lang() === "en" ? "Unavailable" : "資料暫缺";
        panel.querySelector("[data-rock]").textContent = lang() === "en" ? "Insufficient data" : "資料不足";
      });
  });
})();
