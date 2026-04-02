# True Care Clinic

This project is organized as a small React + Vite + TypeScript app for a cosmetic clinic website.

## Suggested folder structure

```text
TrueCare/
├── index.html
├── package.json
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx
│   │   ├── forms/
│   │   │   └── LeadCaptureForm.tsx
│   │   └── sections/
│   │       ├── AppointmentSection.tsx
│   │       ├── DoctorSection.tsx
│   │       ├── HeroSection.tsx
│   │       └── ServicesSection.tsx
│   ├── constants/
│   │   └── forms.ts
│   ├── data/
│   │   ├── services.ts
│   │   └── siteContent.ts
│   ├── hooks/
│   │   └── useAppointmentForm.ts
│   ├── lib/
│   │   └── validation.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── ServicePage.tsx
│   ├── services/
│   │   └── appointments.ts
│   ├── styles/
│   │   └── global.css
│   ├── vite-env.d.ts
│   ├── types/
│   │   └── clinic.ts
│   └── theme/
│       └── appTheme.ts
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
└── .gitignore
```

## Run locally

```bash
npm install
npm run dev
```

The form layer currently uses a typed mock API service so you can connect a real backend later by replacing `src/services/appointments.ts`.
