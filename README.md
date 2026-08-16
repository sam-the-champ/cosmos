# BAVIN PC1155 — Landing Page

Any filename or extension can be changed — just update the matching `src`
in `index.html`.

## 1. Turn on real integrations (edit `js/config.js` only)
- **Meta Pixels** — add IDs to the `FACEBOOK_PIXELS` array (works with 1–5+ pixels).
- **GA4 / GTM / TikTok / Snapchat / Clarity / Hotjar** — fill in `ANALYTICS_CONFIG`.
- **EmailJS** (sends the order form to your inbox, no backend required):
  1. Create a free account at https://www.emailjs.com
  2. Add an Email Service → copy the **Service ID**
  3. Create a Template with variables: `full_name`, `phone`, `whatsapp`, `email`,
     `address`, `city`, `state`, `quantity`, `instructions`, `payment_preference`,
     `product`, `to_email` → copy the **Template ID**
  4. Copy your **Public Key** from Account → General
  5. Paste all three into `EMAILJS_CONFIG` in `js/config.js`
  - Until this is filled in, the form still validates and redirects to the
    thank-you page (useful for testing), it just won't email you.
- **WhatsApp** — set your number (digits only, country code, no `+`) in `WHATSAPP_CONFIG`.
- **Price / product / business info** — `PRODUCT_CONFIG` and `BUSINESS_CONFIG`.

## 3. File structure
```
index.html
thank-you.html
css/ styles.css · animations.css · responsive.css
js/  config.js · analytics.js · main.js · gallery.js · form.js
assets/ images/ videos/ icons/ fonts/
```

## 4. Notes
- No frameworks — hand-written HTML5, CSS3, and vanilla JS.
- Dark mode is the default; a theme toggle in the nav switches to light.
- `prefers-reduced-motion` is respected throughout.
- The signature "charge bar" motif (hero + section dividers) visualizes the
  30,000mAh capacity as the page loads and as you scroll.
- Exit-intent and "recently purchased" popups were intentionally left out —
  they're easy to bolt on later, but they cut against the calm, premium feel
  this page is going for. Say the word if you'd like either added.
