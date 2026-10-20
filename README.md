# GO WILD 網站原始碼

首頁內容區已與目前Webflow footer對齊：介紹內文、DISCOVER／LEARN／EXPLORE卡片及聯絡表單統一桌機15vw、≤991px為7vw、≤767px為5vw的水平留白。LEARN五張卡片改用編輯者指定的彩色照片，救援使用編輯者更正的rescue.avif照片。landing固定投影片、sticky動畫及原生表單整合程式保留。需重貼 `webflow-embeds/home.html` 完整Embed並Publish。


五個學習課程頁共用 `course-pages-v5.css`，內容與原生表單外層的水平留白跟隨目前Webflow footer：桌機15vw、≤991px為7vw、≤767px為5vw，取消原本1080px內容上限。首頁移除台灣嚮導卡片；overlay menu改為「多繩距攀登 Multi-pitch Climbing」及「繩索操作與救援技術 Rope & Rescue Skills」。需重貼五頁、首頁及menu overlay完整Embed並Publish。


新增三個攀登學習與課程推薦頁：`/sport-climbing`（運動攀登）、`/gym-to-crag`（岩館到戶外）、`/trad-climbing`（傳統攀登）。沿用目前課程頁的中英文、字級、章節、導覽與footer底色，提供概念、完整學習方向及推薦單位，不放GO WILD報名表單或停開課公告。傳統攀登內容聚焦單繩距的保護點、器械、先鋒與確保、拆點、下降撤收，移除繩隊交接內容，推薦百合搖滾；運動攀登與Gym to Crag推薦位置保留待填。首頁三張卡片及hamburger LEARN入口已接上新頁，需在Webflow建立三個slug並重貼新頁、首頁、選單Embed後Publish。安裝與內容來源見 `webflow-embeds/course-guides-installation.md`。


## 四頁最小倍率填滿視窗（目前修正版，2026-10-15）

四頁使用 `climbing-map-zoom-v8.js`。最小倍率改取視窗寬、高所需倍率的較大值，地圖始終覆蓋固定視窗，避免手機縮小後下方或右側露底；在最小倍率時，橫向原稿（德芙蘭、墾丁）僅左右滑動，縱向原稿（龍洞、關子嶺）僅上下滑動。初始化、晚載入的CSS及視窗尺寸變更亦會套用此限制，按鈕、雙指與觸控板採同一套下限。既有初始位置、外框尺寸及＋／－樣式保留；龍洞改用 `longdong-sector-map-v22.js` 移除舊的桌機專用下限參數。四頁需重貼完整Embed並Publish。此設定以可平移看遍全圖為準，不再將整張圖同時縮進不同比例的外框。

## 四頁固定地圖視窗（2026-10-15）

四頁共用 `climbing-map-frame-v1.css` 與 `climbing-map-zoom-v7.js`。外框寬度上限1080px，桌機高度固定為 `clamp(440px,65svh,650px)`；手機≤520px維持1.04:1比例，縮放不改變外框大小。墾丁改用 `kenting-sector-map-v10.css`，移除最小倍率時改變外框比例的規則。桌機最小倍率依地圖寬度計算，長圖保留上下捲動；手機仍能縮至全圖。外框與捲動區底色對應各SVG原稿，避免縮小後出現不同色的露底。關子嶺取消SVG的100%最小寬度限制。既有初始位置與＋／－外觀保留，四頁皆需重貼HTML Embed並Publish。

## 路線區塊一致性與全圖底部（目前修正版）

四頁改用 `route-scroll-hints-v5.css`。墾丁、德芙蘭與關子嶺手機版的推薦路線標題統一上下 8px 內距、下方 20px 外距；龍洞保留手機分頁標籤與桌機雙欄標題。空清單採更明確的 panel 直屬 p 規則，覆蓋舊 `area-grid article p` 的 `padding:0`，與標題保留同樣 16px 內距、捲軸雙側預留及右側欄位，修正青竹東等區的訊息未對齊。

龍洞與墾丁改用 `climbing-map-zoom-v5.js`，同步最小倍率狀態。墾丁 `kenting-sector-map-v9.css` 在手機縮至全圖時將外框貼合 SVG 的 4902.1:4200 比例，避免下方背景帶；外框與捲動區使用不透明底色，預設載入視野維持原設定。

墾丁改用 `kenting-routes-v2.js`，維持 102 條兩至三星的篩選條件、級數排序與雙語名稱，畫面移除星號；星數留在編輯資料中。龍洞 35 條運攀路線的雙語細節改為 N bolts + anchor，N 沿用原本沿線 bolt 數，不將頂端固定點加進 N；JSON 的 bolts 與 anchors 欄位保留原值。HTML 與 JSON 的 infoZh/infoEn 同步，其他級數、細分區、2Pitch 與 PG 標示保留。四頁完整 Embed 皆需重貼並 Publish。

## 地圖完整縮小與墾丁星號路線（目前版本）

龍洞與墾丁改用 `climbing-map-zoom-v4.js`。附圖的初始視野仍保留，縮小下限則由視窗與 SVG 實際長寬計算，與載入時的預設倍率分開；「－」、雙指及觸控板縮小均可到整張地圖完整顯示，桌機亦適用。樣式或視窗尺寸改變後重新計算，保留既有縮放中心、拖曳邊界及使用者操作後不重設初始位置的行為。

墾丁依 2026-10-15 讀取的公開 Google Docs 路書正文，列入共 102 條帶兩星或三星的路線，九區數量為 8／5／38／21／11／2／12／5／0；一星及未評星的 Project 不列入。來源記錄、名稱、級數、星數與路書提供的固定點數見 `kenting-starred-routes-v1.json`。`kenting-routes-v1.js` 在 `climbing-sector-browser-v1.js` 前建立隱藏來源節點，避免 Webflow Embed 超過 50,000 字元，並沿用原有岩區、級數排序與雙語切換。沒有第二語言名稱時主副標題同名，不推定未記載的 bolts 或頂端數量。清單依編輯者要求只列名稱、星數、級數與固定點數量，不新增個別路線警示標註。

「不算／Bu Suan」已列於陽光牆，5.12c、兩星、6 bolts + anchor。墾丁手機版推薦路線標題上下內距各 8px、下方 margin 20px，四頁共用 `route-scroll-hints-v4.css`，空清單訊息與推薦路線標題採相同內距、寬度及原生捲軸預留空間，文字起點一致。此次四頁皆需重貼完整 Embed 後 Publish。

這個公開儲存庫保存 Webflow Code Embed、前端天氣與攀登現況小工具，以及 Cloudflare Worker 原始碼。正式頁面仍由 Webflow 發布；此 repo 不含 CWA 授權碼。

## 頁面與檔案

| 頁面 | Webflow Embed | 前端小工具 | 樣式 |
| --- | --- | --- | --- |
| 首頁 `/` | `webflow-embeds/home.html` | Embed 內部中英文切換、導覽與原生表單整合 | Embed 內部樣式 |
| 岩壁攝影 `/photography` | `webflow-embeds/photography.html` | `photography-page-v2.js`：中英文、區塊導覽、手機固定Instagram預覽 | `webflow-embeds/photography-v2.css`、共用 `page-sections-v1.css` |
| 多繩距攀登 `/multi-pitch` | `webflow-embeds/multi-pitch.html` | `course-pages-v3.js`：中英文、原生表單翻譯與區塊導覽；`course-pdf-lightbox-v2.js`：Adobe Lightbox | `webflow-embeds/course-pages-v5.css`、`page-sections-v1.css` |
| 繩索操作與救援技術 `/rock-rescue-skill` | `webflow-embeds/rock-rescue-skill.html` | 同上 | 同上 |
| 龍洞 `/longdong` | `webflow-embeds/longdong.html` | `longdong-conditions-widget-v30.js`、`longdong-cwa-widget-v16.js`、`longdong-rock-estimate-v3.js`、`longdong-sector-map-v19.js`、`longdong-page-v2.js`、`longdong-routes-v4.js`、`longdong-sector-browser-v1.js` | `webflow-embeds/longdong-embed-v13.css`、`climbing-typography-v2.css`、`longdong-sector-browser-v2.css` |
| 墾丁 `/kenting` | `webflow-embeds/kenting.html` | `climbing-conditions-widget-v4.js`、`weather-card-widget-v6.js`、`longdong-rock-estimate-v3.js`、`kenting-sector-map-v9.js` | `webflow-embeds/climbing-detail-v7.css`、`climbing-typography-v2.css` |
| 德芙蘭 `/defulan` | `webflow-embeds/defulan.html` | 共用現況／天氣小工具，另有 `defulan-sector-map-v8.js` | 同墾丁，另有 `webflow-embeds/defulan-sector-map-v7.css` |
| 關子嶺 `/guanziling` | `webflow-embeds/guanziling.html` | `climbing-conditions-widget-v5.js`、`weather-card-widget-v7.js`、`guanziling-sector-map-v7.js`、共用縮放與岩面估算 | `webflow-embeds/guanziling-detail-v3.css` |
| 全站選單 | `webflow-embeds/menu-overlay-full.html` | Embed 內部程式 | Embed 內部樣式 |

上表是目前交接版本。後續以各 Embed **實際引用的檔名** 為準；舊版檔案保留作為歷史版本。首頁新版內容 Embed 的安裝與原生表單保留方式見 `webflow-embeds/home-installation.md`。

兩個課程頁依2026-10-16正式頁整理既有中文內容與PDF、補上英文，頁首均有2026公告「今年已無新開課計劃，請持續關注。」。v3將原生Webflow Course Inquires表單保留在原本section、位置與樣式，只翻譯顯示文字並統一外層section左右留白，英文切換下方新增AI翻譯與公司介紹說明，Embed提供與其他章節相同樣式的「報名諮詢／Course Enquiries」標題，移除「課程概述」小標題，沿用後台收件、欄位識別、輸入值及Turnstile，不搬移節點、不覆寫表單CSS、不另寫送出API。PDF按鈕與渲染容器已整合至各頁HTML，使用提供的Adobe Client ID與Lightbox／Close設定；每頁開啟各自PDF，SDK載入一次，預覽隱藏下載與列印功能，入口改用button，SDK載入或預覽失敗僅顯示提示，不直接開啟PDF原檔。諮詢section使用flow-root，避免標題下方36px外距塌陷到區塊外而露出黑底。兩課程頁的Webflow copyright footer亦固定為最後區塊的#0b0d0e底色。安裝與舊按鈕／Adobe Embed移除方式見 `webflow-embeds/course-installation.md`。首頁與menu overlay無需修改。

攝影頁沿用原本Levi與永春岩選的帳號及介紹，使用單一頂端中英文切換、灰底白色hover按鈕、與岩場頁相同的區塊分線／淺底／間距。介紹段落採一般內文（桌機16px、手機14px、字重400、行高1.72）。桌機與手機均使用固定Instagram預覽，透過覆蓋帳號連結阻止iframe接收滾輪、觸控與鍵盤輸入，滑動交由整頁處理；點預覽或CTA開啟原帳號。移除底部Instagram／版權說明，最後一節不另外留白。完整替換原Embed後Publish，見 `webflow-embeds/photography-installation.md`。

## 架構與維護

- Webflow 負責頁面框架、原有導覽與 footer；地點內文由各自的 Code Embed 提供。選單 Embed 放在現有 Navbar overlay 中，保留 overlay 原本的開關；現有 `.mobile-overlay.gw` 上保留 `fs-scrolldisable-element="when-visible"`。
- Webflow 頁面從 jsDelivr 的 `designchen-tw/gowild-web@main` 載入前端 CSS/JS。瀏覽器小工具呼叫 `https://cwa-weather.designchenme.workers.dev/api/{longdong|kenting|defulan|guanziling}`；Worker 向中央氣象署取得資料。Windy 和即時影像為第三方 iframe。
- `cwa-weather-worker.js` 是 Worker 原始碼，`CWA_API_KEY` 只存在 Cloudflare Worker Secret。龍洞觀測歷史使用 KV binding `CONDITIONS_HISTORY`，每小時 `15 * * * *` 的 Cron Trigger 更新；詳細岩面推估規則見 `ROCK-CONDITION-RULES.md`。
- 中英文切換在各 Embed 及小工具內實作。龍洞是三個地點頁共同的版面參考；墾丁與德芙蘭不顯示潮汐卡。
- 攀登現況共用排版在 `webflow-embeds/climbing-conditions-layout-v3.css`：桌機所有卡片同一列（龍洞六欄、墾丁與德芙蘭五欄），卡片容器寬度 601–980px 時採三欄；墾丁與德芙蘭第二排風向／岩面各佔半寬；≤ 600px 時切換兩欄，兩欄時岩面推估與龍洞潮汐各自滿版。每排卡片透過 CSS subgrid 共用標題、主要數值、補充資料與來源四列，依內容自動決定列高，不保留固定高度的空白。三個地點 Embed 都需載入此 CSS；龍洞 `v30` 將上一次潮汐與標題包在同一標題區塊。
- 龍洞九區位置圖由 `longdong-sector-map-v19.js` 與 `webflow-embeds/longdong-sector-map-v17.css` 提供，點地圖編號、岩區名稱或下方字卡會選取對應岩區，選取卡移至第一格，其餘卡保持01–09的原始順序。選取卡採上方綠線及非常淡的綠底，hover使用灰底；桌機左側列細分區、右側列可捲動的推薦路線，手機用「細分區／推薦路線」標籤切換，省略重複小標與地圖下方的查看文字。地圖以固定高度視窗呈現，可自由上下捲動；點選編號或下方卡片會在地圖視窗內聚焦對應岩區，保留縮放倍率；點卡片時頁面定位至展開卡片，點地圖時保留目前頁面閱讀位置。龍洞使用 `climbing-map-zoom-v2.js`，其餘三頁維持 `climbing-map-zoom-v1.js`；四頁共用 `webflow-embeds/climbing-map-zoom-v1.css`：右上角只有＋／－兩個按鈕，不顯示倍率，支援雙指縮放、單指／滑鼠拖曳、觸控板與鍵盤縮放。範圍為各頁預設比例的 1–3 倍，保留德芙蘭與墾丁手機版較小的初始比例。縮放以視窗中心或手勢中心為基準，定位後仍可自由移動。共用 JS 須排在地圖 JS 前載入。九個岩區預設只有灰色輪廓，選取後只為該區填上網站資料色 #A9D9B6；後續新增地圖顏色也應沿用網站資料色票，集中在地圖 CSS 變數管理。地圖使用使用者提供的 Illustrator 原稿提取之 `webflow-embeds/longdong-map-vector-v4.svg`，保留原稿的海岸地形、道路、步道與九區邊界；九個編號置於原稿圓圈中心；選取填色依岩區唯一幾何路徑識別，不依賴 Illustrator 匯出的 stN 樣式編號。地圖另以可切換中英文的文字標註道路、隧道、步道、停車場、和美國小、西靈巖寺與龍洞南口海洋公園，北方箭頭固定於地圖框左上角、北／N 置於箭頭下方；岩區卡片 hover 為灰底，選取後才顯示 #A9D9B6。龍洞最後一節不另留底部空白，直接銜接 Webflow footer 的既有內距。這是原稿比例的岩區示意位置，並非 GPS 導航或救援點編號。這一版僅用於龍洞。
- 龍洞推薦路線共75條，於選取岩區卡片內依級數由簡單到難列出，級數相同保持原資料順序。描述省略已選取的大分區，保留細分區；細分區與大分區同名時仍顯示一次細分區名稱（例如Oh!為校門口，英文School Gate Crag）。`longdong-sector-browser-v1.js`與`webflow-embeds/longdong-sector-browser-v2.css`管理字卡、排序與雙語內容；`longdong-routes-v4.js`和Embed中隱藏的路線來源提供75條路線與56個細分區資料。`longdong-page-v2.js`管理語言與導覽，Embed維持Webflow的50,000字元限制。
- 龍洞 CWA 預報的橫向資料列保留捲動，捲動條採低對比細線與深色軌道。出發前注意事項為無分隔線的單欄清單，先說明天然岩場資訊會變動，再依序提示安全資料、天候、裝備與環境。底部導覽的「出發／Go」使用前進箭頭；五個導覽依序為「龍洞／Longdong、岩場／Crag、TOCC、出發／Go、天氣／Weather」，皆以對應section頂端作為捲動目標。路線整併至岩場卡片，天氣指向`#ld-live-weather`的即時天氣與現場影像；捲至頁尾時反白天氣。
- 墾丁與德芙蘭也使用低對比細捲動條、雙語路線名稱分行、單欄無分隔線的注意事項，以及「出發／Go」導覽。兩頁的注意內容保留各岩場自身的風險與通行資訊，五個導覽連結都對齊 section 頂端。
- 德芙蘭位置圖由 `webflow-embeds/defulan-location-map-v3.svg`、`defulan-sector-map-v8.js` 和 `webflow-embeds/defulan-sector-map-v7.css` 提供，採用網站編輯者更新的 SVG，保留原稿比例、道路、步道、地標圖示及岩區輪廓；原稿地名保留，英文版依原稿文字切換翻譯，位置依原稿對齊。使用者編輯的 `webflow-embeds/defulan-location-map-v1.svg` 保留為來源檔，網站互動圖直接內嵌更新後的 SVG，並在切換英文時轉換原圖地名。標出台 8 線、支線道路、德芙蘭步道、停車場、公車站、廁所、露營區、大甲溪與原圖四個岩區；北方箭頭固定在地圖左上角。點選圖上編號或下方岩區卡片會選取並聚焦，僅被選取區顯示資料色 #A9D9B6，地圖可自由捲動。手機版預設地圖從固定 960px 改為容器的 200%（最小 640px），讓一次可看見更多相對位置。終極邊境、邊境左、邊境右共用原圖的「邊境區域」輪廓，三個編號只是對應下方字卡，不表示已確認的子區邊界；本圖是位置示意，並非精確導航。
- 德芙蘭推薦路線依六個岩區順序排列，同區依[路線列表](https://docs.google.com/spreadsheets/d/18rTDqJdxDHYv9Jf7z8TZdqs46thJxRLNGasWbvRmiHc/edit?gid=0#gid=0)的列序排列；目前共十條，新增咪嚕咕／Miruku（邊境左，傳統，15 m，5.11b，小號 cam、nut）與私釀／Bootlegger（金三角，運動，5.10b，9 bolts + anchor，原表未列高度）。行前資訊以 Facebook 群組公告為主要更新來源，並提供路線表、路線照片兩個輔助連結；頁面不再使用 Mountain Project 名稱或連結。
- 岩區名稱的中英文排列在 `webflow-embeds/area-names-v1.css`：目前語言排前，手機版（≤ 520px）讓另一語言固定另起一行；三個地點 Embed 都需載入此 CSS。
- 共通文字層級在 `webflow-embeds/climbing-typography-v2.css`：桌機章節標題／重要數值／卡片名稱／內文／標籤／細節文字為 22/20/16/16/14/12px；手機 `max-width:520px` 為 18/16/14/14/12/10px。修改時一併檢查字高、字距、灰度、左右留白與中英文換行。

- 首頁 `webflow-embeds/home.html` 整合雙語介紹、DISCOVER／LEARN／EXPLORE 與 CONTACT。DISCOVER 依龍洞、德芙蘭、關子嶺、墾丁排序；關子嶺卡片連至 `/guanziling`。EXPLORE 保留人物誌卡片為無連結 article；全站選單不提供人物誌連結，品牌文字上方使用指定的 `logo_GW-03.avif` Logo。語言按鈕只放在上方介紹區，切換整頁文字、卡片主副標題及聯絡表單文字；照片卡片呈現原始彩色，插畫卡片維持灰階。內容樣式與程式內嵌，主區塊底色與間距共用 `page-sections-v1.css`。首頁 Embed 放在完整 landing 動畫 section 後方，使用局部疊層蓋住 fixed 投影片；原有 200vh 動畫容器和 sticky 文字保留。底部導覽只在下方內容進入視窗後顯示。
- 首頁 CONTACT 會將頁面現有的 `Course Inquires` 原生 Webflow Form Block 移入 Embed，保留原始節點、欄位名稱、Webflow 識別與 Turnstile，不改提交處理；請勿刪除或複製原生 Form Block。語言切換不改動填寫值；表單保留 Webflow 原始單欄排版、灰底與 20px 圓角，不覆蓋欄位樣式。本機測試未發送真實訊息，發布後仍須確認 Webflow 後台收件。

## 修改與發布

1. 從要修改的 Embed 查目前引用的 CSS/JS，編輯對應原始碼。若要避免 jsDelivr 仍提供舊快取，建立下一個版本化檔名並更新 Embed 引用；同時確認 Webflow Embed 長度限制。
2. 將變更提交並推送到 GitHub `main`，讓 jsDelivr 可取得新版本。只有 CSS/JS 改動時，若 Embed 引用也改了，仍必須把更新後的完整 Embed 貼回 Webflow 對應頁並重新 Publish。
3. `cwa-weather-worker.js` 有變更時，另在 Cloudflare 部署目前 Worker；GitHub 推送不會自動更新 Worker。不要把 Secret 寫入檔案或對話交接文件。
4. 遇到「本機正確、上線仍舊」時，依序確認 GitHub push、jsDelivr URL、Webflow 中貼上的 Embed 版本、Webflow Publish 及瀏覽器快取。不要只憑本機預覽判斷正式站已更新。

## 新對話如何接手

在 Codex 選用這個本機 repo `/Users/Guan-Wei/Documents/GitHub/gowild-web` 作為專案，開一個新對話並直接描述本次要改的頁面和問題。根目錄 `AGENTS.md` 會提供精簡的專案規則；只有需要架構或發布細節時再讀本 README。這能避免每個任務都帶入整段歷史對話。

## 關子嶺頁面

- 第一版依提供的14頁路書整理，詳細來源與發布步驟見 `webflow-embeds/guanziling-installation.md`。六區、50筆路書記錄（含一筆抱石），目前摘錄14條推薦路線，依岩區選取後由易到難顯示，不提供完整路書路線列表。名稱與級數依原書，未把歷史描述當成最新通行或固定點資訊。
- `guanziling-location-map-v2.svg` 是可編輯來源，互動程式內嵌編輯後的 SVG，以維持本機檔案預覽；修改來源後須同步產生新版地圖 JS。網站版會移除來源 SVG 中的手繪參考底圖，保留新北向箭頭與岩區路徑。
- 關子嶺保留獨立整合CSS，岩區字卡共用新的路線展開元件，天氣採四頁共用的獨立區塊樣式。只有選取區域使用 #A9D9B6，hover為灰底，支援＋／－與手勢縮放。
- Worker 新增 `/api/guanziling`，使用臺南 F-D0047-077／079、白河區預報、優先 C0X240 關子嶺測站，Cron也加入本站歷史。岩場定位23.3283185,120.4889894。省道影像為公路局清單中最近的台3線295K+500（直線約7.3km），非岩場現場。

目前四張可編輯地圖集中在 `webflow-embeds/svg/`：`longdong-map-vector-v4.svg`、`defulan-location-map-v3.svg`、`kenting-sail-rock-map-v1.svg`、`guanziling-location-map-v2.svg`。四頁地圖 JS 直接內嵌來源 SVG，再加入編號、選取與中英文切換；編號置於編輯者畫出的圓圈中心。修改 SVG 後須同步產生新版 JS 並更新 Embed 引用。墾丁填色圖層插入原圖層的實際父層，保留文字及地標在上方。關子嶺卡片順序的飛來石／終極岩分別對應來源的 `sector-2`／`sector-1`。

- 墾丁新來源圖為 `webflow-embeds/kenting-sail-rock-map-v1.svg`，由使用者提供的 Sail Rock 地圖複製。四頁新版地圖 JS 直接內嵌各自更新的 SVG，卡片／地圖編號依最新座標互相定位；更新編輯來源後需重新產生版本化 JS，並更新各 HTML Embed 的載入檔名。

龍洞路線資料記錄於 `longdong-selected-routes-v1.json`，來源為 [TOCC 龍洞資料庫](https://tocc-climbing.github.io/longdong/#/)（CC BY-SA 4.0，資料版本 b1056081dd80，2026-10-11）。細分區及英文名稱依來源；選取卡內描述省略外層大分區，但必須保留實際細分區名稱，即使兩者同名。Embed的`data-route-subsector`記錄JSON的實際細分區，英文名稱由細分區資料對應。運動攀登快扣數以 `bolts` 沿線位置及 `anchors` 頂端位置分開計數，不能將含 Anchor 的 `boltCount` 再加頂端數量；例如 Oh No! 為6+2。輪迴列一般攀登的P1，級數依編輯者改為5.11c。兩段路線合併為單筆，以較高的段落級數顯示，並保留編輯者指定的級數（含先前福利社5.10、龍路5.10+）及2Pitch／PG／深水抱石標示。更新 JSON 後需同步 HTML 中的路線及 JS 內的細分區，JSON 是編輯資料記錄而非即時API。

龍洞的舊獨立經典路線區塊保留為隱藏資料來源，以Embed內的critical CSS避免載入時閃現，並移除其導覽與scroll spy標記。細分區小窗不再是正式介面；目前互動統一使用展開岩區字卡。手機地圖至少覆蓋視窗高度；龍洞縮放、拖曳與岩區定位均限制於SVG邊界，避免底部滑出黑色空白。來源與授權記錄留在資料檔。

四頁地圖以 `webflow-embeds/svg/` 內的最新來源為準，編號依來源圓圈及字卡順序定位。岩區名稱與編號都可用點擊、Enter 或空白鍵選取；名稱、圓圈、輪廓填色及字卡同步呈現 #A9D9B6。英文名稱依實際載入字體及右側空間換行；置於圓圈上下的名稱保留置中對應，語言切換保留選取狀態。德芙蘭「邊境區域」名稱對應三張邊境字卡：已有邊境選取時保持該字卡，未選取時定位終極邊境；三個編號仍可各自選取。SVG 原稿保留不覆寫。

## 岩區字卡與獨立天氣區塊

德芙蘭、墾丁與關子嶺共用 `climbing-sector-browser-v1.js` 和 `webflow-embeds/climbing-sector-browser-v2.css`。點地圖名稱、編號或字卡後，只有選取卡移到第一個並展開該區推薦路線，其餘卡依原岩區順序排列；不顯示細分區。路線依級數由易到難排列（a/b區間按兩者中間排序），同級保留原順序；描述省略已在外層顯示的岩區名稱。無推薦路線的區域顯示雙語空狀態。選取卡為非常淡的綠底，hover為灰底，保留手機左右內距與地圖縮放樣式。原路線區塊保留為隱藏資料來源，注意文字移至岩區列表後方；三頁導覽移除路線並在最後新增天氣。

四頁即時天氣與現場影像現在為 `main` 下的獨立section，使用 `webflow-embeds/page-sections-v1.css` 統一全頁主區塊的留白、全寬分隔線與交錯底色。龍洞也需重貼HTML。全站選單DISCOVER與首頁卡片皆按龍洞、德芙蘭、關子嶺、墾丁排列，關子嶺連至 `/guanziling`；選單也能在關子嶺頁標示目前所在頁面。首頁關子嶺英文名稱統一為Guanziling，仍沿用Webflow原生聯絡表單。

## 全頁主區塊排版

首頁與四個岩場頁共用 `webflow-embeds/page-sections-v1.css`。每頁五個可見的主section明確標上 `data-gw-page-section` 與 `data-gw-section-tone`，依序為黑、淺灰黑（#0b0d0e）、黑、淺灰黑、黑；不以DOM的nth-child判定，避免隱藏的路線資料section打亂底色。每個區塊只使用一條上方細線，第一區省略上方分線，移除舊soft／TOCC區塊下緣分線，避免雙線。桌機上下內距統一為clamp(72px,7vw,104px)，≤520px統一56px；最末區塊下方統一0，不新增底部留白，直接接續Webflow footer。龍洞舊的`#ld-safety`零內距規則由共用CSS明確覆寫。內容仍以岩場1080px、首頁1264px置中，手機左右共用18px頁面留白，卡片內距另由卡片樣式管理。

首頁的fixed投影片、sticky landing、原生Webflow聯絡表單與全站overlay選單不屬於此主section樣式範圍。首頁現在也會載入這份共用CDN樣式；更新時需重貼首頁及四個岩場頁Embed，再重新Publish。舊的`climbing-live-section-v1.css`保留供舊Embed使用，新版不再引用。

## Hamburger展開選單

`webflow-embeds/menu-overlay-full.html`為hamburger展開後的共用選單Embed，需貼回 `.mobile-overlay.gw > .menu-icon-items-section`，外層保留Finsweet的`fs-scrolldisable-element="when-visible"`。展開面板統一使用#0b0d0e底色；三個分類收合時採一致內距，不顯示分類底色與分隔線；展開後只有子選單使用上方細線與淡底。選單品牌、分類及連結字級為桌機14px、≤600px手機13px，連結hover為灰底，目前頁面為淡綠底及#A9D9B6文字。每個連結至少44px高，面板在各種高度都能向下捲動，避免展開後項目被裁切；原有hamburger開關、accordion、關子嶺入口與目前頁面判斷保留。樣式內嵌，這次只需替換選單Embed並Publish。

推薦路線清單的最後一筆以CSS `li:last-child` 移除下方分隔線與padding；單筆路線同時套用首尾規則。龍洞清單改用內容高度及max-height，桌機與手機都不再強制最小／固定高度，避免短清單末尾產生可繼續滑動的錯覺。其他三頁沿用內容高度及max-height。


## 推薦路線捲動提示

四個岩場 Embed 共同載入 `route-scroll-hints-v1.js` 與 `webflow-embeds/route-scroll-hints-v3.css`。清單實際超出可見高度時，右側才顯示淺綠色箭頭：頂端只有向下、中段上下皆有、底端只有向上；可點擊捲動，保留手勢與鍵盤操作。語言、岩區、手機標籤、字體與視窗大小改變後重新檢查。短清單不顯示箭頭，仍預留控制欄（桌機36px加4px間距、手機28px），讓岩場編碼、箭頭及清單欄位維持對齊。四頁字卡左右內距20px，清單扣除控制欄後兩側各16px，原生捲軸預留空間對稱，末筆仍沒有底部線或額外空白。龍洞手機細分區採相同文字內距，桌機分隔線隨較高的欄位延伸至內容底部、停在下方留白上緣；推薦路線標題對齊路線名稱並與細分區標題平行。

龍洞「出發」區塊新增救援資訊圖、急救器材清單、意外事故通報群組三個雙語外部連結，採灰底、hover白底按鈕。此次四頁都需替換完整Embed並重新Publish；GitHub發布不會自動改寫Webflow頁面。

手機版（≤700px）四頁的岩場編碼採靠右，文字右側與標題左側皆保留20px；箭頭依16px兩位等寬數字寬度向右平移，中心持續對齊編碼。手機箭頭欄由36px加4px間距縮為28px無間距，推薦路線增加12px寬度；短清單保留相同欄位，沒有箭頭。原本36px按鈕點擊區、路線兩側16px內距及桌機樣式維持原設定。共用JS仍為route-scroll-hints-v1.js，四頁Embed皆改載入route-scroll-hints-v3.css。


## 龍洞救援器材與手機地圖初始視野

龍洞地圖改採編輯者新增的 `webflow-embeds/svg/longdong-map-vector-edit.svg`，由 `longdong-sector-map-v20.js` 內嵌；保留六處器材圖示與九區數字、名稱、選取填色。`longdong-rescue-v1.js`／`webflow-embeds/longdong-rescue-v1.css` 將附圖器材資料顯示於展開字卡的名稱與編碼間：校門口與鐘塔列急救器材／長背板，長巷、第一洞、黃金谷與後門另列卷式擔架。僅在選取卡顯示，手機使用短直列，支援中英文；資料為本次提供圖表的轉錄。救援資訊圖按鈕改連編輯者提供的Google Drive檔案。

龍洞與墾丁的手機版初始視野依2026-10-15提供的兩張圖設定（≤520px）：龍洞SVG基準寬175%，靠右顯示、來源座標頂端40；墾丁SVG基準寬333%，來源座標左上3290／440，以中央攀登區為主要視野。兩頁手機地圖框採約1.04:1的寬高比例，對應參考圖接近正方形的視窗。對應CSS為longdong-sector-map-v18.css與kenting-sector-map-v8.css，墾丁地圖JS為kenting-sector-map-v10.js。兩頁改用climbing-map-zoom-v3.js，在樣式／字體載入及SVG尺寸改變時套用初始位置；使用者開始拖曳、縮放或選取岩區後，保留其操作視野，不再套用初始位置。拖曳與縮放仍限制於SVG邊界。桌機初始比例與既有定位維持原設定，另兩頁維持原縮放版本。此次龍洞與墾丁需重貼完整Embed並Publish。

## 龍洞桌機地圖縮小下限（2026-10-15）

龍洞使用 `climbing-map-zoom-v6.js` 與 `longdong-sector-map-v21.js`。寬度超過520px時，縮小下限改為地圖寬度貼齊視窗，長地圖保留上下捲動，避免縮成窄條、右側露底。手機仍可縮至全圖，載入時的預設視野不變；墾丁維持原版本。需重新貼上龍洞完整HTML Embed並Publish。


## 岩石之外 /outside-of-rock

`webflow-embeds/outside-of-rock.html` 是上線用內容 Embed，內含受頁面範圍限制的樣式，使用固定 commit 的 `outside-of-rock-v5.js` 載入雙語學習內容與互動。首頁 EXPLORE 第三張卡片與 menu overlay 已接上 `/outside-of-rock`。保留原生 Webflow navbar 與 footer；桌機／平板／手機左右留白為15vw／7vw／5vw，黑與淺灰黑區塊交替，最後一節不留額外底部空白，copyright footer 黑底。安裝及來源說明見 `webflow-embeds/outside-of-rock-installation.md`；GitHub 更新不會自動發布 Webflow。
