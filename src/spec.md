# Specification

## Summary
**Goal:** Recreate the Purwanchal Job Center portal UI from the provided screenshots and make it fully functional with Internet Identity authentication, per-user onboarding/profiles, user dashboard features, and an admin CMS.

**Planned changes:**
- Recreate the public landing page layout/theme from screenshots (header with logo/title/subtitle, contact info strip, three feature cards, and centered Get Started login card) with responsive behavior.
- Add static asset handling for the uploaded logo and render it in the header/hero in a contained/circular style.
- Implement Internet Identity login/logout for regular users and route protection for authenticated areas.
- Create per-user profile persistence keyed by Principal; enforce first-login onboarding to collect required details; allow profile view/edit afterward.
- Build authenticated user dashboard with tabbed navigation and routes: Browse Jobs, My Applications, Messages, Updates, Profile, including empty states.
- Implement jobs data model and UX: list + search, job detail view, apply flow, and per-user applications list.
- Implement Updates/Posts feature: admins publish posts (optional image) and users view newest-first list.
- Implement Messages feature: user-to-admin and admin-to-user (broadcast or per-user) messaging with simple inbox/history UI and backend access enforcement.
- Implement admin login entry point and role-based access control via an admin allowlist; block non-admin access to admin routes/methods.
- Build admin panel CMS for CRUD on vacancies and posts/updates, plus image upload/manage for posts/site content.
- Apply a consistent Tailwind theme across landing, dashboard, and admin to match the screenshots (light background, soft shadows, blue accents, rounded cards).

**User-visible outcome:** Users can visit a landing page matching the screenshots, sign in with Internet Identity, complete first-time onboarding, browse/apply to jobs, view their applications, read updates, message admins, and manage their profile; admins can log in to an admin panel to manage jobs, posts, images, and messaging with proper access control.
