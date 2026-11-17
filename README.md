# Sharda University — Ph.D. hero design

Open `index.html` directly in a desktop browser. No install, build, or server is needed.

The header stays at the top while scrolling. Navigation links use 16px medium-weight text, and section links leave room for the sticky header above their destinations.

This local HTML/CSS/JavaScript concept contains a separate white header, a single static laboratory hero banner, a right-side form based on the supplied screenshot, an overlapping research statistics strip, and an Important Notification section. Desktop layout only; minimum canvas width is 1180px.

The original first hero view is retained, using `assets/banner2.webp`. The slideshow, other slides, navigation controls, and rotation logic have been removed.

The research statistics strip counts from zero to its displayed totals over 2.5 seconds when at least 60% of the strip enters the viewport. All five figures animate together, including patents granted. The count repeats after scrolling fully away and returning. Reduced-motion preferences use a shorter 600ms count-up.

The Important Notification section reproduces the July 2026 entrance-test table, both admissions paragraphs, and contact details from the user's screenshot, with the supplied campus photograph. Its colors, typography, and rounded edges match the hero. The header's Important Dates link opens this local section.

The Welcome to Sharda University section follows the notification. It uses the supplied graduation photograph, university introduction, seven institutional statistics, and the university's slogan from the user's reference. Its right-hand column uses compact outlined cards with pastel icon circles, navy figures, and small gold accents, following the user's card reference.

The supercomputer section uses a compact editorial layout: a two-column heading, the complete facility image at the left, and readable research copy with six concise opportunity highlights at the right. Body copy is 16–19px with stronger contrast. A navy expandable facility panel with a gold accent and plus/minus control replaces the old View more link; its label changes when open. Additional computing and healthcare details are split into short, titled paragraphs.

Immediately after Why Ph.D. at Sharda, the Research Across Emerging Domains section follows the supplied reference: a centered two-colour heading, an introductory paragraph adapted to Sharda, and eight rounded cards in four columns and two rows. It preserves the reference's domain order and descriptions, with navy typography and icons, a gold heading accent, and pale blue-grey surfaces. On hover, each card lifts 6px and grows by 2%, turning white with a deeper shadow, soft gold glow, warm gold border, and gold icon. Icons use local SVG symbols.

Beside the Sharda University logo, the supplied NBA, NAAC, and NIRF images rotate automatically every four seconds on a single sliding strip, moving to the right as the next logo enters from the left. A repeated NBA image makes the loop seamless. This header animation uses the same 184 × 57px space as the university logo, clips overflow, and has no scrollbar or visible controls. Image proportions are preserved. The header keeps rotating automatically even when reduced motion is enabled.

The Awards & Achievements section follows the supplied reference: a trophy-led navy introduction at the left and four white recognition cards in a two-by-two grid at the right. It uses the supplied NIRF, Times Engineering, NAAC, and NBA logos, with gold accents and centered content. Its full-width photographic background uses `background-attachment: fixed`, so the cards scroll over a stationary image. Background photograph: [Hümâ H. Yardım on Unsplash](https://unsplash.com/photos/yellow-and-white-bokeh-lights--DwmdT2NRB4), downloaded locally as `assets/awards-bokeh.jpg` and used under the Unsplash License.

Content source: https://admissions.sharda.ac.in/phd/ (17 November 2026). The official page currently states that admissions are closed. Research figures and NAAC accreditation come from that page. Logo and favicon are downloaded from that page's image directory. Banner images were supplied by the user.

The form is a visual prototype. Inputs are editable, but dropdown datasets, applicant registration, and an existing-applicant login integration are not connected. The login link opens the official admissions page. Clicking Apply Now displays the closed status; no personal data is stored or sent. Navigation links point to the relevant official sections.

Files: `index.html`, `styles.css`, `script.js`, and `assets/`.

This is a local desktop prototype; it has not been hosted or optimized for mobile.
