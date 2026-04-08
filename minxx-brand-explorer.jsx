import { useState, useEffect } from "react";

const FONTS_LINK = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;0,8..60,600;0,8..60,700;1,8..60,400;1,8..60,500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=VT323&family=Press+Start+2P&display=swap";

// MINXX_OS terminal palette — pulled from index.html
const TERM = {
  bg:           "#08080c",
  bezel:        "#0d0a10",
  screen:       "#050307",
  phosphor:     "#c4ffd6",
  phosphorDim:  "#5cdc80",
  cream:        "#f0e6e8",
  amber:        "#ffb070",
  red:          "#ff2a3a",
  redGlow:      "#ff5566",
  muted:        "#8a7a8e",
  dim:          "#3a2e3e",
};

// boot sequence printed line-by-line into the CRT
const BOOT_LINES = [
  "MINXX_OS  v1.0   TAPE_PLAYER.EXE",
  "(c) 1996  HANDYCAM INDUSTRIES",
  "",
  "> INIT VIDEO PHOSPHOR..........  OK",
  "> LOAD TAPE  /dev/hi8/01.......  OK",
  "> MOUNT  /vol/brand/explorer...  OK",
  "> VERIFY SIGNAL INTEGRITY......  OK",
  "> LOAD AUTH MODULE.............  OK",
  "",
  "========================================",
  "  PRIVATE TERMINAL  *  ACCESS RESTRICTED",
  "========================================",
  "",
  "> HELLO, PHOEBE.",
  "> THIS TAPE IS FOR YOUR EYES ONLY.",
  "> PLEASE ENTER YOUR ACCESS CODE.",
  "",
];
const BOOT_TEXT = BOOT_LINES.join("\n");

// ════════════════════════════════════════════
// AUTH — soft password gate for Phoebe
// To rotate the code: in any browser console run
//    crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOURNEWCODE'))
//      .then(b => console.log(Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')))
// then paste the hex into PASSWORD_HASH below.
// ════════════════════════════════════════════
const AUTH_KEY = "minxx_explorer_auth_v1";
// SHA-256 of "warriorprincess" — change me before sharing the link.
const PASSWORD_HASH = "cbeabaf851642e1c30e0a3217b857a53748fbe2322437094750c7a84ec0c772c";

async function sha256Hex(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

const C = {
  white: "#FFFFFF",
  bg: "#FAFAF7",
  cream: "#F5F2ED",
  warm50: "#FDF8F3",
  text: "#1A1A1A",
  textMed: "#3D3D3D",
  textLight: "#6B6B6B",
  textMuted: "#9A9590",
  border: "#E8E4DF",
  borderLight: "#F0EDE8",
  terracotta: "#C2714F",
  terracottaLight: "#F3E8E1",
  gold: "#B8963E",
  goldLight: "#FAF5EB",
  sage: "#7A8B6F",
  sageLight: "#EFF3EC",
  slate: "#5C6B7A",
  slateLight: "#EDF0F3",
};

const PILLARS = [
  {
    id: "writing", label: "Writing & Publishing", num: "01", accent: C.terracotta, accentLight: C.terracottaLight,
    tagline: "The pen before the lens",
    description: "Publishing is the most immediately monetizable pillar with the fewest legal restrictions. Book royalties from self-publishing are classified as passive income from creative works — making this the priority revenue stream.",
    phases: [
      { name: "Establish Catalog", time: "Now – June 2026", items: ["Finalize first book manuscript — prioritize completion over perfection", "Self-publish via Amazon KDP for speed to market and global reach", "Design cover art matching the Minxx brand aesthetic", "Set up author profiles on Amazon, Goodreads, and website", "Price accessibly: $9.99–14.99 paperback, $4.99–6.99 digital"] },
      { name: "Build Ecosystem", time: "June – December 2026", items: ["Launch Substack or email newsletter with excerpts and essays", "Release second book to establish catalog credibility", "Pursue independent bookstore placement, especially LA shops", "Pitch literary podcasts and book review outlets", "Create limited signed editions for direct website sales"] },
      { name: "Expand the IP", time: "2027 and beyond", items: ["Audiobook versions narrated by Phoebe (voice is part of the brand)", "Investigate rights licensing for international markets", "Develop a writing workshop or course leveraging her unique style", "Consider chapbook series or zine collection as entry points"] },
    ],
    revenue: [
      { stream: "KDP eBook", perUnit: "$3.50 royalty", volume: "2,000+ units", annual: "$7,000+" },
      { stream: "KDP Paperback", perUnit: "$4–6 royalty", volume: "1,000+ units", annual: "$5,000+" },
      { stream: "Direct Sales (signed)", perUnit: "$15–20 margin", volume: "200+ units", annual: "$3,500+" },
      { stream: "Substack (paid tier)", perUnit: "$5–7/month", volume: "500 subscribers", annual: "$30,000+" },
      { stream: "Speaking & Workshops", perUnit: "$500–2,000/event", volume: "6–12 per year", annual: "$6,000+" },
    ],
  },
  {
    id: "camcorder", label: "Camcorder Content", num: "02", accent: C.gold, accentLight: C.goldLight,
    tagline: "Low resolution, high quality memories",
    description: "Not a trend or an aesthetic choice for engagement. A worldview: the grain, the warmth, the imperfection of analog video preserves something that 4K erases. This philosophy is the brand.",
    contentPillars: [
      { name: "Day-to-Day Diaries", desc: "Unscripted camcorder footage of daily LA life. Coffee shops, drives, golden hour walks, cooking, reading. The mundane made beautiful." },
      { name: "Group Moments", desc: "The social footage. Friends together, nights out, house parties, beach days. Phoebe as the documentarian of her circle." },
      { name: "Camcorder Confessionals", desc: "Direct-to-camera pieces where Phoebe speaks. Thoughts, observations, mini-essays delivered through the analog lens." },
      { name: "\"How We Used to Live\"", desc: "A recurring series contrasting modern habits with analog alternatives. The most brandable, most pitch-worthy content for partnerships." },
    ],
    platforms: [
      { name: "Instagram Reels", format: "30–60s edits", cadence: "4–5× / week", goal: "Core audience & brand identity" },
      { name: "TikTok", format: "15–60s clips", cadence: "5–7× / week", goal: "Discovery & new audience" },
      { name: "YouTube", format: "5–15 min compilations", cadence: "1–2× / month", goal: "Long-form, ad revenue, archive" },
      { name: "YouTube Shorts", format: "15–30s clips", cadence: "3–4× / week", goal: "Cross-promotion" },
    ],
    milestones: [
      { target: "1,000 followers", time: "Month 1–2", unlock: "Community foundation" },
      { target: "5,000 followers", time: "Month 3–4", unlock: "Gifted partnerships" },
      { target: "10,000 followers", time: "Month 5–7", unlock: "Paid micro-deals ($200–500/post)" },
      { target: "25,000 followers", time: "Month 8–12", unlock: "Mid-tier deals ($500–2,000/post)" },
      { target: "50,000+ followers", time: "Year 2", unlock: "Significant brand revenue" },
    ],
  },
  {
    id: "modeling", label: "Modeling", num: "03", accent: C.sage, accentLight: C.sageLight,
    tagline: "Presence is the portfolio",
    description: "A model who also writes books and runs a popular camcorder content brand is exponentially more valuable than someone who only models. The audience is the leverage.",
    actions: [
      "Curate 20–30 of Phoebe's strongest existing photos into a preliminary portfolio",
      "Identify 5–10 LA-based photographers who do TFP (time for print) shoots",
      "Schedule 3–5 test shoots across different looks: editorial, commercial, lifestyle, beauty",
      "Create a digital comp card (front: headshot + full body; back: stats, contact, social links)",
      "Research agencies that align with her look and sponsor international talent",
    ],
    agencies: [
      { name: "Wilhelmina Models", note: "Known for diverse talent and international roster" },
      { name: "Next Management", note: "Strong editorial and commercial divisions" },
      { name: "The Industry Model Management", note: "LA boutique agency with high fashion focus" },
      { name: "State Management", note: "Digital-first, influencer-model hybrid positioning" },
      { name: "Freedom Models LA", note: "Boutique agency focused on emerging talent" },
    ],
    rates: [
      { type: "Editorial (magazines)", range: "$150–500/day", note: "Prestige over pay initially" },
      { type: "Commercial (brands)", range: "$1,000–5,000/day", note: "Primary revenue driver" },
      { type: "Content Creation (UGC)", range: "$500–2,000/project", note: "Leverages existing skills" },
      { type: "Brand Ambassador", range: "$2,000–10,000/campaign", note: "Long-term partnerships" },
      { type: "Runway", range: "$500–2,500/show", note: "Seasonal, high visibility" },
    ],
  },
  {
    id: "visa", label: "Visa & Legal", num: "04", accent: C.slate, accentLight: C.slateLight,
    tagline: "Every milestone is evidence",
    description: "Not a separate workstream — the lens through which every other decision is made. Every book published, every follower milestone reached, every agency meeting becomes evidence in a visa petition.",
    pathways: [
      { name: "O-1B Visa", subtitle: "Extraordinary Ability in the Arts", details: "The strongest professional pathway. Requires evidence of sustained national or international acclaim. Realistically 6–12 months to build a strong enough portfolio of evidence.", evidence: ["Published works (books count directly)", "Press coverage and media features", "Social media following as public interest", "Agency representation by gatekeepers", "Professional recommendation letters", "Original contribution (camcorder aesthetic)", "Industry organization memberships"] },
      { name: "K-1 Fiancé Visa", subtitle: "Relationship-Based Pathway", details: "Requires engagement. Processing time approximately 12–18 months from filing. Phoebe would need to return to the UK during processing. Stated factually as a planning consideration." },
      { name: "Employer Sponsorship", subtitle: "Agency or Publisher Sponsored", details: "If a modeling agency, publishing house, or media company sponsors, an H-1B or O-1 could be filed on her behalf. Less likely near-term but becomes viable as her professional profile grows." },
    ],
    urgentActions: [
      { text: "Consult an immigration attorney within the next 30 days", priority: "high" },
      { text: "Begin documenting ALL professional milestones in a visa evidence folder", priority: "high" },
      { text: "Register a UK Ltd company for receiving international income", priority: "high" },
      { text: "Understand the exact terms of B-1/B-2 visa and extension options", priority: "medium" },
      { text: "Do NOT overstay — this would jeopardize all future visa pathways", priority: "critical" },
    ],
  },
];

const TIMELINE = [
  { phase: "Foundation", time: "April – May 2026", color: C.terracotta, items: ["Finalize Minxx brand identity", "Launch Instagram & TikTok", "Complete first manuscript", "Schedule 3+ TFP shoots", "Register UK Ltd company", "Consult immigration attorney", "Build & launch website"] },
  { phase: "Growth", time: "June – September 2026", color: C.gold, items: ["Publish Book 1 on KDP", "Launch Substack newsletter", "5,000+ Instagram followers", "Submit to agencies", "Pursue press coverage", "O-1B evidence file", "Launch YouTube channel"] },
  { phase: "Monetize", time: "Oct 2026 – Mar 2027", color: C.sage, items: ["Brand partnerships (UK Ltd)", "Publish Book 2", "10,000+ followers", "File O-1B petition", "Website shop launch", "Camcorder filming services"] },
  { phase: "Scale", time: "April 2027+", color: C.slate, items: ["25K+ across platforms", "Digital products launch", "Agency representation", "Workshops & events", "Build team"] },
];

function SectionLabel({ children, color = C.terracotta }) {
  return <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color, marginBottom: 10 }}>{children}</div>;
}

function Card({ children, style = {} }) {
  return <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: 6, padding: "24px 28px", ...style }}>{children}</div>;
}

function NavBtn({ active, label, num, accent, onClick }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, padding: "18px 10px 16px", border: "none", cursor: "pointer",
      background: active ? C.white : "transparent",
      borderBottom: active ? `2.5px solid ${accent}` : "2.5px solid transparent",
      transition: "all 0.25s ease", display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
    }}>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.58rem", letterSpacing: "0.12em", color: active ? accent : C.textMuted }}>{num}</span>
      <span style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontWeight: 600, fontSize: "clamp(0.62rem, 1.2vw, 0.78rem)", color: active ? C.text : C.textLight }}>{label}</span>
    </button>
  );
}

function WritingView({ d }) {
  const [ph, setPh] = useState(0);
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <Card>
        <SectionLabel color={d.accent}>Publishing Roadmap</SectionLabel>
        <div style={{ display: "flex", gap: 0, marginBottom: 24, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.border}` }}>
          {d.phases.map((p, i) => (
            <button key={i} onClick={() => setPh(i)} style={{ flex: 1, padding: "16px 14px", border: "none", cursor: "pointer", background: i === ph ? d.accentLight : C.bg, borderRight: i < 2 ? `1px solid ${C.border}` : "none", transition: "all .2s" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "0.85rem", color: i === ph ? d.accent : C.textLight }}>{p.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", color: C.textMuted, marginTop: 3 }}>{p.time}</div>
            </button>
          ))}
        </div>
        {d.phases[ph].items.map((item, i) => (
          <div key={i} style={{ padding: "13px 0", borderBottom: i < d.phases[ph].items.length - 1 ? `1px solid ${C.borderLight}` : "none", fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", color: C.textMed, lineHeight: 1.55, display: "flex", gap: 14, alignItems: "baseline" }}>
            <span style={{ color: d.accent, fontSize: "0.5rem", flexShrink: 0, marginTop: 4 }}>●</span>{item}
          </div>
        ))}
      </Card>
      <div style={{ height: 24 }} />
      <Card>
        <SectionLabel color={d.accent}>Revenue Projections — Year One</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Revenue Stream", "Per Unit", "Volume Target", "Annual Potential"].map((h, i) => (
            <th key={h} style={{ textAlign: i === 3 ? "right" : "left", padding: "12px 14px 10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.textMuted, borderBottom: `2px solid ${C.border}` }}>{h}</th>
          ))}</tr></thead>
          <tbody>{d.revenue.map((r, i) => (
            <tr key={i}>
              <td style={{ padding: "14px", fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", fontWeight: 600, color: C.text, borderBottom: `1px solid ${C.borderLight}` }}>{r.stream}</td>
              <td style={{ padding: "14px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: C.textLight, borderBottom: `1px solid ${C.borderLight}` }}>{r.perUnit}</td>
              <td style={{ padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: C.textLight, borderBottom: `1px solid ${C.borderLight}` }}>{r.volume}</td>
              <td style={{ padding: "14px", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.88rem", color: d.accent, textAlign: "right", borderBottom: `1px solid ${C.borderLight}` }}>{r.annual}</td>
            </tr>
          ))}</tbody>
        </table>
        <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: 6, background: d.accentLight, border: `1px solid ${C.border}`, fontFamily: "'Source Serif 4', serif", fontSize: "0.85rem", color: C.textMed, lineHeight: 1.7 }}>
          <strong style={{ color: d.accent }}>Conservative Year 1 Estimate:</strong> $15,000 – $25,000. With audience growth and multiple titles, Year 2–3 scales significantly.
        </div>
      </Card>
    </div>
  );
}

function CamcorderView({ d }) {
  const [ex, setEx] = useState(null);
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <Card>
        <SectionLabel color={d.accent}>Content Pillars</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {d.contentPillars.map((p, i) => (
            <button key={i} onClick={() => setEx(ex === i ? null : i)} style={{ padding: 20, border: `1px solid ${ex === i ? d.accent : C.border}`, borderRadius: 6, cursor: "pointer", textAlign: "left", background: ex === i ? d.accentLight : C.bg, transition: "all .2s" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "0.9rem", color: C.text, marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.textLight, lineHeight: 1.6 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </Card>
      <div style={{ height: 24 }} />
      <Card>
        <SectionLabel color={d.accent}>Platform Strategy</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>{["Platform", "Format", "Cadence", "Goal"].map(h => (
            <th key={h} style={{ textAlign: "left", padding: "12px 14px 10px", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: C.textMuted, borderBottom: `2px solid ${C.border}` }}>{h}</th>
          ))}</tr></thead>
          <tbody>{d.platforms.map((p, i) => (
            <tr key={i}>
              <td style={{ padding: "14px", fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: "0.88rem", color: C.text, borderBottom: `1px solid ${C.borderLight}` }}>{p.name}</td>
              <td style={{ padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: C.textLight, borderBottom: `1px solid ${C.borderLight}` }}>{p.format}</td>
              <td style={{ padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem", color: d.accent, fontWeight: 600, borderBottom: `1px solid ${C.borderLight}` }}>{p.cadence}</td>
              <td style={{ padding: "14px", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.textMuted, borderBottom: `1px solid ${C.borderLight}` }}>{p.goal}</td>
            </tr>
          ))}</tbody>
        </table>
      </Card>
      <div style={{ height: 24 }} />
      <Card>
        <SectionLabel color={d.accent}>Growth Milestones</SectionLabel>
        {d.milestones.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 20, padding: "16px 0", borderBottom: i < d.milestones.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: i === 0 ? d.accentLight : C.bg, border: `2px solid ${i < 2 ? d.accent : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.7rem", color: i < 2 ? d.accent : C.textMuted }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "0.92rem", color: C.text }}>{m.target}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.textMuted, marginTop: 2 }}>{m.time}</div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: d.accent, fontWeight: 600, textAlign: "right" }}>{m.unlock}</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ModelingView({ d }) {
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <Card>
        <SectionLabel color={d.accent}>Immediate Action Items</SectionLabel>
        {d.actions.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 16, alignItems: "baseline", padding: "14px 0", borderBottom: i < d.actions.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, background: d.accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.65rem", color: d.accent }}>{i + 1}</div>
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", color: C.textMed, lineHeight: 1.55 }}>{a}</span>
          </div>
        ))}
      </Card>
      <div style={{ height: 24 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <Card>
          <SectionLabel color={d.accent}>Target Agencies</SectionLabel>
          {d.agencies.map((a, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < d.agencies.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "0.88rem", color: C.text }}>{a.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: C.textMuted, marginTop: 3 }}>{a.note}</div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionLabel color={d.accent}>Rate Card (Post Authorization)</SectionLabel>
          {d.rates.map((r, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: i < d.rates.length - 1 ? `1px solid ${C.borderLight}` : "none", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div><div style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.85rem", color: C.text }}>{r.type}</div><div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: C.textMuted, marginTop: 2 }}>{r.note}</div></div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: d.accent, whiteSpace: "nowrap" }}>{r.range}</div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ height: 20 }} />
      <div style={{ padding: "16px 20px", borderRadius: 6, background: "#FFF9F0", border: "1px solid #F0E4D4", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#8B6830", lineHeight: 1.7 }}>
        <strong>⚠ Visa Compliance:</strong> Cannot do paid work on B-1/B-2. Unpaid TFP shoots, portfolio building, comp cards, and agency signing are permitted. All paid work awaits authorization.
      </div>
    </div>
  );
}

function VisaView({ d }) {
  const [p, setP] = useState(0);
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <Card>
        <SectionLabel color={d.accent}>Visa Pathways</SectionLabel>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {d.pathways.map((pw, i) => (
            <button key={i} onClick={() => setP(i)} style={{ flex: 1, padding: 16, borderRadius: 6, cursor: "pointer", border: `1px solid ${i === p ? d.accent : C.border}`, background: i === p ? d.accentLight : C.bg, textAlign: "left", transition: "all .2s" }}>
              <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 700, fontSize: "0.88rem", color: i === p ? C.text : C.textLight }}>{pw.name}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", color: C.textMuted, marginTop: 3 }}>{pw.subtitle}</div>
            </button>
          ))}
        </div>
        <div style={{ padding: 24, borderRadius: 6, background: C.bg, border: `1px solid ${C.borderLight}` }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", color: C.textMed, lineHeight: 1.7, marginBottom: d.pathways[p].evidence ? 20 : 0 }}>{d.pathways[p].details}</p>
          {d.pathways[p].evidence && (<>
            <SectionLabel color={d.accent}>Evidence Categories Being Built</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {d.pathways[p].evidence.map((e, i) => (
                <div key={i} style={{ padding: "10px 14px", borderRadius: 4, background: C.white, border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.textMed, display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: d.accent, fontSize: "0.45rem" }}>●</span>{e}
                </div>
              ))}
            </div>
          </>)}
        </div>
      </Card>
      <div style={{ height: 24 }} />
      <Card>
        <SectionLabel color={d.accent}>Urgent Action Items</SectionLabel>
        {d.urgentActions.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 14, alignItems: "center", padding: "14px 0", borderBottom: i < d.urgentActions.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: a.priority === "critical" ? "#DC2626" : a.priority === "high" ? d.accent : C.textMuted }} />
            <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.88rem", color: a.priority === "critical" ? "#DC2626" : C.textMed, fontWeight: a.priority === "critical" ? 700 : 400, lineHeight: 1.55 }}>{a.text}</span>
          </div>
        ))}
      </Card>
      <div style={{ height: 20 }} />
      <div style={{ padding: "16px 20px", borderRadius: 6, background: "#FEF2F2", border: "1px solid #FECACA", fontFamily: "'DM Sans', sans-serif", fontSize: "0.8rem", color: "#991B1B", lineHeight: 1.7 }}>
        <strong>Current Status:</strong> B-1/B-2 tourist visa expiring May 28, 2026. All monetization must flow through UK-based entities or be structured as passive income until legal status changes.
      </div>
    </div>
  );
}

function TimelineView() {
  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {TIMELINE.map((t, ti) => (
        <Card key={ti} style={{ marginBottom: 20, borderLeft: `4px solid ${t.color}` }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "1.3rem", color: C.text }}>{t.phase}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: t.color, letterSpacing: "0.04em" }}>{t.time}</div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {t.items.map((item, i) => (
              <div key={i} style={{ padding: "8px 16px", borderRadius: 20, background: C.bg, border: `1px solid ${C.border}`, fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", color: C.textMed }}>{item}</div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function SignInScreen({ onAuth }) {
  const [typed, setTyped] = useState(0);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [skip, setSkip] = useState(false);
  const [time, setTime] = useState("");

  const done = typed >= BOOT_TEXT.length;

  // live clock in the top bar — very MINXX_OS
  useEffect(() => {
    const upd = () => {
      const d = new Date();
      const p = (n) => String(n).padStart(2, "0");
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);

  // typewriter — one char per tick, extra pause at newlines, fast-forward on skip
  useEffect(() => {
    if (done) return;
    if (skip) {
      setTyped(BOOT_TEXT.length);
      return;
    }
    const ch = BOOT_TEXT[typed];
    const delay = ch === "\n" ? 85 : (ch === "." ? 22 : 11);
    const id = setTimeout(() => setTyped((c) => c + 1), delay);
    return () => clearTimeout(id);
  }, [typed, skip, done]);

  // any keypress or click during boot → skip the animation
  useEffect(() => {
    if (done) return;
    const onAny = () => setSkip(true);
    window.addEventListener("keydown", onAny);
    window.addEventListener("click", onAny);
    return () => {
      window.removeEventListener("keydown", onAny);
      window.removeEventListener("click", onAny);
    };
  }, [done]);

  async function submit(e) {
    e.preventDefault();
    if (!pw || loading) return;
    setLoading(true);
    setErr(false);
    try {
      const hash = await sha256Hex(pw);
      // tiny fake latency so "VERIFYING…" has time to feel real
      await new Promise((r) => setTimeout(r, 420));
      if (hash === PASSWORD_HASH) {
        try { localStorage.setItem(AUTH_KEY, "1"); } catch (_) {}
        setVerified(true);
        setLoading(false);
        setTimeout(() => onAuth(), 620);
      } else {
        setErr(true);
        setPw("");
        setLoading(false);
      }
    } catch (_) {
      setErr(true);
      setLoading(false);
    }
  }

  const visible = BOOT_TEXT.slice(0, typed);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: TERM.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'VT323', 'Courier New', monospace",
      }}
    >
      {/* ambient CRT glow behind the monitor */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(196,255,214,0.04), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(255,42,58,0.06), transparent 50%)",
        }}
      />

      {/* CRT monitor */}
      <div
        className="mx-crt"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 720,
          background: TERM.screen,
          border: `2px solid #1a1920`,
          borderRadius: 16,
          padding: 5,
          boxShadow:
            `0 0 0 1px #2a2730, 0 0 0 10px ${TERM.bezel}, 0 0 0 12px #1a1920, 0 40px 100px -20px rgba(0,0,0,0.95), 0 10px 40px rgba(196,160,212,0.06)`,
        }}
      >
        {/* inner screen */}
        <div
          style={{
            position: "relative",
            borderRadius: 10,
            padding: "26px 32px 28px",
            minHeight: 520,
            overflow: "hidden",
            background:
              `radial-gradient(ellipse at center, rgba(196,255,214,0.035) 0%, rgba(5,3,7,0) 60%), ${TERM.screen}`,
          }}
        >
          {/* scanlines overlay */}
          <div
            aria-hidden
            className="mx-scan"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              backgroundImage:
                "repeating-linear-gradient(0deg, rgba(0,0,0,0.32) 0 2px, transparent 2px 4px)",
              mixBlendMode: "multiply",
              zIndex: 3,
            }}
          />
          {/* vignette */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)",
              zIndex: 3,
            }}
          />

          {/* HUD top bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 8,
              letterSpacing: "0.1em",
              position: "relative",
              zIndex: 4,
            }}
          >
            <span style={{ color: TERM.red }} className="mx-rec">● REC</span>
            <span style={{ color: TERM.amber }}>MINXX_OS · AUTH.EXE</span>
            <span style={{ color: TERM.phosphorDim }}>{time || "--:--:--"}</span>
          </div>

          {/* boot output */}
          <pre
            className="mx-phosphor"
            style={{
              margin: 0,
              fontFamily: "'VT323', 'Courier New', monospace",
              fontSize: 19,
              lineHeight: 1.18,
              color: TERM.phosphor,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              textShadow:
                `0 0 2px ${TERM.phosphor}, 0 0 10px rgba(196,255,214,0.45), 0 0 22px rgba(92,220,128,0.25)`,
              position: "relative",
              zIndex: 2,
              minHeight: 340,
            }}
          >
            {visible}
            {!done && <span className="mx-cursor">█</span>}
          </pre>

          {/* prompt — appears after boot */}
          {done && !verified && (
            <form
              onSubmit={submit}
              style={{ marginTop: 10, position: "relative", zIndex: 2 }}
            >
              <div
                className="mx-phosphor"
                style={{
                  fontFamily: "'VT323', 'Courier New', monospace",
                  fontSize: 20,
                  color: TERM.phosphor,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  textShadow:
                    `0 0 2px ${TERM.phosphor}, 0 0 10px rgba(196,255,214,0.45)`,
                }}
              >
                <span style={{ color: TERM.amber, textShadow: `0 0 6px rgba(255,176,112,0.45)` }}>
                  PHOEBE@MINXX:~$
                </span>
                <input
                  type="password"
                  value={pw}
                  autoFocus
                  autoComplete="current-password"
                  disabled={loading}
                  onChange={(e) => { setPw(e.target.value); if (err) setErr(false); }}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: TERM.phosphor,
                    fontFamily: "'VT323', 'Courier New', monospace",
                    fontSize: 20,
                    letterSpacing: "0.24em",
                    caretColor: TERM.phosphor,
                    textShadow: `0 0 2px ${TERM.phosphor}, 0 0 8px rgba(196,255,214,0.4)`,
                    padding: 0,
                  }}
                />
                {!pw && <span className="mx-cursor" style={{ color: TERM.phosphor }}>█</span>}
              </div>

              {err && (
                <div
                  className="mx-red"
                  style={{
                    marginTop: 12,
                    fontFamily: "'VT323', 'Courier New', monospace",
                    fontSize: 18,
                    color: TERM.red,
                    textShadow: `0 0 3px ${TERM.red}, 0 0 10px ${TERM.redGlow}`,
                  }}
                >
                  ! ACCESS DENIED &mdash; CODE INVALID. RE-ENTER.
                </div>
              )}

              {loading && (
                <div
                  style={{
                    marginTop: 12,
                    fontFamily: "'VT323', 'Courier New', monospace",
                    fontSize: 18,
                    color: TERM.amber,
                    textShadow: `0 0 6px rgba(255,176,112,0.4)`,
                  }}
                >
                  &gt; VERIFYING CREDENTIALS<span className="mx-dots" />
                </div>
              )}
            </form>
          )}

          {/* access granted */}
          {verified && (
            <div
              style={{
                marginTop: 14,
                position: "relative",
                zIndex: 2,
                fontFamily: "'VT323', 'Courier New', monospace",
                fontSize: 22,
                color: TERM.phosphor,
                textShadow:
                  `0 0 2px ${TERM.phosphor}, 0 0 12px rgba(196,255,214,0.6), 0 0 28px rgba(92,220,128,0.4)`,
              }}
            >
              &gt; ACCESS GRANTED.<br />
              &gt; LOADING BRAND EXPLORER<span className="mx-dots" />
            </div>
          )}

          {/* bottom helper bar */}
          <div
            style={{
              marginTop: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
              fontFamily: "'Press Start 2P', monospace",
              fontSize: 7,
              color: TERM.muted,
              letterSpacing: "0.12em",
              borderTop: `1px dashed #1e1b24`,
              paddingTop: 14,
            }}
          >
            <span>{done ? "[RETURN] SUBMIT" : "[ANY KEY] SKIP"}</span>
            <span style={{ color: TERM.phosphorDim }}>CONFIDENTIAL</span>
            <span>TAPE_01.HI8</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MinxxExplorer() {
  const [active, setActive] = useState("writing");
  const [loaded, setLoaded] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const link = document.createElement("link"); link.rel = "stylesheet"; link.href = FONTS_LINK; document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:${C.bg}}
      ::-webkit-scrollbar{width:6px}
      ::-webkit-scrollbar-track{background:${C.bg}}
      ::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px}

      /* ── MINXX_OS terminal animations ── */
      @keyframes mxBlink { 0%, 49% { opacity: 1 } 50%, 100% { opacity: 0 } }
      .mx-cursor {
        display: inline-block;
        animation: mxBlink 1s steps(1) infinite;
        color: ${TERM.phosphor};
        text-shadow: 0 0 4px ${TERM.phosphor}, 0 0 12px rgba(196,255,214,0.5);
      }

      @keyframes mxDots { 0% { content: "." } 33% { content: ".." } 66% { content: "..." } 100% { content: "" } }
      .mx-dots::after {
        content: "...";
        display: inline-block;
        width: 1.2em;
        text-align: left;
        animation: mxDotsCycle 1s steps(4) infinite;
      }
      @keyframes mxDotsCycle {
        0%   { content: ""; }
        25%  { content: "."; }
        50%  { content: ".."; }
        75%  { content: "..."; }
        100% { content: ""; }
      }

      @keyframes mxFlicker {
        0%, 100% { opacity: 1 }
        2%       { opacity: 0.82 }
        3%       { opacity: 1 }
        7%       { opacity: 0.94 }
        9%       { opacity: 1 }
        41%      { opacity: 0.92 }
        42%      { opacity: 1 }
        68%      { opacity: 0.88 }
        69%      { opacity: 1 }
      }
      .mx-phosphor { animation: mxFlicker 5.5s linear infinite }

      @keyframes mxRecPulse {
        0%, 100% { opacity: 1; text-shadow: 0 0 6px ${TERM.red}, 0 0 14px ${TERM.redGlow} }
        50%      { opacity: 0.35; text-shadow: 0 0 2px ${TERM.red} }
      }
      .mx-rec { animation: mxRecPulse 1.4s ease-in-out infinite }

      @keyframes mxScan {
        0%   { transform: translateY(-2px) }
        100% { transform: translateY(2px) }
      }
      .mx-scan { animation: mxScan 0.12s linear infinite alternate }

      @keyframes mxGlowIn {
        from { opacity: 0; filter: blur(6px) brightness(2) }
        to   { opacity: 1; filter: blur(0) brightness(1) }
      }
      .mx-crt { animation: mxGlowIn 0.9s ease-out }
    `;
    document.head.appendChild(style);
    try {
      if (typeof window !== "undefined" && window.localStorage && window.localStorage.getItem(AUTH_KEY) === "1") {
        setAuthed(true);
      }
    } catch (_) {}
    setTimeout(() => setLoaded(true), 100);
  }, []);

  function signOut() {
    try { localStorage.removeItem(AUTH_KEY); } catch (_) {}
    setAuthed(false);
  }

  if (!authed) {
    return (
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity .5s ease" }}>
        <SignInScreen onAuth={() => setAuthed(true)} />
      </div>
    );
  }

  const pillar = PILLARS.find(p => p.id === active);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, opacity: loaded ? 1 : 0, transition: "opacity .5s ease" }}>
      {/* HEADER */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.border}`, padding: "36px 32px 28px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(2rem, 5vw, 3rem)", color: C.text, letterSpacing: "-0.01em" }}>Minxx</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: C.textMuted, marginTop: 6 }}>Brand Strategy & Business Blueprint</div>
        <div style={{ width: 48, height: 2, background: C.terracotta, margin: "14px auto 0", borderRadius: 1 }} />
        <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: "0.88rem", color: C.textLight, marginTop: 10 }}>Prepared for Phoebe · Creative Direction by Omar Ranti · April 2026</div>
      </div>

      {/* NAV */}
      <div style={{ display: "flex", background: C.white, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        {PILLARS.map(p => <NavBtn key={p.id} active={active === p.id} label={p.label} num={p.num} accent={p.accent} onClick={() => setActive(p.id)} />)}
        <NavBtn active={active === "timeline"} label="Master Timeline" num="→" accent={C.terracotta} onClick={() => setActive("timeline")} />
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "36px 24px 80px" }}>
        {active !== "timeline" && pillar && (
          <div style={{ marginBottom: 32, animation: "fadeUp .4s ease" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", color: C.text }}>{pillar.label}</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: "1rem", color: pillar.accent, marginTop: 4 }}>{pillar.tagline}</div>
            <div style={{ width: 40, height: 2, background: pillar.accent, margin: "14px 0", borderRadius: 1 }} />
            <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: "0.92rem", color: C.textMed, lineHeight: 1.75, maxWidth: 680 }}>{pillar.description}</p>
          </div>
        )}
        {active === "timeline" && (
          <div style={{ marginBottom: 32, animation: "fadeUp .4s ease" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: "clamp(1.5rem, 3.5vw, 2.1rem)", color: C.text }}>Master Timeline</div>
            <div style={{ fontFamily: "'Source Serif 4', serif", fontStyle: "italic", fontSize: "1rem", color: C.terracotta, marginTop: 4 }}>Every milestone is a brick in the foundation</div>
            <div style={{ width: 40, height: 2, background: C.terracotta, margin: "14px 0", borderRadius: 1 }} />
          </div>
        )}

        {active === "writing" && <WritingView d={PILLARS[0]} />}
        {active === "camcorder" && <CamcorderView d={PILLARS[1]} />}
        {active === "modeling" && <ModelingView d={PILLARS[2]} />}
        {active === "visa" && <VisaView d={PILLARS[3]} />}
        {active === "timeline" && <TimelineView />}
      </div>

      {/* FOOTER */}
      <div style={{ textAlign: "center", padding: "32px 24px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: "1.1rem", color: C.text }}>Minxx</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", letterSpacing: "0.14em", color: C.textMuted, textTransform: "uppercase", marginTop: 6 }}>Confidential · Brand Strategy & Business Blueprint · April 2026</div>
        <button onClick={signOut} style={{ marginTop: 14, background: "transparent", border: "none", padding: "4px 8px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: C.textMuted, borderBottom: `1px solid ${C.border}` }}>Sign out</button>
      </div>
    </div>
  );
}
