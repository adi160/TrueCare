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

## Supabase setup

1. Create a Supabase project.
2. For a first-time run, paste `supabase/schema.safe.sql` into the SQL editor and run it.
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to a local `.env` file.
4. The booking form, page views, and admin dashboard will start using Supabase automatically when the variables are present.
5. If you already ran the base schema once, use `supabase/daily-stats-migration.sql` for the new visitor summary table instead of rerunning the whole schema.
6. For admin login, also run `supabase/admin-auth-migration.sql` once so the signed-in admin can read their own profile row.

## Admin login setup

1. In Supabase, create an auth user for yourself in `Authentication -> Users`.
2. Add a matching row in `public.admin_profiles` with that user id and role `admin`, for example:
   ```sql
   insert into public.admin_profiles (id, role, full_name)
   values ('<paste-auth-user-id-here>', 'admin', 'Your Name');
   ```
3. Open the app at `#/admin/login` and sign in with that email and password.

## Live GitHub Pages setup

1. In your GitHub repo, open `Settings -> Secrets and variables -> Actions`.
2. Add two repository secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Push to `main` again or run the Pages workflow manually.
4. GitHub Actions will inject those values during the build, so the live site can use Supabase too.
