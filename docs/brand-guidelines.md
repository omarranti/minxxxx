# MINX tatu — Brand Guidelines v1.0

> Last updated: 2026-04-07
> Status: Active — extracted from the Digital Flashbook (London & Brighton)
> Sister project to: minxx (Phoebe Juanita) creative archive

## Quick Reference

| Element | Value |
|---------|-------|
| Primary Color | #B91C1C (Blood Red) |
| Secondary Color | #050505 (Ink Black) |
| Accent Color | #F5F0E8 (Parchment) |
| Primary Display Font | Pirata One |
| Body Font | Cinzel |
| Voice | Sacred · Gothic · Devotional · Unapologetic |

---

## 1. Color Palette

### Primary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Blood Red** | #B91C1C | rgb(185,28,28) | Sacred emphasis, single-word accents, lip prints |
| **Crimson Dark** | #7F1D1D | rgb(127,29,29) | Hover states, devotional underlines |
| **Ember Light** | #DC2626 | rgb(220,38,38) | Glow halos, focus rings |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Ink Black** | #050505 | rgb(5,5,5) | Page surface, dominant 70% of all comps |
| **Void Dark** | #000000 | rgb(0,0,0) | Recessed wells, deepest shadow |
| **Charcoal Light** | #1A1A1A | rgb(26,26,26) | Cards, panels, layered surfaces |

### Accent Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Parchment** | #F5F0E8 | rgb(245,240,232) | Body type, flash sheet base |
| **Bone Dark** | #9A9590 | rgb(154,149,144) | Captions, secondary text |
| **Cream Light** | #EEE9E0 | rgb(238,233,224) | Highlights, raised paper |

### Neutral Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Background | #050505 | rgb(5,5,5) | Page backgrounds |
| Surface | #1A1A1A | rgb(26,26,26) | Cards, sections |
| Text Primary | #F5F0E8 | rgb(245,240,232) | Headings, body text on dark |
| Text Secondary | #9A9590 | rgb(154,149,144) | Captions, muted text |
| Border | #2A2A2A | rgb(42,42,42) | Dividers, hairlines |

### Semantic Colors

| State | Hex | Usage |
|-------|-----|-------|
| Success | #5C8A4D | Confirmation, "booked" states (rare) |
| Warning | #B98917 | Aftercare cautions |
| Error | #B91C1C | Errors — same as primary, blood red |
| Info | #9A9590 | Informational notes (warm gray) |

### Color Ratio (Sacred Rule)

**70% Ink Black / 20% Parchment Cream / 10% Blood Red.**

Red is reserved for emphasis, accents, and sacred/important text only — never decorative fill. The flash sheets work almost entirely in black linework on cream with selective red stars and lip prints as highlights.

### Accessibility

- Parchment on Ink Black: 16.5:1 contrast (AAA)
- Blood Red on Parchment: 5.8:1 contrast (AA Large)
- Bone Dark on Ink Black: 4.6:1 contrast (AA)
- Never set blood red on charcoal or ink black at body size

---

## 2. Typography

### Font Stack

```css
--font-display:   'Pirata One', serif;          /* Hero headlines */
--font-fraktur:   'UnifrakturMaguntia', serif;  /* Devotional headings */
--font-script:    'Great Vibes', cursive;       /* Taglines, accents */
--font-impact:    'Bebas Neue', sans-serif;     /* CTAs, nav, labels */
--font-body:      'Cinzel', serif;              /* Body, UI */
--font-heading:   'Cinzel Decorative', serif;   /* Section headings */
--font-utility:   'Oswald', sans-serif;         /* Eyebrows, microcopy */
--font-raw:       'Special Elite', monospace;   /* Captions, notes */
```

### Type Roles

| Role | Typeface | Notes |
|------|----------|-------|
| **Primary Display — Blackletter** | Pirata One | Hero headlines, flash titles, primary brand statements. Captures the dark gothic-feminine spirit. |
| **Secondary Display — Fraktur** | UnifrakturMaguntia | Devotional / spiritual feature headings. Heavier, more ornate. |
| **Accent Script — Cursive** | Great Vibes | Taglines, secondary phrases, emotional accents. Never body. |
| **Impact Display — Block Caps** | Bebas Neue + Oswald | UI labels, navigation, CTAs, utilitarian text. |
| **Body & UI — Elegant Serif** | Cinzel | Body copy, descriptions, navigation labels, extended reading. |
| **Section Headings** | Cinzel Decorative | Tracked wide, 700 weight. |
| **Utility — Distressed** | Special Elite | Captions, aftercare, raw personal notes. |

### Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height |
|---------|----------------|---------------|--------|-------------|
| H1 (Pirata) | 64px | 40px | 400 | 1.0 |
| H2 (Fraktur) | 40px | 28px | 400 | 1.15 |
| H3 (Cinzel Dec) | 24px | 20px | 700 | 1.25 |
| Tagline (Great Vibes) | 32px | 22px | 400 | 1.2 |
| Body (Cinzel) | 16px | 16px | 400 | 1.7 |
| Small | 14px | 14px | 400 | 1.5 |
| Caption (Special Elite) | 13px | 13px | 400 | 1.6 |

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Pirata+One&family=UnifrakturMaguntia&family=Great+Vibes&family=Bebas+Neue&family=Cinzel:wght@400;600;700&family=Cinzel+Decorative:wght@700&family=Oswald:wght@400;600&family=Special+Elite&display=swap" rel="stylesheet">
```

---

## 3. Logo Usage

### Variants

| Variant | File | Use Case |
|---------|------|----------|
| Wordmark | minx-tatu-wordmark.svg | Primary use — "MINX tatu" set in Pirata One |
| Stacked | minx-tatu-stacked.svg | Square spaces, profile pictures |
| Mark Only | minx-tatu-mark.svg | Favicons, watermarks, stamp |
| Inverse | minx-tatu-cream.svg | Cream wordmark on ink black |

### Clear Space

Minimum clear space = the cap-height of the "M" in the wordmark on all sides.

### Minimum Size

| Context | Minimum Width |
|---------|---------------|
| Digital — Wordmark | 140px |
| Digital — Mark | 28px |
| Print — Wordmark | 38mm |
| Print — Mark | 12mm |

### Don'ts

- Don't rotate, skew, or mirror the logo
- Don't change colors outside Blood Red / Parchment / Ink Black
- Don't add drop shadows, glows, or 3D effects
- Don't recreate or substitute the wordmark in another font
- Don't crop or compress proportions
- Don't place on busy photographic backgrounds without a scrim

---

## 4. Voice & Tone

### Brand Personality

| Trait | Description |
|-------|-------------|
| **Sacred** | Spiritual, devotional — God is woven through the work |
| **Gothic** | Dark, ornate, blackletter — old-world reverence |
| **Devotional** | Reverent toward the warrior princess archetype |
| **Unapologetic** | Direct, no softening, no apology — *down for customs* |

### Voice Chart

| Trait | We Are | We Are Not |
|-------|--------|------------|
| Sacred | Reverent, prayerful | Preachy, performative |
| Gothic | Ornate, mysterious | Edgelord, costume-y |
| Devotional | Loyal, ride-or-die | Codependent, desperate |
| Unapologetic | Direct, raw | Cruel, bitter |

### Tone by Context

| Context | Tone | Example |
|---------|------|---------|
| Flash titles | Sacred + bold | *Princess · Reckless Angel · DollFace* |
| Taglines | Devotional + flowing | *I pray for you · In God's Hands* |
| CTAs | Direct + lowercase | *book now · down for customs* |
| Captions | Raw + casual | *i can help with placement and style to suit you <333* |
| Sacred quotes | Blackletter, centered | *God is within her, she will not fail* |

### Signature Phrases

| Phrase | When to use |
|--------|-------------|
| **Ride with God or die and try again** | Manifesto, hero, closer |
| **God is within her, she will not fail** | Devotional / spiritual |
| **LOVE NOW CRY LATER** | Bold dual-color statement |
| **Reckless Angel** | Tagline / product naming |
| **down for customs** | Service line, lowercase |
| **Princess · Baby · Mischief** | Flash sheet vocabulary |

### Prohibited Terms

| Avoid | Reason |
|-------|--------|
| Edgy / dark / goth-girl | Cliché — let the work speak |
| Cute / pretty / nice | Wrong register — the brand is sacred, not cute |
| Empowering | Hollow corporate-feminism word |
| Vibes / energy / aesthetic | Lazy — name the actual thing |
| Healing journey | Reserved for the sister brand (minxx writing) |

---

## 5. Imagery Guidelines

### Photography Style

- **Lighting:** Hard low-key — single source, deep shadow, no fill
- **Subjects:** Skin, ink, hands holding rosaries, feet on black floors
- **Color treatment:** Desaturated to near-monochrome, with selective red
- **Composition:** Centered, devotional, altarpiece — symmetry

### Flash Sheets (Native Format)

- Style: Hand-drawn black linework on cream paper
- Stroke: Variable hand weight 1–3pt, expressive
- Highlights: Selective red dots / stars / lip prints only
- Layout: Grid of 6–12 designs per sheet, breathing room between

### Icons

- Style: Hand-drawn outline, never geometric vector
- Stroke: Variable 1.5–2.5px to match flash sheet hand
- Corners: Sharp — never rounded
- Fill: Outline only, except for solid stars (red)

---

## 6. Design Components

### Buttons

| Type | Background | Text | Border | Border Radius |
|------|------------|------|--------|---------------|
| Primary | #B91C1C | #F5F0E8 | none | 0px (sharp) |
| Secondary | transparent | #F5F0E8 | 1px #F5F0E8 | 0px |
| Tertiary | transparent | #9A9590 | none | 0px |
| Destructive | #7F1D1D | #F5F0E8 | none | 0px |

**Sharp corners always** — the brand is gothic, not rounded.

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing, inline gaps |
| sm | 8px | Compact elements |
| md | 16px | Standard spacing |
| lg | 32px | Section spacing — generous |
| xl | 64px | Large gaps between sections |
| 2xl | 96px | Hero / dramatic dividers |
| 3xl | 144px | Cathedral whitespace |

### Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 0px (sharp) |
| Cards | 0px (sharp) |
| Inputs | 0px |
| Modals | 0px |
| Pills/Tags | 0px |

**No rounded corners. Ever.** Sharp is sacred.

---

## 7. Typographic Rules

### ✦ DO

- Pair blackletter display with clean serif body (Pirata + Cinzel)
- Use Great Vibes script sparingly for emotional accent
- Keep block caps (Bebas/Oswald) for functional UI text
- Maintain high contrast: parchment on ink black, or ink on parchment
- Reserve red for single-word emphasis or sacred phrases
- Allow generous whitespace around blackletter headlines
- Use textured / gritty backgrounds behind type
- Set sacred phrases centered, large, and isolated

### ✕ DON'T

- Use more than two display faces in one composition
- Set blackletter at small body sizes (illegible)
- Pair script with script — one ornate face at a time
- Use modern sans-serifs (Inter, Helvetica, Roboto) — they break the spell
- Apply bright or pastel colors — only black, red, cream
- Center-align body paragraphs — left-align for readability
- Use rounded or bubbly typefaces — the brand is sharp
- Mix the brand with the sister brand minxx without clear separation

---

## AI Image Generation

### Base Prompt Template

Always prepend to image generation prompts:

```
Devotional gothic flash sheet style, hand-drawn black linework on cream parchment paper #F5F0E8, sharp variable-weight strokes, selective blood red #B91C1C accents only, hard low-key lighting, deep shadow, sacred symmetry, no rounded corners, no modern sans-serif, no pastel, ornate blackletter typography
```

### Style Keywords

| Category | Keywords |
|----------|----------|
| **Lighting** | hard low-key, single source, deep shadow, candle-lit, cathedral light |
| **Mood** | sacred, devotional, gothic, reverent, unapologetic |
| **Composition** | centered, symmetrical, altarpiece, framed, isolated |
| **Treatment** | high contrast, near-monochrome, desaturated, ink-on-parchment |
| **Aesthetic** | flash sheet, blackletter, ornate, hand-drawn, sharp |

### Visual Mood Descriptors

- Ink on parchment — old paper grain visible
- Hand-drawn variable line weight — never CAD-perfect
- Sacred symmetry — altar / triptych composition
- Selective red — one or two red marks per composition only
- Deep shadow — never flat lighting
- Gothic ornament — crosses, wings, hearts, daggers, rosaries

### Visual Don'ts

| Avoid | Reason |
|-------|--------|
| Bright pastels | Wrong palette — kills the gothic |
| Rounded cartoon style | Wrong register — brand is sharp |
| 3D rendering / CGI gloss | Wrong texture — brand is hand + paper |
| Modern minimalism / Scandi | Wrong era — brand is old-world |
| Photographic realism | Wrong medium — brand is illustration |
| Multiple bright colors | Wrong restraint — only black/red/cream |

### Example Prompts

**Hero Banner:**
```
MINX tatu hero — blackletter wordmark "MINX tatu" set in Pirata One typography, parchment cream #F5F0E8 on deep ink black #050505 background, single blood red #B91C1C ornament beneath the wordmark, hard low-key lighting, deep shadow, sacred symmetry, paper grain texture, no rounded corners
```

**Flash Sheet Spread:**
```
Tattoo flash sheet, 8 hand-drawn gothic designs on aged parchment #F5F0E8 paper, sharp variable-weight black linework, designs include: ornate cross with wings, sacred heart with dagger, "ride with God" blackletter banner, rosary chain, Madonna silhouette, selective blood red #B91C1C lip prints and stars as accents, sacred altarpiece grid layout, low-key candlelit photograph
```

**Social Post:**
```
Single tattoo design centered on cream parchment, "God is within her" set in UnifrakturMaguntia blackletter beneath an ornate winged heart, hand-drawn variable black ink lines, one small blood red accent dot, deep shadow at edges, devotional gothic mood
```

---

## Sister Brand

This brand is the **tattoo arm** of the broader **minxx / Phoebe Juanita** creative universe (film, photography, writing, music). The two brands share a spiritual foundation and palette family but maintain distinct visual languages:

| Brand | Visual Language | Palette |
|-------|----------------|---------|
| **MINX tatu** | Gothic blackletter, sharp, blood red | #050505 / #F5F0E8 / #B91C1C |
| **minxx** | Lavender camcorder, soft, dreamy | #08080c / #c4a0d4 / #d4739a |

When co-branding, separate them visually — never merge palettes.

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-04-07 | Initial guidelines extracted from Digital Flashbook HTML reference |
