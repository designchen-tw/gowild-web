# 地區存取控制 Worker 記錄

記錄日期：2026-10-28（Asia/Taipei）。來源為網站管理者在對話中提供的目前「404 Worker」程式；本次未讀取或變更 Cloudflare 線上部署。

原始碼：[geo-access-worker.js](geo-access-worker.js)。僅移除貼文中的 Markdown 斜體、HTML 空白實體及跳脫符號，整理縮排；保留提供的條件判斷、白名單、404 內容與轉送邏輯。

## 功能與放行條件

這是以訪客地區判斷是否轉送請求的 Worker，不是替所有不存在的網址產生 404 的路由器。

1. 以 `request.cf?.country` 取得地區代碼，依下方 36 個代碼判斷是否放行。
2. 若 `request.cf?.botManagement?.verifiedBot` 是布林值，優先採用它；`false` 不會被標頭的 `1` 覆蓋。
3. 只有前述欄位不是布林值時，才以 `x-gowild-verified-bot` 標頭是否**完全等於字串 `1`**作為替代判斷。
4. 白名單地區**或**驗證機器人會放行。非白名單及缺少地區資料的請求，若未符合機器人例外，就回傳 404。

| 分組 | 代碼 | 數量 |
| --- | --- | --- |
| 亞洲 | TW、JP、CN、HK、MO、SG、MY、VN、TH、KR、PH、ID | 12 |
| 大洋洲 | AU、NZ | 2 |
| 選列歐盟地區 | AT、BE、DK、FI、FR、DE、IE、IT、NL、PL、PT、ES、SE | 13 |
| 英國 | GB | 1 |
| 選列非歐盟歐洲地區 | CH、NO、IS、LI、AD、MC、SM、VA | 8 |

代碼按原程式精確比對，不額外轉換大小寫；例如 `US`、`CA` 不在這份白名單內，仍適用驗證機器人例外。

## 回應與轉送

- 被擋請求：回傳英文 `404 Not Found` HTML，狀態碼 404。
- 回應標頭：`content-type: text/html; charset=UTF-8`、`cache-control: no-store`、`x-robots-tag: noindex, nofollow`；HTML 亦保留 robots meta。
- 放行請求：使用 `new Request(request)` 建立轉送請求，刪除 `x-gowild-verified-bot` 後交由 `fetch`；其餘網址、方法、內容及原站回應沿用原程式。
- 不使用環境變數、Secret、KV 或資料庫。

## Cloudflare Transform Rules

以下為管理者於同日補充的 **Modify Request Header** 設定；兩條均為 **Set static**，保留先後順序：

| 順序 | 符合條件／運算式 | 動作 |
| --- | --- | --- |
| 1 | 所有請求，`true` | Set static：`x-gowild-verified-bot` = `0` |
| 2 | `cf.client.bot` | Set static：`x-gowild-verified-bot` = `1` |

按此設定執行時，第一條先覆寫訪客自行送入的同名標頭；第二條再為 Cloudflare 識別的機器人覆寫為 `1`。Worker 隨後才將這個標頭作為替代訊號使用，並在轉送原站前移除它。Worker 本身不會辨識標頭來源，因此全請求的歸零規則及順序屬於這份部署記錄的一部分。

這不改變 Worker 的優先順序：若 `request.cf.botManagement.verifiedBot` 是布林值，就採用該值；例如明確的 `false` 仍優先於標頭 `1`。Transform Rules 的 `cf.client.bot` 與 Worker 的 `botManagement.verifiedBot` 分開記錄，不將兩者視為同一欄位。

## 部署設定的記錄範圍

來源為管理者提供的程式與設定表，尚未獨立讀取 Cloudflare 控制台確認啟用狀態、實際執行順序或涵蓋範圍。Worker 在 Cloudflare 的名稱及 Routes／Custom Domains 尚未提供，因此不推定或修改。

此檔與 `cwa-weather-worker.js`、`pwa-offline-worker.js` 分開保存，後兩者未變更。

GitHub 更新僅保存來源與說明，不會自動部署到 Cloudflare。本次不需重貼 Webflow Head／Footer 或任何頁面 Embed。

## 驗證

以 Node.js 執行：

```sh
node tests/geo-access-worker.test.mjs
```

測試涵蓋 36 地區、未知／缺少地區、兩種機器人訊號的優先順序、404 標頭、轉送前刪除驗證標頭，以及 POST 內容與原站回應的保留；另按上述順序模擬 Transform Rules，驗證訪客送入的 `1` 被歸零、符合機器人條件時再設為 `1`。這是本機行為驗證，不代表已核對 Cloudflare 實際規則。
