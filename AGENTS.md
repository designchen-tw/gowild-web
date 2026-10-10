# GO WILD 專案交接

- 這個 repo 是 Webflow Embed、瀏覽器小工具與 Cloudflare Worker 的原始碼；工作前先看與本次任務相關的檔案。架構和部署方式見 `README.md`，龍洞岩面推估規則見 `ROCK-CONDITION-RULES.md`。
- 三個攀岩地點頁是 `webflow-embeds/longdong.html`、`kenting.html`、`defulan.html`。龍洞是版面與資訊層級的參考；修改共通元件時，同步檢查三頁的中英文及手機版。
- 不要把 CWA 授權碼或其他密鑰放進 Git、Webflow Embed、前端 JS。`cwa-weather-worker.js` 從 Cloudflare Secret `CWA_API_KEY` 讀取授權碼。
- 頁面載入 jsDelivr 上的版本化 CSS/JS。改動前端檔案時，確認 Embed 引用的檔名和本機檔案一致；需要更新引用時，也更新三頁對應的 Embed。Webflow 貼上的 Embed 與 Cloudflare Worker 都需各自部署，推送 GitHub 不會自動發布它們。
- 保持 `AGENTS.md` 簡短；不要為每次小修改讀取整個 repo 或所有舊版檔案。從 Embed 的實際引用找目前版本。
