# Castle Robotics (FRC 6498): WordPress to Hugo Migration Plan

## Status (2026-11-25)

**Decisions:** hosted on Cloudflare Pages; same structure with a cleaner design; known content issues fixed; forms handled later by the board.

| Phase | Status |
|---|---|
| 0 Setup | ✅ Hugo extended 0.170.1 installed in `~/.local/bin`, git repository initialised |
| 1 Capture | ✅ All page content, 47 images and 5 PDFs captured (the public WP REST API was used for media URLs) |
| 2 Conversion | ✅ 15 pages in `content/`, sponsors in `data/sponsors.yaml` |
| 3 Theme | ✅ Custom layouts in `layouts/`, `assets/css/main.css` |
| 4 Interactive | ✅ Counters and mobile menu done. Contact and join forms have placeholders (`form_action`, `form_url`). Search dropped. |
| 5 QA | 🟡 Internal links check clean and desktop/mobile screenshots reviewed. Lighthouse and real-device testing still to do. |
| 6 Deploy | ⬜ Push to GitHub, connect Cloudflare Pages (see README), switch DNS |

**Still needed from the team:** student and mentor counts for the home page, the 2026 spirit-wear order form PDF, and a Google Calendar embed URL if there is one.

## 1. Goal

Rebuild https://castlerobotics.com/ as a static Hugo site that keeps the current content, page structure and URLs. Team members should be able to update it by editing Markdown and YAML files instead of using a WordPress admin. We have no backend or database access, so all content comes from the public site.

## 2. What's on the current site (from a public crawl)

| Area | Pages / notes |
|---|---|
| Global | Top bar (tagline, address, search, social icons), logo, dropdown nav, sticky nav, footer (logo, quick links, "@ Castle Robotics 2022", go-to-top) |
| Home (`/`) | "Knights Home" intro, 4 animated stat counters (they currently render as **0**, which is broken), sponsor logo grid (10 logos) |
| About | `/about-us/` (mission, FIRST mission/vision/competitions, 2 images), `/new-team/` (student officers with photos, mentors, board), `/awards/` |
| Join Us | `/join-us/` |
| Sponsors | `/sponsors/our-sponsors/`, `/sponsors/become-a-sponsor/` (levels), `/become-a-team-sponsor/` |
| Seasons | `/seasons/`: 6 seasons (2021–2027), each with Game Information and Our Robot/Our Season sections plus images |
| Resources | `/calendar/` (competition list plus a calendar widget that may be a plugin), `/team-safety/`, `/forms/` (Google Forms links, handbook PDFs, a `/pdfviewer/` page), `/resources/spirit-wear/`, external FIRST Scholarships link |
| Contact | `/contact-2/`: form (name, email, message), email, phone, address |

**Things to fix while migrating** (confirm each with the team):
- Leftover theme button "Start a project" pointing to `/modern-business/contact/`
- Stat counters show 0
- Calendar event titles say "2026" but have 2027 dates
- "Gaurdian" typo and a wrong hidden title on the Student Officer Application link
- Copyright year is hard-coded to 2022 (Hugo can generate it)
- Generic image alt text (e.g. "65de434f…webp")

## 3. Technical approach

- **Hugo (extended)**: not installed yet. Install it with `sudo dnf install hugo` or from the GitHub release binary.
- **Custom theme**: built in `themes/castle/` (or `layouts/` directly), with no third-party theme. This keeps the look close to the original and avoids learning a theme's quirks.
- **Styling**: plain CSS (or SCSS through Hugo Pipes) with CSS variables for team colours and fonts taken from the live site. No CSS framework is needed.
- **JavaScript**: small vanilla JS for the mobile menu, dropdowns, stat counters and go-to-top. No jQuery.
- **Data-driven content**: sponsors, team members, seasons, competitions, forms links and social links live in `data/*.yaml`. Updating a sponsor or officer then means editing YAML, not HTML.
- **Images**: kept in `assets/images/` and processed with Hugo image processing (resize, WebP, lazy loading).
- **Search**: Pagefind (static, runs at build time), or drop search entirely, since the site is small.
- **Contact form**: needs a third-party endpoint because the site is static. Options are Formspree, Netlify Forms, Web3Forms, or a link to a Google Form.
- **Calendar**: embed a Google Calendar iframe if the team has one, plus a competition list built from `data/competitions.yaml`.
- **PDFs**: stored in `static/files/` and linked directly or shown with the browser's PDF viewer, which replaces the `/pdfviewer/` plugin page.

### Proposed structure
```
castleRobotics/
├── hugo.toml               # site params, menus, social links
├── content/
│   ├── _index.md           # home
│   ├── about-us.md  new-team.md  awards.md  join-us.md
│   ├── sponsors/our-sponsors.md  sponsors/become-a-sponsor.md
│   ├── become-a-team-sponsor.md  seasons.md  calendar.md
│   ├── team-safety.md  forms.md  resources/spirit-wear.md
│   └── contact-2.md
├── data/  sponsors.yaml team.yaml seasons.yaml competitions.yaml forms.yaml stats.yaml
├── layouts/ (_default/baseof, single, list; partials: header, nav, footer, sponsors, counters; shortcodes)
├── assets/ css/ js/ images/
└── static/ files/ (PDFs), favicon
```
URLs are kept the same by setting `url:` in each page's front matter, so existing links and search results still work. Hugo `aliases` handle any URL we decide to clean up (e.g. `/contact-2/` → `/contact/`).

## 4. Phases

### Phase 0: Setup
- Install Hugo extended, run `git init`, scaffold the site and add a `.gitignore`
- Agree on hosting and form service (see open questions)

### Phase 1: Content and asset capture
- The live site's ModSecurity blocks plain `curl`/`wget`, so crawl with browser-like headers (or `wget --mirror` with a browser User-Agent and polite rate limits). Save the raw HTML into a scratch folder outside the repo.
- Download every image and PDF under `/wp-content/uploads/` that the pages reference
- Record the colours, fonts and spacing from the live CSS, and take reference screenshots of each page at desktop and mobile widths
- Try `https://castlerobotics.com/wp-json/wp/v2/pages` and `/wp-json/wp/v2/media`. If the REST API is publicly enabled, it returns clean content and the full media list without any login.

### Phase 2: Content conversion
- Convert each page's HTML to Markdown (pandoc or a small script), then clean it up by hand
- Pull repeated, structured content into `data/*.yaml` (sponsors, team, seasons, competitions, forms)
- Write meaningful image alt text

### Phase 3: Theme and layout
- `baseof.html`, header/top bar, responsive nav with dropdowns, footer
- Page templates: default single page, home, team grid, sponsors grid, seasons timeline, competitions list
- Shortcodes for common blocks (image-with-text, button, quote)
- Mobile-first responsive CSS and an accessible menu (keyboard and ARIA)

### Phase 4: Interactive pieces
- Stat counters (numbers stored in `data/stats.yaml`)
- Contact form wired to the chosen service
- Calendar embed and search (if kept)

### Phase 5: QA
- Compare each page side by side with the reference screenshots
- Check links with `htmltest` or `lychee`, confirm all old URLs resolve, check images and PDFs
- Lighthouse audit (performance, accessibility, SEO) and a mobile test
- SEO: titles and descriptions, Open Graph tags, `sitemap.xml`, `robots.txt`, favicon

### Phase 6: Deployment and cutover
- Push to a GitHub repo, then set up CI deploys to Netlify, Cloudflare Pages or GitHub Pages
- Test on the host's preview URL, then switch the domain's DNS. This needs whoever controls the domain registrar.
- Keep the WordPress site running until DNS has propagated and the new site is verified
- Write a short `README.md` explaining how to add a sponsor, update the team, add a season and run the site locally

## 5. Open questions for you
1. **Hosting**: Netlify, Cloudflare Pages or GitHub Pages? Who controls the domain DNS?
2. **Design**: a pixel-close replica, or the same structure with a cleaned-up modern look?
3. **Contact form**: which service, and which inbox receives submissions (castlerobotics6498@…)?
4. **Calendar**: is there a Google Calendar to embed, or just the competition list?
5. **Search**: keep it (Pagefind) or drop it?
6. **Fixes**: should the issues in section 2 be fixed during migration or reproduced exactly?
7. **Permission**: confirm you're working on behalf of the team, since this is their site and branding.

## 6. Rough effort
| Phase | Estimate |
|---|---|
| 0–1 Setup and capture | 0.5 day |
| 2 Content conversion | 1 day |
| 3 Theme and layout | 1.5–2 days |
| 4 Interactive pieces | 0.5 day |
| 5 QA | 0.5 day |
| 6 Deploy and cutover | 0.5 day (plus DNS wait) |
