# LUMEN: studio website

A premium 3D marketing site for a web/ads studio. Built with **Vite + React + Three.js (react-three-fiber) + GSAP + Lenis**. Georgian and English.

## Run it in VS Code
1. Open this folder in VS Code (`File → Open Folder → lumen-studio`)
2. Open the terminal (`Ctrl + ~`)
3. `npm install` (first time only)
4. `npm run dev`, then open http://localhost:5173

Build for hosting: `npm run build`. The finished site goes to `dist/`, which you can upload to Netlify, Vercel or any host.

## What's inside
| Section | File |
|---|---|
| 3D hero (glass diamond refracting the LUMEN wordmark, follows the mouse) | `src/three/HeroScene.jsx`, `Gem.jsx`, `Studio.jsx` |
| Idea gallery (horizontal scroll, filters, full preview) | `src/components/Ideas.jsx`, `Mock.jsx` |
| Services list | `src/components/Services.jsx` |
| Package builder with live price | `src/components/Builder.jsx` |
| Process, FAQ | `src/components/Process.jsx`, `Faq.jsx` |
| Contact with 3D gems | `src/components/Contact.jsx`, `src/three/CtaScene.jsx` |
| All text (English + Georgian) | `src/i18n.jsx` |
| Site styles, prices, features | `src/data.js` |
| Colors, fonts, spacing | `src/styles/global.css` (top of file) |

## Before going live, replace these placeholders
- **Name:** "LUMEN" appears in `src/i18n.jsx`, `index.html`, `Nav.jsx`, `Footer.jsx` and the 3D wordmark in `HeroScene.jsx`
- **Email and city:** `STUDIO` in `src/components/Contact.jsx`
- **Prices:** `src/data.js` (`TYPES`, `FEATURES`, `PER_PAGE`, `CARE`, template prices) and the "from $…" lines in `src/i18n.jsx`
- **FAQ policies** (payment terms, timelines) in `src/i18n.jsx`
- **The contact form:** create a free form at formspree.io, then add a `.env` file containing
  `VITE_FORM_ENDPOINT=https://formspree.io/f/your-id`.
  Without it, the form opens the visitor's email app instead.
