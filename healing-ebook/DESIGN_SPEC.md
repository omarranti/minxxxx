# Unconventional Healing 4 the Warrior Princess — Design Spec

Reverse-engineered from a single page captured at frame 756 of `REC-20260407043116.mp4`.
Original was hosted at `zylaminx.my.canva.site/healing4princesswarrior` (now 404).

## Page

| Property | Value |
|---|---|
| Aspect ratio | ~0.75 (A5 / standard ebook portrait) |
| Suggested size | 148 × 210 mm (A5) at 300 dpi → 1748 × 2480 px |
| Background | `#ECF0EA` (pale mint-cream "tea-stained paper") |
| Primary ink | `#15181A` (near-black, slight warm undertone) |
| Secondary ink | `#242722` (ornament strokes) |

## Border / ornaments

- All four corners carry the **same** ornate baroque scrollwork motif (mirrored to each corner).
- Top and bottom edges have a horizontal flourish that meets the corners.
- A thin inner rule line forms the actual text frame.
- Style cue: Victorian / late-19th-century scrollwork — search Noun Project / Creative Market for "baroque corner ornament" or "vintage scroll frame".

## Typography

| Role | Style observed |
|---|---|
| Body | Clean humanist sans, ~16–17 px equivalent, generous line-height (~1.5), justified |
| Italic emphasis | Same family, italic — used for short phrases mid-sentence (e.g. an italicised callback) |
| Callout / affirmation | Same family, **bold**, slightly tighter — sits in a separate boxed area near the page bottom |

Recommended font stack to match the vibe:
- Primary: **Inter** or **Open Sans** (clean, readable)
- Affirmation block could swap to a contrasting display serif (e.g. **Cormorant Garamond**) if you want more drama.

## Layout grid (one body page)

```
┌─ ornate border ────────────────────────┐
│ ┌─ inner rule ──────────────────────┐  │
│ │                                   │  │
│ │  body paragraph 1                 │  │
│ │  body paragraph 2                 │  │
│ │  body paragraph 3                 │  │
│ │                                   │  │
│ │  ┌─ affirmation block ──────────┐ │  │
│ │  │  bold short stanza           │ │  │
│ │  └──────────────────────────────┘ │  │
│ │                                   │  │
│ └───────────────────────────────────┘  │
└────────────────────────────────────────┘
```

- Inner margin: ~12% of page width on each side.
- Vertical: ~10% padding top + bottom.
- Body block: 3 short paragraphs fits comfortably; the fourth slot is reserved for the affirmation callout.

## Voice / tone (from the one page)

Mixed register that's part of the brand identity:
- Lowercase casual chat-speak ("u", "rn", "cos", "prolly", "<33")
- Mid-paragraph shift to direct second-person ("You must…", "We have to learn…")
- Themes: redirecting intensity, curiosity & sensitivity as strength, courage, vision-holding
- Affirmation block always framed as advice from author → reader, present tense, imperative

This is the "Warrior Princess" voice — keep it intact; don't sanitize the lowercase or chat-speak when reflowing.

## Source format recommendation

Build pages in **HTML/CSS** (not Canva) so you control:
- Reflow at any page size
- Font embedding
- Easy export to PDF via headless Chrome (`chromium --headless --print-to-pdf`)
- Ornament SVGs that scale without quality loss

Template scaffold lives in `template.html` next to this file.
