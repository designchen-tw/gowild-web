# 德芙蘭、關子嶺、墾丁深淺色主題 · 2026-10-22

在 Webflow 三個頁面的主要 Code Embed，分別完整替換成：

- `/defulan`：`webflow-embeds/defulan.html`
- `/guanziling`：`webflow-embeds/guanziling.html`
- `/kenting`：`webflow-embeds/kenting.html`

完成後 Publish。沿用目前全站 overlay menu 的月亮／太陽切換；首頁、龍洞、menu overlay、Page Code 與 Cloudflare Worker 不需重貼或更換。GitHub 更新本身不會發布 Webflow。

## 一致的主題

- 共用 `gw-color-theme-v1` 儲存偏好，透過選單切換後，其他頁面載入會沿用同一主題。主題切換只更新配色與品牌圖，不會重建地圖、路線或重新請求天氣。
- 淺色主底 `#F6F7F3`、交替區塊 `#EDF0EB`；主要文字 `#262626`、內文 `#4D4D4D`、輔助文字 `#666666`。資料與選取色沿用龍洞五色：綠 `#296744`、藍 `#28617C`、黃褐 `#796017`、橘褐 `#954B2D`、紅 `#A33B3B`。
- 展開岩區字卡：淺色使用 `#F6F7F3`，深色保留淡綠透明底。兩種主題上方均為3px綠線；hover／focus-within不改變展開卡背景，不增加灰色內陰影。未選取字卡保留原有hover提示。
- 現場影像、Windy、天氣外框與一般攀登現況卡均為透明框線，照片與外部iframe不使用濾鏡。
- 底部導覽沿用目前首頁／龍洞尺寸、間距與毛玻璃：深色50%、淺色55%底色，16px模糊、僅內側亮線。原生Webflow頂部導航、品牌圖與footer同步主題。最後區塊下方不新增空白。

## 地圖與路線

- 新版地圖腳本讓岩區輪廓內部可點選，保留編碼與文字選取、既有座標、圖形、北向、初始視野、最小縮放與固定視窗規則。
- 德芙蘭三個邊境細分區共用同一輪廓：若目前選的是其中一區，點輪廓會保留該選取；否則選第一個邊境岩區，避免重複事件導致跳到最後一張卡。三張卡的編碼仍可各自選取。
- 地圖視窗、SVG與原稿背景同步配色，避免縮小後露出不同底色。選取岩區的淺色填色透明度為16%。
- 點選字卡後置於第一張並展開推薦路線，其餘卡依原順序排列；路線依難度排序。三頁保留只有推薦路線、沒有細分區的設計，空清單與捲動箭頭維持既有縮排。
- 保留所有原有中英文內容、路線、連結、氣象端點與更新頻率。墾丁的102條路線、德芙蘭10條、關子嶺14條均未新增或刪改。

## 淺色地圖地形層次修正

- 水面 `#FAFBF8` 最淺；海岸 `#EDF0E8`、一般陸地 `#E0E5DC`、樹林 `#CCD2C8`、較深區域 `#BAC4B5` 依序加深。道路、步道與建物各有對應灰綠階，文字仍維持原本灰階。
- 德芙蘭大甲溪及墾丁海面依原圖實際水域形狀著色；關子嶺沒有水域圖形，不額外繪製水面，以林地與岩區面區分層次。地圖視窗與SVG原稿底圖使用相同陸地／林地色，避免縮小後透底或出現接縫。
- 三頁外框統一為1px細線、16px圓角、無額外陰影；移除關子嶺原本固定深色的框線差異。深色地形原配色與所有地圖／天氣／路線腳本保持原樣。
- 已檢查深淺色、手機／平板／桌機及widget晚載入時的樣式優先級，並確認水面到林地的亮度順序；未進行瀏覽器實際渲染或iPhone實機驗證。

## 天氣圖示

`weather-card-widget-v8.js` 沿用支援三頁的v7，僅套用龍洞修正後的陰天雲朵路徑，雲朵與描邊均落在32×32圖示範圍內。目前天氣、近期預報、五日預報與逐時明細共用此修正。

## 檔案與本機預覽

- 共用主題控制：`climbing-theme-v1.js`。
- 各頁新增 `*-page-v1.js`、`webflow-embeds/*-page-v1.css`，從原Embed移出初始化與原樣式，避免重複載入，頁面主內容保持原樣。
- 各頁色彩覆寫：`webflow-embeds/defulan-theme-v2.css`、`guanziling-theme-v2.css`、`kenting-theme-v2.css`。
- 地圖版本：`defulan-sector-map-v9.js`、`guanziling-sector-map-v8.js`、`kenting-sector-map-v11.js`。
- 三份Embed使用固定Git commit載入全部CSS／JS；本機file／localhost則使用對應本機檔案。直接開啟三份Embed即可預覽。
- 含目前選單與模擬navbar／footer的完整本地預覽在 `/Users/Guan-Wei/Desktop/Web/portfolio/crag-theme-release/` 的 `defulan-preview.html`、`guanziling-preview.html`、`kenting-preview.html`。模擬殼層未包含在上線Embed。

## 檢查

已執行實際腳本的DOM檢查：三頁共21個字卡、126條路線、中英文／難度順序／空清單、區域點選／字卡排序、五個導航連結、實際縮放控制器的拖曳與雙指防誤選／最小倍率，以及30次主題切換保留選取與縮放。

配色檢查涵蓋三頁深淺色、手機／平板／桌機、hover／focus及widget樣式晚載入，包含單一綠線、五種狀態色、地圖背景／編碼、透明影像、首頁一致導航與底部零留白。另確認原HTML main與SVG向量完整一致，所有CSS／JS可解析，Embed低於Webflow 50,000字元限制。未進行瀏覽器實際渲染或iPhone實機驗證。

固定資源 commit：`d5f14f2d798612ea9471dffb22888ccd109bd575`。完整Embed字元數：defulan 17533、kenting 13921、guanziling 22685。
