# 課程 PDF 與 App 導覽列層級修正

多繩距攀登與繩索操作／救援技術兩頁使用 `course-pdf-lightbox-v3.js`。

## 行為

- 開啟 Adobe Lightbox 前，先以頁面狀態 `data-gw-course-pdf-open` 隱藏網站導覽列、App 獨立品牌、hamburger、重新整理按鈕及課程底部導覽。
- 使用 `visibility:hidden`，保留原版面佔位與捲動位置，避免關閉 PDF 後畫面跳動。
- Adobe `PDF_VIEWER_CLOSE` 事件恢復原導覽，焦點回到開啟 PDF 的按鈕。
- PDF 載入 Promise 完成不代表視窗關閉，不提早恢復導覽列。
- SDK 尚未準備好時不隱藏導覽；開啟前的例外／拒絕會還原。已開啟的 Adobe 錯誤畫面仍保持原生關閉按鈕可用。
- 保持原生縮放、關閉、禁止下載及禁止列印設定；不增加 PDF 直連或另造關閉按鈕。

## 上線

將 `multi-pitch.html` 與 `rock-rescue-skill.html` 完整替換到 Webflow 各自的 Embed，再 Publish。

這次無需修改 App Head、App Footer、離線 Worker 或氣象 Worker。既有 App 連網後重新整理這兩頁即可取得新的課程頁。GitHub 推送本身不會取代 Webflow Publish。

## 驗證範圍

- Node 測試：開啟、Promise 完成、原生關閉、重開、舊事件、開啟失敗及可關閉的錯誤視窗。
- 本地手機尺寸：使用實際 App Head 與 `app-v10.js`，確認所有網站導覽元件 hidden／不可攔截點擊，關閉後恢復。
- 本地 Adobe 視窗為事件與層級模擬；正式 Adobe client ID 綁定 `gowild.one`，發布後仍需用 iPhone 主畫面 App 核對原生檢視器。

Adobe 官方事件說明：https://developer.adobe.com/document-services/docs/overview/pdf-embed-api/howtodata
