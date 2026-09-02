# 🎓 Glory International Admissions Fair — Design System

## 📋 Overview

A clean, professional design system for the Glory International Admissions Fair platform. The design conveys trust, academic credibility, and clarity — critical for Ethiopian students making life-changing education decisions.

---

## 🎨 Color Palette

### Primary Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Primary Action** | Bright Ocean | `#3e8fd2` | Buttons, links, active states, primary CTA |
| **Accent** | Amber Gold | `#f9bf31` | Highlights, badges, warnings, success indicators, alerts |
| **Brand Dark** | Carbon Black | `#1a1a19` | Primary text, headers, navigation |
| **Brand Deepest** | Black | `#030303` | Page titles, hero text, footer |

### Neutral Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Background** | Porcelain | `#fbfbf7` | Main page background, card backgrounds |
| **Background Alt** | White | `#ffffff` | Modals, dropdowns, input fields, elevated cards |
| **Muted Text** | Dim Grey | `#65625d` | Secondary text, placeholders, captions |
| **Borders** | Charcoal | `#4e4d4b` | Dividers, input borders, subtle separators |

### Accent Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| **Light Accent** | Pale Sky | `#cddde7` | Hover states, selected items, light backgrounds |
| **Info/Links** | Bright Ocean | `#3e8fd2` | Informational banners, link hover |

### Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| 🟢 **Green** | Eligible | `#22c55e` | Green result, verified payments, success |
| 🟡 **Yellow** | Review | `#f9bf31` | Yellow result, pending states, warnings |
| 🔴 **Red** | Not Matched | `#ef4444` | Red result, errors, failed states |
| 🔵 **Blue** | Info | `#3e8fd2` | Informational messages, links |
| ⚪ **Grey** | Neutral | `#65625d` | Inactive, disabled, secondary info |

---

## 📐 Design Tokens

### Spacing

```css
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
--space-3xl: 64px;
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(26, 26, 25, 0.05);
--shadow-md: 0 4px 6px rgba(26, 26, 25, 0.07);
--shadow-lg: 0 10px 15px rgba(26, 26, 25, 0.1);
--shadow-xl: 0 20px 25px rgba(26, 26, 25, 0.15);
```

### Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-display: 'Poppins', 'Inter', sans-serif;

--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;

--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

---

## 🖥️ Page Layouts

### 1. Landing / Registration Page

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER: White background, subtle bottom border                 │
│  ┌─────────┐                                    ┌────────────┐  │
│  │ 🎓 GLORY│  Navigation: About | FAQ | Contact │ [Login]    │  │
│  │  Logo   │                                    │ [Register] │  │
│  └─────────┘                                    └────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HERO SECTION: Porcelain background (#fbfbf7)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   Find Out Where Your Academic Profile                 │   │
│  │   Can Realistically Take You 🌍                        │   │
│  │   (Black #030303, 48px, bold)                          │   │
│  │                                                         │   │
│  │   Join 2,000+ Ethiopian students for the Glory         │   │
│  │   International Admissions Fair                        │   │
│  │   (Dim Grey #65625d, 18px, regular)                   │   │
│  │                                                         │   │
│  │   ┌──────────────────────────────────┐                 │   │
│  │   │   Register Now — 500 ETB         │ ← Amber Gold   │   │
│  │   │   (#f9bf31 bg, #030303 text)     │   button       │   │
│  │   └──────────────────────────────────┘                 │   │
│  │                                                         │   │
│  │   ✓ Profile Assessment  ✓ University Matching          │   │
│  │   ✓ Expert Review       ✓ Live Event Access            │   │
│  │   (Bright Ocean #3e8fd2 checkmarks)                    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FEATURES SECTION: White background (#ffffff)                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  📊 Profile  │ │  🎯 Matching │ │  🎓 Results  │           │
│  │  Assessment  │ │  Engine      │ │  & Next Steps│           │
│  │  (Icon: Ocean│ │  (Icon: Gold)│ │  (Icon: Ocean│           │
│  │   #3e8fd2)   │ │              │ │   #3e8fd2)   │           │
│  │              │ │              │ │              │           │
│  │  Complete    │ │  Matched to  │ │  Green/Yellow│           │
│  │  your profile│ │  universities│ │  /Red result │           │
│  │  for scoring │ │  worldwide   │ │  + next step │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
│  HOW IT WORKS: Porcelain background (#fbfbf7)                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  1. Register    2. Pay 500 ETB   3. Complete Profile   │   │
│  │  ───────○──────────────○──────────────○────→            │   │
│  │                                                         │   │
│  │  4. Assessment  5. Get Matched  6. Attend Fair         │   │
│  │  ───────○──────────────○──────────────○────→            │   │
│  │  (Bright Ocean #3e8fd2 step indicators)                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  FOOTER: Carbon Black background (#1a1a19)                      │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Glory Educational Consultancy © 2026                   │   │
│  │  (White #ffffff text, Dim Grey #65625d secondary)      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2. Registration Form

```
┌─────────────────────────────────────────────────────────────────┐
│  FORM CARD: White background (#ffffff), shadow-md, radius-lg    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Create Your Account                                    │   │
│  │  (Carbon Black #1a1a19, 24px, semibold)                │   │
│  │                                                         │   │
│  │  Full Name                                              │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Enter your full name                            │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │  (Border: Charcoal #4e4d4b, Focus: Ocean #3e8fd2)     │   │
│  │                                                         │   │
│  │  Email Address                                          │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ example@email.com                               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Phone Number        Education Level                   │   │
│  │  ┌──────────────┐   ┌─────────────────────────────┐   │   │
│  │  │ +251...       │   │ Select...                 ▼ │   │   │
│  │  └──────────────┘   └─────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Password                                               │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │ ••••••••                                       👁 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │  Min 6 characters (Dim Grey #65625d hint)              │   │
│  │                                                         │   │
│  │  ☐ I agree to the Terms and Conditions                 │   │
│  │  (Amber Gold #f9bf31 checkbox when checked)            │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │              Create Account                     │   │   │
│  │  │         (Bright Ocean #3e8fd2 bg, white text)   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Already have an account? Login                         │   │
│  │  (Bright Ocean #3e8fd2 link)                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 3. Student Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  SIDEBAR: Carbon Black (#1a1a19) background                     │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐ │
│  │ 🎓 GLORY │  │  TOP BAR: White (#ffffff)                    │ │
│  │          │  │  ┌──────────────────────┐  ┌──────────────┐  │ │
│  │ ─────── │  │  │ 🔍 Search...         │  │ 👤 Almaz T. │  │ │
│  │ 📊 Dash │  │  └──────────────────────┘  └──────────────┘  │ │
│  │ 📝 Prof │  │                                               │ │
│  │ 💳 Pay  │  │  MAIN CONTENT: Porcelain (#fbfbf7)           │ │
│  │ 📄 Docs │  │  ┌─────────────────────────────────────────┐ │ │
│  │ 🎯 Match│  │  │                                         │ │ │
│  │ 📋 Result│ │  │  Welcome back, Almaz! 👋                │ │ │
│  │ 📅 Event│  │  │  (Carbon Black #1a1a19, 28px)          │ │ │
│  │          │  │  │                                         │ │ │
│  │          │  │  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │ │ │
│  │ ─────── │  │  │  │ Profile  │ │ Payment  │ │ Docs   │ │ │ │
│  │ ⚙ Set  │  │  │  │ ✅ 100%  │ │ ✅ Paid  │ │ 📄 1/1 │ │ │ │
│  │          │  │  │  └──────────┘ └──────────┘ └────────┘ │ │ │
│  │          │  │  │                                         │ │ │
│  │          │  │  │  ┌──────────┐ ┌──────────┐ ┌────────┐ │ │ │
│  │          │  │  │  │ Assess   │ │ Match    │ │ Result │ │ │ │
│  │          │  │  │  │ ⏳ Pending│ │ ⏳ Pending│ │ ⏳ Pending│ │ │ │
│  │          │  │  │  └──────────┘ └──────────┘ └────────┘ │ │ │
│  │          │  │  │                                         │ │ │
│  │          │  │  │  Your Progress                          │ │ │
│  │          │  │  │  ┌─────────────────────────────────┐   │ │ │
│  │          │  │  │  │ ████████████░░░░░ 60% Complete  │   │ │ │
│  │          │  │  │  └─────────────────────────────────┘   │ │ │
│  │          │  │  │  (Bright Ocean #3e8fd2 progress bar)   │ │ │
│  └──────────┘  │  └─────────────────────────────────────────┘ │ │
│                └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Student Profile Card (Staff View)

```
┌─────────────────────────────────────────────────────────────────┐
│  STUDENT CARD: White background (#ffffff), shadow-md            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  🎓 GLORY INTERNATIONAL ADMISSIONS FAIR         │   │   │
│  │  │  (Bright Ocean #3e8fd2 background, white text) │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Student ID: GH26-000001                                │   │
│  │  (Amber Gold #f9bf31 badge)                            │   │
│  │                                                         │   │
│  │  Name: Almaz Tadesse                                    │   │
│  │  Education: Bachelor | GPA: 3.5                         │   │
│  │  Program: Computer Science                              │   │
│  │  Country: USA | English: IELTS 7.0                      │   │
│  │  (Carbon Black #1a1a19 text)                           │   │
│  │                                                         │   │
│  │  ────────────────────────────────────────────────────   │   │
│  │  (Charcoal #4e4d4b divider)                            │   │
│  │                                                         │   │
│  │  Assessment Score: 94/100                               │   │
│  │  (Bright Ocean #3e8fd2 score, Amber Gold #f9bf31 bar)  │   │
│  │                                                         │   │
│  │  Primary Match: MIT                                     │   │
│  │  Secondary Match: Stanford                              │   │
│  │  (Bright Ocean #3e8fd2 match cards)                    │   │
│  │                                                         │   │
│  │  Result: 🟢 Eligible to Apply                           │   │
│  │  (Green #22c55e badge)                                  │   │
│  │                                                         │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐              │   │
│  │  │ View Docs│ │ Edit     │ │ Publish  │              │   │
│  │  │ (Ocean)  │ │ (Grey)   │ │ (Gold)   │              │   │
│  │  └──────────┘ └──────────┘ └──────────┘              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Assessment Result Card (Student View)

```
┌─────────────────────────────────────────────────────────────────┐
│  RESULT CARD: Centered, max-width 600px                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  🎓 GLORY ADMISSIONS FAIR                       │   │   │
│  │  │  Assessment Result                               │   │   │
│  │  │  (Bright Ocean #3e8fd2 header)                  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Student: GH26-000001 — Almaz Tadesse                  │   │
│  │  Date: September 15, 2026                              │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │                                                 │   │   │
│  │  │   Primary Match                                 │   │   │
│  │  │   🏛️ Massachusetts Institute of Technology      │   │   │
│  │  │   📚 Computer Science                           │   │   │
│  │  │   📍 USA                                        │   │   │
│  │  │   (Bright Ocean #3e8fd2 left border)            │   │   │
│  │  │                                                 │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  🟢 ELIGIBLE TO APPLY                           │   │   │
│  │  │  (Green #22c55e background, white text)         │   │   │
│  │  │                                                 │   │   │
│  │  │  Your profile meets the preliminary criteria    │   │   │
│  │  │  for this institution.                          │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  Next Step: Application recommended                     │   │
│  │  (Carbon Black #1aa1a19 text)                          │   │
│  │                                                         │   │
│  │  ────────────────────────────────────────────────────   │   │
│  │                                                         │   │
│  │  ⚠️ Disclaimer                                         │   │
│  │  This is a preliminary assessment. Final admission      │   │
│  │  depends on the institution's official application.     │   │
│  │  (Dim Grey #65625d text, Pale Sky #cddde7 bg)          │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │     Start Application                           │   │   │
│  │  │     (Bright Ocean #3e8fd2 button)               │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Admin Analytics Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  STAT CARDS ROW: White cards on Porcelain background            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ 📊 Total │ │ 💳 Paid  │ │ 📝 Done  │ │ 🎯 Match │         │
│  │ 2,047    │ │ 1,823    │ │ 1,650    │ │ 1,200    │         │
│  │ students │ │ 89%      │ │ 81%      │ │ 59%      │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│  (Ocean #3e8fd2 icon, Carbon Black #1a1a19 number)             │
│                                                                 │
│  RESULTS BREAKDOWN:                                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🟢 Green: 650 (54%)                                   │   │
│  │  ████████████████████░░░░░░░░░░░░░░░░░░░               │   │
│  │  (Green #22c55e bar)                                    │   │
│  │                                                         │   │
│  │  🟡 Yellow: 350 (29%)                                  │   │
│  │  ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░               │   │
│  │  (Amber Gold #f9bf31 bar)                               │   │
│  │                                                         │   │
│  │  🔴 Red: 200 (17%)                                     │   │
│  │  ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░               │   │
│  │  (Red #ef4444 bar)                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  APPLICATION PIPELINE:                                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Interested: 200 → Consultation: 150 → AppStarted: 80 │   │
│  │  → DocsComplete: 60 → Submitted: 40 → Offer: 25       │   │
│  │  (Bright Ocean #3e8fd2 flow arrows)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 7. Representative Portal

```
┌─────────────────────────────────────────────────────────────────┐
│  REP DASHBOARD: Assigned Students                               │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Welcome, John Smith — MIT Representative               │   │
│  │  (Bright Ocean #3e8fd2 header)                         │   │
│  │                                                         │   │
│  │  Students Pending Review: 12                            │   │
│  │  (Amber Gold #f9bf31 badge)                            │   │
│  │                                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  📋 Student Card                                 │   │   │
│  │  │  GH26-000001 — Almaz Tadesse                    │   │   │
│  │  │  GPA: 3.5 | IELTS: 7.0 | CS                    │   │   │
│  │  │                                                  │   │   │
│  │  │  ┌─────────┐ ┌──────────┐ ┌─────────┐         │   │   │
│  │  │  │ 🟢 Green│ │ 🟡 Yellow│ │ 🔴 Red  │         │   │   │
│  │  │  │ Eligible│ │ Review   │ │ No Match│         │   │   │
│  │  │  └─────────┘ └──────────┘ └─────────┘         │   │   │
│  │  │  (Green #22c55e, Gold #f9bf31, Red #ef4444)    │   │   │
│  │  │                                                  │   │   │
│  │  │  Comments: [____________________________]       │   │   │
│  │  │                                                  │   │   │
│  │  │  [Submit Review] ← Bright Ocean #3e8fd2 button  │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 8. Event Check-In Page

```
┌─────────────────────────────────────────────────────────────────┐
│  CHECK-IN: Student view during event                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  📅 Glory Fair 2026                                    │   │
│  │  September 15, 2026 | 2:00 PM - 5:00 PM               │   │
│  │  (Carbon Black #1a1a19 title)                          │   │
│  │                                                         │   │
│  │  Your Sessions:                                         │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  📌 USA Session — MIT                           │   │   │
│  │  │  ⏰ 3:00 PM - 4:00 PM                           │   │   │
│  │  │  🔗 [Join Google Meet]                           │   │   │
│  │  │  (Bright Ocean #3e8fd2 link)                    │   │   │
│  │  │  (Pale Sky #cddde7 card background)             │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  │  ✅ Check-In                                            │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │  Enter check-in code (optional):                │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  │ GLORY2026                               │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │
│  │  │                                                 │   │   │
│  │  │  ┌─────────────────────────────────────────┐   │   │
│  │  │  │     ✓ I Attended This Session           │   │   │
│  │  │  │     (Bright Ocean #3e8fd2 button)       │   │   │
│  │  │  └─────────────────────────────────────────┘   │   │
│  │  │                                                 │   │   │
│  │  │  Or after the event:                            │   │   │
│  │  │  ☐ I did NOT attend this session               │   │   │
│  │  │  (Charcoal #4e4d4b checkbox)                   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Library

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #3e8fd2;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
}
.btn-primary:hover {
  background: #2d7bc0;
}

/* Accent Button */
.btn-accent {
  background: #f9bf31;
  color: #030303;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
}

/* Secondary Button */
.btn-secondary {
  background: #ffffff;
  color: #1a1a19;
  border: 1px solid #4e4d4b;
  border-radius: 8px;
  padding: 12px 24px;
}

/* Danger Button */
.btn-danger {
  background: #ef4444;
  color: #ffffff;
  border: none;
  border-radius: 8px;
}
```

### Status Badges

```css
.badge-green {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #22c55e;
}

.badge-yellow {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #f9bf31;
}

.badge-red {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.badge-blue {
  background: #cddde7;
  color: #1a1a19;
  border: 1px solid #3e8fd2;
}
```

### Cards

```css
.card {
  background: #ffffff;
  border: 1px solid #4e4d4b;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(26, 26, 25, 0.07);
  padding: 24px;
}

.card-header {
  background: #3e8fd2;
  color: #ffffff;
  border-radius: 12px 12px 0 0;
  padding: 16px 24px;
}
```

### Input Fields

```css
.input {
  background: #ffffff;
  border: 1px solid #4e4d4b;
  border-radius: 8px;
  padding: 12px 16px;
  color: #1a1a19;
}

.input:focus {
  border-color: #3e8fd2;
  box-shadow: 0 0 0 3px rgba(62, 143, 210, 0.1);
}

.input::placeholder {
  color: #65625d;
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile: < 640px */
/* Tablet: 640px - 1024px */
/* Desktop: > 1024px */

@media (max-width: 640px) {
  /* Stack stat cards vertically */
  /* Hide sidebar, use hamburger menu */
  /* Full-width forms */
}
```

---

## 🎯 Design Principles

1. **Trust First** — Clean, professional layout. No flashy animations. Academic credibility.
2. **Clarity Over Cleverness** — Every element has a clear purpose. Students shouldn't guess what to do.
3. **Progressive Disclosure** — Show what's needed now, hide what's next. Don't overwhelm.
4. **Color = Meaning** — Green = good, Yellow = caution, Red = action needed, Blue = information.
5. **Accessible** — Minimum 4.5:1 contrast ratio. Focus states visible. Screen reader friendly.
