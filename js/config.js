/**
 * config.js
 * ---------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for everything you need to plug in before launch.
 * Edit only this file to go live — every other script reads from here.
 * ---------------------------------------------------------------------------
 */

/* ============ META (FACEBOOK) PIXELS ============
 * Add or remove IDs freely — analytics.js loops over this array and
 * initializes every pixel automatically. Leave the array empty ([]) to
 * disable Meta Pixel entirely (no errors will be thrown).
 */
const FACEBOOK_PIXELS = [
  // "PIXEL_ID_1",
  // "PIXEL_ID_2",
  // "PIXEL_ID_3",
  // "PIXEL_ID_4",
  // "PIXEL_ID_5",
];

/* ============ OTHER ANALYTICS / TRACKING IDS ============
 * Leave any value as an empty string to skip loading that integration.
 */
const ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: "",        // e.g. "G-XXXXXXX"
  GTM_CONTAINER_ID: "",          // e.g. "GTM-XXXXXXX"
  TIKTOK_PIXEL_ID: "",           // e.g. "CXXXXXXXXXXXXXXXXX"
  SNAPCHAT_PIXEL_ID: "",         // e.g. "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
  MICROSOFT_CLARITY_ID: "",      // e.g. "abcd1234"
  HOTJAR_ID: "",                 // e.g. "1234567"
};

/* ============ EMAILJS (form → your inbox, no backend needed) ============
 * 1. Create a free account at https://www.emailjs.com
 * 2. Add an Email Service (Gmail, Outlook, etc.) → copy the Service ID
 * 3. Create an Email Template with variables matching FORM_FIELD_MAP values
 *    below (e.g. {{full_name}}, {{phone}}, {{city}} ...) → copy Template ID
 * 4. Account → General → copy your Public Key
 */
const EMAILJS_CONFIG = {
  PUBLIC_KEY: "YOUR_EMAILJS_PUBLIC_KEY",
  SERVICE_ID: "YOUR_EMAILJS_SERVICE_ID",
  TEMPLATE_ID: "YOUR_EMAILJS_TEMPLATE_ID",
  NOTIFY_EMAIL: "your-email@example.com", // set as the "To" address in your EmailJS template
};

/* ============ WHATSAPP ============ */
const WHATSAPP_CONFIG = {
  NUMBER: "2348000000000", // international format, digits only, no + or spaces
  DEFAULT_MESSAGE: "Hello, I'm interested in the BAVIN PC1155 Power Bank.",
};

/* ============ PRODUCT / BUSINESS INFO (used across the page + schema) ============ */
const PRODUCT_CONFIG = {
  NAME: "BAVIN PC1155",
  BRAND: "BAVIN",
  PRICE: 53300,          // in smallest display unit you use, e.g. Naira
  CURRENCY: "NGN",
  COMPARE_AT_PRICE: 65000,
  SKU: "BAVIN-PC1155-30000",
};

const BUSINESS_CONFIG = {
  PHONE: "+234 800 000 0000",
  EMAIL: "hello@yourstore.com",
  ADDRESS: "Ojodu Berger",
  HOURS: "Mon – Sat, 9:00 AM – 7:00 PM (WAT)",
  SOCIALS: {
    instagram: "https://instagram.com/yourstore",
    facebook: "https://facebook.com/yourstore",
    tiktok: "https://tiktok.com/@yourstore",
  },
  MAPS_EMBED_URL: "", // paste a Google Maps embed src URL here if desired
};
