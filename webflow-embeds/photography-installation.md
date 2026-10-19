# 岩壁攝影 /photography · v3.0.0

將 `webflow-embeds/photography.html` 完整取代 Webflow `/photography` 的舊 Embed，再 Publish。保留 Webflow 原有 navbar、menu overlay 與 footer。GitHub 推送不會自動發布 Webflow。

此版本將 CSS、SVG icon、語言切換與圖集程式包含在同一個 Embed，不再載入 photography-v2.css、page-sections-v1.css 或 photography-page-v2.js。若先前另外貼了舊版攝影頁載入器，請移除該額外載入器，避免舊程式重複綁定。

- Levi 使用指定六張精選照片；桌機三欄兩列，≤991px 兩欄三列。方形縮圖置中裁切，大圖保持原圖比例。縮圖間距桌機12px、≤767px 8px。
- 點照片開啟原生對話框，可使用上／下一張、左右方向鍵、Escape 或關閉按鈕；關閉後返回原照片按鈕。開啟時鎖定背景捲動，關閉恢復。
- 攝影師名稱、副標、介紹、精選標題與提示文字置中。兩位攝影師的 Instagram 按鈕皆放在各自作品展示完畢後方並置中。
- 查看大圖提示為12px細節文字；介紹為桌機14px、手機12px。章節標題22px／17px，名稱與主文維持現有層級。
- 永春岩選維持固定 Instagram 預覽，iframe 不接受滑動手勢，滑動時由頁面處理。
- 中文／EN 切換涵蓋介紹、按鈕、提示、圖像替代文字與大圖無障礙名稱；品牌及帳號保留原名。
- 水平留白沿用首頁及課程頁：15vw／≤991px 7vw／≤767px 5vw。最後一個章節下方無額外留白，銜接原有黑色 footer。

本地預覽建置工具保存於工作區 photography-preview。正式 Embed 不含該預覽頁首或模擬 footer。
