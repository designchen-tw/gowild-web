# App 首頁更新提示與更新頁 — 2026.11.02.3

## 使用流程

- 僅在安裝版 App 的首頁顯示，位置在上方導覽列下方、首頁投影片之前；完整首頁與精簡首頁都能看見。
- 只有新版 Service Worker 已安裝、必要檔案已準備好（`registration.waiting`）才顯示「App 有新版可更新 · 查看更新」。首次安裝、沒有新版、一般瀏覽器不顯示。
- 點擊前往同網域 `/gw-offline/update`，顯示目前／新版版本，按「更新 App」才套用；不強制中斷閱讀，也不在背景偷偷重新整理。
- 完成後顯示「App 已更新完成」，按「回到首頁」開啟新版首頁。更新頁也處理檢查中、準備中、已是最新版、離線、失敗及重試。
- 中英與深淺色沿用 App 儲存的選擇；系統主題在開啟更新頁時讀取裝置設定。字級沿用標題22/18、內文16/14、按鈕14/12、細節12/10px。
- 更新不刪除或重抓已下載岩場。岩場內容更新仍在「離線資料」中處理；這個 App 更新提示不代表有新岩場內容。
- 首頁若有未送出的表單，會先提示處理表單，避免直接離開造成資料遺失。

## 上線步驟

1. 在原本的 Cloudflare **離線 Worker**，完整替換根目錄 `pwa-offline-worker.js` 並部署。既有 Route **`gowild.one/gw-offline/*`** 不變，不需新增 Webflow 頁面。
2. 若有變數 `OFFLINE_ASSET_COMMIT`，改成 `858bfa9fedc0098a3352f0bd7eaa70d9bc01d620`，或移除變數以使用內建新版。
3. Webflow 全站 Footer 的 GO WILD App 區塊完整替換成 `app-footer.html`，保留其他程式，然後 Publish。Head、首頁 Embed、Menu Overlay Embed、氣象 Worker 與地區限制 Worker 不需修改。
4. 確認 `/gw-offline/health` 版本為 `2026.11.02.3`，`/gw-offline/update` 能開啟更新頁。
5. 既有 App 先連網重新載入，必要時在「離線資料」套用 App 新版；取得這次提示程式後，未來有新版即可從首頁進入更新頁，不需重新加入主畫面。

**無法讓從未重新連線、仍停在舊頁面的 App 立即出現新功能。** 這次功能須先進入使用者裝置。之後每次載入與回到前景會檢查新版（前景檢查間隔最多每小時一次），新版下載完成才出現提示。手機背景或完全離線時不保證即時檢查，也不使用推播。

GitHub 推送不等同 Cloudflare 部署或 Webflow Publish。

## 往後發布新版

- 修改 App 共用程式時，建立新版檔名與固定 GitHub commit，調整 Service Worker 的 `RELEASE` 及安裝清單，讓手機辨識為新 App 版本。
- 更新離線 Worker 的固定資產 commit，並更新 Webflow Footer 引用後 Publish。Service Worker 安裝失敗時不會宣稱新版已準備好，原 App 與離線資料繼續使用。
- 一般 Webflow 文字／圖片／Menu 更新依原發布流程，不必每次都當成 App 程式更新。

## 驗證

- 實際本地 Service Worker：舊版啟動 → 新版下載至 waiting → 首頁提示 → 更新頁 → skipWaiting → controllerchange → 完成 → 首頁提示消失。
- 測試包括：App／瀏覽器、首頁／其他頁、初次安裝、重複提示、雙語、未送表單、最新版／離線／錯誤重試、原離線包保留、專用更新 Route、原本網路優先與氣象自動更新不回退。
- 更新頁可從已安裝的 App shell 開啟；未安裝 shell 時由既有 Cloudflare Route 提供。
