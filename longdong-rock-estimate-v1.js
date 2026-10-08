/* Longdong rock-surface weather estimate. These are conservative UI heuristics, not rock measurements. */
(() => {
  const valid = value => typeof value === "number" && Number.isFinite(value);
  const reading = value => valid(value) && value >= 0 ? value : null;
  const labels = {
    "very-dry": ["極乾", "Very dry"],
    dry: ["乾燥", "Dry"],
    "slightly-damp": ["微濕", "Slightly damp"],
    greasy: ["出油", "Greasy"],
    damp: ["潮濕", "Damp"],
    condensing: ["返潮", "Condensing"],
    seeping: ["滲水", "Seeping"],
    saturated: ["濕透", "Saturated"],
    runoff: ["流水", "Runoff"],
    unknown: ["資料不足", "Insufficient data"]
  };
  const result = (level, windHistory) => ({ level, zh: labels[level][0], en: labels[level][1], windHistory });
  const dewPoint = (temperature, humidity) => {
    if (!valid(temperature) || !valid(humidity) || humidity <= 0 || humidity > 100) return null;
    const a = 17.625, b = 243.04;
    const gamma = Math.log(humidity / 100) + a * temperature / (b + temperature);
    return b * gamma / (a - gamma);
  };

  window.GWLongdongRockEstimate = data => {
    const rain = data?.hourlyRain || {};
    const station = data?.station || {};
    const history = data?.conditionHistory || {};
    const r1 = reading(rain.past1hr), r3 = reading(rain.past3hr), r6 = reading(rain.past6hr);
    const r24 = reading(rain.past24hr), r2d = reading(rain.past2days);
    const rh = reading(station.humidity) ?? reading(data?.conditionsForecast?.humidity);
    const temperature = valid(station.temperature) ? station.temperature : null;
    const wind3 = reading(history.wind3hAvg);
    const bearing = reading(history.wind3hDirection);
    const windHistory = wind3 !== null;
    const make = level => result(level, windHistory);

    // Recent substantial rain takes precedence: wind must never turn a wet wall green.
    if (r1 !== null && r3 !== null && r1 >= 8 && r3 >= 15) return make("runoff");
    if ((r3 !== null && r3 >= 5) || (r6 !== null && r6 >= 10)) return make("saturated");
    if (r3 === 0 && r6 === 0 && r24 !== null && r24 >= 15) return make("seeping");
    if (r3 !== null && r3 > 0 || r6 !== null && r6 >= 2) return make("damp");

    // Dew risk requires a rain-free period, near-saturation, cooling, and night hours.
    const timestamp = Date.parse(station.observedAt || data?.fetchedAt || "");
    const hour = Number.isFinite(timestamp) ? Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Taipei", hour: "2-digit", hourCycle: "h23" }).format(timestamp)) : null;
    const dew = dewPoint(temperature, rh);
    if (r2d === 0 && r24 === 0 && r6 === 0 && rh !== null && rh >= 93 && dew !== null && temperature - dew <= 1.5 &&
        (hour >= 18 || hour < 7) && valid(history.tempTrend3h) && history.tempTrend3h <= -0.4) return make("condensing");

    // Salt is not observed. Easterly coastal flow + humidity + consecutive hot days is only a proxy.
    const marineWind = bearing !== null && bearing >= 45 && bearing <= 135 && wind3 !== null && wind3 >= 1.6;
    if (r2d === 0 && r24 === 0 && history.hotDays >= 2 && temperature !== null && temperature >= 30 &&
        rh !== null && rh >= 75 && marineWind) return make("greasy");

    if (rh !== null && rh >= 85) return make("damp");
    if (r24 !== null && r24 > 0) {
      if (r6 === 0 && rh !== null && rh < 85 && wind3 !== null && wind3 >= 3.4) return make("slightly-damp");
      return make("damp");
    }
    if (r2d !== null && r2d > 0) {
      if (r2d < 10 && rh !== null && rh < 80 && wind3 !== null && wind3 >= 3.4) return make("slightly-damp");
      return make("damp");
    }
    if (r3 === null || rh === null) return make("unknown");
    if (rh >= 75) return make("slightly-damp");
    if (r24 !== 0 || r2d !== 0) return make("unknown");
    if (rh < 60 && wind3 !== null && wind3 >= 3.4) return make("very-dry");
    return make("dry");
  };
})();
