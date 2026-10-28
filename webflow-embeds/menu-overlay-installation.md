# Overlay menu：網站聲明

將 `menu-overlay-full.html` 的完整內容，替換 Webflow 共用選單中 `.mobile-overlay.gw > .menu-icon-items-section` 內原有的 Code Embed，然後發布需要更新的網域。

保留既有 Site Settings 的 App Head、App Footer 與外層 Finsweet `fs-scrolldisable-element="when-visible"` 設定。這次無需修改 Worker 或 Service Worker。

- 「網站聲明」是獨立的一列，位於既有「加入主畫面App／離線資料」工具列下方。
- App 與離線資料按鈕即使較晚載入，也會移至聲明上方；不會新增重複的離線入口。
- 入口及視窗頂端均使用使用者提供的圓形驚嘆號，完整保留向量形狀，並沿用灰階、深淺主題及既有語言設定。原始 SVG 保留於 `webflow-embeds/svg/website-statement-danger.svg`；Embed 直接內嵌圖形，不需額外載入圖片。
- 聲明以已確認的中文版本為準，英文為對應翻譯。
- 原生 dialog 限制焦點於視窗內，支援關閉按鈕、Escape、點擊外部關閉及關閉後焦點回位。視窗內容可獨立捲動。
- GitHub 更新不會自動發布 Webflow；請替換 Embed 並 Publish。

建議發布後確認：手機及電腦的工具列順序、深淺主題、中文／英文聲明，以及 App 模式下的離線入口。
