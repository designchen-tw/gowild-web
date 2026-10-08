# GO WILD Webflow source

This public repository stores the Webflow embed source and browser-side weather/camera widgets. It contains no CWA API key.

## Webflow page embeds

- `webflow-embeds/longdong.html`
- `webflow-embeds/kenting.html`
- `webflow-embeds/defulan.html`
- `webflow-embeds/menu-overlay-full.html`: paste into a Code Embed inside the existing Navbar overlay. It replaces the overlay menu contents, keeps page groups collapsed until clicked, and can be opened directly in a browser for a local preview.

Paste an updated embed into the matching Webflow Code Embed and republish when changing page structure or layout.
For the shared menu, keep `fs-scrolldisable-element="when-visible"` on the existing `.mobile-overlay.gw` element. The menu Embed only controls its own layout.

## Browser-side widgets

- `longdong-rock-estimate-v1.js`: Longdong rock-surface condition rules and Chinese/English labels.
- `longdong-conditions-widget-v17.js`: Longdong climbing conditions, tide, and roadside cameras; the rock condition uses the estimator above.
- `longdong-cwa-widget-v12.js`: Longdong CWA forecast card.
- `climbing-conditions-widget-v1.js`: Kenting and Defulan climbing conditions (without tide).
- `weather-card-widget-v3.js`: Shared CWA forecast card layout and data widget for Kenting and Defulan.

Webflow loads these from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-rock-estimate-v1.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-conditions-widget-v17.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-cwa-widget-v12.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/climbing-conditions-widget-v1.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/weather-card-widget-v3.js" defer></script>
```

Longdong uses versioned widget filenames so jsDelivr cannot keep serving an older cached file at a mutable `@main` URL. For a future Longdong widget change, publish the next filename version and update the matching Webflow Embed URLs. Front-end widget changes do not require a Cloudflare Worker deployment.

## Weather API

`cwa-weather-worker.js` is the backend Worker source. It serves forecast and observation API routes, CORS, cached responses, and an optional Longdong observation history. Configure `CWA_API_KEY` as a Cloudflare Worker Secret; never add the key to this repository or to a Webflow embed. Deploy Worker changes from Cloudflare when the API/backend itself changes.

To enable the three-hour wind average and the multi-day heat signal used by the Longdong rock estimate:

1. Create a Cloudflare KV namespace, then add a **KV namespace binding** named exactly `CONDITIONS_HISTORY` to the existing weather Worker. It is a binding, not a text secret.
2. Add a Cron Trigger of `15 * * * *` (15 minutes past every hour) to the same Worker. The scheduled handler records Bitou Cape observations without relying on page visits.
3. Deploy the updated Worker, publish the three browser-side files above, replace the Longdong Webflow Embed with `webflow-embeds/longdong.html`, and republish Webflow.

The wind average appears after roughly three hours of observations; the multi-day heat signal needs two previous hot days. Until enough history exists, the estimator avoids the `極乾` and `出油` states. Rainfall-only states continue to work without KV. These labels are weather-derived risk signals, not a measurement of rock moisture, salinity, seepage, or wave spray.
