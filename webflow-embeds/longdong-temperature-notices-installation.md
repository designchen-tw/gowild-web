# 龍洞當日溫度與公告修正 — 2026-10-27

## 上線

1. 替換 Webflow 龍洞內容 Embed 為 `longdong.html`，發布 Webflow。
2. 原 CWA Weather Worker 完整替換為 `cwa-weather-worker.js` 後 Deploy；保留既有 Secret、KV、Cron。離線 Worker、App Head、App Footer 與 Menu Overlay 不需為此修改。
3. App 連網重新載入；離線儲存的龍洞內容需由使用者更新。

## 當日高／低溫

2026-10-27 實際 API 回應的七日預報從10/28起算，鼻頭角站當日高／低溫也為 null。避免誤用明日預報，維持同日預報優先；若缺值，改用同份觀測資料中15公里內、三小時內且同一台灣日期的有效當日高／低溫測站，優先保留鼻頭角，有缺值才選最近的有效站。觀測高／低溫是截至觀測時間的當日紀錄，不是全天結束值；欄位 title 顯示站名／站碼與來源性質。所有來源缺值時仍顯示 --，不以0或範例值填入。

新增回傳 `dailyTemperatureStation`；前端 v34 相容舊回應，原 station 與其他氣象指標的來源不變。不增加任何上游請求，沿用15分鐘整體快取；schema改v27使部署後舊快取不再阻擋修正。

## 排版

公告標題與攀登現況共用 `ld-condition-title` 的字級、字重及灰階。公告內容置中，標題與日期同一行置中，使用相同字級、字重及灰階；下一行放手動更新非即時註記。維持中英文翻譯與深淺主題。龍洞手機簡介移除舊36ch限制，使用與其他岩場一致的內容寬度與頁面留白。

## 驗證

- `node tests/longdong-temperature.test.mjs`
- `node tests/longdong-wave-load.test.mjs`
- 獨立本機預覽8795的鄰近站26.8／22.4是測試 fixture，未寫入正式程式或 API。
