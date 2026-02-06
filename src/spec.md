# Specification

## Summary
**Goal:** Replace the app’s existing logo asset so all current `/assets/logo-job.jpg` image references display the newly uploaded logo.

**Planned changes:**
- Update/replace `frontend/public/assets/logo-job.jpg` with the newly uploaded logo image.
- Verify the logo renders correctly everywhere it is currently used (landing hero/footer, dashboard header/footer, admin header) without changing any existing `<img src="/assets/logo-job.jpg" ... />` paths.

**User-visible outcome:** The new logo appears across the landing page, dashboard, and admin areas with no broken images, while all existing logo `src` references remain unchanged.
