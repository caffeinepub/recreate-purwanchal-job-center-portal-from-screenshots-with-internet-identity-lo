# Specification

## Summary
**Goal:** Prevent admin login/unlock from getting stuck when the backend canister is stopped (IC0508 / Reject code 5), and show a clear, actionable English error message.

**Planned changes:**
- Update the admin access check (`isCallerAdmin`) error handling to detect “canister is stopped” / IC0508 / Reject code 5 and show a short friendly message that includes canister ID `gkorp-uqaaa-aaaab-qeptq-cai` and the recommended recovery action (restart/redeploy the canister and refresh).
- Ensure failed admin checks return the user to the admin gate with the error visible (no indefinite “Checking admin access...” state) and do not mark the admin session as unlocked.
- Centralize formatting/handling of replica/backend errors for admin unlock and admin CRUD mutations so “canister is stopped” errors are consistently displayed as the same friendly English message, while existing unauthorized/access-denied behavior remains unchanged.

**User-visible outcome:** If the backend canister is stopped during admin unlock or admin actions, the user sees a clear English message (including canister ID `gkorp-uqaaa-aaaab-qeptq-cai`) explaining the canister is stopped and advising to restart/redeploy and refresh; the admin UI remains responsive and retryable without unlocking the session.
