# /resole · 攀岩鞋製造與修補

## 2026-10-27 上線版本 v1.1.0

將 `webflow-embeds/resole.html` 的完整內容貼回 Webflow `/resole` 頁面原有 Code Embed，再 Publish。保留既有 navbar、menu overlay 與 footer；全站 Head／Footer、其他頁面及 Workers 不需因此更換。GitHub 更新不會自動發布 Webflow。

新版圖例與樣式已內嵌於 HTML，無需另外上傳圖片或新增載入器；原有共用深淺主題程式仍沿用既有固定版本。HTML 約48,100字元，低於 Webflow 50,000字元限制。

## 本次內容

- 製造章節：使用站方更新的 Instinct VSR 外型 SVG，保留42個原始路徑及其 transform 與中文標記位置。整合時僅補上英文標記、可讀文字與深淺主題配色，並將 Illustrator 的通用 class 名稱加上專用前綴以免影響其他元件。圖上不放 VSR 字樣，結構與分層為製程示意，非原廠工程圖。
- 製作流程維持鞋楦與材料準備、鞋面裁切與縫合、套楦成形、包邊與外底黏合、修整與檢查，不新增裝飾編碼。電腦左右對照，手機上下排列。
- 材料卡片：XS Grip 2 新增 Instinct VSR、Drago、Solution Comp；XS Edge 新增 Instinct VS 男款前掌、TC Pro、Katana 男款。標示外底或前掌部位，並說明 Instinct VS 男款的腳跟採用 XS Grip 2。
- Vibram XS Grip 2／XS Edge 官方連結放在各自材料描述下一行，鞋款例子排列其後。
- 送修推薦加入 Roofguy Works 與 `https://lin.ee/9z18c2UT`，只顯示名稱與 LINE 入口，不附額外服務說明。

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
