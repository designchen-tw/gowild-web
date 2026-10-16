# 岩壁攝影 `/photography`

用 `photography.html` 完整替換現有岩壁攝影 Code Embed；不要保留重複的舊 Embed、舊的內嵌 style 或 script。保留頁面原本的 Webflow navbar、選單與 footer，貼上後 Publish。

內容沿用 `/Users/Guan-Wei/Desktop/Web/portfolio/webflow-photography-embed.html` 的 Levi（`longdong_climber`）、永春岩選（`yongchunhero`）及介紹；新增頂端單一中文／EN切換。`photography-v2.css` 提供Avenir字體、灰底白色hover按鈕、浮動導覽與可讀字級，`page-sections-v1.css` 提供一致的間距、分線、交替淺底與最後區塊無底部留白。

桌機與手機的Instagram均為固定預覽，iframe不接收滑鼠滾輪、觸控或鍵盤輸入；預覽上方的帳號連結讓滑動交由整頁處理，點擊則開啟原Instagram帳號。也可使用上方「前往Instagram」按鈕。320px等窄手機會等比縮放預覽，避免Instagram版面最小寬度造成橫向溢出。外部Instagram內容仍由Instagram提供，登入、隱私或第三方阻擋可能影響其可用性。兩位攝影者介紹與開頭段落使用一般內文：桌機16px、手機≤600px為14px、字重400、行高1.72。已移除原本底部Instagram／版權說明段落的中英文內容。

本機預覽以 `webflow-embeds/photography.html` 為準，並保留相鄰CSS與上層 `photography-page-v2.js`；正式頁使用jsDelivr的版本化資產。
