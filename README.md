# Castle Robotics website (FRC Team 6498)

The source for [castlerobotics.com](https://castlerobotics.com/), built with [Hugo](https://gohugo.io/) and hosted on Cloudflare Pages.

## Editing content

You don't need to know HTML. Almost everything is in plain text files:

| To change… | Edit |
|---|---|
| Sponsors (home page and Our Sponsors) | `data/sponsors.yaml`, logos in `assets/images/sponsors/` |
| Student officers, mentors, board | `content/new-team.md`, photos in `assets/images/team/` |
| Awards (also updates the home page counter) | `content/awards.md`, photos in `assets/images/awards/` |
| Seasons and robots | `content/seasons.md`, images in `assets/images/seasons/` |
| Competition schedule | `content/calendar.md` |
| Home page banner, intro and counters | `content/_index.md` |
| Sponsorship levels | `content/become-a-sponsor.md` |
| Any other page | the matching file in `content/` |
| Address, email, phone, social links, menus | `hugo.toml` |
| PDFs (handbook, safety manual, forms) | `static/files/`, then link to them as `/files/name.pdf` |

Each page file starts with a **front matter** block between `---` lines, which holds structured data such as lists of people, awards and events. The page's Markdown text comes after it. Copy an existing entry and change it, keeping the indentation the same.

### Editing in the browser (no install)

`.pages.yml` sets up [Pages CMS](https://pagescms.org). Sign in there with GitHub, open this repository, and you get forms for sponsors, team, awards, seasons, competitions and every page, including image uploads. Each save commits to GitHub, and Cloudflare redeploys within about a minute.

GitHub's own web editor (press `.` on the repository page) also works for quick text changes.

### Markdown tips

```markdown
## Section heading
Regular paragraph with **bold**, *italic* and a [link](/join-us/).

![Description of the image](images/pages/photo.jpg)          full-width image
![Description of the image](images/brand/logo.png "right")   small image floated right

{{< callout >}}An important highlighted note.{{< /callout >}}
```

Always give images a real description. Screen readers read it aloud, and search engines use it.

### Common tasks

- **Add a sponsor:** put the logo in `assets/images/sponsors/` (a PNG with a transparent background works best), then add a `- name / logo / url` entry to `data/sponsors.yaml`.
- **New season:** add a new entry at the **top** of `seasons:` in `content/seasons.md`, and a new season at the top of `content/awards.md` once the team wins awards.
- **New school year:** update the officers in `content/new-team.md`, replace the handbook PDF in `static/files/` (and its link in `content/forms.md`), and update `content/calendar.md`.
- **Spirit wear order:** upload the PDF to `static/files/` and set `order_form: "/files/your-file.pdf"` in `content/spirit-wear.md`.
- **Home page counters:** set `students:` and `mentors:` under `stats:` in `content/_index.md`. Blank counters are hidden. The awards counter is calculated automatically.

## Running it locally

1. Install Hugo **extended** 0.170 or newer.
2. Run `hugo server`.
3. Open http://localhost:1313. Pages reload as you save.

`hugo --minify` builds the finished site into `public/`.

## Deploying (Cloudflare Pages)

Set up once in the Cloudflare dashboard under **Workers & Pages → Create → Pages → Connect to Git**:

| Setting | Value |
|---|---|
| Framework preset | Hugo |
| Build command | `hugo --minify` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION` = `0.170.1` |

Every push to `main` deploys automatically, and other branches get preview URLs. Then add `castlerobotics.com` under **Custom domains**.

- `static/_redirects` keeps old WordPress links (old PDF links, the `/pdfviewer/` pages and so on) working.
- `static/_headers` sets the security and caching headers.

## Project layout

```
content/        page text and structured page data (Markdown + front matter)
data/           shared data (sponsors)
assets/images/  original images; Hugo resizes them and converts them to WebP automatically
assets/css, js  styles and scripts
layouts/        HTML templates (only needed for design changes)
static/         files copied as-is (PDFs, Cloudflare _redirects/_headers)
hugo.toml       site settings and menus
.pages.yml      Pages CMS editor configuration
```
