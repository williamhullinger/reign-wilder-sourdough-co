# Reign & Wilder Sourdough Co.

Public client website for Reign & Wilder Sourdough Co., an artisan sourdough bakery serving the Rogersville, Missouri area.

- Live site: [reignandwilder.com](https://reignandwilder.com/)
- Architecture: static HTML, CSS, and JavaScript with Netlify Functions for checkout-related server tasks
- Primary experiences: bakery story, weekly menu and shop, cake-pop builder, sourdough guides and tools, events, reviews, contact, cart, and order confirmation

## Attribution permission

Reign & Wilder Sourdough Co. explicitly approved the visible, normal crawlable footer credit linking to [Hullinger Digital](https://hullingerdigital.com/). The credit records who built the website and is not presented as an independent endorsement.

No traffic, ranking, conversion, order, or revenue result is claimed by this repository. Any future performance claim must be supported by measured evidence and separately approved before publication.

## Shared site components

The shared header and footer live in `components/` and are inserted by `script.js` on most public pages. `reviews.html` currently contains its footer inline, so attribution changes must be kept synchronized there. `order-confirmation.html` loads the same shared footer through its own component loader.

## Attribution release checkpoint

On 2026-08-30, the approved `Website by Hullinger Digital` credit was added to the shared footer and the inline Reviews-page footer. The credit uses a standard same-tab HTML link with no paid-link, sponsored, or hidden-link treatment.
