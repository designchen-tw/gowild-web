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

- `longdong-conditions-widget-v12.js`: Longdong climbing conditions, tide, and roadside cameras; the outer panel is transparent and its inner content aligns with the route facts on desktop and mobile.
- `longdong-cwa-widget-v7.js`: Longdong CWA forecast card; unified section labels and a five-day forecast beginning tomorrow; section titles and mobile content insets are aligned.
- `climbing-conditions-widget-v1.js`: Kenting and Defulan climbing conditions (without tide).
- `weather-card-widget-v3.js`: Shared CWA forecast card layout and data widget for Kenting and Defulan.

Webflow loads these from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-conditions-widget-v12.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-cwa-widget-v7.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/climbing-conditions-widget-v1.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/weather-card-widget-v3.js" defer></script>
```

Longdong uses versioned widget filenames so jsDelivr cannot keep serving an older cached file at a mutable `@main` URL. For a future Longdong widget change, publish the next filename version and update the matching Webflow Embed URLs. Front-end widget changes do not require a Cloudflare Worker deployment.

## Weather API

`cwa-weather-worker.js` is the backend Worker source. It serves only forecast API routes, CORS, and cached responses. Configure `CWA_API_KEY` as a Cloudflare Worker Secret; never add the key to this repository or to a Webflow embed. Deploy Worker changes from Cloudflare when the API/backend itself changes.
