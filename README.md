# Sharda University — Ph.D. hero design

Open `index.html` directly in a desktop browser. No install, build, or server is needed.

The header stays at the top while scrolling. Navigation links use 16px medium-weight text, and section links leave room for the sticky header above their destinations.

This local HTML/CSS/JavaScript concept contains a separate white header, a three-image hero slideshow, a right-side form based on the supplied screenshot, an overlapping research statistics strip, and an Important Notification section. Desktop layout only; minimum canvas width is 1180px.

The hero opens on the laboratory photo (`assets/banner2.webp`). The left and right arrows cycle through all three banners on demand, and the hero buttons and application form stay in place.

The research statistics strip counts from zero to its displayed totals over 2.5 seconds when at least 60% of the strip enters the viewport. All five figures animate together, including patents granted. The count repeats after scrolling fully away and returning. Reduced-motion preferences use a shorter 600ms count-up.

The Important Notification section reproduces the July 2026 entrance-test table, both admissions paragraphs, and contact details from the user's screenshot, with the supplied campus photograph. Its colors, typography, and rounded edges match the hero. The header's Important Dates link opens this local section.

The Welcome to Sharda University section follows the notification. It uses the supplied graduation photograph, university introduction, seven institutional statistics, and the university's slogan from the user's reference. Its right-hand column uses a compact navy grid with a staggered entrance and hover highlights.

The supercomputing section pairs the full facility graphic with six research opportunities in a compact card grid and expandable facility details.

Beside the Sharda University logo, the supplied NBA, NAAC, and NIRF images rotate automatically every four seconds on a single sliding strip, moving to the right as the next logo enters from the left. A repeated NBA image makes the loop seamless. This header animation uses the same 184 × 57px space as the university logo, clips overflow, and has no scrollbar or visible controls. Image proportions are preserved. The header keeps rotating automatically even when reduced motion is enabled.

Awards & Achievements shares its heading, introductory typography, and desktop section height with Global Tie-Ups. The rankings and accreditations appear in one panel, with the original NIRF, Times Engineering, NAAC, and NBA logos paired with their results. The backdrop uses a trophy photograph by Engin Akyurt, stored locally as `assets/awards-trophy-dark.jpg`. [Pexels](https://www.pexels.com/photo/standing-man-figurine-2098604/)

Content source: https://admissions.sharda.ac.in/phd/ (17 November 2026). The official page currently states that admissions are closed. Research figures and NAAC accreditation come from that page. Logo and favicon are downloaded from that page's image directory. Banner images were supplied by the user.

The form is a visual prototype. Inputs are editable, but dropdown datasets, applicant registration, and an existing-applicant login integration are not connected. The login link opens the official admissions page. Clicking Apply Now displays the closed status; no personal data is stored or sent. Navigation links point to the relevant official sections.

Files: `index.html`, `styles.css`, `script.js`, and `assets/`.

This is a local desktop prototype; it has not been hosted or optimized for mobile.
