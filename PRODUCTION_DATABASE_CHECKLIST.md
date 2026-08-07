# Production Database Checklist

When launching the MR Institute of Learning platform to production, the Firestore database must be initialized properly.

## CRITICAL: Do NOT Use Development Seed Scripts
Unlike development environments, **you must start with a clean, empty Firestore database** in production. Running automated development seed scripts will result in mock data leaking into the live application. 

Instead, all data must be inserted securely through the **Developer CMS** or **Office Operations Portal** by an authorized administrator.

## Required Collections
The application relies on the following root collections being managed dynamically:

### Content Management System (CMS)
These collections power the public-facing website and are managed via `/developer`:
- `homepage`: Hero sections, featured items, and announcements.
- `about`: Institutional history, mission statements, and core values.
- `courses`: Academic programs, syllabus details, and pricing.
- `services`: Additional student or community services.
- `charity`: Charitable initiatives and donation goals.
- `gallery`: Public image grids and media.
- `settings`: Global site settings and SEO configurations.
- `forms`: Dynamically generated form structures.

### Operations & CRM
These collections handle incoming data and are managed via `/office`:
- `applications`: Course admissions and student applications.
- `students`: Admitted student records.
- `enquiries`: General contact and WhatsApp leads.
- `scholarships`: Scholarship program applications.
- `charityApplications`: Aid or donation requests.
- `notifications`: Internal system alerts.
- `activityLogs`: Immutable audit logs of administrative actions.

## First Steps After Launch
1. Ensure the first Developer account is created (See `ADMIN_SETUP.md`).
2. Log in to the Developer CMS.
3. Configure the `homepage` and `settings` collections first, as these are critical for the public website to render without falling back to empty states.
