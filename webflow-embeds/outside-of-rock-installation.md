# 岩石之外 /outside-of-rock · v1.0.0

1. 在 Webflow 建立或使用 `/outside-of-rock` 頁面，沿用其他內容頁的 navbar、hamburger menu 與 copyright footer。
2. 將 `webflow-embeds/outside-of-rock.html` 完整貼進主內容的 Code Embed。此檔已包含頁面 CSS 及載入器，勿另貼本地預覽的 header 或 footer。
3. 首頁完整換成更新後的 `webflow-embeds/home.html`，保留既有 landing 動畫、navbar、原生表單與 footer。
4. 全站 menu overlay 換成更新後的 `webflow-embeds/menu-overlay-full.html`。EXPLORE 的三個入口依序為攝影、岩鞋修補、岩石之外；新頁會標示目前位置。
5. Publish 上述頁面及全站選單。GitHub 更新不會自動發布 Webflow。

## 頁面設定

- Title：岩石之外｜冰雪技能、野外急救與國際嚮導學習路徑｜GO WILD 夠野戶外
- Meta description：從攀岩走向冰雪與山野，整理滑雪、攀冰、雪崩訓練、野外急救及國際嚮導認證的學習路徑與官方來源，協助規劃下一步戶外學習。
- 首區已新增雙語說明：資料來自有限公開來源，目的是提供亞洲較透明的學習管道與資訊；並非即時更新，內容可能遺漏或有誤，須自行向原始來源與主辦機構核對。

## 版面與行為

- 使用 Avenir、22px 桌機／17px 手機章節標題、16px／14px 內文、灰色輔助文字與網站資料綠色 #A9D9B6。
- 左右留白：桌機15vw、≤991px 7vw、≤767px 5vw，不另加超寬螢幕的內容上限。
- 七個主區塊黑／#0b0d0e交替，區塊之間單一細線；桌機上下留白 clamp(72px,7vw,104px)，≤520px為56px；最後一節下方0，copyright footer維持黑色，不額外建立footer。
- 五項底部導覽：路徑、技能、雪崩、急救、嚮導。所有錨點均指向主區塊上緣，scroll-margin-top為24px。
- CSS 與互動均限制在 `#outside-of-rock`，不改寫全站表單、menu 或其他元件的語言與樣式。
- 活動目標、雪崩分頁支援中英文；雪崩分頁可用方向鍵、Home／End。技能、急救及嚮導項目在語言切換後保留展開狀態。
- 首頁使用指定 IMG_1367.avif 彩色縮圖，桌機EXPLORE三欄，較窄畫面沿用原兩欄，不新增獨立首頁章節。

## 載入與驗證

內容較長，互動及詳細課程資料集中於根目錄的 `outside-of-rock-v1.js`。Embed 固定引用同一 Git commit 的 jsDelivr 網址，避免可變 main 分支造成不同版本混用。完整 Embed 保持低於50,000字元。腳本載入失敗時提供重新整理提示與官方來源連結。

執行檢查：六種活動目標、三種雪崩路線與鍵盤操作、九項技能、四種急救課程、三個嚮導體系、雙語說明、展開狀態保留、所有區塊錨點、唯一ID、CSS／JS語法，以及首頁修改範圍。未在本輪執行瀏覽器實際渲染檢查；Publish後應以正式網站確認字體與Webflow外層結構。

內容保留本地預覽已整理的官方來源；本輪複查 Avalanche Canada 訓練、AMGA Mountain Guide Programs 與 NOLS Wilderness Medicine 主頁，未宣稱全面重新審核所有課程先修、時數及認可。課程與職業資格以各機構最新公告為準。
