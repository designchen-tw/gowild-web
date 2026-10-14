# GO WILD 網站原始碼

這個公開儲存庫保存 Webflow Code Embed、前端天氣與攀登現況小工具，以及 Cloudflare Worker 原始碼。正式頁面仍由 Webflow 發布；此 repo 不含 CWA 授權碼。

## 頁面與檔案

| 頁面 | Webflow Embed | 前端小工具 | 樣式 |
| --- | --- | --- | --- |
| 首頁 `/` | `webflow-embeds/home.html` | Embed 內部中英文切換、導覽與原生表單整合 | Embed 內部樣式 |
| 龍洞 `/longdong` | `webflow-embeds/longdong.html` | `longdong-conditions-widget-v30.js`、`longdong-cwa-widget-v16.js`、`longdong-rock-estimate-v3.js`、`longdong-sector-map-v19.js`、`longdong-page-v2.js`、`longdong-routes-v4.js`、`longdong-sector-browser-v1.js` | `webflow-embeds/longdong-embed-v13.css`、`climbing-typography-v2.css`、`longdong-sector-browser-v1.css` |
| 墾丁 `/kenting` | `webflow-embeds/kenting.html` | `climbing-conditions-widget-v4.js`、`weather-card-widget-v6.js`、`longdong-rock-estimate-v3.js`、`kenting-sector-map-v8.js` | `webflow-embeds/climbing-detail-v7.css`、`climbing-typography-v2.css` |
| 德芙蘭 `/defulan` | `webflow-embeds/defulan.html` | 共用現況／天氣小工具，另有 `defulan-sector-map-v7.js` | 同墾丁，另有 `webflow-embeds/defulan-sector-map-v7.css` |
| 關子嶺 `/guanziling` | `webflow-embeds/guanziling.html` | `climbing-conditions-widget-v5.js`、`weather-card-widget-v7.js`、`guanziling-sector-map-v6.js`、共用縮放與岩面估算 | `webflow-embeds/guanziling-detail-v3.css` |
| 全站選單 | `webflow-embeds/menu-overlay-full.html` | Embed 內部程式 | Embed 內部樣式 |

上表是目前交接版本。後續以各 Embed **實際引用的檔名** 為準；舊版檔案保留作為歷史版本。首頁新版內容 Embed 的安裝與原生表單保留方式見 `webflow-embeds/home-installation.md`。

## 架構與維護

- Webflow 負責頁面框架、原有導覽與 footer；地點內文由各自的 Code Embed 提供。選單 Embed 放在現有 Navbar overlay 中，保留 overlay 原本的開關；現有 `.mobile-overlay.gw` 上保留 `fs-scrolldisable-element="when-visible"`。
- Webflow 頁面從 jsDelivr 的 `designchen-tw/gowild-web@main` 載入前端 CSS/JS。瀏覽器小工具呼叫 `https://cwa-weather.designchenme.workers.dev/api/{longdong|kenting|defulan|guanziling}`；Worker 向中央氣象署取得資料。Windy 和即時影像為第三方 iframe。
- `cwa-weather-worker.js` 是 Worker 原始碼，`CWA_API_KEY` 只存在 Cloudflare Worker Secret。龍洞觀測歷史使用 KV binding `CONDITIONS_HISTORY`，每小時 `15 * * * *` 的 Cron Trigger 更新；詳細岩面推估規則見 `ROCK-CONDITION-RULES.md`。
- 中英文切換在各 Embed 及小工具內實作。龍洞是三個地點頁共同的版面參考；墾丁與德芙蘭不顯示潮汐卡。
- 攀登現況共用排版在 `webflow-embeds/climbing-conditions-layout-v3.css`：桌機所有卡片同一列（龍洞六欄、墾丁與德芙蘭五欄），卡片容器寬度 601–980px 時採三欄；墾丁與德芙蘭第二排風向／岩面各佔半寬；≤ 600px 時切換兩欄，兩欄時岩面推估與龍洞潮汐各自滿版。每排卡片透過 CSS subgrid 共用標題、主要數值、補充資料與來源四列，依內容自動決定列高，不保留固定高度的空白。三個地點 Embed 都需載入此 CSS；龍洞 `v30` 將上一次潮汐與標題包在同一標題區塊。
- 龍洞九區位置圖由 `longdong-sector-map-v19.js` 與 `webflow-embeds/longdong-sector-map-v17.css` 提供，點地圖編號、岩區名稱或下方字卡會選取對應岩區，選取卡移至第一格，其餘卡保持01–09的原始順序。選取卡採上方綠線及非常淡的綠底，hover使用灰底；桌機左側列細分區、右側列可捲動的推薦路線，手機用「細分區／推薦路線」標籤切換，省略重複小標與地圖下方的查看文字。地圖以固定高度視窗呈現，可自由上下捲動；點選編號或下方卡片會在地圖視窗內聚焦對應岩區，保留縮放倍率；點卡片時頁面定位至展開卡片，點地圖時保留目前頁面閱讀位置。龍洞使用 `climbing-map-zoom-v2.js`，其餘三頁維持 `climbing-map-zoom-v1.js`；四頁共用 `webflow-embeds/climbing-map-zoom-v1.css`：右上角只有＋／－兩個按鈕，不顯示倍率，支援雙指縮放、單指／滑鼠拖曳、觸控板與鍵盤縮放。範圍為各頁預設比例的 1–3 倍，保留德芙蘭與墾丁手機版較小的初始比例。縮放以視窗中心或手勢中心為基準，定位後仍可自由移動。共用 JS 須排在地圖 JS 前載入。九個岩區預設只有灰色輪廓，選取後只為該區填上網站資料色 #A9D9B6；後續新增地圖顏色也應沿用網站資料色票，集中在地圖 CSS 變數管理。地圖使用使用者提供的 Illustrator 原稿提取之 `webflow-embeds/longdong-map-vector-v4.svg`，保留原稿的海岸地形、道路、步道與九區邊界；九個編號置於原稿圓圈中心；選取填色依岩區唯一幾何路徑識別，不依賴 Illustrator 匯出的 stN 樣式編號。地圖另以可切換中英文的文字標註道路、隧道、步道、停車場、和美國小、西靈巖寺與龍洞南口海洋公園，北方箭頭固定於地圖框左上角、北／N 置於箭頭下方；岩區卡片 hover 為灰底，選取後才顯示 #A9D9B6。龍洞最後一節不另留底部空白，直接銜接 Webflow footer 的既有內距。這是原稿比例的岩區示意位置，並非 GPS 導航或救援點編號。這一版僅用於龍洞。
- 龍洞推薦路線共75條，於選取岩區卡片內依級數由簡單到難列出，級數相同保持原資料順序。描述省略已選取的大分區，保留細分區；細分區與大分區同名時仍顯示一次細分區名稱（例如Oh!為校門口，英文School Gate Crag）。`longdong-sector-browser-v1.js`與`webflow-embeds/longdong-sector-browser-v1.css`管理字卡、排序與雙語內容；`longdong-routes-v4.js`和Embed中隱藏的路線來源提供75條路線與56個細分區資料。`longdong-page-v2.js`管理語言與導覽，Embed維持Webflow的50,000字元限制。
- 龍洞 CWA 預報的橫向資料列保留捲動，捲動條採低對比細線與深色軌道。出發前注意事項為無分隔線的單欄清單，先說明天然岩場資訊會變動，再依序提示安全資料、天候、裝備與環境。底部導覽的「出發／Go」使用前進箭頭；五個導覽依序為「龍洞／Longdong、岩場／Crag、TOCC、出發／Go、天氣／Weather」，皆以對應section頂端作為捲動目標。路線整併至岩場卡片，天氣指向`#ld-live-weather`的即時天氣與現場影像；捲至頁尾時反白天氣。
- 墾丁與德芙蘭也使用低對比細捲動條、雙語路線名稱分行、單欄無分隔線的注意事項，以及「出發／Go」導覽。兩頁的注意內容保留各岩場自身的風險與通行資訊，五個導覽連結都對齊 section 頂端。
- 德芙蘭位置圖由 `webflow-embeds/defulan-location-map-v3.svg`、`defulan-sector-map-v7.js` 和 `webflow-embeds/defulan-sector-map-v7.css` 提供，採用網站編輯者更新的 SVG，保留原稿比例、道路、步道、地標圖示及岩區輪廓；原稿地名保留，英文版依原稿文字切換翻譯，位置依原稿對齊。使用者編輯的 `webflow-embeds/defulan-location-map-v1.svg` 保留為來源檔，網站互動圖直接內嵌更新後的 SVG，並在切換英文時轉換原圖地名。標出台 8 線、支線道路、德芙蘭步道、停車場、公車站、廁所、露營區、大甲溪與原圖四個岩區；北方箭頭固定在地圖左上角。點選圖上編號或下方岩區卡片會選取並聚焦，僅被選取區顯示資料色 #A9D9B6，地圖可自由捲動。手機版預設地圖從固定 960px 改為容器的 200%（最小 640px），讓一次可看見更多相對位置。終極邊境、邊境左、邊境右共用原圖的「邊境區域」輪廓，三個編號只是對應下方字卡，不表示已確認的子區邊界；本圖是位置示意，並非精確導航。
- 德芙蘭推薦路線依六個岩區順序排列，同區依[路線列表](https://docs.google.com/spreadsheets/d/18rTDqJdxDHYv9Jf7z8TZdqs46thJxRLNGasWbvRmiHc/edit?gid=0#gid=0)的列序排列；目前共十條，新增咪嚕咕／Miruku（邊境左，傳統，15 m，5.11b，小號 cam、nut）與私釀／Bootlegger（金三角，運動，5.10b，9 bolts + anchor，原表未列高度）。行前資訊以 Facebook 群組公告為主要更新來源，並提供路線表、路線照片兩個輔助連結；頁面不再使用 Mountain Project 名稱或連結。
- 岩區名稱的中英文排列在 `webflow-embeds/area-names-v1.css`：目前語言排前，手機版（≤ 520px）讓另一語言固定另起一行；三個地點 Embed 都需載入此 CSS。
- 共通文字層級在 `webflow-embeds/climbing-typography-v2.css`：桌機章節標題／重要數值／卡片名稱／內文／標籤／細節文字為 22/20/16/16/14/12px；手機 `max-width:520px` 為 18/16/14/14/12/10px。修改時一併檢查字高、字距、灰度、左右留白與中英文換行。

- 首頁 `webflow-embeds/home.html` 整合雙語介紹、DISCOVER／LEARN／EXPLORE 與 CONTACT。DISCOVER 依龍洞、德芙蘭、關子嶺、墾丁排序；關子嶺卡片連至 `/guanziling`。EXPLORE 保留人物誌卡片為無連結 article；全站選單不提供人物誌連結，品牌文字上方使用指定的 `logo_GW-03.avif` Logo。語言按鈕只放在上方介紹區，切換整頁文字、卡片主副標題及聯絡表單文字；照片卡片呈現原始彩色，插畫卡片維持灰階。樣式與程式內嵌，不需要發布新的 CDN 檔案。首頁 Embed 放在完整 landing 動畫 section 後方，使用局部疊層蓋住 fixed 投影片；原有 200vh 動畫容器和 sticky 文字保留。底部導覽只在下方內容進入視窗後顯示。
- 首頁 CONTACT 會將頁面現有的 `Course Inquires` 原生 Webflow Form Block 移入 Embed，保留原始節點、欄位名稱、Webflow 識別與 Turnstile，不改提交處理；請勿刪除或複製原生 Form Block。語言切換不改動填寫值；表單保留 Webflow 原始單欄排版、灰底與 20px 圓角，不覆蓋欄位樣式。本機測試未發送真實訊息，發布後仍須確認 Webflow 後台收件。

## 修改與發布

1. 從要修改的 Embed 查目前引用的 CSS/JS，編輯對應原始碼。若要避免 jsDelivr 仍提供舊快取，建立下一個版本化檔名並更新 Embed 引用；同時確認 Webflow Embed 長度限制。
2. 將變更提交並推送到 GitHub `main`，讓 jsDelivr 可取得新版本。只有 CSS/JS 改動時，若 Embed 引用也改了，仍必須把更新後的完整 Embed 貼回 Webflow 對應頁並重新 Publish。
3. `cwa-weather-worker.js` 有變更時，另在 Cloudflare 部署目前 Worker；GitHub 推送不會自動更新 Worker。不要把 Secret 寫入檔案或對話交接文件。
4. 遇到「本機正確、上線仍舊」時，依序確認 GitHub push、jsDelivr URL、Webflow 中貼上的 Embed 版本、Webflow Publish 及瀏覽器快取。不要只憑本機預覽判斷正式站已更新。

## 新對話如何接手

在 Codex 選用這個本機 repo `/Users/Guan-Wei/Documents/GitHub/gowild-web` 作為專案，開一個新對話並直接描述本次要改的頁面和問題。根目錄 `AGENTS.md` 會提供精簡的專案規則；只有需要架構或發布細節時再讀本 README。這能避免每個任務都帶入整段歷史對話。

## 關子嶺頁面

- 第一版依提供的14頁路書整理，詳細來源與發布步驟見 `webflow-embeds/guanziling-installation.md`。六區、50筆路書記錄（含一筆抱石），呈現12條原路書三星評價路線，不提供全部路線展開列表。名稱與級數依原書，未把歷史描述當成最新通行或固定點資訊。
- `guanziling-location-map-v2.svg` 是可編輯來源，互動程式內嵌編輯後的 SVG，以維持本機檔案預覽；修改來源後須同步產生新版地圖 JS。網站版會移除來源 SVG 中的手繪參考底圖，保留新北向箭頭與岩區路徑。
- 關子嶺使用獨立整合CSS與共用元件下一版；原有三頁保留原本引用，不改其行為。只有選取區域使用 #A9D9B6，hover為灰底，支援＋／－與手勢縮放。
- Worker 新增 `/api/guanziling`，使用臺南 F-D0047-077／079、白河區預報、優先 C0X240 關子嶺測站，Cron也加入本站歷史。岩場定位23.3283185,120.4889894。省道影像為公路局清單中最近的台3線295K+500（直線約7.3km），非岩場現場。

目前四張可編輯地圖集中在 `webflow-embeds/svg/`：`longdong-map-vector-v4.svg`、`defulan-location-map-v3.svg`、`kenting-sail-rock-map-v1.svg`、`guanziling-location-map-v2.svg`。四頁地圖 JS 直接內嵌來源 SVG，再加入編號、選取與中英文切換；編號置於編輯者畫出的圓圈中心。修改 SVG 後須同步產生新版 JS 並更新 Embed 引用。墾丁填色圖層插入原圖層的實際父層，保留文字及地標在上方。關子嶺卡片順序的飛來石／終極岩分別對應來源的 `sector-2`／`sector-1`。

- 墾丁新來源圖為 `webflow-embeds/kenting-sail-rock-map-v1.svg`，由使用者提供的 Sail Rock 地圖複製。四頁新版地圖 JS 直接內嵌各自更新的 SVG，卡片／地圖編號依最新座標互相定位；更新編輯來源後需重新產生版本化 JS，並更新各 HTML Embed 的載入檔名。

龍洞路線資料記錄於 `longdong-selected-routes-v1.json`，來源為 [TOCC 龍洞資料庫](https://tocc-climbing.github.io/longdong/#/)（CC BY-SA 4.0，資料版本 b1056081dd80，2026-10-11）。細分區及英文名稱依來源；選取卡內描述省略外層大分區，但必須保留實際細分區名稱，即使兩者同名。Embed的`data-route-subsector`記錄JSON的實際細分區，英文名稱由細分區資料對應。運動攀登快扣數以 `bolts` 沿線位置及 `anchors` 頂端位置分開計數，不能將含 Anchor 的 `boltCount` 再加頂端數量；例如 Oh No! 為6+2。輪迴列一般攀登的P1，級數依編輯者改為5.11c。兩段路線合併為單筆，以較高的段落級數顯示，並保留編輯者指定的級數（含先前福利社5.10、龍路5.10+）及2Pitch／PG／深水抱石標示。更新 JSON 後需同步 HTML 中的路線及 JS 內的細分區，JSON 是編輯資料記錄而非即時API。

龍洞的舊獨立經典路線區塊保留為隱藏資料來源，以Embed內的critical CSS避免載入時閃現，並移除其導覽與scroll spy標記。細分區小窗不再是正式介面；目前互動統一使用展開岩區字卡。手機地圖至少覆蓋視窗高度；龍洞縮放、拖曳與岩區定位均限制於SVG邊界，避免底部滑出黑色空白。來源與授權記錄留在資料檔。

四頁地圖以 `webflow-embeds/svg/` 內的最新來源為準，編號依來源圓圈及字卡順序定位。岩區名稱與編號都可用點擊、Enter 或空白鍵選取；名稱、圓圈、輪廓填色及字卡同步呈現 #A9D9B6。英文名稱依實際載入字體及右側空間換行；置於圓圈上下的名稱保留置中對應，語言切換保留選取狀態。德芙蘭「邊境區域」名稱對應三張邊境字卡：已有邊境選取時保持該字卡，未選取時定位終極邊境；三個編號仍可各自選取。SVG 原稿保留不覆寫。
