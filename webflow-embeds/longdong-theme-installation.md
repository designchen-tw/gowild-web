# 龍洞深淺色主題上線 · 2026-10-22

1. 在 Webflow `/longdong` 的主內容 Code Embed，完整替換為 `webflow-embeds/longdong.html` 後 Publish。
2. 沿用目前全站 menu overlay 的月亮／太陽切換；首頁、menu overlay、首頁 Page Code 與 Cloudflare Worker 不需更換。
3. 本機可直接開啟 `webflow-embeds/longdong.html`；完整模擬導覽／選單／footer 的版本在 `/Users/Guan-Wei/Desktop/Web/portfolio/longdong-theme-preview/index.html`，重新整理目前的預覽分頁即可。模擬殼層不包含在上線 Embed。

## 配色與狀態

- 沿用首頁 `gw-color-theme-v1` 偏好，預設深色，資料儲存被阻擋時仍可透過全站選單即時切換。
- 淺色為 #f6f7f3／#edf0eb 交替底色，主文 #262626、一般內文 #4d4d4d、輔助文字 #666；未選取文字採灰階，資料狀態與選取可用對應資料色。
- 即時影像、Windy、道路影像、預報與一般現況卡採透明底框線，不對照片、影片或外部 iframe 使用濾鏡。
- 潮汐卡獨立保留淡藍底：深色 rgba(125,176,201,.08)，淺色 rgba(40,97,124,.07)。
- 淺色展開岩區底色為 `#F6F7F3`，以頂部3px綠線與文字標示選取；深淺色展開字卡在hover／focus-within時皆保留原底色與單一綠線，不再加上灰色內陰影；手機細分區／路線標籤與預報選取仍使用較明顯的淡綠底。
- 地圖背景、地形、道路、步道、文字、編碼與救援符號各有對應色；未選取岩區保持線稿，選取的淺色填色透明度 .16。
- 底部導覽尺寸與間距以首頁為準，深色底50%、淺色55%，保留16px毛玻璃與內側亮線，沒有外擴陰影。原生 navbar、品牌圖、hamburger與footer同時切換，最後區塊底部仍為0。

## 地圖選取

`longdong-sector-map-v23.js` 讓九個岩區的實際 path／polygon 內部與邊線都可點選，編碼與岩區文字原有操作保留。沿用既有地圖縮放控制的捕捉階段防誤觸，拖曳或雙指縮放後不會誤選。選取後編碼、名稱、區域填色、字卡排序與推薦路線同步；圖形、座標、初始視野、地圖視窗尺寸及最小倍率規則不變。

## 天氣圖示修正

`longdong-cwa-widget-v17.js` 修正陰天雲朵路徑，讓雲朵與描邊完整保留在32×32圖示邊界內；目前天氣、三小時預報、五日預報與逐時明細共用修正，資料邏輯與其他天氣圖示維持原樣。

## 版本與驗證

- 新增 `longdong-theme-v1.js`、`webflow-embeds/longdong-theme-v3.css`、`longdong-sector-map-v23.js`，只在龍洞 Embed 引用。其他三個岩場頁維持原有檔案。
- 所有本頁 CSS／JS 載入器使用固定 Git commit，並保留 file／localhost 的本機引用方式。互動資料與原有 worker API／更新頻率不變。
- 程式檢查包含九區圖形／編碼／字卡選取、75條路線順序與難度排序、中英文與救援資訊、實際縮放程式的點選／拖曳／雙指防誤選與最小倍率、30次主題切換的路線／縮放保留、晚載入widget與SVG樣式的深淺色優先級、原HTML main完整一致、CSS／JS語法與Webflow字數限制。
- 未進行瀏覽器實際渲染或iPhone實機驗證；發布後確認地圖區域點選、淺色即時影像、潮汐卡、頁尾與Safari工具列顯示。

固定資源 commit：`ddf4ab95071afee873ea43301eaf1148d309f410`。完整 Embed：47790 字元。

## 淺色連結按鈕底色

在主底色 `#F6F7F3` 的區塊，連結按鈕使用 `#EDF0EB`；在交替底色 `#EDF0EB` 的區塊，按鈕使用 `#F6F7F3`。文字為 `#262626`，保留細框線；hover為深灰底白字。僅調整帶有各頁 `*-detail__button` 樣式的超連結，不影響語言切換、導航、地圖控制與預報選項。深色主題維持原樣。
