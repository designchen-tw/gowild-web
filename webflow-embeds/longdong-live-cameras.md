# 龍洞即時影像來源與失效處理

記錄日期：2026-10-28（Asia/Taipei）。本次更新龍洞頁，不更動其他三個岩場頁面。

## 來源核對

YouTube 改為管理者提供的 [龍洞灣觀景台](https://www.youtube.com/watch?v=7fDA_cR12qg)，影片 ID `7fDA_cR12qg`。官方 oEmbed 回傳標題 `[LIVE即時影像] 玩樂東北角-龍洞灣觀景台 Longdong Bay Observatory`、發布者 `necoast nsa`。這只能證明目前可取得嵌入資訊，不保證串流長期不中斷。

公路局資料以[官方 CCTV 公開位置服務](https://thbapp.thb.gov.tw/services/cctv/thb)核對。當次清單共 2,137 筆，下列三筆的網址與原本頁面相同：

| 地點 | 官方 ID | 官方串流 | 當次實測 |
| --- | --- | --- | --- |
| 龍洞隧道口（W）・台2線87K+743 | CCTV-14-0020-087-004 | `https://cctv-ss01.thb.gov.tw:443/T2-87K+743(N)` | HTTP 404 |
| 龍洞隧道口（E）・台2線87K+543 | CCTV-14-0020-087-003 | `https://cctv-ss01.thb.gov.tw:443/T2-87K+543(S)` | HTTP 200，multipart MJPEG；取得有效 JPEG 影格 |
| 鼻頭隧道口（W）・台2線84K+792 | CCTV-14-0020-084-004 | `https://cctv-ss01.thb.gov.tw:443/T2-84K+792` | HTTP 404 |

清單存在不代表串流當下可用。保留原地點與官方網址，不將其他路段影像冒充為這些地點，也不把當次失效硬編碼成永久停用。

## 顯示方式

- 新控制器為 `longdong-conditions-widget-v36.js`，取代龍洞 Embed 引用的 v35。既有天氣、浪況與潮汐邏輯維持原文。
- YouTube 同時更新動態監視器卡及 HTML 備援 iframe／外部連結；動態卡建立時會移除舊的備援 YouTube 卡，避免重複。
- 公路局影像靠近視窗時才建立串流請求，載入期間顯示「影像載入中…」。
- 取得第一張可解碼影格後顯示影像。MJPEG 串流可能尚未結束而沒有觸發 `load`，因此以 `naturalWidth` 檢查第一張影格；每 500ms 檢查一次，最長 16 秒，取得影格後即停止檢查。
- `error` 或 16 秒內未取得第一張影格時，隱藏並移除影像來源，顯示「影像來源暫時失效」；英文為 `Camera source temporarily unavailable`。不顯示破圖、不持續自動重試；重新載入頁面會重試來源。
- 已顯示的影像若觸發 `error`，亦改為失效提示。
- 不分析影像內容；來源若回傳可解碼的停機告示圖，或停止更新但未觸發錯誤，前端無法單憑跨網域 img 判斷。
- 提示沿用細節字級與深淺主題灰階；卡片尺寸、四張卡片的排列與手機橫向滑動保留。

完整替換 `webflow-embeds/longdong.html` 後 Publish。CSS／JS 已用固定 commit 載入；無需部署 Worker、修改 Webflow Head／Footer 或更新 Service Worker。已儲存的離線頁面需由使用者更新離線資料，才會取得新版本。

## 本機測試

```sh
node tests/longdong-camera-status.test.mjs
```

涵蓋延遲載入、未收到 load 的第一張 MJPEG 影格、影像錯誤、首次影格逾時、串流錯誤事件、過期事件及雙語提示。
