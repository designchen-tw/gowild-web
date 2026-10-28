# 龍洞岩場公告卡片與收合輪播

版本：2026.10.28.1。完整替換 `webflow-embeds/longdong.html` 的 Webflow Code Embed，然後 Publish。

- 樣式：`webflow-embeds/longdong-announcements-v2.css`；控制器：`longdong-announcements-v1.js`。兩者使用同一個固定 commit 的 jsDelivr URL。
- 公告為一張細框卡片；三則重點標題使用既有主題綠色（深色 `#A9D9B6`、淺色 `#296744`）。中文／英文內容、日期與手動更新提醒維持原文。
- 預設收合，一次顯示一則，8 秒輪播。保留上一則、下一則、頁碼與「展開全部公告／收合公告」，不提供播放或暫停按鈕。
- 展開顯示全部公告；收合回到目前選取的一則。輪播使用重疊 grid 保留最高消息高度，避免切換時推動下方內容。
- 滑鼠移入、鍵盤焦點進入、頁面隱藏或公告離開視窗時停止計時；離開互動區或重新可見時恢復。減少動態效果偏好下不自動播放，仍可手動切換或展開。
- 控制列上方間距桌機 8px、手機 6px；卡片下方內距桌機 16px、手機 12px；控制按鈕最小高度 32px。
- 單則公告不建立輪播控制；程式載入失敗時，原始三則內容仍會完整顯示。
- 若從已儲存的離線 DOM 還原，控制器重用既有控制列並重新綁定事件，避免重複建立按鈕。已儲存的舊頁面需由使用者更新其離線資料，才會取得新樣式與程式。

這次不修改氣象／地圖控制器、Cloudflare Worker、Service Worker、Webflow Head／Footer。GitHub 更新不會自動發布 Webflow。

手動更新公告時，修改 HTML 中的 `.ld-announcements ol`，同時維護 `data-lang-en`、日期與中文內容；輪播數量由實際消息數自動計算。
