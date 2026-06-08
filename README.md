# North Idaho Technologies — Website

A fast, modern, mobile-responsive marketing site for **North Idaho Technologies**, a North
Idaho technology services company. Built as a static site (HTML, CSS, vanilla JS) —
no build step, no dependencies, hosts anywhere.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The full single-page site (hero, services, refresh, why, about, contact, footer) |
| `styles.css` | Design system + all styling (charcoal / soft white / light gray / forest green) |
| `script.js` | Header scroll state, mobile nav, scroll-reveal animations, contact form |
| `assets/favicon.svg` | Brand mark (North Idaho mountain peak) |
| `robots.txt`, `sitemap.xml` | Basic SEO |

## Viewing locally

Just open `index.html` in a browser. For a local server (recommended so fonts and
fetch behave normally):

```powershell
# Python
python -m http.server 8000
# then visit http://localhost:8000
```

## Before you go live — fill in the real details

A few placeholders are in place. Search the project for each and replace:

1. **Phone number** — `(208) 555-1234` and the `tel:+12085551234` link in `index.html`.
2. **Email address** — `info@northidahotechnologies.com` (appears in `index.html` and `script.js`).
3. **Domain** — `https://www.northidahotechnologies.com/` in the `<link rel="canonical">`,
   Open Graph tags, and `sitemap.xml`.
4. **Contact form delivery** — the form `action` in `index.html` is set to a
   Formspree placeholder: `https://formspree.io/f/your-form-id`.
   - Create a free form at <https://formspree.io>, then paste your real endpoint
     into the `action` attribute. Submissions will then arrive in your inbox with a
     smooth, in-page success message (handled by `script.js`).
   - **Until that's configured**, the form gracefully falls back to opening the
     visitor's email app pre-filled with their request — so it's never a dead end.

## Deploying

This is a static site — drag-and-drop or connect the repo to any of:

- **Netlify** — drag the folder onto the dashboard, or connect the GitHub repo.
  (Netlify Forms can also handle the contact form without Formspree.)
- **Vercel** — import the repo; framework preset = "Other".
- **GitHub Pages** — Settings → Pages → deploy from `main` / root.
- Any traditional web host — upload the files via FTP.

## Design notes

- **Palette:** charcoal black `#15171a`, soft white `#f6f7f6`, light gray `#eceeec`,
  forest green `#2e6b4a`. Defined as CSS custom properties at the top of `styles.css`.
- **Type:** Inter (Google Fonts), with a system-font fallback.
- **Motion:** subtle scroll-reveal via `IntersectionObserver`; respects
  `prefers-reduced-motion`.
- Fully responsive down to small phones; accessible nav, labels, and skip link.
