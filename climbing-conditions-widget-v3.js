/* Shared climbing conditions for Kenting and Defulan. The Worker holds the CWA key. */
(() => {
  const roots = document.querySelectorAll('[data-kd-detail],[data-df-detail]');
  if (!roots.length) return;
  const number = value => {
    if (value == null || value === '') return null;
    if (typeof value === 'object') {
      for (const name of ['Value','value','AirTemperature','Temperature','WindSpeed','WindDirection','RelativeHumidity']) {
        if (value[name] != null) return number(value[name]);
      }
      for (const [key,item] of Object.entries(value)) {
        if (/measure|unit|name/i.test(key)) continue;
        const result = number(item);
        if (result != null) return result;
      }
      return null;
    }
    const match = String(value).match(/-?\d+(?:\.\d+)?/);
    const n = match ? Number(match[0]) : null;
    return n != null && n > -90 ? n : null;
  };
  const dayKey = value => {
    const d = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(d.getTime())) return '';
    const p = new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d);
    const f = type => p.find(x => x.type === type)?.value || '';
    return f('year') + '-' + f('month') + '-' + f('day');
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
    const n = number(value);
    if (n != null) return ((n % 360) + 360) % 360;
    const dirs = {'北':0,'北北東':22.5,'東北':45,'東北東':67.5,'東':90,'東南東':112.5,'南東':135,'南南東':157.5,'南':180,'南南西':202.5,'西南':225,'西南西':247.5,'西':270,'西北西':292.5,'西北':315,'北北西':337.5};
    return dirs[String(value || '').replace(/偏|風|風向|\s/g,'')] ?? null;
  };
  const apparent = (temp, humidity, wind) => {
    if (temp == null || humidity == null || wind == null) return null;
    return temp + .33 * (humidity / 100 * 6.105 * Math.exp(17.27 * temp / (237.7 + temp))) - .7 * wind - 4;
  };
  const levels = [.3,1.6,3.4,5.5,8,10.8,13.9,17.2,20.8,24.5,28.5,32.7,37,41.5,46.2,51,56.1];
  const windNames = {
    zh:['無風','軟風','輕風','微風','和風','清風','強風','疾風','大風','烈風','狂風','暴風'],
    en:['Calm','Light air','Light breeze','Gentle breeze','Moderate breeze','Fresh breeze','Strong breeze','Near gale','Gale','Strong gale','Storm','Violent storm']
  };
  const highLow = (data, locationName) => {
    const today = dayKey(new Date());
    let high = null, low = null;
    const visit = value => {
      if (!value || typeof value !== 'object') return;
      if (Array.isArray(value)) { value.forEach(visit); return; }
      const name = String(value.LocationName || value.locationName || '');
      const weather = value.WeatherElement || value.weatherElement;
      if (name.includes(locationName) && Array.isArray(weather)) {
        weather.forEach(element => {
          const title = String(element.ElementName || element.elementName || '');
          const kind = /最高溫|MaxTemperature/i.test(title) ? 'high' : /最低溫|MinTemperature/i.test(title) ? 'low' : null;
          if (!kind) return;
          (element.Time || element.time || []).forEach(period => {
            const time = period.StartTime || period.startTime || period.DataTime || period.dataTime || '';
            if (String(time).slice(0,10) !== today) return;
            const raw = period.ElementValue || period.elementValue || period.Parameter || period.parameter;
            const n = number(Array.isArray(raw) ? raw[0] : raw);
            if (n == null || n < -30 || n > 50) return;
            if (kind === 'high') high = high == null ? n : Math.max(high,n);
            else low = low == null ? n : Math.min(low,n);
          });
        });
        return;
      }
      Object.values(value).forEach(visit);
    };
    visit(data?.records || data);
    return {high,low};
  };
  const request = endpoint => {
    const path = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    const cache = window.__gowildCwaRequests || (window.__gowildCwaRequests = new Map());
    if (!cache.has(path)) cache.set(path,fetch('https://cwa-weather.designchenme.workers.dev' + path,{headers:{Accept:'application/json'}}).then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.detail || data.error || 'Weather API ' + response.status);
      return data;
    }).catch(error => { cache.delete(path); throw error; }));
    return cache.get(path);
  };
  roots.forEach(root => {
    if (root.dataset.conditionsV3) return;
    root.dataset.conditionsV3 = 'true';
    const prefix = root.hasAttribute('data-kd-detail') ? 'kd' : 'df';
    const facts = root.querySelector('.' + prefix + '-detail__facts');
    if (!facts) return;
    const panel = document.createElement('section');
    panel.className = 'gw-condition-panel';
    panel.setAttribute('aria-label','Climbing conditions');
    panel.innerHTML = [
      '<div class="gw-condition-head"><h2 data-en="Climbing conditions">攀登現況</h2><time data-updated>--</time></div>',
      '<div class="gw-condition-grid">',
      '<article class="gw-condition-sun"><small data-en="Sunrise / sunset">日出／日落</small><strong data-sun>--:-- / --:--</strong><span data-en="Local time">當地時間</span></article>',
      '<article class="gw-condition-humidity"><small data-en="Relative humidity">相對濕度</small><strong data-humidity>--%</strong><span data-humidity-source>氣象署觀測</span></article>',
      '<article class="gw-condition-feels"><small data-en="Feels like">體感溫度</small><strong data-feels>--°</strong><div class="gw-condition-feels-range"><div><i data-en="Today’s high">當日最高溫</i><b data-high>--°</b></div><div><i data-en="Today’s low">當日最低溫</i><b data-low>--°</b></div></div><div class="gw-condition-current"><i data-en="Current temperature">目前溫度</i><b data-temp>--°</b></div></article>',
      '<article class="gw-condition-wind" data-level="unknown"><small data-en="Wind direction · speed">風向・風速</small><div class="gw-condition-wind-main"><span data-arrow aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 2 5 10h5v12h4V10h5z"/></svg></span><strong data-wind>資料暫缺</strong></div><div class="gw-condition-wind-support"><span data-wind-detail>蒲福 -- 級・-- m/s</span><span data-en="Mean station wind; local gusts may be stronger.">氣象站平均風速，現場陣風可能更強</span></div></article>',
      '<article class="gw-condition-rock"><small data-en="Rock condition estimate">岩面狀況推估</small><strong data-rock data-level="unknown">資料不足</strong><span data-rock-note>依雨量與濕度推估</span></article>',
      '</div><p class="gw-condition-disclaimer" data-en="Weather-based estimate from nearby stations; the rock surface is not measured. Check on site.">岩面狀況由附近氣象站推估，並非岩面直接量測；請以現場狀況為準。</p>'
    ].join('');
    facts.insertAdjacentElement('afterend',panel);
    const q = selector => panel.querySelector(selector);
    const lang = () => root.dataset.language === 'en' ? 'en' : 'zh';
    panel.querySelectorAll('[data-en]').forEach(el => el.dataset.zh = el.textContent);
    let latest = null;
    const render = data => {
      latest = data;
      const en = lang() === 'en', station = data.station || {}, forecast = data.conditionsForecast || {};
      const humid = number(station.humidity) ?? number(forecast.humidity);
      const humidity = humid != null && humid <= 1 ? humid * 100 : humid;
      const temp = number(station.temperature) ?? number(forecast.temperature);
      const rawWindSpeed = number(station.windSpeed) ?? number(forecast.windSpeed);
      const windSpeed = rawWindSpeed != null && rawWindSpeed >= 0 ? rawWindSpeed : null;
      const windDir = bearing(station.windDirection ?? forecast.windDirection);
      const feels = number(forecast.feels) ?? apparent(temp,humidity,windSpeed);
      const lat = Number(root.dataset.conditionLat), lon = Number(root.dataset.conditionLon);
      q('[data-sun]').textContent = solarTime(new Date(),lat,lon,true) + ' / ' + solarTime(new Date(),lat,lon,false);
      q('[data-humidity]').textContent = humidity == null ? '--%' : Math.round(humidity) + '%';
      q('[data-feels]').textContent = feels == null ? '--°' : Math.round(feels) + '°';
      q('[data-temp]').textContent = temp == null ? '--°' : Math.round(temp) + '°';
      const range = highLow(data.fiveDay,root.querySelector('[data-cwa-location]')?.dataset.cwaLocation || '');
      const observationToday = dayKey(station.observedAt) === dayKey(new Date());
      const high = range.high ?? (observationToday ? number(station.dailyHigh) : null);
      const low = range.low ?? (observationToday ? number(station.dailyLow) : null);
      q('[data-high]').textContent = high == null ? '--°' : Math.round(high) + '°';
      q('[data-low]').textContent = low == null ? '--°' : Math.round(low) + '°';
      q('[data-humidity-source]').textContent = station.humidity != null ? (en ? 'CWA station observation' : (station.stationName || '氣象署') + '站觀測') : (en ? 'CWA forecast' : '氣象署預報');
      const grade = windSpeed == null ? null : levels.findIndex(limit => windSpeed < limit);
      const beaufort = grade == null ? null : grade < 0 ? 17 : grade;
      const band = beaufort == null ? 'unknown' : beaufort <= 2 ? 'blue' : beaufort <= 6 ? 'green' : beaufort <= 9 ? 'sand' : beaufort <= 12 ? 'coral' : 'warning';
      const index = windDir == null ? null : Math.round(windDir/45)%8;
      const dirNames = en ? ['N','NE','E','SE','S','SW','W','NW'] : ['北','東北','東','東南','南','西南','西','西北'];
      const name = beaufort == null ? (en ? 'Unavailable':'資料暫缺') : beaufort >= 12 ? (en ? 'Hurricane-force wind':'颶風級風') : windNames[lang()][beaufort];
      q('[data-wind]').textContent = beaufort == null || beaufort === 0 ? name : (index == null ? (en ? 'Direction unavailable':'風向暫缺') : dirNames[index]) + (en ? ' · ':'・') + name;
      q('[data-wind-detail]').textContent = beaufort == null ? (en ? 'Beaufort -- · -- m/s':'蒲福 -- 級・-- m/s') : (en ? 'Beaufort ' + beaufort + ' · ' : '蒲福 ' + beaufort + '級・') + windSpeed.toFixed(1) + ' m/s';
      q('.gw-condition-wind').dataset.level = band;
      q('[data-arrow]').hidden = beaufort == null || beaufort === 0 || windDir == null;
      q('[data-arrow]').style.setProperty('--wind-angle',windDir == null ? '0deg' : windDir + 'deg');
      // The Longdong estimator's sea-salt proxy is location-specific; these areas have no measured salinity.
      const estimateInput = {...data,conditionHistory:{...data.conditionHistory,hotDays:null},conditionsForecast:{...forecast,humidity:humidity}};
      const estimate = window.GWLongdongRockEstimate?.(estimateInput) || {level:'unknown',zh:'資料不足',en:'Insufficient data',windHistory:false};
      q('[data-rock]').dataset.level = estimate.level;
      q('[data-rock]').textContent = en ? estimate.en : estimate.zh;
      q('[data-rock-note]').textContent = estimate.windHistory ? (en ? 'Rain, humidity and three-hour wind estimate':'依雨量、濕度與近三小時風況推估') : (en ? 'Rain and humidity estimate; wind history pending':'依雨量與濕度推估；風況歷史不足');
      const stamp = new Intl.DateTimeFormat(en?'en-GB':'zh-TW',{timeZone:'Asia/Taipei',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(data.fetchedAt || Date.now()));
      q('[data-updated]').textContent = (en ? 'Updated ':'更新 ') + stamp;
    };
    document.addEventListener(root.dataset.conditionLanguageEvent,() => {
      panel.querySelectorAll('[data-en]').forEach(el => el.textContent = lang() === 'en' ? el.dataset.en : el.dataset.zh);
      if (latest) render(latest);
    });
    panel.querySelectorAll('[data-en]').forEach(el => el.textContent = lang() === 'en' ? el.dataset.en : el.dataset.zh);
    request(root.dataset.conditionEndpoint).then(render).catch(error => {
      console.warn('Climbing conditions unavailable:',error);
      q('[data-updated]').textContent = lang() === 'en' ? 'Unavailable':'資料暫缺';
    });
  });
})();
