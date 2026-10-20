# 首頁 Embed 安裝

`home.html` 是可整份貼回 Webflow 的首頁內容 Embed。內容、卡片及表單程式保留在同一檔案；主section的底色、分隔線與間距由共用CDN樣式 `page-sections-v1.css` 提供，貼回前需確認此樣式已更新至GitHub。

## 貼回的位置

1. 保留首頁現有的 Navbar、fixed 投影片（`.go-wild-slide.main-page`）、200vh 動畫區（`.selection-from-animation`）、其中的 sticky 文字（`.gw-landing-wording`）、Webflow 聯絡 Form Block 與 Footer。
2. 只替換 landing 動畫區後方的一般內容 Embed；不要移除或包住 landing 的動畫 section。已使用新版首頁時，直接更新目前的 `.html-code.test` Code Embed。
3. Code Embed 必須接在完整 landing 動畫 section 的後面，與它同層，貼上 `home.html` 的全部內容。程式會為這個 Embed 設定獨立疊層及自動高度，使內容蓋住固定投影片；不更動 landing 的尺寸、定位或動畫。這個 Embed 不要放在 sticky 容器或 Form Block 裡。
4. **保留原本名為 `Course Inquires` 的原生 Webflow Form Block**，維持它在頁面上、位於首頁 Embed 外。不要刪除、複製或更改欄位名稱。程式會把這個原有 Form Block 移到新版 CONTACT 裡，並隱藏原本空出的聯絡 section。
5. 全站 overlay 選單另貼回更新後的 `menu-overlay-full.html`；DISCOVER 連結已改為北到南，EXPLORE 不再提供尚未完成的人物誌連結；選單品牌文字上方使用指定的 `logo_GW-03.avif` Logo。
6. Publish 首頁。實際執行 JavaScript 的發布頁面才會整合表單；Designer 畫布可能仍顯示原生表單原本的位置。

## 聯絡表單

- 這版沿用原生表單 DOM 節點，不建立第二張表單，也不自訂收件端點或接管提交事件。
- 原生表單 ID：`wf-form-Course-Inquires`；名稱：`Course Inquires`。
- 原有欄位名稱保持 `Nick-alt-Name`、`Email`、`Inquiring-About`、`field`；required、長度上限、Webflow page／element 識別、Turnstile 及原本的後台通知設定保留。
- 語言切換更新標籤、placeholder、送出／等待文字、成功與失敗訊息，不重建欄位或改動填寫值。
- 單獨開啟 `home.html` 沒有原生 Form Block 時，CONTACT 顯示電子郵件連結。要在正式站呈現完整表單，務必保留上方第 4 步的 Form Block。
- Webflow 的 Form Settings 中，收件仍應使用既有的 Webflow／Email notifications 設定，不要新增 Custom action；Custom action 會繞過原生 Webflow 收件。[Webflow 官方表單說明](https://help.webflow.com/hc/en-us/articles/33961347548563-How-do-I-add-forms-in-Webflow)

## 完成與驗證範圍

- 只在上方介紹區保留一組中文、EN 按鈕，切換整頁文字及表單內容；聯絡區不再顯示語言按鈕，完整納入指定雙語介紹。
- DISCOVER 保留四張卡片，順序為龍洞 → 德芙蘭 → 關子嶺 → 墾丁；關子嶺可點擊連至 `/guanziling`，全站選單 DISCOVER 也包含相同入口。
- DISCOVER與岩壁攝影照片保留；LEARN五張卡片改用2026-10-16指定的照片（運動攀登、Gym to Crag、傳統攀登、多繩距攀登、繩索操作與救援技術；救援使用最後更正的rescue.avif網址），照片以原始彩色呈現；其餘插畫卡片維持灰階。EXPLORE 為人物誌、岩壁攝影、攀岩鞋修補三張卡片；人物誌保留為無連結、不可點擊的 article。
- 中英文卡片主副標題隨語言交換，副標題固定另起一行。按鈕灰底、hover／鍵盤 focus 時白底。
-「主頁」返回原本 landing 頂端；其他四個導覽指向各自 section，採一致的頂端留白，避免 Webflow 預設捲動重複接管。底部導覽進入下方內容後才顯示，landing 不顯示這組按鈕。
- 表單沿用 Webflow 原始單欄排版、灰底和 20px 圓角；一般欄位高 40px，訊息欄高 120px，不使用另一套欄位樣式覆蓋。
- 本機改以完整首頁結構、Webflow CSS 與互動程式驗證，包含 fixed 投影片、sticky landing、下方內容疊層、無連結人物誌、原生表單及選單 Logo。預覽會阻止所有表單提交，未送出任何真實訊息。
- **尚未發布到 Webflow，也尚未驗證後台實際收件。** Publish 後請以一筆測試訊息確認兩種語言的送出結果，以及 Site settings → Forms 的收件與通知。

- 主section已與四個岩場頁統一：黑／淺灰黑交替、區塊之間單一細線、桌機及手機各採一致上下間距。首頁介紹內文、DISCOVER／LEARN／EXPLORE卡片及CONTACT表單的內容邊界均與目前Webflow footer對齊：桌機15vw、≤991px為7vw、≤767px為5vw，移除原1264px、介紹830px及表單760px的額外寬度上限。置中的章節標題與簡介保留適當閱讀寬度；landing動畫結構及表單程式原樣保留。

- 首頁照片裁切：傳統攀登放大至1.18倍，焦點設於水平50%／垂直25%，將原本偏上的攀爬者向縮圖中央移動；多繩距以左下角為焦點放大至1.22倍。僅對img套用transform，保留卡片尺寸、文字標籤與原照片網址；父層overflow裁切，手機與桌機共用焦點。

- DISCOVER四張岩場圖卡在桌機改為每列兩張，依既有北到南順序呈現兩列；LEARN與EXPLORE排列保留。

- 2026-10-19：EXPLORE 的攀岩鞋修補卡片啟用 `/resole`；menu overlay 的 EXPLORE 新增相同入口，並支援 `/resole` 目前頁面標示。首頁關子嶺卡片替換為編輯者指定的 IMG_5719.avif，沿用彩色照片樣式。需重貼首頁與 menu overlay Embed，再於 Webflow Publish。攝影頁新圖集僅在本地預覽，未納入本次發布。

- 2026-10-19 手機圖卡標籤：≤767px 英文使用短版、桌機保留完整描述，中文維持原文。切換語言與跨螢幕斷點會自動更新。中英文標籤左右內距一致：桌機12px、手機10px，手機維持單行與原字級，極窄時以省略符避免外溢。完整首頁 Embed 已內嵌共用區塊 CSS，無須額外載入器；保留原有 landing、navbar、原生表單及 footer。需重貼首頁 HTML 再 Publish。

- 2026-10-19 EXPLORE 改為「岩壁攝影 Climbing Photography」與「攀岩鞋修補 Climbing Shoe Resole」三欄版面的前兩張卡片，依此順序排列；第三欄留空，不新增空白卡片，暫時移除人物誌。全首頁11張卡片的中英文主副標題與 overlay menu 名稱核對統一；龍洞使用 Long Dong，德芙蘭使用 Defulan，繩索操作與救援技術使用 Rope & Rescue Skills。照片、手機短標籤、內距與原生表單程式保留。需重貼首頁及 menu overlay Embed 再 Publish。

- 2026-10-20：EXPLORE 第三張加入「岩石之外 Outside of Rock」，連結 `/outside-of-rock`，採指定 IMG_1367.avif 彩色縮圖；桌機維持三欄，手機沿用兩欄。同步 menu overlay 的 EXPLORE 入口與目前頁面判定。請重貼首頁與 menu overlay，再 Publish。

- 2026-10-20：EXPLORE「攀岩鞋修補」卡片改用指定 IMG_0951.avif 照片，沿用彩色照片樣式與既有裁切比例；卡片文字、連結、順序及手機排列保留。僅需更新首頁 Embed 並 Publish。
