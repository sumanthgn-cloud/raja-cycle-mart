# Raja Cycle Mart Static Site Blueprint

This repo is a clean, AdSense-ready static site for **Raja Cycle Mart**. It includes reusable HTML pages, a single `styles.css`, and a lightweight `site.js` for search, related articles, and contact-form mailto handling.

## 📂 File structure
```text
.
├── index.html
├── about.html
├── services.html
├── contact.html
├── privacy.html
├── disclaimer.html
├── blog/
│   ├── index.html
│   ├── article-template.html
│   └── 10-essential-cycle-maintenance-tips-tumkur.html
├── styles.css
├── site.js
├── posts.json
├── sitemap.xml
└── robots.txt
```

## 🖼️ Images to add later
Copy your photos into `images/` using these names so existing `<img>` references continue to work:

| Original reference | Target filename |
| :--- | :--- |
| `raja-cycle-mart-front-view.webp` | `images/shop.png` |
| `ed96c2f9-132b-4f5b-beba-542c31b0d008.jpeg` | `images/qr.jpeg` |
| `eb6c4aa3-6609-45e5-af65-571ccc5da3ff.png` | `images/shop-alt.png` |
| `778184ab-ff6b-48c7-a51d-17857f7cec37.jpeg` | `images/qr-alt.jpeg` |
| `Screenshot 2025-11-21 124707.png` | `images/shot1.png` |
| `Screenshot 2025-11-21 124722.png` | `images/shot2.png` |
| `Screenshot 2025-11-21 124736.png` | `images/shot3.png` |

> **Note:** Keep file sizes between 80–300 KB and prefer WebP for faster loads.

## 💰 AdSense placeholders
Look for `<!-- ADSENSE: ... -->` comments in HTML. After Google approves your site:

1.  Paste the AdSense async script into each page `<head>`.
2.  Replace placeholder `<div class="ad ...">` blocks with responsive ad unit snippets.
3.  Keep at least **24px spacing** between ads and buttons/links to avoid accidental clicks.

## ✍️ Blog workflow
1.  Add metadata for each article in `posts.json`.
2.  Duplicate `blog/article-template.html`, fill in title/meta placeholders, and place it in `blog/`.
3.  Update `sitemap.xml` with the new URL.
4.  Run `site.js` search/filter client-side (already wired).

## 📧 Contact form behaviour
The form uses a **hidden mailto address**. When users click "Send message," their mail app opens with pre-filled text.
*   **Action:** Update the hidden address by changing `data-mailto` on the `<form>` inside `contact.html`.

## 🚢 Deployment checklist
- [ ] Move large installers (e.g., `CursorSetup-x64-2.0.77.exe`) outside the repo before committing.
- [ ] `git init` → `git add .` → `git commit -m "Initial site"`.
- [ ] `git remote add origin https://github.com/sumanthgn-cloud/raja-cycle-mart.git`.
- [ ] `git push -u origin main`.
- [ ] Enable **GitHub Pages** (Settings → Pages → Deploy from branch → main / root).
- [ ] Update `sitemap.xml` domain and submit it to Google Search Console.
- [ ] After steady traffic, apply for Google AdSense and paste ad code.

## 📝 Need more articles?
One full article is included. Use the outlines referenced in `posts.json`, or ask the AI assistant to "Write all 14 articles" to generate the remaining bodies.
