# 主題、語言與手機精簡首頁 — 2026-10-27

維護仍使用 Webflow 與 HTML Embed。這一版將網頁版的主題、語言控制整合到全站選單，並加入可選的手機精簡首頁。

## 上線順序

1. Webflow Site settings → Custom code → Head code：完整替換原 GO WILD App Head 為 `app-head.html`，其他無關程式保留。新 Head 在首次繪製前讀取偏好，避免顯示動畫後才跳到精簡版。
2. 全站 Hamburger Overlay 的 Code Embed：替換為 `menu-overlay-full.html`。
3. 首頁下方內容 Embed：替換為 `home.html`。Webflow 原生投影片、動畫、表單與 footer 不刪除；首頁原有 Safari Page Code 保留。
4. 龍洞內容 Embed：替換為 `longdong.html`，包含三則雙語公告及新版浪況載入程式。
5. 原有 **CWA 天氣 Worker** 更新為 repo 的 `cwa-weather-worker.js`，保留 `CWA_API_KEY`、`CONDITIONS_HISTORY` KV 與 Cron。這不是離線 Worker；離線 Worker、route 與 App Footer 不需為這次更新而更換。
6. Publish Webflow；現有 App 連網重新載入。離線副本仍是使用者保存的版本，可在「離線資料」更新已儲存的首頁與龍洞。

共用程式與 CSS 使用固定 GitHub commit，所有交付 Embed 低於50,000字元。其他頁面的語言、主題由全站 Head 與 Overlay 提供，不必逐頁重貼。

## 控制與偏好

- 電腦版：第一行主題、第二行中文／EN、第三行加入主畫面 App 與離線資料（保留小下載圖示，兩個入口同列置中）。
- 手機版：在 Logo 與品牌文字下方提供「完整首頁／精簡首頁」。第一次為完整首頁；切換後，只有手機首頁略過 Webflow 開場動畫與介紹，直接顯示岩場圖卡。學習、探索、聯絡與原生表單保留。桌機始終顯示完整首頁；手機橫向採同樣精簡規則。
- Logo與品牌文字在深色為白色90%、淺色為黑色90%；其他文字維持原層級。
- 主題、語言與首頁控制共用膠囊、30px按鈕高度與滑動選取色塊。動畫約0.2秒，只在操作時執行，不使用模糊或捲動迴圈；尊重「減少動態效果」。
- 網頁主題使用 `gw-color-theme-v1`，值為 `system`、`dark` 或 `light`；移除舊 `-day` 日期，既有有效的手動選擇保留，不再每日重設。只有 system 會即時跟隨裝置外觀。
- App 仍使用既有 `gw-app-color-theme-v1` 與 `gw-app-language-v1`，不強制改寫 App 的既有選擇。
- 網頁語言使用 `gw-site-language-v1`，預設中文，切換後跨頁、重新開啟及同站分頁沿用。使用每頁既有翻譯按鈕的事件，不重建表單、清空輸入或改寫提交。
- 原本頁面語言按鈕只在選單控制已掛載後隱藏；主題／語言不需登入、不設到期時間。不同裝置、瀏覽器與主畫面 App 的儲存不保證共用。
- 精簡首頁使用 `gw-home-compact-v1`，值為 `full` 或 `compact`。清除網站資料後回到完整首頁；偏好儲存被封鎖時仍可在本頁切換。

## 公告維護

龍洞公告直接在 `longdong.html` 的 `ld-announcements` 區塊修改；中文與 `data-lang-en` 同時更新，並調整整理日期。這次內容依站方提供的颱風災損及10/31活動資訊編寫，不聲稱為自動查證、即時監測或外部公告串接。活動結束後可自行移除或更新該項。

## 浪況首次載入

見 `longdong-wave-installation.md`。新版在資料到達前顯示載入中；整份預報過慢或缺少浪況時，最多向 `/api/longdong/wave` 補抓一次小型觀測回應。正常15分鐘快取與顏色級距保持不變。Worker 只保存有效海況，並可從既有 KV 回復三小時內的最後有效觀測；原始觀測時間不重設。離線不補抓。
