# GO WILD App v1：Webflow 全站安裝

維護仍使用原本的 Webflow、Code Embed、GitHub 與天氣 Worker。此版本不建立獨立網站，不註冊 Service Worker，不新增離線資料、推播、會員或表單 API。

## 貼上與發布

1. 開啟 Webflow **Site settings → Custom Code → Head code**，保留原內容，在最後附加 `webflow-embeds/app-head.html` 的完整內容。不要貼進一般頁面 Code Embed；manifest 必須在每頁的 head。
2. 在同一處的 **Footer code** 保留原內容，附加 `webflow-embeds/app-footer.html` 的完整內容。只放一次，無須修改 13 頁內容 Embed 或重新貼 menu overlay。
3. Save，將網站 Publish 到正式網域 `gowild.one`。GitHub push 只發布共用資產，不會替 Webflow 完成這一步。
4. iPhone 用 Safari 開啟正式頁，從 hamburger 選單中點「加入主畫面」，依畫面步驟安裝，保留「以網頁 App 開啟」。從圖示重新開啟後檢查頂端固定列、地圖、跨頁及 Logo 回首頁。Android 用支援安裝的瀏覽器開啟；有原生安裝事件時，對話框按鈕會呼叫瀏覽器安裝提示，其他情況顯示手動步驟。

`manifest-v1.json` 在 CDN 提供，`id`、`scope`、`start_url`、捷徑均使用正式站絕對網址，因此從任一頁加入主畫面都指向同一個 App。圖示與程式檔採版本化名稱。manifest 回應須是 JSON 並允許跨來源讀取；部署後應確認 CDN 的 HTTP 狀態、MIME 與 CORS。

## 顯示與維護

- 一般瀏覽器只新增選單內的安裝入口，不將網站 Navbar 改為 Sticky。只有 `display-mode: standalone` 或 `navigator.standalone` 才使用 App 固定導覽；不依賴 `source=app` 或 `app-preview` 網址參數。
- 沿用原生 Logo、完整品牌文字、三線 hamburger 與 Webflow interaction。共用 CSS 統一水平對齊、手機 50px 圖檔容器、6px 品牌間距與輕微底部陰影。不複製或重新實作 Webflow 選單動畫，不攔截內部連結，不新增返回箭頭或自訂邊緣滑動。
- App 選單提供手機／月亮／太陽三個圖示選項（跟隨手機／深色／淺色），預設跟隨手機並即時回應系統主題改變。手動選擇保存在 `gw-app-color-theme-v1`，不設重置時間；回到「跟隨手機」即可恢復自動。一般網站仍使用既有的當日選擇／隔天重置規則，兩組儲存設定互不改寫。
- 安裝入口由共用腳本加到現有 `.gw-menu-panel`，放在主題切換之後。入口僅使用文字與小圖示、沒有按鈕底色或外框；視窗的內文與步驟置中。入口文字與提示皆可隨中文／英文切換，已安裝模式隱藏入口。沒有自動跳出的宣傳提示或安裝追蹤。
- 提示主標題 22px／手機18px、內文16px／14px、步驟14px／12px、細節12px／10px；灰階文字，灰底圓角按鈕，滑鼠 hover 白底，鍵盤 focus 綠框。淺色主題使用 `#F6F7F3` 底與 `#EDF0EB` 按鈕；深色跟隨既有底色與灰階。
- 頁面與選單更新須照原流程 Publish；已開啟的 App 畫面需重新載入，並非遠端即時替換。未新增積極更新或輪詢。
- 表單保持 Webflow 原始節點、欄位識別、Turnstile、提交與後台收件。原生 slider、首頁文字動畫與 Adobe PDF 預覽程式保留。PDF 沿用隱藏下載／列印的設定，不自動下載到裝置；仍需連網，Adobe SDK 的允許網域維持正式站。
- App 安裝及系統啟動畫面由各瀏覽器／作業系統提供；manifest 設定深色背景與白色 Logo 圖示，不新增開場動畫。不保證各系統顯示相同啟動過場或相同的返回手勢。
- 如取消此功能，移除新增的全站 Head／Footer 兩段並 Publish。沒有 Service Worker 需要解除、沒有離線快取需要清除；已安裝圖示由使用者自行移除。

## 驗證範圍

資產、manifest、原生頁框與安裝對話框可在本機驗證。iPhone 主畫面實際安裝、Safari 狀態列、Android 原生提示、Adobe 正式網域開啟與 Webflow 後台收件，必須在 Webflow Publish 後由實機確認；本機測試不發送真實表單。

## 官方參考

- [MDN：PWA 安裝條件](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN：manifest 的 start_url 與跨來源 manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url)
- [MDN：manifest 部署與 JSON 類型](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [WebKit：Safari 26 的主畫面網頁 App](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)

2026-10-23：正式 Head／Footer 改載 `app-v2.css` 與 `app-v2.js`，保留首版檔案供快取／歷史引用；主題三選項為圖示，名稱保留在中英文 aria-label／title。
