/**
 * Centralized logo asset URL with cache-busting version parameter.
 * Loads from Vite environment variable with fallback for safety.
 * Update VITE_LOGO_URL in .env files when the logo changes.
 */
export const LOGO_URL = import.meta.env.VITE_LOGO_URL || 'https://purwanchaljobs-s0q.caffeine.xyz/assets/logo%20job.jpg?v=6';
