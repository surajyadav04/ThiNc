# THiNC / Traverso Hand — Specialist Hand and Wrist Surgery

> **Practice**: Dr. Purnell Traverso, Hand & Wrist Surgeon, Coral Springs, Florida  
> **Brand**: THiNC™ Traverso Hand  
> **Reference Prototype**: Interactive 3D Medical Editorial Website  

---

## Quick Start & Viewing Instructions

### Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### Installation & Run

```bash
# 1. Install dependencies
npm install --ignore-scripts

# 2. Build for production (fully optimized static and client components)
npm run build

# 3. Start the production server
npx next start -p 3005
```

Open [http://localhost:3005](http://localhost:3005) in your web browser.

---

## Implemented Architecture & Storyboard Panels

1. **Header & Brand Navigation**: Stylized `TH` monogram, `THiNC™ TRAVERSO HAND` typography, editorial navigation links, cyan `Contact →` pill, and quick search.
2. **Immersive Hero**:
   - Editorial headline: *"Understand your hand"* with *"your hand"* highlighted in cyan.
   - Dual-tone atmosphere (luminous fluid clinical white on left transitioning into deep indigo on right).
   - Anatomical hand visual with interactive pins: `Thumb +`, `+ Fingers`, `Median nerve`, `+ Wrist`.
   - Right HUD panel with layer controls (`Surface`, `Bones`, `Tendons`, `Nerves`, `Joints`) and interactive 3D WebGL mode.
   - Carousel step navigation (`01 / 04`, `The structures that power your hand`).
3. **Scroll Journey (Anatomy Layers)**: Sequential 01–06 rail synchronized with layer isolation.
4. **Symptom Explorer**: Interactive clinical map with region selectors (`Wrist`, `Thumb`, `Fingers`, `Nerves`) and symptom callout pins.
5. **Focused Wrist Anatomy**: Dark indigo cutaway inspection with interactive median nerve target.
6. **Condition Page Deep-Dive**: Complete Carpal Tunnel Syndrome educational layout with tabs (Overview, Symptoms, Causes, Treatment, FAQs) and surgeon draft review notices.
7. **For Physicians**: Professional referral workflows and clinical liaison pathways without forcing role selection upfront.
8. **Patient Education Grid**: High-level cards for Carpal Tunnel, Thumb Arthritis, Trigger Finger, and Wrist Injuries.
9. **About the Practice**: Dr. Purnell Traverso's Coral Springs practice philosophy.
10. **Low-Friction Contact**: Minimal form strictly excluding sensitive Protected Health Information (PHI).

---

## Content & Compliance Standards
- **Strictly No Em Dashes or Emojis**: All visible UI text complies with the candidate brief guidelines.
- **No Invented Clinical Claims**: All medical content is explicitly marked as proposed drafts pending surgeon review.
- **Privacy & HIPAA Respect**: No collection of sensitive personal health records on web intake forms.
- **WCAG 2.2 AA Compliance**: Full keyboard support, screen-reader text alternatives, and `prefers-reduced-motion` compliance.
