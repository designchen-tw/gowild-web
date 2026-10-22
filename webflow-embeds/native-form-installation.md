# 原生 Webflow 表單統一 · 2026-10-22

完整替換首頁 `home.html`、多繩距 `multi-pitch.html`、繩索操作／救援 `rock-rescue-skill.html` 的主內容 Code Embed，再於 Webflow Publish。保留原生 Form Block 及完整父層 section，位於內容 Embed 之後、footer 之前。不要複製表單、改欄位名稱、加入新的收件端點或刪除原生 Webflow scripts／Turnstile。首頁 Page Code、menu overlay、footer 元件本次不需更換。

- 首頁不再搬移原生表單，也取消送出按鈕另外設定的寬高、字級、圓角、內外距。三頁欄位、選單、訊息框、送出按鈕的排版、尺寸與兩側圓角由原生 Webflow CSS 決定。
- 共用 `webflow-native-form-v1.css` 只設定表單內的顏色。深色保留原生半透明底；淺色在 `#F6F7F3` 區塊使用 `#EDF0EB` 欄位／按鈕，在 `#EDF0EB` 區塊使用 `#F6F7F3`。文字用中性灰階。
- 欄位聚焦時維持原框線粗細與圓角，深色框 `#A9D9B6`、淺色框 `#296744`。僅滑鼠裝置顯示送出按鈕 hover，鍵盤 focus 保留對應回饋。
- 首頁中英文標籤（含原本 for 與名字欄位 id 不同的標籤）與 placeholder、送出／等待／成功／失敗訊息維持切換。課程原有技能選項翻譯保留。原生表單節點、父層、id、name、data-name、required、option value、輸入內容、勾選狀態、Webflow page／element 識別及 Turnstile 保留；提交仍由 Webflow 處理。
- 原生表單 section 外層繼續對齊 footer：15vw／7vw／5vw，無額外底部空白。首頁舊 CONTACT 小標題隱藏，使用 Embed 的聯絡標題；聯絡導覽在原生表單範圍內保留。

已用原生 Webflow 樣式核對三個寬度、兩種主題、一般／聚焦欄位，確認沒有覆蓋欄位與按鈕尺寸、字級或圓角；亦執行中英文、重複主題切換與資料保留測試。未提交真實表單，未寄信；GitHub 更新不等於 Webflow Publish，後台實際收件可於發布後另行驗證。
