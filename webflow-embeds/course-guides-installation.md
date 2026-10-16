# 攀登學習與課程推薦頁

| Webflow slug | 完整 HTML Embed |
| --- | --- |
| `/sport-climbing` | `sport-climbing.html` — 運動攀登 |
| `/gym-to-crag` | `gym-to-crag.html` — 岩館到戶外 |
| `/trad-climbing` | `trad-climbing.html` — 傳統攀登 |

三頁共用 `course-pages-v4.css`、`page-sections-v1.css` 與 `course-pages-v3.js`。運動攀登使用 `course-guides-v2.css`，另外兩頁使用 `course-guides-v1.css`。沿用已完成課程頁的字級、中英文切換、四項浮動導覽、灰底白色hover按鈕、左右留白、章節淺底與分線，以及最後區塊與Webflow footer相同的#0b0d0e底色。英文版語言切換下方保留AI翻譯與公司說明。

## 安裝

1. 新建上述三個Webflow靜態頁，保留全站Navbar、hamburger menu與footer。若複製現有課程頁，刪除舊課程內容、原生諮詢表單、舊PDF按鈕與Adobe初始化程式。此三頁是推薦介紹，不是GO WILD承辦課程，不放GO WILD報名表單、PDF viewer或停開課公告。
2. 每頁新增一個Code Embed，貼入同名HTML檔完整內容，置於Navbar下方的內容區。
3. 更新首頁 `home.html` 的完整Embed：原有三張學習卡片已連往新頁；其餘卡片及首頁landing/sticky/原生表單整合均保留。
4. 更新hamburger內的 `menu-overlay-full.html`：LEARN新增三項連結，順序為運動攀登、Gym to Crag、傳統攀登、多繩距、繩索操作與救援；在新頁開選單時會展開LEARN並標示目前頁。
5. 三個頁面建立後，再一併Publish新頁、首頁與選單，避免新入口指向尚未發布的網址。GitHub更新不會自動建立或發布Webflow頁面。

## 內容編輯

- 運動攀登頁四個章節為認識、頂繩攀登、先鋒攀登、推薦。認識章節介紹運動攀登、繩隊角色與場域；頂繩列8項細項，先鋒列10項細項，各自整理裝備、確保、溝通與下降學習方向。此頁使用 `course-guides-v2.css`，另外兩頁仍用v1。
- Gym to Crag涵蓋天然岩場判讀、各類固定點、頂端作業、撤收與雙繩垂降；英文使用double-strand rappelling，指以兩股繩索下降。
- 傳統攀登先提供完整單繩距學習架構，共10項：準備與路線規劃、器械配置、保護點放置、受力與繩索管理、確保站、先鋒、跟攀拆點、繩隊交接、下降撤收、狀況應對與整合實作。這是本網站的整體學習架構，並非逐項宣稱推薦單位開授同一份課綱。
- 依編輯者指示，傳攀推薦區只提供百合搖滾介紹及指定官方課程頁連結，不另標明該連結課程的範圍。未轉載其日期、價格、時數或報名表，也未宣稱目前可報名。
- 運動攀登與Gym to Crag推薦連結先留空間。HTML內 `data-guide-provider-placeholder` 標示待填區，沒有假href或無作用按鈕。確認單位後，將此區替換為單位名稱、簡介及官方課程連結。
- 所有中英文文案分別在 `data-course-zh`、`data-course-en`；修改時同步維護，避免切換語言後恢復舊內容。

## 編輯參考

- [百合搖滾：保護點以及固定點系統架設](https://www.wildlily.rocks/2025%E5%90%84%E9%9A%8E%E6%AE%B5%E8%AA%B2%E7%A8%8B/%E4%BF%9D%E8%AD%B7%E9%BB%9E%E5%9B%BA%E5%AE%9A%E9%BB%9E%E7%B3%BB%E7%B5%B1%E6%9E%B6%E8%A8%AD)：保護點與確保站練習方向及推薦連結來源。
- [Petzl ACCESS BOOK #1](https://www.petzl.com/FI/en/Sport/Downloads-eBooks/AccessBook-Belaying?universe=Sport)：頂繩、先鋒、夥伴檢查及確保學習主題。
- [BMC：Top tips for new outdoor climbers](https://www.thebmc.co.uk/en/guidance-for-new-outdoor-climbers)：室內轉戶外的環境差異與下降規劃方向。

頁面內容是學習方向介紹，未編寫可直接依序操作的繩索技術步驟。
