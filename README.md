# GO WILD Webflow source

This public repository stores the Webflow embed source and browser-side weather/camera widgets. It contains no CWA API key.

## Webflow page embeds

- `webflow-embeds/longdong.html`
- `webflow-embeds/kenting.html`
- `webflow-embeds/defulan.html`

Paste an updated embed into the matching Webflow Code Embed and republish when changing page structure or layout.

## Browser-side widgets

- `longdong-conditions-widget.js`: Longdong climbing conditions and the Longdong/Highway 2 camera section.
- `weather-card-widget.js`: CWA forecast card behavior for Kenting and Defulan.

Webflow loads these from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-conditions-widget.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/weather-card-widget.js" defer></script>
```

After changing a widget, update its `.js` file in this repository. Front-end widget changes do not require a Cloudflare Worker deployment; the CDN may take a short time to refresh.

## Weather API

`cwa-weather-worker.js` is the backend Worker source. It serves only forecast API routes, CORS, and cached responses. Configure `CWA_API_KEY` as a Cloudflare Worker Secret; never add the key to this repository or to a Webflow embed. Deploy Worker changes from Cloudflare when the API/backend itself changes.
