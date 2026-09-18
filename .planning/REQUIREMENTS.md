# Requirements: Digital Diary

**Defined:** 2026-09-18
**Core Value:** A virtual diary that feels like an authentic physical handwritten notebook, rendering keyboard typing into realistic handwriting on textured paper pages without feeling like a generic dashboard.

## v1 Requirements

### Foundation & Design System (SCAFF)
- [ ] **SCAFF-01**: Next.js App Router project initialized with TypeScript, Tailwind CSS, and Lucide React.
- [ ] **SCAFF-02**: Warm, tactile journal design tokens defined (parchment hues, subtle grain, ruled lines, margin guides, ink colors, soft drop shadows).
- [ ] **SCAFF-03**: Modular component architecture with strict TypeScript types and zero backend/DB dependencies.

### Paper & Physical Notebook Canvas (PAGE)
- [ ] **PAGE-01**: Journal notebook layout with realistic spine binding, page depth, and delicate paper border styling.
- [ ] **PAGE-02**: Realistic ruled paper lines with aligned baseline grid for text.
- [ ] **PAGE-03**: Support for desktop two-page spread and mobile/tablet single-page responsive view.
- [ ] **PAGE-04**: Calming, minimalist aesthetic (no aggressive SaaS gradients, no dashboard clutter).

### Handwriting Typing Engine (TYPE)
- [ ] **TYPE-01**: Realistic cursive/handwritten typography loaded and configured.
- [ ] **TYPE-02**: Live keyboard input flow: user types on keyboard and text renders as ink on paper lines with natural line-height matching ruled guides.
- [ ] **TYPE-03**: Ink color selections (e.g., fountain pen midnight blue, carbon black, sepia walnut).
- [ ] **TYPE-04**: Clean title, date stamp, and body text layout with handwriting style.

### Navigation & Transitions (NAV)
- [ ] **NAV-01**: Smooth page turn transitions powered by Framer Motion with realistic page elevation shadows.
- [ ] **NAV-02**: Tactile bookmark ribbon and page number indicators.
- [ ] **NAV-03**: Next/Previous page controls and date navigation.

### Local Persistence & Storage (DATA)
- [ ] **DATA-01**: Client-side localStorage persistence for diary entries, dates, and selected preferences.
- [ ] **DATA-02**: Fast local entry browsing (open past dates, browse page history).
- [ ] **DATA-03**: Empty state with inviting journal prompt on fresh pages.

### Responsive & Tactile Polish (POLISH)
- [ ] **POLISH-01**: Fully responsive experience across desktop, tablet, and mobile devices.
- [ ] **POLISH-02**: Mobile touch-friendly page turn controls.
- [ ] **POLISH-03**: Strict TypeScript compliance and zero build/lint errors.

## v2 Requirements (Deferred)
- **AUDIO-01**: Subtle tactile audio toggles (delicate page turn sound, gentle pen on paper feedback).
- **EXPORT-01**: Export diary entries to styled PDF or markdown.
- **LOCK-01**: Optional client-side PIN / privacy blur lock.
- **PEN-01**: Multiple handwriting font styles (fountain pen script, casual print, neat cursive).

## Out of Scope
| Feature | Reason |
|---------|--------|
| User Authentication | Frontend-only rule; no accounts or auth servers |
| Database & Backend APIs | Strict requirement: no backend or remote database |
| Payments / Subscriptions | Free offline/local client tool |
| AI Text / Handwriting Generation | Excluded per project rules for v1 |
| SaaS Dashboards / Analytics Widgets | Must strictly maintain the feel of a personal physical journal |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SCAFF-01 | Phase 1 | Pending |
| SCAFF-02 | Phase 1 | Pending |
| SCAFF-03 | Phase 1 | Pending |
| PAGE-01 | Phase 1 | Pending |
| PAGE-02 | Phase 1 | Pending |
| PAGE-03 | Phase 1 | Pending |
| PAGE-04 | Phase 1 | Pending |
| TYPE-01 | Phase 2 | Pending |
| TYPE-02 | Phase 2 | Pending |
| TYPE-03 | Phase 2 | Pending |
| TYPE-04 | Phase 2 | Pending |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| DATA-01 | Phase 4 | Pending |
| DATA-02 | Phase 4 | Pending |
| DATA-03 | Phase 4 | Pending |
| POLISH-01 | Phase 5 | Pending |
| POLISH-02 | Phase 5 | Pending |
| POLISH-03 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓
