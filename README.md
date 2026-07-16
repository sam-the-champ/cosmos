# BAVIN PC1155 — Landing Page

## 1. Drop in your media
The page already looks for these exact files. Until they exist, each spot
shows a labeled placeholder (dashed box) instead of a broken image — so you
can preview the whole page before your assets are ready, and everything
lights up automatically the moment you add the real file at the same path.

```
assets/images/hero-product.png        — Hero product shot (transparent/cutout background looks best)
assets/images/gallery-1.jpg           — Front view
assets/images/gallery-2.jpg           — Ports close-up
assets/images/gallery-3.jpg           — Built-in cables extended
assets/images/gallery-4.jpg           — In-hand, for scale
assets/images/gallery-thumb-1.jpg …5.jpg  — Small thumbnails matching the 5 slides
assets/images/video-poster.jpg        — Poster frame for the product video
assets/images/lifestyle-travel.jpg    — Lifestyle: travel/airport
assets/images/lifestyle-work.jpg      — Lifestyle: desk/work
assets/images/review-avatar-1.jpg …3.jpg  — Customer avatars
assets/images/og-cover.jpg            — Social share preview image (1200×630)
assets/images/logo.png                — Logo for structured data
assets/icons/favicon.png              — Browser tab icon
assets/videos/product-demo.mp4        — Product demo video
```

Any filename or extension can be changed — just update the matching `src`
in `index.html`.

## 2. Turn on real integrations (edit `js/config.js` only)
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
