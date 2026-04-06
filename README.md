# True Care Clinic

True Care Clinic is a React + Vite + TypeScript clinic website with a live admin dashboard, editable site sections, consultation lead tracking, and Supabase-backed content storage.

## What’s Included

- Public marketing site with home, about, doctor, services, gallery, and consultation sections
- Admin dashboard with visitor, lead, and booking analytics
- Lead management board for consultation requests
- Editable site sections for:
  - top bar
  - header
  - home hero
  - about
  - doctor
  - services
  - gallery
  - testimonials
  - appointment block
  - contact
  - footer
- Footer social media links editable from admin
- Supabase-backed storage with local fallback for site content

## Local Setup

```bash
npm install
npm run dev
```

Open:
- Home: `http://localhost:5173/`
- Admin login: `http://localhost:5173/#/admin/login`
- Admin dashboard: `http://localhost:5173/#/admin`
- Admin content pages are linked from the dashboard, including `Home`, `Header`, `Top Bar`, `About`, `Doctor`, `Services`, `Gallery`, `Testimonials`, `Appointment`, `Contact`, and `Footer`

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.safe.sql` in the Supabase SQL editor for first-time setup.
3. Add a local `.env` file in the project root:

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_publishable_key
```

4. If the base schema is already installed, run `supabase/daily-stats-migration.sql` when adding the daily visitor summary layer.
5. Run `supabase/admin-auth-migration.sql` once for the admin profile/auth flow.

## Admin Login

1. In Supabase, create an auth user under `Authentication -> Users`.
2. Add a matching row in `public.admin_profiles`:

```sql
insert into public.admin_profiles (id, role, full_name)
values ('<paste-auth-user-id-here>', 'admin', 'Your Name');
```

3. Open `http://localhost:5173/#/admin/login` and sign in.

## How Content Editing Works

The shared content store saves each section as one row in `site_sections`:

- `section_key` identifies the section, such as `truecare-site-header` or `truecare-site-footer`
- `content` stores the JSON payload for that section
- admin saves update the table through the shared content store
- the live site reads the same stored content and falls back to defaults if Supabase is unavailable

The footer social media handles are also editable now from the footer admin page.

## Live GitHub Pages

1. Open the repository in GitHub.
2. Go to `Settings -> Secrets and variables -> Actions`.
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Push to `main` or re-run the Pages workflow.

## Notes

- The admin and analytics data are currently designed for the Supabase-backed phase.
- Site content saves locally too, which keeps the app usable if Supabase is unavailable.
- The project is deployed through GitHub Pages with hash routes for the admin area.
