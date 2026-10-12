# 首頁 Embed 安裝

`home.html` 是可整份貼回 Webflow 的首頁內容 Embed。HTML、CSS 與程式都在同一檔案，不需要先推送新的 CDN 檔案。

## 貼回的位置

1. 保留首頁現有的 Navbar、照片／水面 Hero、Webflow 聯絡 Form Block 與 Footer。
2. 移除原本同時列出兩種語言的介紹文字區塊，以及舊的 DISCOVER／LEARN／EXPLORE 內容 Embed。
3. 在 Hero 下方放置一個 Code Embed，貼上 `home.html` 的全部內容。這個 Embed 不要放在 Form Block 裡。
4. **保留原本名為 `Course Inquires` 的原生 Webflow Form Block**，維持它在頁面上、位於首頁 Embed 外。不要刪除、複製或更改欄位名稱。程式會把這個原有 Form Block 移到新版 CONTACT 裡，並隱藏原本空出的聯絡 section。
5. 全站 overlay 選單另貼回更新後的 `menu-overlay-full.html`；DISCOVER 連結已改為北到南，EXPLORE 已移除人物誌。
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
- 四個指定照片 URL 均已套用並確認載入。EXPLORE 移除人物誌，剩下岩壁攝影與攀岩鞋修補。
- 中英文卡片主副標題隨語言交換，副標題固定另起一行。按鈕灰底、hover／鍵盤 focus 時白底。
- 五個頁面導覽均指向相應 section，採同樣的捲動頂端留白；CONTACT 不再跳到整個頁面底端。
- 本機驗證涵蓋手機、平板與桌機的中英文排版、欄位內容保留、原始表單與欄位節點保留。測試提交由本機預覽攔截，未送出任何真實訊息。
- **尚未發布到 Webflow，也尚未驗證後台實際收件。** Publish 後請以一筆測試訊息確認兩種語言的送出結果，以及 Site settings → Forms 的收件與通知。
