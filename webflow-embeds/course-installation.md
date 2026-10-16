# 多繩距與繩索操作／救援課程頁

- `/multi-pitch` 使用 `multi-pitch.html`。
- `/rock-rescue-skill` 使用 `rock-rescue-skill.html`。

兩頁共用 `course-pages-v1.css`、`course-pages-v1.js` 及現有 `page-sections-v1.css`，提供頂端單一中英文切換、四項浮動導覽、灰底白色hover按鈕、交替淺底／分線／間距及最後區塊無底部留白。首頁與選單已有正確連結，無需重貼它們。

## Webflow 安裝

1. 保留現有 Navbar、hamburger menu overlay、footer、Webflow自動產生的scripts。
2. 將舊課程標題、課程概述、適合對象、課程目標、舊PDF按鈕等內容替換成一個Code Embed，貼上對應HTML完整內容。新Embed應是Navbar下方第一個內容區塊，公告才會顯示在最上方。
3. **保留現有原生 Course Inquires Form Block**（`.w-form` 包含 `#wf-form-Course-Inquires`），放在Embed外面、同一頁，保留原本 `data-wf-page-id`、`data-wf-element-id`、Turnstile、所有欄位名稱及Webflow頁面設定。不要另外複製表單或手寫新的form。
4. 共用程式會將同一個原生Form Block移到新版「課程諮詢」區塊，並隱藏原來空下來的表單section。新舊內容不要重複保留。表單仍由Webflow原本的提交程式處理，不使用自訂API或取代submit事件。
5. 新PDF按鈕直接連原本的2026課程大綱，在新分頁開啟；可移除舊Adobe PDF Lightbox專用Embed與初始化程式，避免殘留空白或無用載入。
6. Publish兩個課程頁。實際送出與後台收件請在Webflow正式頁以測試資料驗證；本機檢查不會提交表單或寄送訊息。

## 內容與公告

中文課程概述、適合對象、目標及PDF網址取自2026-10-16的兩個現有正式頁，依原文整理段落並翻譯英文，未新增價格、日期或課程時數。舊的「匯款前請先聯絡講師確定開課日期」提示以課程諮詢取代，避免與停開課公告衝突。

兩頁第一個內容為 **2026** 公告：「今年已無新開課計劃，請持續關注。」英文為「No new courses are planned for the rest of this year. Please stay tuned.」。年度是編輯內容，不會跨年自動重設公告。

新版不改變form／input／select的id、name、data-name、required、option value、已輸入內容、勾選狀態、後台收件設定或Turnstile。語言切換只改標籤、placeholder、option顯示文字、送出／等待與成功／錯誤文案。輸入欄保留兩側圓角，textarea使用圓角矩形。
