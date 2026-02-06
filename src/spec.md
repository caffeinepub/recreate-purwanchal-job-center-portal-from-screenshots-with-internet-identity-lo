# Specification

## Summary
**Goal:** Fix social/contact branding links and switch the admin area to password-only access, including password-authorized admin backend operations and name-based recipient search.

**Planned changes:**
- Replace all placeholder Facebook and WhatsApp links across the UI with the provided Facebook profile URL and a working wa.me chat link for 9804968758.
- Render displayed phone numbers as tappable `tel:` links wherever they appear without changing layout/styling.
- Ensure the logo is present as a static asset at `frontend/public/assets/logo-job.jpg` so all existing `/assets/logo-job.jpg` references render correctly (landing, dashboard, admin).
- Add a password gate for all `/admin` routes using password `@rewan10`, storing unlocked state in session storage, and remove the Internet Identity requirement for viewing admin when unlocked.
- Update backend admin CRUD methods (jobs/posts) to require the admin password and reject otherwise, keeping logic in `backend/main.mo`.
- Wire admin frontend mutations to pass the session-stored password to the password-authorized backend methods; on invalid/missing password, show an English error and return to the password prompt state.
- Replace the admin recipient Principal ID input with a name-based user search + selection UI that sets the receiver principal while displaying the selected person’s name.
- Add a password-protected backend query to list/search user profiles (principal + name fields) for the admin recipient picker, supporting case-insensitive name filtering.

**User-visible outcome:** Facebook/WhatsApp buttons and phone numbers open the correct destinations, the logo displays everywhere it’s referenced, and the admin panel is accessible only after entering `@rewan10`—with admin CRUD working via password authorization and admin messaging selecting recipients by name instead of pasting a Principal ID.
