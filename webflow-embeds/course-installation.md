# 多繩距與繩索操作／救援課程頁

> 2026-10-22 原生表單統一版：首頁、多繩距與繩索操作／救援共用 `webflow-native-form-v4.css`。三頁都保留 Webflow 表單原本的 section、父層、class、欄位與按鈕尺寸、字級和圓角；取消首頁額外的送出按鈕版型。僅共用配色、綠色聚焦框與既有中英文切換。請完整重貼這三頁的主內容 Embed 後 Publish，保留原生表單；選單與首頁 Page Code 不需更換。

> 2026-10-22 更新：本頁已加入與首頁一致的深淺色主題。請使用目前完整 HTML Embed，並參照 `content-theme-installation.md` 的最新部署方式。配色與底部導航設定以該文件為準；原有內容、照片、課程 PDF 與表單提交功能保留。


- `/multi-pitch` 使用 `multi-pitch.html`。
- `/rock-rescue-skill` 使用 `rock-rescue-skill.html`。

兩頁共用 `course-pages-v5.css`、`course-pages-v3.js`、`course-pdf-lightbox-v2.js` 及現有 `page-sections-v1.css`，提供頂端單一中英文切換、四項浮動導覽、灰底白色hover按鈕、課程內容的交替淺底／分線／間距。原生表單保留原有Webflow欄位版型與樣式，翻譯顯示文字並統一外層左右留白。英文版的語言切換下方顯示AI翻譯與公司介紹說明，中文版隱藏。首頁與選單已有正確連結，無需重貼它們。

## Webflow 安裝

1. 保留現有 Navbar、hamburger menu overlay、footer、Webflow自動產生的scripts。
2. 將舊課程標題、課程概述、適合對象、課程目標、舊PDF按鈕等內容替換成一個Code Embed，貼上對應HTML完整內容。新Embed應是Navbar下方第一個內容區塊，公告才會顯示在最上方。
3. **保留現有原生課程表單的整個section與Form Block**（`.w-form` 包含 `#wf-form-Course-Inquires`），留在Embed外面與原本位置，保留class、style、`data-wf-page-id`、`data-wf-element-id`、Turnstile、所有欄位名稱及Webflow頁面設定。刪除原生section中的舊「報名諮詢」標題，只留下原生表單；新版Embed已提供「COURSE ENQUIRIES／報名諮詢」大小標題，與其他章節同樣字級。不要另外複製表單或手寫新的form。
4. 新版不搬移表單，不加入表單 class 或欄位尺寸覆寫；僅統一原生 section 的外層左右留白，並以共用表單樣式調整顏色。共用程式只翻譯原生區塊的標籤、placeholder、選項顯示文字與送出／等待／成功／失敗文案；切回中文恢復原文。新版Embed的備用郵件內容會隱藏，「報名諮詢」標題保留並緊接原生表單。浮動「諮詢」導覽定位至此標題；原生section外層取消上下padding，延續諮詢區塊的淺底色，避免標題與表單斷開。諮詢section採用flow-root，讓標題底部36px外距保留在淺底區塊內，修正正式頁標題與表單之間出現黑條。兩頁既有Webflow `.block-for-copyright.gw` footer強制使用相同 `#0b0d0e` 底色，選擇器限定這兩個課程slug，不影響其他頁面。提交仍由Webflow原本的程式處理。
5. **保留新版HTML內的PDF按鈕，不要另外新增按鈕。** 每頁HTML已包含唯一的 `#open-pdf-btn` 按鈕與 `#adobe-pdf-view` 容器，並由共用程式載入Adobe SDK。請刪除原本另外放置的舊PDF按鈕，以及舊Adobe PDF Embed中的SDK script／渲染div／初始化程式，避免同ID重複或點一次開啟兩次。新版按鈕沿用使用者提供的Client ID `1ab7bac71c454175860f77e0c80b3a03`，以 `LIGHT_BOX`、`exitPDFViewerType: CLOSE`、`showDownloadPDF: false`、`showPrintPDF: false` 開啟各頁原本對應的2026 PDF，不會讓救援課程誤開多繩距PDF。
6. Publish兩個課程頁。實際送出與後台收件請在Webflow正式頁以測試資料驗證；本機檢查不會提交表單或寄送訊息。

## 內容與公告

中文課程概述、適合對象、目標及PDF網址取自2026-10-16的兩個現有正式頁，依原文整理段落並翻譯英文，未新增價格、日期或課程時數。「課程概述／Course Overview」小標題已移除，介紹內文保留。舊的「匯款前請先聯絡講師確定開課日期」提示以課程諮詢取代，避免與停開課公告衝突。

兩頁第一個內容為 **2026** 公告：「今年已無新開課計劃，請持續關注。」英文為「No new courses are planned for the rest of this year. Please stay tuned.」。年度是編輯內容，不會跨年自動重設公告。

新版不改變form／input／select的id、name、data-name、required、option value、已輸入內容、勾選狀態、後台收件設定或Turnstile，也不改表單位置、class、style或欄位原生外觀。外層原生section以data屬性標記，僅統一左右留白：與目前Webflow footer相同：桌機15vw，≤991px為7vw，≤767px為5vw，不再套用1080px內容上限。公告、概述、對象與目標清單也使用相同內容邊界；標題仍置中。新增section id只用於導覽定位。

## PDF 預覽驗證

PDF入口改為button，不含href、target或download。SDK尚未就緒或預覽失敗時僅顯示雙語提示，不直接開啟原PDF，亦不觸發下載。Adobe預覽隱藏下載與列印按鈕。這是預覽介面的限制，不是DRM；瀏覽器仍需取得PDF內容，公開CDN原檔仍可被取用。PDF Embed API會檢查Client ID所允許的網站網域，本機file預覽與Webflow測試網域未必能使用現有金鑰；正式Lightbox需在已授權網域Publish後確認。[Adobe 官方說明](https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/gettingstarted)
