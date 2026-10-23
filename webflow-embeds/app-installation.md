# GO WILD App v8

App v8 adds per-crag offline downloads. Keep the existing App Head v7; replace the App Footer and deploy the same-origin Service Worker endpoint. Follow [app-offline-installation.md](app-offline-installation.md) for the current deployment and rollback instructions.

The following v7 guide describes the pre-offline base App. Its statements about no Service Worker and online-only use apply to v7.

---

# GO WILD App v7：Webflow 全站安裝

維護仍使用原本的 Webflow、Code Embed、GitHub 與天氣 Worker。此版本不建立獨立網站，不註冊 Service Worker，不新增離線資料、推播、會員或表單 API。

## 貼上與發布

1. 開啟 Webflow **Site settings → Custom Code → Head code**，保留其他原有內容，**替換舊版 GO WILD App Head 區塊**為 `webflow-embeds/app-head.html` 的完整內容。不要貼進一般頁面 Code Embed；manifest 必須在每頁的 head。
2. 在同一處的 **Footer code** 保留其他原有內容，**替換舊版 GO WILD App Footer 區塊**為 `webflow-embeds/app-footer.html` 的完整內容。只放一次，無須修改 13 頁內容 Embed 或重新貼 menu overlay。
3. Save，將網站 Publish 到正式網域 `gowild.one`。GitHub push 只發布共用資產，不會替 Webflow 完成這一步。
請保留既有 Finsweet Scroll Disable script（全站只載入一次）與 `.mobile-overlay.gw` 的 `fs-scrolldisable-element="when-visible"`。App 不取代完整捲動鎖定。

4. iPhone 用 Safari 開啟正式頁，從 hamburger 選單中點「加入主畫面」，依畫面步驟安裝，保留「以網頁 App 開啟」。從圖示重新開啟後檢查頂端固定列、地圖、跨頁及 Logo 回首頁。Android 用支援安裝的瀏覽器開啟；有原生安裝事件時，對話框按鈕會呼叫瀏覽器安裝提示，其他情況顯示手動步驟。

`manifest-v2.json` 在 CDN 提供，`id`、`scope`、`start_url`、捷徑均使用正式站絕對網址，因此從任一頁加入主畫面都指向同一個 App。圖示與程式檔採版本化名稱。manifest 回應須是 JSON 並允許跨來源讀取；部署後應確認 CDN 的 HTTP 狀態、MIME 與 CORS。

## 顯示與維護

- 一般瀏覽器只新增選單內的安裝入口，不將網站 Navbar 改為 Sticky。只有 `display-mode: standalone` 或 `navigator.standalone` 才使用 App 固定導覽；不依賴 `source=app` 或 `app-preview` 網址參數。
- 沿用原生 Logo、完整品牌文字、三線 hamburger 與 Webflow interaction。共用 CSS 在 App 中將導覽列及兩個操作圖示統一為 fixed，預留等高內容空間，並統一水平對齊、手機 50px 圖檔容器、6px 品牌間距與輕微底部陰影。不複製或重新實作 Webflow 選單動畫，不攔截內部連結，不新增返回箭頭或自訂邊緣滑動。
- App 選單提供手機／月亮／太陽三個圖示選項（跟隨手機／深色／淺色），預設跟隨手機並即時回應系統主題改變。手動選擇保存在 `gw-app-color-theme-v1`，不設重置時間；回到「跟隨手機」即可恢復自動。一般網站仍使用既有的當日選擇／隔天重置規則，兩組儲存設定互不改寫。
- App 主題切換下方增加「中文／EN」共用語言切換，使用 `gw-app-language-v1` 記住選擇並跨頁套用。透過各頁既有語言按鈕事件翻譯內容、原生表單及天氣／地圖；不重建表單節點。動態頁面腳本完成初始化時以 MutationObserver 同步，沒有輪詢。
- App 自動隱藏十三頁的頁內語言切換；普通網站維持原有按鈕。原始頁面按鈕請保留，毋須逐頁刪除或重貼內容 Embed，它們仍是各頁翻譯入口。
- 安裝說明視窗另外提供「中文／EN」，可獨立切換說明，不更改一般網站頁面的語言。中文入口「加入主畫面App」、標題「將 GO WILD 加入主畫面App」、介紹「從App直接開啟，查看岩場地圖、推薦路線與最新資訊。」；Safari 步驟名稱維持原生「加入主畫面」。
- 安裝入口由共用腳本加到現有 `.gw-menu-panel`，放在主題切換之後。入口僅使用文字與小圖示、沒有按鈕底色或外框；視窗的內文與步驟置中。入口文字與提示皆可隨中文／英文切換，已安裝模式隱藏入口。沒有自動跳出的宣傳提示或安裝追蹤。
- 提示主標題 22px／手機18px、內文16px／14px、步驟14px／12px、細節12px／10px；灰階文字，依文字寬度加左右20px留白的灰底圓角按鈕，滑鼠 hover 白底，鍵盤 focus 綠框。淺色主題使用 `#F6F7F3` 底與 `#EDF0EB` 按鈕；深色跟隨既有底色與灰階。
- 頁面與選單更新須照原流程 Publish。App 在 hamburger 左側新增細線重新整理圖示，重新載入目前網址；有未送出的表單時先確認，取消會保留輸入。一般瀏覽器不新增此圖示。
- v5 移除整套下拉重新整理：沒有 touchstart／touchmove／touchend 攔截、提示、動態留白、translate 或高度過場。App 頂端列與兩個操作圖示固定 top；保留垂直 overscroll 限制與固定高度占位，使用「↻」手動更新。
- App Head 在首頁提供返回恢復控制器，先於舊 Page Code 取得 `GWHomeNativeScrollPin`，舊程式的既有 guard 會避免重複初始化；首頁原本的 `home-safari-native-scroll-page-code.html` CSS 仍保留，不必重貼。只在 installed App 的首頁、支援 CSS scroll timeline 時生效。
- 離頁時取消並清空未執行 RAF；pageshow／回到前景時重新量測，並在同一繪製階段重新綁定自己的 CSS 時間軸。Finsweet body inline style 鎖定期間不量測，解除後同步範圍；不重啟 Webflow IX2、slider 或表單，不設 scroll handler、永久 RAF 迴圈或每次返回自動 reload。
- App 離開超過15分鐘再回到前景會重新載入一次，讓已開啟畫面取得新頁面；沒有背景輪詢或額外天氣請求。有未送出表單、開啟中的 dialog、全螢幕或 Adobe PDF 時暫緩，重新整理圖示上顯示小點。重新載入不是版本比對，不保證繞過第三方資料來源自身的快取。
- 網站和 App 共用返回修正：點選選單連結、pagehide、BFCache pageshow 還原時，透過原生 trigger 關閉選單並復原捲動鎖。未攔截原生返回手勢，也不改 history。
- App Head 內嵌關鍵導覽 CSS，在 HTML body 建立前即決定 installed mode，不再等 Footer 標記才套用，降低點 Logo 跨頁時的樣式閃動。
- 表單保持 Webflow 原始節點、欄位識別、Turnstile、提交與後台收件。原生 slider、首頁文字動畫與 Adobe PDF 預覽程式保留。PDF 沿用隱藏下載／列印的設定，不自動下載到裝置；仍需連網，Adobe SDK 的允許網域維持正式站。
- 啟動畫面分兩層：manifest 使用純黑背景；另提供24張 iOS `apple-touch-startup-image`（常見手機與平板直／橫向尺寸，黑底置中官方白 Logo）。系統顯示與快取由 OS 管理，無法保證所有裝置或既有安裝立即採用；必要時移除後重新加入。
- 網頁首次 App 工作階段另以 Head 內嵌黑底 Logo 遮罩接續，程式就緒後移除；最遲6秒退場，避免 CDN 失敗時卡住。一般站不顯示，也不在每次內部跨頁重播。
- 一般功能更新不需要重新安裝：先發布 GitHub 新版本檔名，再替換這兩段全站 Head／Footer 並 Webflow Publish；使用者重新載入即可取得。已安裝舊版必須至少重新載入一次，才能取得 新版的手動／回到前景更新功能。主畫面名稱、圖示及 OS 啟動畫面屬安裝資訊，可能要重新加入才更新。
- 如取消此功能，移除新增的全站 Head／Footer 兩段並 Publish。沒有 Service Worker 需要解除、沒有離線快取需要清除；已安裝圖示由使用者自行移除。

## v6 跨頁品牌列

App 在 body 一建立就掛入共用品牌連結，早於原生選單 Embed 與 Navbar 標記。使用同一份官方白 Logo 縮製的透明 128px PNG，直接內嵌 Head，依主題以 CSS 著色；App 顯示的 Logo 無需外部圖檔請求或切換主題換圖。只在成功掛入後隱藏 App 原生 Navbar 的 Logo／品牌文字，避免兩份可見或可讀取的品牌連結；原生 Navbar 背景與 hamburger 保留。普通瀏覽器不掛入、不隱藏。品牌列仍連回 `/`，不攔截點擊或原生返回。

僅預載品牌使用的 Avenir Medium；關鍵 font-face 使用 swap，字型未就緒先顯示備援字體。尋找 body 的 MutationObserver 掛入後即停止；pageshow 僅確認節點存在，不重複建立。維持正常 Webflow 多頁導覽，因此每次換頁仍會建立新文件；此改善減少品牌等待，並非 SPA、不保證零切頁空隙。

## 驗證範圍

資產、manifest、原生頁框與安裝對話框可在本機驗證。iPhone 主畫面實際安裝、Safari 狀態列、Android 原生提示、Adobe 正式網域開啟與 Webflow 後台收件，必須在 Webflow Publish 後由實機確認；本機測試不發送真實表單。

## 官方參考

- [MDN：PWA 安裝條件](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [MDN：manifest 的 start_url 與跨來源 manifest](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/start_url)
- [MDN：manifest 部署與 JSON 類型](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest)
- [WebKit：Safari 26 的主畫面網頁 App](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)

2026-10-23 v6：正式 Head／Footer 改載 `app-v6.css`、`app-v6.js` 與 `manifest-v2.json`，保留歷史資產。安裝說明改為置中三步圖例；提示按鈕依文字寬度。更新後請取代舊 App 區塊，不要重複附加。

- [web.dev：BFCache 的 pageshow／pagehide](https://web.dev/articles/bfcache)
- [Apple：主畫面網頁與 startup image](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html)


- [MDN：pageshow 與返回快取還原](https://developer.mozilla.org/en-US/docs/Web/API/Window/pageshow_event)

## v7 品牌位置修正

提前品牌列補回 v5 原生 Navbar 的 16px flex gap 與內層 1% margin；使用 CSS calc 比照原容器的可用寬度，無需等候 Footer 量測。保持手機 50px／桌機 70px 圖檔容器、垂直置中及 6px 圖文間距。只需替換 App Head 並 Publish；app-v7.css 搭配原 app-v6.js，Footer 不變。

479px 以下依原生 Webflow 設定取消內層 1% margin，保留外層 padding 與 16px flex gap，避免窄手機多加留白。
