# GO WILD 離線 App v1 — 2026-10-24

維護仍以 Webflow 與現有 HTML Embed 為主，不另建網站，也不替換原生 Webflow 導覽、投影片或表單。第一版提供龍洞、德芙蘭、關子嶺、墾丁四個岩場的手動離線儲存。

## 使用方式

1. 連線時在 App 選單開啟「離線資料」。
2. 在目前岩場選「儲存」；其他岩場選「前往儲存」，進入該頁後會開始下載。
3. 等待顯示「已完成，可離線閱讀」及儲存時間。保持頁面開啟，下載未完成不算離線可用。
4. 出發前開啟「檢查內容更新」。若有新版內容，重新載入該岩場再儲存；顯示的「儲存於」是下載時間，不是路線資料的發布日期。
5. 不需要的岩場可個別移除。裝置若因空間不足、清除網站資料或長期未使用而刪除快取，下次開啟清單會回到「尚未儲存」，不繼續標成可用。

成功下載會保存原始公開頁面 HTML、已載入的互動程式、樣式、地圖、路線、必要圖片與字型。每個岩場採獨立交易：新版本完整下載後才取代舊版本，失敗保留舊資料。單一岩場最多200個資產、64MiB，最多三個平行下載；不在背景反覆下載全部岩場。

## 資料邊界

- 天氣 API：連線時照原規則取得資料，只保留最後成功回應。離線顯示明確標示「離線資料 · 最後取得」時間；這不是當前天氣。未曾成功取得的資料顯示暫缺，不補示例值。
- 波高／潮汐：包含在最後的龍洞回應中，仍受原本資料過期邏輯限制。不外推不存在的浪高或潮汐事件。
- 即時影像、Windy、外部網站、Google Maps、Google 文件及 Adobe PDF 不列入離線包。原本限制下載的 PDF 仍需連線；不建立離線 PDF 副本。
- 表單：不快取 POST、輸入值、訊息或送出結果。離線按送出會提示需連線，輸入仍留在當前頁面，不排隊自動寄送；關閉或重新載入頁面仍可能失去未送內容。
- 其他頁面不自動儲存。離線開啟未儲存頁面／首頁時，提供可開啟的已儲存岩場清單。
- 一般網站依舊優先使用網路 HTML。程式與圖片以實際版本化網址快取；頁面、Menu Overlay 與 Webflow 更新仍走原發布流程。

## 上線前置：同網域 Service Worker

不能將 jsDelivr／GitHub 或 `workers.dev` 的 URL 直接註冊成 `gowild.one` 的 Service Worker。必須同網域提供 JavaScript，並授權根目錄 scope。

本 repo 提供獨立 `pwa-offline-worker.js`，只供應以下兩個端點：

- `https://gowild.one/gw-offline/sw.js`：Service Worker 程式，`Content-Type: application/javascript`、`Service-Worker-Allowed: /`、`Cache-Control: no-cache`。
- `https://gowild.one/gw-offline/health`：連線確認。

此 Worker 不代理 Webflow 頁面、不處理表單，也不替換 CWA Weather Worker。

### Cloudflare 設定

1. 在現有 Cloudflare 帳戶新建獨立 Worker，例如 `gowild-offline`，貼入 `pwa-offline-worker.js`。
2. 交付的 Worker 已內建固定資產版本 `66ff6f0d8bf51033e05bb586edc36703dc9627da`，可直接貼上部署，不需 Secret。未來發布時，可用一般變數 `OFFLINE_ASSET_COMMIT` 覆蓋成包含新版離線程式的40字元 GitHub commit。
3. 將 Worker Route 指向 **僅** `gowild.one/gw-offline/*`。不要設定成 `gowild.one/*`，不要改成網站的 Custom Domain origin，也不要移除 Webflow DNS。
4. Route 需有 Cloudflare 代理的 DNS record。網域已使用 Cloudflare nameservers，但仍須在 Dashboard 核對此 hostname 的代理狀態。若目前為 DNS only，不要未確認就更動正式網站連線；先確認 Webflow 網域與 SSL 設定能配合該路由。
5. 確認端點回傳 JavaScript，不是301、Webflow 404 HTML、登入頁或 Cloudflare challenge。一般網站與 `/longdong` 等頁應繼續由 Webflow 提供。
6. 如使用 `www.gowild.one`，建議保留現有導向 canonical `gowild.one`。若兩個網域都直接服務網站，兩者需各自設置 route；快取與安裝狀態依 origin 分開。

沒有同網域端點時，光貼 Footer 不能啟用離線功能。前端會保留正常網站與既有 App 功能，儲存清單顯示離線功能未就緒。

### Webflow 設定

1. 保留現有 `webflow-embeds/app-head.html`（App v7）及首頁 Page Code。
2. 將全站 Footer 裡原本載入 `pwa/app-v6.js` 的 App 區塊，**完整替換**成新版 `webflow-embeds/app-footer.html`；不要重複附加兩份 App 腳本。
3. 新 Footer 載入 `app-v8.js`、`offline-v1.js` 及 `offline-v1.css`。保留其他原生 Webflow、Finsweet、表單、PDF 程式。四頁內容 Embed 不需為離線功能另外改寫。
4. Webflow Publish 後，既有 App 需連線並手動 ↻ 重新載入一次，才能取得離線程式。不需移除並重新加入主畫面。
5. 用 iPhone 真機完成下方核對；GitHub 推送不會替代 Cloudflare deploy 與 Webflow Publish。

## 更新機制

網站內容更新與 App 程式更新分開：

- 內容：已儲存內容是使用者選定的副本，不靜默大量覆蓋。「檢查內容更新」比對目前 Webflow HTML；若不同，顯示有新內容，使用者再儲存。資料若由外部來源獨立變更而 Webflow HTML 不變，仍可手動選「更新」重新抓取所有資產。
- App：頁面開啟及回到前景時至多每小時檢查 Service Worker 程式。新 Worker 先等待，不在閱讀或填寫表單時強制接管；清單顯示「App 有新版 · 更新並重新載入」。有未送表單／PDF視窗時先提示處理，再由使用者更新。
- 管理員發布新版：新增版本化 JS／CSS／SW 檔並發布 GitHub，更新 gateway 中使用的檔名與 `OFFLINE_ASSET_COMMIT`、部署 gateway；若前端介面也更新，替換 Webflow Footer 並 Publish。版本號三個程式與安裝文件一起更新。舊快取包在相容 schema 下繼續可用，不因更新 App 就刪光使用者離線資料。
- 單純路線、地圖或 Menu Overlay 修改，繼續原 Webflow／Embed 流程，不必每次改 Service Worker；使用者可更新岩場副本。新頁面需日後另外擴充明確的可儲存清單。

## 發布驗證與限制

本機使用真正的 Service Worker、Cache API 與四頁目前 Embed 測試，所有表單送出均阻擋。實際裝置的主畫面安裝、OS 啟動畫面、網路切換、背景儲存與儲存空間回收仍需發布後實機確認。不要宣稱離線資料永久不會被清除。

正式發布後核對：四個岩場逐一儲存完成 → 飛航模式關閉 Wi-Fi → 完全關閉再開啟 App → 地圖平移／縮放、選取字卡、路線排序與中英文 → 未存頁面顯示離線清單 → 天氣顯示最後時間 → 重新連線、檢查內容更新 → 更新後斷線再開啟。PDF、監視器與表單需連線。

## 回復／停用

只刪掉 Footer 不會自動解除已註冊的 Service Worker。若需撤回，可先在 gateway 設定 `OFFLINE_DISABLED=true`，同一 `/gw-offline/sw.js` 就會提供 `pwa/offline-disable-v1.js`，解除註冊並只清除 **gw-offline-v1-** 前綴快取。先讓使用者連線更新，再移除 Footer 與 route。不要呼叫 `caches.keys()` 後無差別刪除整個 origin 的其他網站資料。

## 官方參考

- [MDN：Service Worker 註冊與同網域 scope](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register)
- [MDN：PWA 快取策略](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Caching)
- [Cloudflare：Worker Routes 與既有網站](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [WebKit：儲存配額與清除政策](https://webkit.org/blog/14403/updates-to-storage-policy/)
