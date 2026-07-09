# Md. Tanvir Islam Riyad — Portfolio

A bold **white × red × black** editorial portfolio, built with **HTML5, CSS3, and vanilla JavaScript** — no build step, no framework.

![status](https://img.shields.io/badge/status-live-ff2d2d) ![tech](https://img.shields.io/badge/tech-HTML%20%7C%20CSS%20%7C%20JS-111)

## ✨ Features

- **Light / Dark theme toggle** (remembered) — black bg in dark, white bg with a black frame margin in light
- **Smooth scrolling** (Lenis) with smooth anchor jumps
- **Custom cursor** (dot + lerp-follow ring that reacts to hover)
- **Mouse parallax** — multi-layer depth on background + hero (`data-parallax`)
- **Magnetic** buttons / icons + **3D tilt** cards (`data-tilt`)
- **Live GitHub activity** — real repos, languages & contribution graph from your account
- Kinetic hero headline, scroll-reveal, animated counters & bars
- Infinite **marquee** ticker, vertical social rail
- **SEO 100/100** (Lighthouse) — meta + Open Graph + Twitter + JSON-LD + sitemap/robots
- Fully responsive, `prefers-reduced-motion` aware

## 🎨 Type & icons

| Role | Font | Source |
|------|------|--------|
| Display / headings | **Bebas Neue** | Google Fonts |
| Body / UI | **Chillax** | Fontshare |
| Numbers / accents | **Bitcount** | Google Fonts |

> The requested **Aalto Display, Galgo Condensed, HUMANE, OffBit** are paid/Gumroad fonts with no public CDN. Bebas Neue stands in as the tall-condensed display face. To use a purchased font: drop the `.woff2` files into `assets/fonts/`, add an `@font-face` block at the top of `css/style.css`, and swap `--font-display`.

**Icons:** [Phosphor](https://phosphoricons.com) *light* weight (free, MIT) — the closest match to Streamline-light, whose own SVGs are license-gated. Social icons use Phosphor's brand logos.

## 📁 Structure

```
RYD/
├── index.html
├── css/style.css      # theme tokens, layout, animations
├── js/main.js         # cursor, parallax, tilt, magnetic, theme, form
└── assets/
    └── profile.jpg    # ← add your portrait (see assets/README.txt)
```

## 🚀 Run it

Open `index.html` in a browser. For live reload: `python -m http.server 5500` (or VS Code Live Server).

## 🔧 Customize

| What | Where |
|------|-------|
| Your photo | `assets/profile.jpg` |
| Accent red / colors | `:root` + `[data-theme]` blocks in `css/style.css` |
| Live GitHub user | `GITHUB_USERNAME` at top of `js/main.js` (currently `Riyad6950`) |
| Social links | already set (GitHub, LinkedIn, Instagram, X, Facebook, WhatsApp) |
| Text | `index.html` |

> **SEO/hosting note:** canonical URL, Open Graph, Twitter, JSON-LD and `sitemap.xml`
> all use the placeholder `https://riyad6950.github.io/`. If you host on a different
> domain, find-and-replace that URL. The **X (Twitter)** link is just `https://x.com/`
> — add your handle when you have one.

## 📬 Contact

**Md. Tanvir Islam Riyad** · Frontend Developer · Cyberjaya, Malaysia
📧 10vir69@gmail.com · 💬 WhatsApp +60 11-1277 8527

---

© 2026 Md. Tanvir Islam Riyad. All Rights Reserved.
