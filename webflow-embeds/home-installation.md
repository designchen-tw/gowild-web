# 首頁 Embed 安裝

> 2026-10-22 原生表單統一版：首頁、多繩距與繩索操作／救援共用 `webflow-native-form-v1.css`。三頁都保留 Webflow 表單原本的 section、父層、class、欄位與按鈕尺寸、字級和圓角；取消首頁額外的送出按鈕版型。僅共用配色、綠色聚焦框與既有中英文切換。請完整重貼這三頁的主內容 Embed 後 Publish，保留原生表單；選單與首頁 Page Code 不需更換。

`home.html` 是可整份貼回 Webflow 的首頁內容 Embed。內容、卡片及表單程式保留在同一檔案；主section的底色、分隔線與間距由共用CDN樣式 `page-sections-v1.css` 提供，貼回前需確認此樣式已更新至GitHub。

## 貼回的位置

1. 保留首頁現有的 Navbar、fixed 投影片（`.go-wild-slide.main-page`）、200vh 動畫區（`.selection-from-animation`）、其中的 sticky 文字（`.gw-landing-wording`）、Webflow 聯絡 Form Block 與 Footer。
2. 只替換 landing 動畫區後方的一般內容 Embed；不要移除或包住 landing 的動畫 section。已使用新版首頁時，直接更新目前的 `.html-code.test` Code Embed。
3. Code Embed 必須接在完整 landing 動畫 section 的後面，與它同層，貼上 `home.html` 的全部內容。程式會為這個 Embed 設定獨立疊層及自動高度，使內容蓋住固定投影片；不更動 landing 的尺寸、定位或動畫。這個 Embed 不要放在 sticky 容器或 Form Block 裡。
4. **保留原本名為 `Course Inquires` 的原生 Webflow Form Block**，維持它在頁面上、位於首頁 Embed 外。不要刪除、複製或更改欄位名稱。原生表單 section 保留在首頁 Embed 後方、footer 前方，程式不再搬移 Form Block，也不隱藏原生 section；舊 CONTACT 標題隱藏，沿用 Embed 的聯絡標題。
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


## 2026-10-22 首頁＋Overlay Menu 主題版

- 主頁與選單重新對照當日線上發布內容（2026-10-22 02:19:46 UTC）。原文、雙語資料、字體、字級、字重、行高、字距、版面 CSS、頁面 JS、landing 動畫及原生表單程式保留；新增樣式只調整配色。
- 重貼 `home.html` 與 `menu-overlay-full.html` 後 Publish。兩份 Embed 已內嵌主題 CSS／JS；首頁原生表單配色另載入版本固定的 `webflow-native-form-v1.css`。保留 navbar、原生 Form Block、footer、hamburger 的 Webflow 互動及 overlay 的 Finsweet 設定。
- 選單新增月亮／太陽圖示切換（36×30px），預設深色，選擇儲存在 `gw-color-theme-v1`。本次啟用首頁及 overlay；其他內容頁保留原配色。一般首頁圖卡透明底，保留框線；照片及照片上的字標沿用原樣。
- Overlay 與首頁 navbar 使用新版 Logo：深色底為 `6ad9712b794a5603e6bb48f9_logo_GW-white.avif`，淺色底為 `6ad9712cb9c80fb6fc1287b1_logo_GW-black.avif`。僅換來源，尺寸和文字設定不變。首頁 navbar、hamburger 線條、footer 及原生表單顏色配合主題。
- 已檢查保留原 CSS／JS、僅新增配色覆寫、主題儲存與失敗回復、Logo、語言及表單輸入值保留、選單展開狀態、重複初始化。未由代理 Publish Webflow、未送出正式表單測試。


### 2026-10-22 灰階與選單密度調整

- 已核對線上 menu 的初始 src 與主題程式，深色皆使用新版 `6ad9712b794a5603e6bb48f9_logo_GW-white.avif`。
- 淺色首頁未選取文字改為中性灰階；選取底色與文字可保留綠色。淺色 menu 的未選文字統一 `#666666`，黑色品牌 Logo 以 `brightness(0) invert(.4)`、opacity 1 呈現相同灰度；目前頁面、展開分類及已選主題可以使用綠色。首頁 navbar Logo 配合原品牌文字灰度。
- 兩條分隔線之間的分類區域縮短：桌機群組上下內距 8px、手機 6px，保留原字級及按鈕高度。Instagram 圖示由 39px／32px 改為 22px／20px，降低預設透明度。
- 首頁和 menu 各自內嵌對應的淺色規則，兩份都需更新後 Publish；不需額外 CDN 檔案。


### 2026-10-22 選單 Hover 與展開符號

- 此次只需重貼 `menu-overlay-full.html` 並 Publish；首頁 Embed 內容未變。
- 深色品牌文字與 Logo 同為 `#adadad`，淺色同為 `#666666`；Logo 使用實心灰度，沒有透明度淡化。
- Hover／鍵盤 focus 時，文字與圖片採完全不透明的顏色：深色為白、淺色為黑；選取狀態在未 hover 時保留既有設定。Instagram 保留較小尺寸，以灰度而非透明度降低平時存在感。
- 三個分類展開符號改用 SVG，桌機 10px、手機 8px；與文字水平置中，展開時僅原地旋轉，移除舊的垂直位移。



### 2026-10-22 Safari 首屏與選單測試版

- 首頁 Page Settings → Inside `<head>` 使用 `home-safari-native-scroll-page-code.html`，完整替換之前的首屏測試程式。Designer 首屏維持 Sticky、Top 0、高度 100svh，外層維持原本 200vh；不要併用先前的 12px／calc 高度或 JavaScript 捲動位移版本。
- 支援原生 scroll timeline 的瀏覽器，在寬度 767px 以下，或觸控裝置橫向且高度不超過 600px 時，使用 CSS 位移模擬首屏停留。直向保留 Webflow 的原有透明度動畫；手機橫向文字及遮罩改以首屏捲動區間完成淡入。不支援功能的瀏覽器保留 Designer sticky。
- 重新貼上完整 `menu-overlay-full.html`：選單外框使用 100dvh，內文保留原本安全區與捲動設定。選單開啟時同步 html／body 背景至選單實際顏色，切換主題時更新，關閉後移除覆寫；原 Webflow 開關動畫及 Finsweet 鎖定保留。
- 已檢查語法、首屏進退場範圍、橫向的時間軸變數、選單開關與主題同步、關閉還原、原表單節點與資料保留、Embed 長度。代理尚未 Publish；Safari 工具列顏色與橫向實際效果仍需發布後以 iPhone 驗證。



### 2026-10-22 選單主題切換效能調整

- 選單開啟時，以 visibility 暫時隱藏被全畫面選單蓋住的首頁首屏、內容及浮動導覽，保留高度、原表單節點與資料，避免背後照片標籤及模糊效果持續繪製；選單關閉時在繪製前還原。首頁 Page Code 不變。
- 主題控制只更新有差異的屬性；選取相同主題不再重新同步。立即同步會取消尚未執行的排程，選單顏色與可見性一次讀取後才寫入，保留已確認有效的上下取色圖層。
- 實際程式的 DOM 模擬測試通過：100 次交替切換始終只有兩個取色節點，關閉後移除；重複同步／選取相同主題的根節點屬性寫入從 200 次減為 0 次。此數字是程式測試結果，不代表 iPhone 幀率量測。
- 首頁主題控制與選單 Embed 原始檔同步更新。現有網站先載入選單的主題控制，因此此次只需重新貼上完整 menu-overlay-full.html 並 Publish；首頁 Page Code 不需更換。尚未由代理發布 Webflow，實際流暢度仍需 iPhone 對照。


### 2026-10-22 淺色首頁底部導覽陰影

- 本次完整替換 `home.html` 並 Publish；沿用上一版已修正 Instagram 觸控 hover 的 `menu-overlay-full.html`，選單與首頁 Page Code 不需重貼。
- 僅淺色首頁導覽取消外擴陰影，改為內側細亮線與較不透明的灰白底；模糊調整為16px並取消增色，補上相同的 WebKit 屬性。避免大範圍深色陰影在 Safari 底部瀏覽器介面附近出現明顯截斷；未更動導覽位置、尺寸、安全區、選取色或深色主題。
- 已核對原內容與所有腳本完全一致，只有一條限定淺色首頁的外觀覆寫；選單檔案與上一版相同，完整首頁 Embed 48,956 字元。需 Publish 後以 iPhone 確認實際捲動顯示，未宣稱已完成實機驗證。


### 2026-10-22 導覽毛玻璃與雙主題陰影

- 首頁深色與淺色導覽均取消外擴陰影，改用內側亮線；保留真正的 backdrop-filter 毛玻璃（16px、相同 WebKit 屬性）與半透明底色。淺色底透明度調為80%，深色沿用原本透明度。
- 同步「岩石之外」的深淺色導覽。位置、尺寸、安全區、字級、選取色及原有內容／腳本不變。
- 完整替換 `home.html`、`outside-of-rock.html` 並 Publish；menu overlay 與首頁 Page Code 不需更換。首頁49,064字元、岩石之外48,955字元。已核對不同 Embed 載入順序不會恢復外擴陰影；仍需發布後以 iPhone 確認實際顯示。


2026-10-22 導覽透明度調整：首頁與岩石之外導覽同步採深色55%、淺色60%的底色不透明度，保留16px毛玻璃、內側亮線及既有文字／選取色。完整替換兩頁 Embed 並 Publish，menu overlay及Page Code不需更換；首頁49,094字元。

2026-10-22 小幅降低導覽底色不透明度：深色50%、淺色55%，首頁與岩石之外同步；其餘毛玻璃與文字設定不變。
