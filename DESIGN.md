---
name: LUMEN
description: A lit stage where one faceted crystal splits light across the studio's name.
colors:
  ink: "#0b0b0c"
  ink-2: "#121213"
  ink-3: "#1a1a1b"
  bone: "#edebe6"
  stone: "#9b978f"
  flare: "#ff5a1f"
  flare-dim: "rgba(255, 90, 31, 0.14)"
  line: "rgba(237, 235, 230, 0.14)"
  line-2: "rgba(237, 235, 230, 0.28)"
  danger: "#ff8a7a"
  ok: "#b9e3a5"
typography:
  display:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, min(7.4vw, 10.5vh), 6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.04em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.1rem, 4.8vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 112"
  index:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 4.2vw, 3.6rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  statement:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 4.1vw, 3.6rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 105"
  figure:
    fontFamily: "Archivo Variable, ui-sans-serif, sans-serif"
    fontSize: "clamp(3rem, 5.5vw, 4.75rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.045em"
    fontFeature: "'tnum' 1"
    fontVariation: "'wdth' 118"
  title:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 1.6vw, 1.5rem)"
    fontWeight: 600
    letterSpacing: "-0.01em"
  lead:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.06rem, 1.25vw, 1.25rem)"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    fontVariation: "'wdth' 100"
  label:
    fontFamily: "Archivo Variable, Noto Sans Georgian Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.6
  wordmark-3d:
    fontFamily: "Archivo Expanded Black"
    fontWeight: 900
    letterSpacing: "-0.02em"
rounded:
  focus: "4px"
  tile: "14px"
  panel: "22px"
  pill: "999px"
spacing:
  gutter: "max(20px, 4vw)"
  max: "1440px"
  chip-gap: "8px"
  stack: "22px"
  field: "44px"
  head-to-content: "clamp(48px, 6vw, 80px)"
  section: "clamp(120px, 16vw, 200px)"
components:
  button-bone:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "0 28px"
    height: "56px"
  button-line-hover:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  button-sm:
    rounded: "{rounded.pill}"
    padding: "0 18px"
    height: "42px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.stone}"
    rounded: "{rounded.pill}"
    padding: "0 16px"
    height: "38px"
  chip-selected:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  index-row:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    typography: "{typography.index}"
    padding: "clamp(22px, 3vw, 36px) 0"
  index-row-hover:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
  receipt:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.bone}"
    rounded: "{rounded.panel}"
    padding: "clamp(24px, 3vw, 36px)"
  feature-tile:
    backgroundColor: "transparent"
    rounded: "{rounded.tile}"
    padding: "14px 16px"
  feature-tile-checked:
    backgroundColor: "{colors.ink-2}"
  text-field:
    backgroundColor: "transparent"
    textColor: "{colors.bone}"
    rounded: "0"
    padding: "14px 0"
  idea-mock:
    rounded: "{rounded.tile}"
    width: "clamp(280px, min(34vw, 52svh), 540px)"
---

# Design System: LUMEN

## Overview

**Creative North Star: "The Lit Stage"**

LUMEN is a dark studio with one light source. The ground is ink, the type is bone, everything secondary is warm stone, and one signal colour, flare orange, marks the next action and what the visitor has chosen. The same orange enters the 3D as a single warm light, so the diamond's glints and the buttons belong to one system. No gradients in the UI, no cards standing in for structure. Hairline rules and very large, wide Archivo carry the hierarchy.

Density is low and the scale is theatrical. Headlines run wide (variable width axis 112 to 125) and tightly tracked, sections are separated by 120 to 200px of ink, and lists are typographic index rows that invert to bone on hover. Motion is one grammar everywhere: expo-out, line-masked reveals, and wipes driven by clip-path.

**Key Characteristics:**
- Ink, bone and stone, plus flare for action and selection only.
- Wide Archivo display, set tight; Noto Sans Georgian set looser and calmer.
- Bone pill buttons and pill chips; hairline rules instead of containers.
- Expo-out everywhere: line reveals, fill wipes, row wipes.
- 3D carries the page: a scroll-driven background world (a tunnel of dark glinting crystals, light rings and dust the camera travels down, behind a veil that keeps copy legible), a brilliant-cut diamond over the wordmark, a sticky stage in Services (glass pane, glass knot, ad stack), and a gem cluster at the close.

## Colors

A warm-neutral palette on ink with one signal colour.

### Primary
- **Bone** (`bone`): all primary type, secondary filled buttons (Next), the selected chip, language and segment states, and the slider thumb.
- **Flare** (`flare`): primary calls to action (Get a price, Send, Add to estimate), selected radios, checkboxes, switches, the range fill, step progress, the active nav dot, focus rings, selection and the caret. Text on flare is ink (about 6.6:1). `flare-dim` tints a selected feature tile.

### Neutral
- **Ink** (`ink`): page ground, the 3D canvas clear colour, the loader, the menu and preview overlays, and the text on bone fills.
- **Ink Raised** (`ink-2`): the receipt panel and checked feature tiles; the only raised surface tone.
- **Ink Deep Mark** (`ink-3`): fill of the outlined footer wordmark.
- **Warm Stone** (`stone`): secondary copy, leads, meta, labels, unselected chips and nav links.
- **Hairline** (`line`): section rules, index-row dividers, the receipt and feature-tile borders.
- **Hairline Strong** (`line-2`): pill outlines (chips, line button, language switch, segments), input underlines, the dashed receipt rules, and the slider track.

### Status
- **Coral** (`danger`) and **Sage** (`ok`): form validation and submit status only. They never appear as decoration.

Inside an inverted index row, the description drops to a dark stone (#47453f) so it stays legible on bone. The bone pill's hover fill is pure white (#ffffff). Both are local to their component.

### Named Rules
**The One-Signal Rule.** Flare means "act here" or "you chose this". It never decorates headings, backgrounds or illustrations; if a surface needs more colour, it gets it from the 3D glass.

**The Borrowed Palette Rule.** Idea mocks render each template's own palette (`--m-bg`, `--m-fg`, `--m-accent`, `--m-soft`, `--m-art`). Those colours belong to the mock and never leak into LUMEN's chrome.

## Typography

**Display and Body Font:** Archivo Variable (self-hosted via @fontsource-variable), using its width axis.
**Georgian Font:** Noto Sans Georgian Variable (self-hosted), second in the same stack, so Georgian glyphs fall through to it automatically.
**3D Wordmark Font:** Archivo Expanded Black (`public/fonts/ArchivoExpanded-Black.ttf`, OFL), used only by the hero's troika `Text` wordmark.

**Character:** One family doing everything. Width does the emotional work: body text stays at `wdth` 100 while headlines widen to 112 to 125, so the display voice reads stretched and architectural without a second face.

### Hierarchy
- **Display** (`display`): the hero h1, set in two lines with `mix-blend-mode: difference` so it inverts over the bone wordmark. The contact display is a sibling (800 weight, `wdth` 120, clamp(3rem, 9vw, 6rem)), with its second line dimmed to stone.
- **Headline** (`headline`): every section h2 (`.h2`), balanced, capped at 18ch.
- **Index** (`index`): service row names.
- **Statement** (`statement`): the manifesto paragraph. Words scrub from 0.22 to 1 opacity as it passes the reading line.
- **Figure** (`figure`): the live estimate total. Tabular numerals.
- **Title** (`title`): fieldset legends in the builder. Process step titles and FAQ summaries sit in the same band (1.1 to 2rem, 600 to 700 weight).
- **Lead** (`lead`): section intros in stone, capped at 46ch.
- **Body** (`body`): running copy at 1rem/1.6.
- **Label** (`label`): hints, meta, field labels, footer legal. Prices always use `font-variant-numeric: tabular-nums`.
- **Mark sizes**: the loader counter (800, `wdth` 125, up to 15rem) and the outlined footer wordmark (800, `wdth` 125, 20.5vw, 1px `line-2` stroke on `ink-3`).

### Named Rules
**The Georgian Rule.** `:lang(ka)` is a first-class setting, not a fallback. Body line-height rises to 1.7. Display, headline, index and statement sizes step down (hero clamp(2rem, min(4.6vw, 8svh), 4rem), contact display clamp(2.2rem, 6vw, 4.6rem), service names clamp(1.6rem, 3.4vw, 2.8rem), manifesto clamp(1.5rem, 3.3vw, 2.9rem)). Tracking relaxes to -0.01em (the manifesto goes to 0), and line-height opens to 1.1 to 1.3. Never carry Latin's -0.04em tracking onto Mkhedruli.

**The Sentence-Case Rule.** LUMEN's own UI is never uppercased or letter-spaced for effect. The only wide tracking is the nav brand (0.14em, 800, `wdth` 125). Uppercase appears only inside mocks, as part of a template's look.

## Layout

A single 1440px column (`max`) with a fluid gutter of max(20px, 4vw), applied by `.wrap`. Sections are separated by clamp(120px, 16vw, 200px) of ink, with clamp(48px, 6vw, 80px) between a section heading and its content. Section heads are two-column grids (1.15fr / 1fr, 24px by 64px gaps) with the h2 on the left and the lead or controls bottom-aligned on the right. They collapse to one column below 900 to 960px.

- **Hero:** a 165svh `.hero-track` pins a 100svh sticky stage. Scroll progress `--p` (0 to 1) drives the scene. Copy sits bottom-left and fades out between p 0.52 and 0.72. A 140px ink gradient at the stage's foot hands off to the next section.
- **Ideas reel:** on desktop (900px and up, motion allowed) a pinned section turns vertical scroll into horizontal travel (scrub 0.8). Below 900px it becomes a native horizontal scroller with mandatory snap and the scrollbar hidden.
- **Builder:** form 1.5fr against a sticky receipt minmax(320px, 1fr), with the receipt at `top: 96px`. Stacks below 960px.
- **Process:** a 4-up grid under a scrubbed progress rule; 2-up below 900px, 1-up below 520px.
- **Nav:** a fixed 3-column grid (brand, centred links, end controls). It turns solid on scroll and collapses to a full-screen menu below 1080px.

Breakpoints in use: 520, 560, 760, 860, 900, 960 and 1080px.

## Elevation & Depth

Depth comes from the 3D stage and from tonal steps (ink to ink-2), not from a shadow system. The UI is flat. Only two surfaces lift, both with long, soft, negative-spread drops that read as a pool of shadow rather than a glow. The fixed chrome (the solid nav and the preview close button) uses ink at 0.7 opacity with a backdrop blur, purely to keep text legible over moving content.

### Shadow Vocabulary
- **Mock drop** (`0 30px 60px -30px rgba(0,0,0,.8)`): idea mocks.
- **Panel drop** (`0 40px 80px -40px rgba(0,0,0,.9)`): the receipt.

### 3D Material Recipe
- **Crystal geometry:** a brilliant-cut silhouette lathed from five profile points with only 10 to 12 segments, then made non-indexed so every facet gets flat shading.
- **Glass:** drei `MeshTransmissionMaterial` with transmission 1, thickness 0.75, roughness 0.02, ior 1.55, chromaticAberration 0.9, anisotropicBlur 0.12, distortion 0.15 / scale 0.4 / temporal 0.05, clearcoat 1, backside with backsideThickness 0.35, envMapIntensity 1.6, attenuationDistance 2.4, and white colour/attenuation. The refraction background is a lifted smoke (#2a2a2d), so internal facets read as smoky glass rather than holes. Quality: high is 10 samples at 768, low (mobile, CTA) is 6 samples at 512.
- **Light:** no HDR download. A local `Environment` (resolution 256, rendered once) holds five white rect Lightformers (a top softbox at 6, a floor bounce at 3, and three long strips at 2) plus two ring Lightformers, one warm (#ffd9b0) and one cool (#c7d8ff), both at 3. The warm/cool rings are where the spectral edges come from.
- **Stage:** camera at z 6, fov 35, clear colour `ink`. The wordmark is bone and untoned (`toneMapped: false`) at z -1.6, fitted to 88% of the frame width (90% on mobile). The CTA scene adds four thin untoned bone light bars behind a three-gem cluster so refraction splits them into spectra.

### Named Rules
**The One Light Rule.** Colour on the page is earned optically: bone light bars, a bone wordmark and white softboxes, split by glass. Never fake dispersion with CSS gradients in the chrome.

## Shapes

Two shapes do almost everything: the full pill (999px) for every control (buttons, chips, the language switch, segments, the switch track, preview feature tags, the legend counter) and the straight hairline for structure. Containers are rare and softly rounded: 14px for mocks and feature tiles, 18px for the enlarged mock, 22px for the receipt (mocks also ease to 22px on hover). Inputs have no box at all, only an underline. Radio dots and the cursor ring are circles. The checkbox is a 5px-rounded square with an authored SVG tick. Icons are authored inline SVG at a 1.8 stroke with round caps (arrow, close, the rhombus-and-horizon brand mark, which the favicon repeats).

## Components

### Buttons
Bone pills that fill from below.
- **Shape:** full pill (999px), 56px tall (`--h`), 28px side padding, 600 weight. The small size is 42px tall with 18px padding; the hero on mobile uses 50px with 22px.
- **Bone (primary):** bone fill, ink text. On hover a white layer wipes up from translateY(101%) to 0 over 0.6s expo-out, and the trailing arrow nudges 4px right.
- **Line (secondary):** a `line-2` outline with bone text. On hover a bone layer wipes up and the text turns ink.
- **Active / Disabled:** scale(.98) on press; 0.55 opacity with a progress cursor while disabled.
- **Focus:** the global 1.5px bone outline at a 4px offset.

### Chips
- **Style:** 38px pills with a `line-2` outline, stone text at 0.9rem / 500, and 8px gaps.
- **State:** hover turns text and border bone. `aria-pressed="true"` fills bone with ink text. Chips serve both as filters (ideas) and as one-shot actions (builder quick-start packages).

### Index Rows
The site's answer to cards.
- **Structure:** a three-column grid (name 1.3fr, description 1fr, price auto) between `line` hairlines. Names use `index` type, descriptions are stone (max 42ch), prices use tabular numerals.
- **Hover (hover-capable devices only):** a bone wash wipes up by clip-path from the row's foot over 0.7s and extends into the gutters. The name slides 16px right and turns ink.
- **Siblings:** builder type rows (radio dot, name, meta, price, which indent 12px on hover), FAQ `details` rows (a plus that rotates to minus, with the answer rising 6px), and process steps (stone tabular step number, 2rem title).

### Receipt
- **Panel:** `ink-2` with a `line` border, 22px radius, the panel drop shadow, sticky at 96px.
- **Content:** a stone label, an optional style pill, the `figure` total, a stone delivery meta line, line items between dashed `line-2` rules (stone names, bone tabular prices), a full-width bone button, and a centred hint. It is announced with `aria-live="polite"`.

### Inputs / Fields
- **Text fields:** no box. Transparent background, 14px vertical padding, a 1px `line-2` underline, and a stone label above (0.88rem). The textarea starts at 150px tall.
- **Focus:** the underline turns bone; the outline is suppressed in favour of the underline.
- **Error:** `aria-invalid` turns the underline `danger`; the status line uses `danger` or `ok`.
- **Builder controls:** a 2px slider track filled in bone up to `--fill` with a 22px bone thumb (scales 1.25 when active); 14px-radius feature tiles that check to a bone border on `ink-2`; a pill segment control; and a 48 by 28px switch that fills bone with an ink knob. Hidden native inputs carry a 1.5px bone focus ring on their visual proxy.

### Navigation
- **Bar:** fixed, transparent over the hero, then `ink` at 0.72 opacity with a 14px blur once scrolled, while padding tightens from 18 to 12px. Links are stone pills (0.92rem) that turn bone on hover.
- **Language switch:** a `line-2` pill holding two 32px pill buttons. The active one is bone with ink text.
- **Mobile (below 1080px):** a 44px circular menu button whose two bars cross into an X. A full-screen ink menu lists large `wdth` 112 links that rise in with a 50ms stagger.

### Reel and Idea Mock (signature)
- **Mock:** a miniature site typeset entirely in CSS (no raster). It uses a container-query-scaled browser bar, nav, headline, sub and pill CTA, an art shape painted with the template's gradient, and a tile grid. Aspect ratio 16:11, 14px radius, mock drop shadow. Layout variants are split, center, editorial and shop; font variants are serif, sans and condensed (Archivo at `wdth` 62).
- **Idea card:** a mock above a meta grid (name 1.35rem / 700, stone category, tabular price). Hover or focus scales the mock to 0.97 and rounds it to 22px over 0.9s. The custom cursor labels it "Open".
- **Preview:** a full-screen ink overlay that wipes up by clip-path (0.9s expo-out), with the enlarged mock on the left, details on the right, a fixed blurred close pill, focus trapping to the close button, and Escape to dismiss.

### Cursor
An 18px bone ring with `mix-blend-mode: difference`, trailing the pointer at 0.45s expo-out. It scales 2.2x over interactive elements and 4.8x into a solid bone label disc over `[data-cursor]`. It is only active on fine pointers with motion allowed.

### Motion Grammar
- **Easing:** `--ease` is cubic-bezier(0.16, 1, 0.3, 1) in CSS, and `expo.out` in GSAP. Wipes that both open and close use `expo.inOut`.
- **Headline reveal:** SplitText lines, masked, rising from yPercent 115 over 1.3s with a 0.09s stagger, triggered at top 88%.
- **Block rise:** y 40 to 0 with autoAlpha over 1.1s, triggered at top 90%, once.
- **Scrubbed:** the manifesto word brightening, the process rule's scaleX, and the reel's horizontal travel.
- **Loader:** a 000 to 100 tabular counter (1.6s power2.inOut), then the panel clips away upward (1.1s expo.inOut).
- **Smooth scroll:** Lenis lerp 0.09; anchor scrolls take 1.4s.
- **Hero choreography:** a 2.2s expo-out intro grows and untilts the crystal. From p 0 to 0.75 it glides right to left along the wordmark row, spinning faster as it travels and following the pointer (x 0.22, y 0.14 of the viewport). From p 0.75 to 1 the wordmark and crystal lift away together while the word fades.
- **Reduced motion:** CSS durations drop to 0.001ms, GSAP reveals, Lenis, the loader and the cursor are skipped, and 3D motion scales to 0.1 to 0.15 with pointer follow off.

## Do's and Don'ts

### Do:
- **Do** keep every UI surface to ink, ink-2, bone, stone and the two hairline alphas; let the 3D glass supply all colour.
- **Do** use a bone pill (56px, 999px radius, fill-wipe hover) for the primary action and a `line-2` outline pill for the secondary one.
- **Do** present lists as index rows between hairlines, with the bone clip-path wipe on hover.
- **Do** set every display line with masked, expo-out line reveals and the `--ease` curve.
- **Do** apply the Georgian Rule (looser line-height, -0.01em tracking, smaller display clamps) whenever `:lang(ka)` is active.
- **Do** use tabular numerals for every price, counter and total.
- **Do** build new glass from the Gem recipe and the Studio light rig rather than tuning a new material.

### Don't:
- **Don't** introduce a UI accent hue, gradient fills or coloured glows in the chrome; `danger` and `ok` are for form status only.
- **Don't** use grids of same-size icon cards; the receipt and feature tiles are the only bordered containers.
- **Don't** uppercase or widely track LUMEN's own labels.
- **Don't** apply Latin display tracking (-0.035 to -0.045em) to Georgian.
- **Don't** ship raster images for mocks or icons; mocks are CSS and icons are authored SVG at a 1.8 stroke.
- **Don't** let a mock's borrowed palette or its serif leak into LUMEN's own type or colour.
