# Kunaal Ravindran — Personal Website Design Spec
**Date:** 2026-05-11  
**Stack:** Next.js 14 (App Router) + Framer Motion + Tailwind CSS  
**Hosting:** Vercel

---

## 1. Design Language

| Decision | Choice |
|---|---|
| Theme | Dark — pure black `#000000` background |
| Palette | Pure Monochrome — white text, white glows, no colour |
| Hero style | Cosmic Dark — twinkling particles, radial breathing glow |
| Navigation | Side Dot Navigation — vertical dots + labels on left edge |
| Animation library | Framer Motion |
| Typography | System sans-serif for body; large 800-weight display type for headings |
| Vibe | High-budget · Clean · Elegant · Editorial · Cinematic |

---

## 2. Navigation

- Fixed vertical dot nav on left edge of viewport
- 5 dots — one per section: Home · Work · Skills · Life · Connect
- Active dot: white, slightly larger, soft glow
- Inactive dots: dim white
- Labels appear on hover (fade in, uppercase, letter-spaced)
- Smooth-scrolls to section on click

---

## 3. Page Sections

### 3.1 Hero (Section 01 — Home)
- Full-screen black canvas
- **Content:**
  - Eyebrow: `Adelaide, Australia · Open to opportunities`
  - Name: `KUNAAL RAVINDRAN` — large, 800-weight, letter-spaced
  - Horizontal divider line (draws in on load)
  - Typewriter role cycle: *AI Engineer → Systems Builder → Sous Chef → World Traveler → Chess Player*
  - CTAs: LinkedIn (primary white button) · GitHub · View Work ↓
- **Background:** Twinkling white micro-particles + radial breathing glow behind name
- **Animations:** Staggered fade-up on load (eyebrow → name → divider → role → CTAs), ~2s total
- **Scroll hint:** animated line pulses downward at bottom center

---

### 3.2 The Work (Section 02)
**Experience — horizontal drag-scroll card track**

Cards (left to right):
| Company | Role | Type | Link |
|---|---|---|---|
| Fit Chef Australia | End-to-End IT Lead · $2.5M Revenue | Current | fitchefaus.com |
| Independent AI Consultant | Strategic AI Advisory | Current | — |
| Digital Converters | Systems Eng · Front End | Current | — |
| Super Cheap Auto | Retail Team Member · Casual | Current | — |
| Sunoida Solutions | BI Consultant · Chennai | Past | — |
| Kals Breweries & Distilleries | SAP QA Tester · Chennai | Past | — |

- Current cards: slightly wider, brighter border, "Current" badge
- Past cards: dimmed (75% opacity), lift to full on hover
- Thin vertical divider between Current and Past groups
- Website links on Fit Chef card: `fitchefaus.com ↗`
- Drag gesture (mouse + touch)

**Projects — 2-column grid below the track**
| Project | Type | Link |
|---|---|---|
| McGee's Property — Power BI | Data · Dashboard | adl.mcgees.com.au ↗ |
| ShopHunt | Full Stack · React | — |
| Spidey | Python · Automation · Privacy | — |
| FindUni | Machine Learning · Data Science | — |

- Cards fade + slide up on scroll-in
- Each card: name, type label, website link (if applicable), description, tech tags

---

### 3.3 The Skills (Section 03)
**Stats row (4 blocks):**
- 5+ Years Experience
- $2.5M Revenue Managed
- 5 Active Roles
- 10+ Projects Shipped

Stats count up from zero when section enters viewport.

**4 skill category blocks (2×2 grid):**
| Category | Primary Skills |
|---|---|
| Artificial Intelligence | Claude API · Agentic Systems · Intelligent Automation · AI Evaluation · Responsible AI · Azure AI · Machine Learning · AI Governance |
| Data & Analytics | Power BI · SQL · DAX · Power Automate · Data Modelling · SAP HANA |
| Development | Python · React · Next.js · HTML5/CSS3 · C++ · REST APIs · Selenium · Git |
| Enterprise & Systems | SharePoint · Azure DevOps · ServiceNow · Jira · SAP · Systems Architecture · ITSM |

- Brighter pills = primary skills; dimmer = supporting
- Top edge of each block sweeps in on hover (gradient line)
- Pills stagger-fade in on scroll

---

### 3.4 The Life (Section 04)
**Expanded bento grid — 2 rows of tiles**

**Row 1 (3 columns):**
- **Travel** (tall, spans both rows on left) — world map with glowing dots, stat pills, India broken by region (North/South/Kerala/West), international cities
- **Sports** (top center) — Tennis · Padel · Badminton · Pickleball, all Advanced (3/5 dots)
- **Chess** (top right) — mini board + link to chess.com/member/kunaal_k3

**Row 2 (right 2 columns — 3 smaller tiles):**
- **Fitness & Gym** — Journey since 2019. Started from body shaming/dysmorphia, first push-up in a bedroom, became an obsession and lifestyle. Deep interest in training, diet and nutrition.
- **Cars, Racing & F1** — Childhood passion. Read Autocar, Top Gear, Zig Wheels magazines. Watched Top Gear TV series from childhood. F1 fan. Into go-karting, Top Golf, bowling.
- **More** tile (Photography + Gaming nostalgia) — Photography interest. Former obsessive gamer: NFS, Naruto, God of War, Spiderman, Road Rash, GTA Vice City/San Andreas, CoD4 multiplayer (competed against a university team in high school).

**Food tile (wide, spans full width below bento):**
- Sous Chef trained
- Favourite cuisines: Japanese · Turkish · Thai · Italian · Arabic · Chettinad · North Indian
- Food icons (grayscale → colourize on hover)

**Travel detail:**
- India grouped by region: North (Delhi, Manali, Dharamshala, Kasol) · South (Chennai, Bangalore, Hyderabad, Ooty, Kodaikanal) · Kerala (Kochi, Thrissur, Guruvayur, Varkala, Poovar) · West (Goa, Pune)
- International: Japan (Tokyo, Osaka, Kyoto, Nara, Hiroshima) · Australia (Sydney, Melbourne, Brisbane, Adelaide) · Thailand (Bangkok, Pattaya) · Malaysia × 2 · Singapore × 2 · UAE (Dubai, Abu Dhabi) · Bali · Hong Kong · Sri Lanka · China
- Real site: SVG world map, hovering India shows regional breakdown tooltip
- 15+ countries stat pill

---

### 3.5 Let's Connect (Section 05)
**Headline:** "Let's build something great together." — types in word by word on scroll-in

**Intro copy:** "Whether it's an AI project, a tech conversation, a game of chess, or just a hello — I'm always open to connecting with interesting people."

**Link cards (2-col grid):**
| Card | Style | Link |
|---|---|---|
| LinkedIn | Full-width white (inverted) — primary CTA | **TODO: user to provide LinkedIn URL** |
| GitHub | Dark secondary | **TODO: user to provide GitHub URL** |
| Chess.com — kunaal_k3 | Dark secondary | chess.com/member/kunaal_k3 |

**Email rows:**
- Personal: `kunaal20011106@gmail.com`
- Work: `kunaal@digitalconverters.com.au`

**Footer:** `Kunaal Ravindran · Adelaide, Australia · 2025`

---

## 4. Animation System

| Element | Animation |
|---|---|
| Hero load | Staggered fade-up: eyebrow → name → divider → role → CTAs |
| Typewriter | Cycles through 5 roles, 90ms/char type, 60ms/char delete, 1.8s pause |
| Particles | CSS keyframe twinkle, random delays |
| Section entry | Framer Motion `whileInView` fade + translateY(20px → 0) |
| Skill pills | Stagger children on viewport entry |
| Stats | Count-up animation on viewport entry |
| Work cards | Drag-to-scroll (Framer Motion drag) |
| Life tiles | Hover lift (translateY -3px, border brighten) |
| Connect headline | Word-by-word reveal on scroll |
| Side dots | Active dot glows and grows on section change |

---

## 5. Responsive Behaviour

- **Desktop (≥1024px):** Full layout as designed
- **Tablet (768–1023px):** Side dots collapse to bottom dot row; work cards scroll horizontally; bento grid 2-col
- **Mobile (<768px):** Side dots hidden; hamburger or swipe nav; single column; hero name scales down

---

## 6. File Structure

```
/app
  layout.tsx          — root layout, fonts, metadata
  page.tsx            — single-page scroll composition
/components
  Hero.tsx
  Work.tsx
  Skills.tsx
  Life/
    LifeSection.tsx
    TravelTile.tsx
    SportsTile.tsx
    ChessTile.tsx
    FitnessTile.tsx
    CarsTile.tsx
    MoreTile.tsx
    FoodTile.tsx
  Connect.tsx
  SideNav.tsx
/lib
  useActiveSection.ts — tracks which section is in view
```

---

## 7. Verification

- [ ] Run `npm run dev` — site loads on localhost:3000
- [ ] All 5 sections visible and scroll smoothly
- [ ] Side dot nav updates active state on scroll
- [ ] Hero typewriter cycles all 5 roles
- [ ] Work cards drag horizontally
- [ ] Fit Chef and McGee's links open correctly
- [ ] Chess.com link opens kunaal_k3 profile
- [ ] Both email addresses present in Connect section
- [ ] Life bento renders all tiles (travel, sports, chess, fitness, cars, more, food)
- [ ] Deploy to Vercel — production URL works
- [ ] Mobile layout checked at 375px and 768px
