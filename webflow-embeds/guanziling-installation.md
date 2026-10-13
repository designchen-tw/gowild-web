# 關子嶺 /guanziling 第一版

## 貼回與發布

1. 在 Webflow 建立頁面，slug 設為 `guanziling`，使用既有 Navbar 與 footer；將 `guanziling.html` 全文貼入內容 Code Embed。全文約 24,000 字元，低於 50,000 字元限制。頁面無額外 footer，保留原有 Webflow footer 內距。
2. 發布本次新增的版本化 CSS/JS 至 repo 的 `main`，使 Embed 使用的 jsDelivr URL 可取得檔案。需新增 guanziling-detail-v2.css、guanziling-sector-map-v3.js、climbing-conditions-widget-v5.js、weather-card-widget-v7.js，以及可編輯 guanziling-location-map-v2.svg；共用 climbing-map-zoom-v1.js 與 longdong-rock-estimate-v3.js 已存在。
3. 在既有 Cloudflare `cwa-weather` Worker 部署更新的 `cwa-weather-worker.js`；保留 CWA_API_KEY Secret、ALLOWED_ORIGINS、CONDITIONS_HISTORY KV 與 `15 * * * *` Cron。無需新增或輸入前端授權碼。GitHub 更新不會自動部署 Worker。
4. 以 Origin `https://gowild.one` 讀取 `/api/guanziling`，應回傳白河區預報、F-D0047-079、關子嶺測站（有資料時）與 `tides:null`。新端點未部署前為 404，本機 file 或 localhost 未在正式 Worker allowlist 中，預覽天氣資料會無法載入。
5. `/guanziling` 頁發布後，再將更新的 `home.html` 貼回首頁；關子嶺卡片已改為 `/guanziling`，避免在新頁未發布前產生斷鏈。

這次只更新本機原始碼，未自動提交／推送 GitHub、發布 Webflow 或部署 Cloudflare。原有龍洞、德芙蘭與墾丁 Embed 的資產版本不變。

## 路書資料與地圖

來源：網站編輯者提供的「關仔嶺 Guide Book.pdf」，14頁；原書封面標示 Credit: http://eguide.joey91133.idv.tw/place/guanzailing。此網址未能在本次查核取得內容，不作為最新公告來源。

- 頁2：終極岩8筆。頁4：集合場10筆。頁5：Taiwan Boulder9筆（含魔域V5）。頁8：神秘谷10筆。頁10：毒刺林10筆。頁14：飛來石3筆。共50筆，其中49筆繩索路線、1筆抱石。正文與表格數量有些不一致，統計採表格列數。
- 頁9總圖中文為「蓬萊島」，英文 Taiwan Boulder；兩者一起保留。集合場原圖的英文拼寫 Assenbling Field 與正文 Assembling Field 不同，採正文名稱。其餘英文名稱與難度按表格保留，包括 Project (Complete)、蜘珠網、The Bridge the Nose 等原書寫法；未自行新增翻譯、改級或宣稱 Project 現況。
- SVG 主要保留頁9集合場三顆岩體、蓬萊島、神秘谷三組岩體及步道分岔關係。飛來石、終極岩、毒刺林依各區文字描述補入相對位置；未經測量，不使用虛構GPS區域座標或北向。10分鐘／2分鐘為原書描述，不是現場量測。
- SVG 圖層：terrain、trails、cracks、areas、area-labels、landmarks、markers。`sector-1` 至 `sector-6` 對應飛來石、終極岩、集合場、蓬萊島、神秘谷、毒刺林。編號為本頁選取索引，不是原書路線編號。
- 要修改 SVG，編輯 `guanziling-location-map-v2.svg`，再同步地圖 JS 的內嵌字串、markers 點位和 viewBox 比例。與目前另外兩個手稿地圖相同，SVG 是示意資料，不能作為精確導航或救援定位。

## 天氣與影像來源（2026-10-12 查核）

岩場：使用者提供 Google Maps 地點解析為 23.3283185,120.4889894（不可用地圖視窗中心經度取代）。

- [CWA 現存測站清單](https://hdps.cwa.gov.tw/static/state.html)：在現存 C0／46 系列氣象站中以 WGS84 座標計算球面距離，最近是 C0X240 關子嶺（23.331169,120.508025，海拔394m，直線1.97km）。雨量與溫濕風採不同產品；較近的雨量站不能自動取代溫濕風站。舊 C0X020 已撤銷，不採用。
- [白河區預報](https://www.cwa.gov.tw/V8/C/W/Town/Town.html?TID=6700300)：臺南市3天 F-D0047-077、一週 F-D0047-079。頁面呈現未來5天。測站暫缺時沿用現有Worker附近測站／預報fallback，岩面估算不使用龍洞海鹽代理參數。
- [公路局 CCTV 公開位置服務](https://thbapp.thb.gov.tw/services/cctv/thb)：依完整清單設備座標計算最近省道攝影機，CCTV-55-0030-295-001／台3線295K+500（23.38156,120.5301），直線7.26km。串流 `https://cctv-ss06.thb.gov.tw/T3-295K+500` 已取得HTTP200及JPEG影格；頁面另提供公路局168路況入口。影像是附近省道路段，不代表岩場、進場步道或172市道現況。
- Windy iframe 與外開連結均固定使用岩場地點坐標，雨量圖層、ECMWF產品。

## 驗證

Worker測試使用測試授權字串與mock CWA資料，未輸出或讀取真實授權碼：新地點產品／測站／無潮汐、原三端點、CORS、無密鑰錯誤與四站Cron皆通過。省道串流另以真實公開服務驗證。前端採本機測試資料驗證預報解析；測試資料沒有寫入任何交付檔案。最終以正式URL重新核對，正式新端點在本次部署前仍404。

Webflow SEO 建議標題：關子嶺攀岩 | Guanziling Climbing | GO WILD。發布後需分別核對CWA真實觀測、五日預報、Windy及省道影像，不能以mock測試當作正式上線確認。

PLAN YOUR VISIT 的外連按鈕依編輯者要求只保留 Google Maps 岩場定位；官方預報及公路局來源連結仍在天氣／影像區塊。手機320／390、iPad768與桌機1280寬度，中英文未發生頁面橫向溢出；已核對語言排序、地圖單區選取、縮放、五日預報點開及真實攝影機影格載入。

SELECTED ROUTES 現列出14條代表路線：野地飛鼠、雪山飛狐、一棵榕樹下、終極右、叭咘叭咘、天天天藍、右派、美人照鏡、周遊列國、投奔大陸、雞肉飯、浴火鳳凰、小蜜蜂、天堂之路。依岩區與原書列序排列，完整路線展開區與按鈕已移除。50筆僅作為路書統計，不代表頁面列出全部路線。

## 2026-10-13 頁面修訂

- 將第三張概況卡改為「攀登季節・時間」：11 月至翌年 3 月為依中央氣象署中南部季節氣候推估，非路書指定時段。路書第 8 頁提神秘谷潮濕，第 10 頁提毒刺林遮蔭且夏季可攀。
- 推薦列表由 12 條增為 14 條；天天天藍原已列入，新增終極右（路書 5.10c、三星）和叭咘叭咘（5.12d、兩星）。野地飛鼠依編輯者指示改為 5.12-，有別於路書 5.12c。
- 地圖文字以岩區主標、地標輔標區分，步道虛線採圓端短線與較長空隙的共通節奏。四頁均以新增版本的 SVG／JS／CSS 引用避免舊 CDN 快取。
