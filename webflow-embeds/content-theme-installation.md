# 學習五頁與探索兩頁 · 深淺色主題 · 2026-10-22

以下七頁分別完整替換 Webflow 主內容 Code Embed 後 Publish：

- `/sport-climbing`：`webflow-embeds/sport-climbing.html`
- `/gym-to-crag`：`webflow-embeds/gym-to-crag.html`
- `/trad-climbing`：`webflow-embeds/trad-climbing.html`
- `/multi-pitch`：`webflow-embeds/multi-pitch.html`
- `/rock-rescue-skill`：`webflow-embeds/rock-rescue-skill.html`
- `/photography`：`webflow-embeds/photography.html`
- `/resole`：`webflow-embeds/resole.html`

全站選單改用這次的 `webflow-embeds/menu-overlay-full.html`，僅移除選單內Instagram按鈕，保留其餘導覽、logo、主題切換、觸控展開與Safari工具列補色程式。使用者另外在Webflow移除原生頂部與footer的Instagram連結；這次不修改這些原生元件。攝影頁內的攝影師帳號連結維持原樣。

GitHub更新不會自動發布Webflow。首頁、岩石之外、四個岩場頁、首頁Page Code與Worker不需重貼。

## 共通主題

- 共用首頁／選單的 `gw-color-theme-v1` 儲存偏好。共通檔案為 `webflow-embeds/content-theme-v1.css` 與 `content-theme-v1.js`，只在七頁以 `data-gw-page-theme="content"` 啟用。
- 淺色區塊為 `#F6F7F3`／`#EDF0EB` 交替，文字為 `#262626`、`#4D4D4D`、`#666666`。未選取文字維持灰階，選取可用 `#296744` 與淡綠背景。
- 超連結／PDF預覽按鈕在主底區塊使用 `#EDF0EB`，在較深區塊使用 `#F6F7F3`，hover為深灰底白字。一般行內連結與攝影縮圖不改成按鈕。
- 底部導覽沿用首頁間距與尺寸，保留各頁的項目數：課程四個、攝影三個、修鞋五個。深色50%、淺色55%透明底，16px毛玻璃，只有內側亮線，無外擴陰影。
- 頂部品牌圖、文字、hamburger與footer同步主題。課程頁最後為soft區塊，footer接同色；攝影與修鞋最後為base，footer接主底色。最後章節下方維持零額外留白。
- 保留現有文字層級、15vw／7vw／5vw左右留白及各章節結構。主題切換不重建內容、不新增持續輪詢或動畫。

## 課程表單與PDF

原生Webflow表單保留原節點、位置、class、欄位圓角與尺寸、id、name、data-name、required、option value、輸入值與勾選狀態。只透過 `data-gw-native-course-section` 套用主題顏色；原有 `course-pages-v3.js` 保持不變，仍負責中英文標籤與原生表單銜接。未加入新的表單提交或攔截處理。

多繩距與救援的PDF仍使用既有 `course-pdf-lightbox-v2.js` 與Adobe LIGHT_BOX，保持 `showDownloadPDF:false`、`showPrintPDF:false`，沒有新增PDF直連入口。按鈕與渲染容器ID維持唯一，SDK與PDF檔案仍為原設定。

本輪未送出表單、未寄信，後台實際收件及Adobe授權網域仍需發布後實際確認。

## 攝影與修鞋

所有原有照片、攝影師、來源連結、材料文字與中英文內容完整保留。攝影頁兩組各六張照片及原生大圖檢視不重建；切換主題只變更檢視器底色與控制項，照片不套用反相或灰階濾鏡。修鞋頁維持既有雙語顯示及五個章節，推薦仍在送修內。

兩頁原有內嵌功能程式保持原樣；修鞋語言程式依賴 `document.currentScript.previousElementSibling`，因此不搬動或插入元素到main與該script之間。主題載入器放在原程式後方。

## 檢查與預覽

已檢查七頁深淺色、手機／平板／桌機的區塊色、文字、選取、按鈕、導航項目數／間距、footer銜接、原有左右留白、表單配色與攝影檢視器。

實際程式DOM檢查涵蓋中英文與導覽、保存的主題、30次主題切換保留表單節點／設定／輸入／勾選／選項及目前照片、兩組相簿的前後張與焦點恢復、Adobe預覽選項。另確認七份HTML main完整一致、原有攝影／修鞋程式逐字一致，CSS／JS可解析，所有Embed低於50,000字元。

完整本地模擬在 `/Users/Guan-Wei/Desktop/Web/portfolio/content-theme-release/` 的七個 `*-preview.html`。其中表單是先前保存的本機樣本，僅供版面與程式檢查，送出已停用；不包含在正式Embed。未進行瀏覽器實際渲染或iPhone實機驗證。

固定資源 commit：`06da3727f790f61ac1ef95807606818b8e742e4e`。Embed字元數：sport-climbing 18511、gym-to-crag 11185、trad-climbing 14196、multi-pitch 11721、rock-rescue-skill 12051、photography 36330、resole 30444。
