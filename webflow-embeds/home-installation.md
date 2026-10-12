# 首頁 Embed 安裝

`home.html` 是可整份貼回 Webflow 的首頁內容 Embed。HTML、CSS 與程式都在同一檔案，不需要先推送新的 CDN 檔案。

## 貼回的位置

1. 保留首頁現有的 Navbar、fixed 投影片（`.go-wild-slide.main-page`）、200vh 動畫區（`.selection-from-animation`）、其中的 sticky 文字（`.gw-landing-wording`）、Webflow 聯絡 Form Block 與 Footer。
2. 只替換 landing 動畫區後方的一般內容 Embed；不要移除或包住 landing 的動畫 section。已使用新版首頁時，直接更新目前的 `.html-code.test` Code Embed。
3. Code Embed 必須接在完整 landing 動畫 section 的後面，與它同層，貼上 `home.html` 的全部內容。程式會為這個 Embed 設定獨立疊層及自動高度，使內容蓋住固定投影片；不更動 landing 的尺寸、定位或動畫。這個 Embed 不要放在 sticky 容器或 Form Block 裡。
4. **保留原本名為 `Course Inquires` 的原生 Webflow Form Block**，維持它在頁面上、位於首頁 Embed 外。不要刪除、複製或更改欄位名稱。程式會把這個原有 Form Block 移到新版 CONTACT 裡，並隱藏原本空出的聯絡 section。
5. 全站 overlay 選單另貼回更新後的 `menu-overlay-full.html`；DISCOVER 連結已改為北到南，EXPLORE 不再提供尚未完成的人物誌連結；選單品牌文字上方新增首頁既有 Logo。
6. Publish 首頁。實際執行 JavaScript 的發布頁面才會整合表單；Designer 畫布可能仍顯示原生表單原本的位置。

## 聯絡表單

- 這版沿用原生表單 DOM 節點，不建立第二張表單，也不自訂收件端點或接管提交事件。
- 原生表單 ID：`wf-form-Course-Inquires`；名稱：`Course Inquires`。
- 原有欄位名稱保持 `Nick-alt-Name`、`Email`、`Inquiring-About`、`field`；required、長度上限、Webflow page／element 識別、Turnstile 及原本的後台通知設定保留。
- 語言切換更新標籤、placeholder、送出／等待文字、成功與失敗訊息，不重建欄位或改動填寫值。
- 單獨開啟 `home.html` 沒有原生 Form Block 時，CONTACT 顯示電子郵件連結。要在正式站呈現完整表單，務必保留上方第 4 步的 Form Block。
- Webflow 的 Form Settings 中，收件仍應使用既有的 Webflow／Email notifications 設定，不要新增 Custom action；Custom action 會繞過原生 Webflow 收件。[Webflow 官方表單說明](https://help.webflow.com/hc/en-us/articles/33961347548563-How-do-I-add-forms-in-Webflow)

## 完成與驗證範圍

- 新增首頁／聯絡兩處同步的中文、EN 按鈕，完整納入指定雙語介紹。
- DISCOVER 保留四張卡片，順序為龍洞 → 德芙蘭 → 關子嶺 → 墾丁；關子嶺維持無連結。
- 四個指定照片 URL 均已套用。EXPLORE 為人物誌、岩壁攝影、攀岩鞋修補三張卡片；人物誌保留為無連結、不可點擊的 article。
- 中英文卡片主副標題隨語言交換，副標題固定另起一行。按鈕灰底、hover／鍵盤 focus 時白底。
-「主頁」返回原本 landing 頂端；其他四個導覽指向各自 section，採一致的頂端留白，避免 Webflow 預設捲動重複接管。底部導覽進入下方內容後才顯示，landing 不顯示這組按鈕。
- 表單沿用 Webflow 原始單欄排版、灰底和 20px 圓角；一般欄位高 40px，訊息欄高 120px，不使用另一套欄位樣式覆蓋。
- 本機改以完整首頁結構、Webflow CSS 與互動程式驗證，包含 fixed 投影片、sticky landing、下方內容疊層、無連結人物誌、原生表單及選單 Logo。預覽會阻止所有表單提交，未送出任何真實訊息。
- **尚未發布到 Webflow，也尚未驗證後台實際收件。** Publish 後請以一筆測試訊息確認兩種語言的送出結果，以及 Site settings → Forms 的收件與通知。
