# GO WILD Webflow widgets

This public repository hosts browser-side weather and camera widgets used by Webflow pages. It contains no CWA API key.

## Widget files

- `longdong-conditions-widget.js`: Longdong climbing conditions and camera section.
- `weather-card-widget.js`: CWA forecast card for Kenting and Defulan.

The pages load these files from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/longdong-conditions-widget.js" defer></script>
<script src="https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@main/weather-card-widget.js" defer></script>
```

## Data service

The scripts request forecast JSON from `https://cwa-weather.designchenme.workers.dev/api/*`. The Cloudflare Worker should keep only the API routes, CWA key secret, CORS, and response cache. Never add the CWA key to this repository or a Webflow embed.

After editing a widget, commit the updated `.js` file here. GitHub CDN propagation may take a short time.
