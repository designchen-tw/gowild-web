# App 更新小窗與選單入口 — 2026.11.02.5

## 顯示方式

- 只有安裝版 App 顯示「檢查 App 更新」。入口移到 overlay menu，與「離線資料」同一列；兩者均使用14px細線 icon、12px文字、18px行高及40px點擊高度。
- 「離線資料」視窗移除 App 更新按鈕，只保留岩場內容檢查／儲存操作。
- 首頁有新版時顯示提示；「查看更新」開啟同一個 dialog，保留目前網址及頁面。兩段文字同字型、字級、行高與文字基準，icon 不再影響文字 baseline。
- 更新 dialog 使用既有安裝提示窗的深淺色、字級與右上角 X。可以直接關閉，不提供首頁或返回首頁按鈕。
- 按「更新並重新載入」才套用 waiting Worker 並重新載入目前頁面。完成後以同一個小窗確認實際版本，按 X 繼續瀏覽；原下載岩場資料保留。
- 更新前檢查未送表單及仍在進行的離線下載，不強制中斷。小窗支援離線、已是最新、準備中、失敗與重試、中英切換。
- 一般電腦／手機網頁不建立 App 更新入口、通知或 dialog；原本的加入主畫面提示、離線功能及網站聲明保留。

## 相容處理

`app-updater-v1.js/css` 由全站 Footer 獨立載入，舊 Worker 不會把它改回舊的離線程式。新版 Worker 對已下載的舊 HTML 也補上此共用 dialog，並隱藏舊的更新頁連結介面。舊連結若仍在目前 App 文件中，點擊時轉成開啟 dialog。

舊 `/gw-offline/update` 端點保留給尚未取得新介面的相容流程；新介面的首頁和選單不再導航到此網址。

## 上線

1. 原 Cloudflare 離線 Worker 替換根目錄 `pwa-offline-worker.js` 並部署，Route 維持 `gowild.one/gw-offline/*`。
2. 若設有 `OFFLINE_ASSET_COMMIT`，移除該變數，或改成 `084bc57b58bc4d19be5bdbecf103e91990824b4e`。
3. Webflow 全站 Footer 的 App 區塊替換 `app-footer.html` 並 Publish。Head、Menu Overlay Embed、首頁與四個岩場 Embed不需重貼。
4. App 連網重新載入以取得介面；若原 Worker 有新版等待，按首頁提示或 menu 的 App 更新入口更新到 `2026.11.02.5`。

GitHub 推送不等同 Cloudflare 部署或 Webflow Publish。不清除已下載岩場；原本下載網址修正、網路優先與氣象24小時備份規則保留。

## 驗證

- 手機390px：首頁提示與「查看更新」文字 bounding top 都為132px、bottom都為142px，字型均為10px／16px GW Home Avenir。
- menu兩個入口同列、同top，均40px高、12px／18px GW Avenir、14px icon。
- 真正本地 Worker：`.4`等待`.5` → 首頁按鈕開 dialog → X關閉仍停原頁 → menu再次開同一dialog → 明確更新 → 原頁重新載入 → 可關閉的`.5`完成小窗。
- 一般手機390px與電腦1280px：App更新入口與dialog數量皆為0，安裝入口與離線入口仍存在。
- 自動測試：App／網頁隔離、menu同列及icon、關閉不導航、只在明確更新後重載原頁、完成確認、未送表單、失敗及離線、舊Footer載入新dialog、舊離線包保留、下載404修正與氣象網路優先不回退。
