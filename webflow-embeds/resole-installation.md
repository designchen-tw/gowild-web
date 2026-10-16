# /resole · 攀岩鞋製造與修補

在 Webflow 建立或使用 slug 為 `resole` 的頁面，將 `webflow-embeds/resole.html` 完整內容貼入 HTML Embed，保留網站原有 navbar、menu overlay 與 footer，再 Publish。GitHub 更新不會自動發布 Webflow。

Embed 包含完整樣式、SVG 與程式，不需另貼 CSS/JS 載入器。預覽用的頁首與模擬 copyright footer 不包含在正式 Embed 中。Webflow 現有表單不受本頁影響。

## 版面與頁尾

- 水平留白：桌機 15vw、≤991px 7vw、≤767px 5vw。內文、材料卡、示意圖、來源與送修內容均使用同一組邊界，取消額外 760px 上限。
- 章節上／下間距：桌機 clamp(72px,7vw,104px)，手機 56px。章節使用同一條淺分隔線與黑／深灰黑交替底色。
- 最後送修章節下留白為 0；這一頁的既有 `.block-for-copyright.gw` footer 背景設為黑色，與最後章節相同。footer 原有內容、字級與 padding 保留。
- 五項導覽為介紹、製造、材料、修補、送修，推薦資訊整合於送修；全部指向 section 外框，scroll-margin-top 一致 24px。
- 製造示意分成鞋楦、鞋面、包邊、外底四張概念圖，桌機兩欄、手機單欄。鞋楦明確說明為完成後取出的工具，圖非品牌工程圖。
- 材料來源直接放在各自介紹下方。完整來源清單以送修末尾的「資料來源」折疊呈現，不另佔整個章節。

## 後續內容

推薦修補工作室目前保留資訊整理中的文字，尚無業者名稱、評價或聯絡連結。提供資料後再更新此區。首頁與 menu 的入口此次未更動。

頁面引用 Vibram、La Sportiva、SCARPA、TENAYA、UNPARALLEL 公開資料；Vibram 修補型錄標註為 2020 年，實際材料供應需向修補者確認。
