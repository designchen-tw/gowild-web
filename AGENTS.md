# GO WILD 專案交接

- 這個 repo 是 Webflow Embed、瀏覽器小工具與 Cloudflare Worker 的原始碼；工作前先看與本次任務相關的檔案。架構和部署方式見 `README.md`，龍洞岩面推估規則見 `ROCK-CONDITION-RULES.md`。
- 攀岩地點頁是 `webflow-embeds/longdong.html`、`kenting.html`、`defulan.html`、`guanziling.html`。龍洞是版面與資訊層級的參考；修改共通元件時，同步檢查各頁的中英文及手機版。
- 不要把 CWA 授權碼或其他密鑰放進 Git、Webflow Embed、前端 JS。`cwa-weather-worker.js` 從 Cloudflare Secret `CWA_API_KEY` 讀取授權碼。
- 頁面載入 jsDelivr 上的版本化 CSS/JS。改動前端檔案時，確認 Embed 引用的檔名和本機檔案一致；需要更新引用時，也更新相關頁面對應的 Embed。Webflow 貼上的 Embed 與 Cloudflare Worker 都需各自部署，推送 GitHub 不會自動發布它們。
- 保持 `AGENTS.md` 簡短；不要為每次小修改讀取整個 repo 或所有舊版檔案。從 Embed 的實際引用找目前版本。
- 新增岩場頁時，沿用最新版共用攀登現況小工具（目前為 `climbing-conditions-widget-v10.js`）。頁面容器配置 `data-condition-endpoint`、`data-condition-language-event` 與座標，在概況區加上 `data-condition-anchor`。發布前測試 API 成功、暫缺及載入失敗，並在每種狀態切換中英文。龍洞另有包含潮汐與浪況的專用小工具。
- 新版 GPX 地圖沿用共用地圖小工具（目前為 `climbing-gpx-map-v3.js`）。定位註記用 `#point` 圖層內的圓圈，或標上 `data-map-waypoint`，深淺主題都由共用樣式保留外框。停車場、公車站等地標圖示維持原本的填色樣式。
