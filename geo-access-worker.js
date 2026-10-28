export default {
  async fetch(request) {
    // ========================================
    // GO WILD - Geographic Access Control
    // ========================================

    const country = request.cf?.country;

    // Cloudflare verified bot detection
    // Prefer trusted Cloudflare metadata when available.
    // Fallback to the existing Transform Rules header.
    const verifiedBotFromCloudflare =
      request.cf?.botManagement?.verifiedBot;

    const verifiedBotFromHeader =
      request.headers.get("x-gowild-verified-bot") === "1";

    const isVerifiedBot =
      typeof verifiedBotFromCloudflare === "boolean"
        ? verifiedBotFromCloudflare
        : verifiedBotFromHeader;

    // ========================================
    // Allowed Countries and Regions
    // ========================================

    const allowedCountries = new Set([
      // Asia (12)
      "TW", // Taiwan
      "JP", // Japan
      "CN", // China
      "HK", // Hong Kong
      "MO", // Macau
      "SG", // Singapore
      "MY", // Malaysia
      "VN", // Vietnam
      "TH", // Thailand
      "KR", // South Korea - NEW
      "PH", // Philippines - NEW
      "ID", // Indonesia - NEW

      // Oceania (2)
      "AU", // Australia
      "NZ", // New Zealand

      // European Union - Selected 13
      "AT", // Austria
      "BE", // Belgium
      "DK", // Denmark
      "FI", // Finland
      "FR", // France
      "DE", // Germany
      "IE", // Ireland
      "IT", // Italy
      "NL", // Netherlands
      "PL", // Poland
      "PT", // Portugal
      "ES", // Spain
      "SE", // Sweden

      // United Kingdom (1)
      "GB", // United Kingdom

      // Non-EU Europe - Selected 8
      "CH", // Switzerland
      "NO", // Norway
      "IS", // Iceland
      "LI", // Liechtenstein
      "AD", // Andorra
      "MC", // Monaco
      "SM", // San Marino
      "VA"  // Vatican City
    ]);

    // ========================================
    // Geographic Restriction
    // ========================================

    const isAllowedCountry = allowedCountries.has(country);

    // Block unapproved countries,
    // except Cloudflare verified bots.
    if (!isAllowedCountry && !isVerifiedBot) {
      return new Response(
        `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>404 Not Found</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding-top: 120px;
      color: #333;
    }
  </style>
</head>
<body>
  <h1>404 Not Found</h1>
  <p>The page you are looking for could not be found.</p>
</body>
</html>`,
        {
          status: 404,
          headers: {
            "content-type": "text/html; charset=UTF-8",
            "cache-control": "no-store",
            "x-robots-tag": "noindex, nofollow"
          }
        }
      );
    }

    // ========================================
    // Allow Request
    // ========================================

    // Remove internal verification header
    // before forwarding to the origin.
    const forwardedRequest = new Request(request);

    forwardedRequest.headers.delete("x-gowild-verified-bot");

    return fetch(forwardedRequest);
  }
};
