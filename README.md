# Kiddies Town ECD & Academy - Developer & Architecture Guide

A state-of-the-art, fully responsive early childhood development (ECD) web-based applet designed with premium design standards. Built with a unified **React 19 + TypeScript + Express + Node.js** full-stack architecture, it delivers real-time dashboards for Parents, Teachers, and Administrators, with strict POPIA-compliant data structures.

---

## 🎨 Visual Identity & Style Principles

This platform avoids generic templates and "AI slop" styles by following high-end, responsive Swiss-meets-Tech brand guidelines.

- **Primary Display Typography**: Using **Outfit** for elegant, balanced, and friendly brand headers and numbers.
- **Body & Controls Typography**: Incorporating **Inter** for clean, legible interface text.
- **Monospace Elements**: Applying **JetBrains Mono** for status flags, counters, reference codes, and billing information.
- **Color Palette**: An elegant, eye-safe slate theme focused on deep indigos (`slate-900`, `indigo-950`), pristine white cards (`white`), subtle boundaries (`slate-100`), and warm, professional indicators (emerald, amber, and orange highlights).
- **Interactive Affordances**: Framed cards possess smooth bezier-curves (`premium-card-hover` with `cubic-bezier(0.16, 1, 0.3, 1)`), subtle backdrop glass filters (`glass-card`), and dynamic focus states.

---

## 🚀 Key System Capabilities

1. **Aesthetic Brand Landing Page**
   - High-grade, contextual program hero galleries featuring filterable photographic sliders.
   - Beautifully designed responsive bento grid showcasing security compliance, billing buffers, milestone tracking, and daily regional ECD CBD shuttle pick-ups.
2. **Tri-Portal Dashboard Framework**
   - **Parent Hub**: Visualizes child's attendance, daily visual schedules, class themes, school fee notices, teacher chat conduits, and real-time learning milestone charts.
   - **Teacher Console**: Enables instant assessment grading of child milestones across ten distinct developmental indicators (social-emotional, fine motor, literacy, numeracy), and live direct parent messaging.
   - **Principal Admin Center**: Manages centralized enrolment applications, financial receipts, tuition statistics, database state sync tables, and emergency broadcasts.
3. **South African POPI Act (POPIA) Compliance**
   - Secure and authenticated role endpoints protect child files, birth records, phone numbers, and home addresses.
   - Prevents public index caching or exposing children's identities to unauthorized visitors.
4. **Interactive Enrolment Wizard**
   - Dynamic step-by-step progress wizard capturing detailed biographical info, language choices, medical details, and parent contacts.
5. **Dynamic PDF Generation**
   - A fully functional, server-compiled developmental guide generator driven by `pdfkit` that produces high-fidelity downloadable PDFs for users.

---

## 📂 Codebase Directory Layout

```bash
├── .env.example              # Env template for database connection keys
├── metadata.json             # AI Studio applet capabilities & permissions
├── package.json              # Unified dependencies, scripts, & build setups
├── server.ts                 # Full-stack Express entry point, API router, & DB seeder
├── tsconfig.json             # TypeScript rules for compiler stripping
├── vite.config.ts            # Vite asset-bundling configuration
├── assets/
│   └── .aistudio/            # Platform-specific environment settings
└── src/
    ├── App.tsx               # Main client-side router, shell, & theme controller
    ├── index.css             # Tailwind CSS configurations, fonts, and global variables
    ├── main.tsx              # React mounting root
    ├── types.ts              # Absolute type definitions & academic scoring enums
    ├── components/
    │   ├── LandingPage.tsx   # Premium brand showcase and interactive photography
    │   ├── ParentDashboard.tsx   # Child visual tracking, lesson plans, & chat portal
    │   ├── TeacherDashboard.tsx  # Assessment recorders & developmental scorecard sliders
    │   ├── AdminDashboard.tsx    # General enrolment tracker & financial counters
    │   ├── EnrolmentWizard.tsx   # Dynamic step-by-step applicant progress form
    │   ├── ProgressReportView.tsx# Gorgeous downloadable scorecard progress visualizers
    │   ├── LoginPage.tsx         # Universal school credentials gateway
    │   └── KiddiesTownLogo.tsx   # Custom vector logo rendering component
    │
    ├── data/
    │   └── mockData.ts       # Structured seed records, events, & lessons
    └── lib/
        ├── utils.ts          # Shadcn class merging helper
        └── generatePdf.ts    # Server-side pdfkit blueprint generator
```

---

## 🗄️ Database Architecture & Cloud Synchronization

The platform utilizes a hybrid **Durable Cloud PostgreSQL (`@neondatabase/serverless`) + Transient Memory Fallback** data layer.

- **Cloud Connect**: If a `DATABASE_URL` is detected in the environment variables, the system automates database bootstrapping by building all required tables, syncing foreign data, and seeding updated ECD matrices inside PostgreSQL.
- **Graceful Fail-Safe**: If no environment keys are present, the application runs on an instantly available in-memory buffer, mapping state transformations dynamically to preserve full mock authenticity as you click and interact.

### Relational Tables Structure:
1. `kt_users`: User roles, emails, hashed assets, and registration states.
2. `kt_learners`: Student biographical records, class listings, and attendance monitors.
3. `kt_parent_profile`: Emergency contact information and POPIA consents.
4. `kt_progress_reports`: Terminal scorecard scores across 10 developmental tracks.
5. `kt_payments`: Fee ledgers, invoice status flags, and school reference codes.
6. `kt_chats`: Safe encrypted principal-parent text streams.
7. `kt_weekly_themes`: Lesson structures, sensory walks, and physical motor goals.
8. `kt_school_events`: Community events, concert schedules, and RSVP counts.
9. `kt_journal`: Weekly classroom highlights displaying lesson journals.
10. `kt_enrolments`: Registered applications submitted via the Enrolment Wizard.

---

## 🔌 API Route Registers

### Authentication Endpoints
- **`POST /api/auth/signup`**: Registers clean parent, teacher, or admin profiles. When a new parent registers, it automatically populates their portal with custom mocked junior school children profiles, starting milestones, and pending school fee ledgers so their initial system setup presents realistic mock data instantly.
- **`POST /api/auth/login`**: Authenticates role categories.

### System Orchestration
- **`GET /api/all-data`**: Resolves combined data feeds customized directly for the logged-in user profile (filtered via query params).
- **`POST /api/admin/reset-db`**: Re-boots schema structures, synchronizes and cleans tables back to initial mockData definitions. Perfect for live demonstrations or testing fresh records.
- **`GET /api/guide/download-pdf`**: Dynamically compiles and downloads a highly-annotated PDF guide containing structured guidelines for milestones.

### Live Update Conduits (Writes securely to Cloud or Memory Cache)
- `POST /api/learners`
- `POST /api/parent-profile`
- `POST /api/progress-reports`
- `POST /api/payments`
- `POST /api/chats`
- `POST /api/events`
- `POST /api/themes`
- `POST /api/journal`
- `POST /api/enrolments`

---

## 💻 Setup & Operational Commands

### Development Server Runs on Port 3000

To execute the application locally with complete type-stripping support:

```bash
npm run dev
```

### Clean Compiled Production Build

The production compilation pipeline compiles the React client-side bundles and bundles the backend TypeScript server into a streamlined, high-speed CommonJS package inside `dist/server.cjs` via `esbuild`:

```bash
npm run build
```

To run the compiled production build:

```bash
npm start
```

### Static Syntactic Guard & Linter Checks

Runs typescript diagnostic validation to guard against fatal issues or imports:

```bash
npm run lint
```
