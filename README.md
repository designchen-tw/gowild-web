# GO WILD 網站原始碼

這個公開儲存庫保存 Webflow Code Embed、前端天氣與攀登現況小工具，以及 Cloudflare Worker 原始碼。正式頁面仍由 Webflow 發布；此 repo 不含 CWA 授權碼。

## 頁面與檔案

| 頁面 | Webflow Embed | 前端小工具 | 樣式 |
| --- | --- | --- | --- |
| 龍洞 `/longdong` | `webflow-embeds/longdong.html` | `longdong-conditions-widget-v30.js`、`longdong-cwa-widget-v15.js`、`longdong-rock-estimate-v3.js`、`longdong-sector-map-v4.js` | `webflow-embeds/longdong-embed-v8.css`、`climbing-typography-v2.css` |
| 墾丁 `/kenting` | `webflow-embeds/kenting.html` | `climbing-conditions-widget-v4.js`、`weather-card-widget-v5.js`、`longdong-rock-estimate-v3.js` | `webflow-embeds/climbing-detail-v6.css`、`climbing-typography-v2.css` |
| 德芙蘭 `/defulan` | `webflow-embeds/defulan.html` | 同墾丁 | 同墾丁 |
| 全站選單 | `webflow-embeds/menu-overlay-full.html` | Embed 內部程式 | Embed 內部樣式 |

上表是目前交接版本。後續以各 Embed **實際引用的檔名** 為準；舊版檔案保留作為歷史版本。首頁其他 Embed 不在上表的三個地點頁之內。

## 架構與維護

- Webflow 負責頁面框架、原有導覽與 footer；地點內文由各自的 Code Embed 提供。選單 Embed 放在現有 Navbar overlay 中，保留 overlay 原本的開關；現有 `.mobile-overlay.gw` 上保留 `fs-scrolldisable-element="when-visible"`。
- Webflow 頁面從 jsDelivr 的 `designchen-tw/gowild-web@main` 載入前端 CSS/JS。瀏覽器小工具呼叫 `https://cwa-weather.designchenme.workers.dev/api/{longdong|kenting|defulan}`；Worker 向中央氣象署取得資料。Windy 和即時影像為第三方 iframe。
- `cwa-weather-worker.js` 是 Worker 原始碼，`CWA_API_KEY` 只存在 Cloudflare Worker Secret。龍洞觀測歷史使用 KV binding `CONDITIONS_HISTORY`，每小時 `15 * * * *` 的 Cron Trigger 更新；詳細岩面推估規則見 `ROCK-CONDITION-RULES.md`。
- 中英文切換在各 Embed 及小工具內實作。龍洞是三個地點頁共同的版面參考；墾丁與德芙蘭不顯示潮汐卡。
- 攀登現況共用排版在 `webflow-embeds/climbing-conditions-layout-v3.css`：桌機所有卡片同一列（龍洞六欄、墾丁與德芙蘭五欄），卡片容器寬度 601–980px 時採三欄；墾丁與德芙蘭第二排風向／岩面各佔半寬；≤ 600px 時切換兩欄，兩欄時岩面推估與龍洞潮汐各自滿版。每排卡片透過 CSS subgrid 共用標題、主要數值、補充資料與來源四列，依內容自動決定列高，不保留固定高度的空白。三個地點 Embed 都需載入此 CSS；龍洞 `v30` 將上一次潮汐與標題包在同一標題區塊。
- 龍洞九區位置圖由 `longdong-sector-map-v4.js` 與 `webflow-embeds/longdong-sector-map-v4.css` 提供，點地圖或下方卡片會雙向選取並聚焦。地圖使用使用者提供的 Illustrator 原稿提取之 `webflow-embeds/longdong-map-vector-v2.svg`，保留原稿的海岸地形、道路、步道與九區邊界；奇數與偶數岩區使用交錯灰階，九個標記位於原稿對應岩區內。地圖另以可切換中英文的文字標註道路、隧道、步道、停車場、和美國小、西靈巖寺與龍洞南口海洋公園。此版只保留地圖、縮放重置與下方岩區卡片連動。這是原稿比例的岩區示意位置，並非 GPS 導航或救援點編號。這一版僅用於龍洞。
- 岩區名稱的中英文排列在 `webflow-embeds/area-names-v1.css`：目前語言排前，手機版（≤ 520px）讓另一語言固定另起一行；三個地點 Embed 都需載入此 CSS。
- 共通文字層級在 `webflow-embeds/climbing-typography-v2.css`：桌機章節標題／重要數值／卡片名稱／內文／標籤／細節文字為 22/20/16/16/14/12px；手機 `max-width:520px` 為 18/16/14/14/12/10px。修改時一併檢查字高、字距、灰度、左右留白與中英文換行。

## 修改與發布

1. 從要修改的 Embed 查目前引用的 CSS/JS，編輯對應原始碼。若要避免 jsDelivr 仍提供舊快取，建立下一個版本化檔名並更新 Embed 引用；同時確認 Webflow Embed 長度限制。
2. 將變更提交並推送到 GitHub `main`，讓 jsDelivr 可取得新版本。只有 CSS/JS 改動時，若 Embed 引用也改了，仍必須把更新後的完整 Embed 貼回 Webflow 對應頁並重新 Publish。
3. `cwa-weather-worker.js` 有變更時，另在 Cloudflare 部署目前 Worker；GitHub 推送不會自動更新 Worker。不要把 Secret 寫入檔案或對話交接文件。
4. 遇到「本機正確、上線仍舊」時，依序確認 GitHub push、jsDelivr URL、Webflow 中貼上的 Embed 版本、Webflow Publish 及瀏覽器快取。不要只憑本機預覽判斷正式站已更新。

## 新對話如何接手

在 Codex 選用這個本機 repo `/Users/Guan-Wei/Documents/GitHub/gowild-web` 作為專案，開一個新對話並直接描述本次要改的頁面和問題。根目錄 `AGENTS.md` 會提供精簡的專案規則；只有需要架構或發布細節時再讀本 README。這能避免每個任務都帶入整段歷史對話。
