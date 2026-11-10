# LUMEN: studio website

A premium 3D marketing site for a web/ads studio. Built with **Vite + React + Three.js (react-three-fiber) + GSAP + Lenis**, with a **MongoDB** backend on Vercel serverless functions. Georgian and English.

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
| Scroll-driven 3D background world | `src/three/ScrollWorld.jsx` |
| Services 3D stage | `src/three/ServicesScene.jsx` |
| Ads section, text band | `src/components/Ads.jsx`, `Marquee.jsx` |
| Backend API (MongoDB) | `api/` |
| Studio inbox at `/admin` | `admin.html`, `src/admin/` |

## Backend
Vercel runs everything in `api/` as serverless functions. `npm run dev` serves the same files locally.

| Endpoint | What it does |
|---|---|
| `POST /api/inquiries` | Saves a contact request. Validates fields, recomputes the estimate on the server, ignores bots (hidden field), allows 5 requests per 10 minutes per visitor |
| `GET /api/inquiries` | Lists requests (admin token) |
| `PATCH / DELETE /api/inquiries/:id` | Changes status (new, contacted, won, lost), saves a private note, or deletes (admin token) |
| `POST /api/estimates` | Anonymous record of what someone priced (no personal data) |
| `GET /api/estimates` | Summary: how many estimates, average, most priced project and feature (admin token) |
| `GET /api/health` | Checks the database connection |

Collections in the `lumen` database: `inquiries`, `estimates`. Indexes are created automatically.

**Connect the database**
1. In MongoDB Atlas, create a free cluster and a database user, then copy the connection string (Connect → Drivers).
2. In Atlas → Network Access, allow `0.0.0.0/0`, because Vercel has no fixed IP address.
3. In Vercel → lumen-studio → Settings → Environment Variables, add `MONGODB_URI`, `MONGODB_DB=lumen` and a long random `ADMIN_TOKEN`. Redeploy.
4. For local development, put the same keys in `.env.local` (see `.env.example`; it is git-ignored).
5. Open `/admin` and enter your `ADMIN_TOKEN` to see requests.

Until `MONGODB_URI` is set, the API answers 503 and the contact form falls back to Formspree (if `VITE_FORM_ENDPOINT` is set) or the visitor's email app, so the site never loses a request.

## Before going live, replace these placeholders
- **Name:** "LUMEN" appears in `src/i18n.jsx`, `index.html`, `Nav.jsx`, `Footer.jsx` and the 3D wordmark in `HeroScene.jsx`
- **Email and city:** `STUDIO` in `src/components/Contact.jsx`
- **Prices:** `src/data.js` (`TYPES`, `FEATURES`, `PER_PAGE`, `CARE`, template prices) and the "from $…" lines in `src/i18n.jsx`
- **FAQ policies** (payment terms, timelines) in `src/i18n.jsx`
- **The contact form:** create a free form at formspree.io, then add a `.env` file containing
  `VITE_FORM_ENDPOINT=https://formspree.io/f/your-id`.
  Without it, the form opens the visitor's email app instead.
