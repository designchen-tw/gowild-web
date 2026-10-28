# /resole · 攀岩鞋製造與修補

## 2026-10-28 上線版本 v1.1.1

將 `webflow-embeds/resole.html` 的完整內容貼回 Webflow `/resole` 頁面原有 Code Embed，再 Publish。保留既有 navbar、menu overlay 與 footer；全站 Head／Footer、其他頁面及 Workers 不需因此更換。GitHub 更新不會自動發布 Webflow。

新版圖例與樣式已內嵌於 HTML，無需另外上傳圖片或新增載入器；原有共用深淺主題程式仍沿用既有固定版本。HTML 約47,567字元，低於 Webflow 50,000字元限制。

## 本次內容

- 製造章節：使用站方更新的 Instinct VSR 外型 SVG，保留39個原始路徑及其 transform 與中文標記位置。整合時僅補上英文標記、可讀文字與深淺主題配色，並將 Illustrator 的通用 class 名稱加上專用前綴以免影響其他元件。新版描繪與中文標記位置維持站方原稿，深色主題補齊新增的覆膠與粗線配色，淺色主題保留原稿色票。圖上不放 VSR 字樣，結構與分層為製程示意，非原廠工程圖。
- 製作流程維持鞋楦與材料準備、鞋面裁切與縫合、套楦成形、包邊與外底黏合、修整與檢查，不新增裝飾編碼。電腦左右對照，手機上下排列。圖例說明已放入 figure／figcaption，緊接 SVG 下方；手機不會再排到全部製程步驟之後。
- 材料卡片：XS Grip 2 新增 Instinct VSR、Drago、Solution Comp；XS Edge 新增 Instinct VS 男款前掌、TC Pro、Katana 男款。標示外底或前掌部位，並說明 Instinct VS 男款的腳跟採用 XS Grip 2。
- 內文、材料標題與鞋款範例的引用連結全部集中於頁尾可展開的「資料來源」，依製造與鞋型、橡膠與鞋款規格、修補與保養三類整理，共16個去重來源。正文保留鞋款與部位文字、章節導覽與 Roofguy Works LINE 聯絡按鈕。鞋款範例使用預設收合的「舉例鞋款與使用部位」，點選後顯示鞋款與使用部位；採原生 details／summary，中文英文同步，字級桌機14px／手機12px，不使用額外按鈕外框。
- 送修推薦加入 Roofguy Works 與 `https://lin.ee/9z18c2UT`，只顯示名稱與 LINE 入口，不附額外服務說明。按鈕配色與其他頁面一致：淺色預設 #EDF0EB／深灰字，hover 為 #262626／白字；深色預設淡灰底，hover 為淺灰底／深色字，鍵盤焦點保留主題綠框，觸控區至少44px。

## SVG 維護

- `webflow-embeds/svg/instinct-vsr-construction-edit.svg`：站方提供的 Illustrator 原稿，保留原始內容。
- `webflow-embeds/svg/instinct-vsr-construction.svg`：網頁使用的雙語／深淺主題版本，已內嵌於 `resole.html`。

重新調整原稿後，需同步更新網頁版本與 HTML 內的 SVG；單獨更新 repo 的 SVG 不會自動替換已貼在 Webflow 的內嵌圖形。

## 版面與頁尾

水平留白：桌機15vw、≤991px 7vw、≤767px 5vw。內文、材料卡、圖例、來源與送修均使用相同邊界。章節上下間距：桌機 clamp(72px,7vw,104px)，手機56px；以分隔線及深淺交替背景區分。

最後送修章節下留白為0；既有 `.block-for-copyright.gw` footer 使用目前主題的主底色，與最後章節銜接，原有內容、字級與 padding 保留。五項導覽仍為介紹、製造、材料、修補、送修，推薦整合在送修內。

字級維持既有規則：標題桌機22px／手機17px，內文16px／14px，小標題16px，輔助標籤與引用連結14px／12px。中英文切換保留段落、來源、導覽與 SVG 標記；品牌與型號維持原名。

## 已驗證

手機390px／電腦1280px、中英文、深淺主題、無左右溢出、材料連結順序、Roofguy Works 文字與連結、製圖路徑一致、HTML腳本可解析與Embed長度。正式網站需貼回並發布後才更新。
