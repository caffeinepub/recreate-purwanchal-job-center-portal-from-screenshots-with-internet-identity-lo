/**
 * Centralized admin error formatting utility.
 * Detects stopped-canister errors (IC0508 / Reject code 5) and authorization errors,
 * returning user-friendly English messages with actionable guidance.
 */

const CANISTER_ID = 'gkorp-uqaaa-aaaab-qeptq-cai';

export interface AdminErrorResult {
  userMessage: string;
  shouldLockSession: boolean;
  isStoppedCanister: boolean;
  isAuthorizationError: boolean;
}

/**
 * Formats backend/replica errors for admin operations.
 * Recognizes stopped-canister errors and authorization errors.
 */
export function formatAdminError(error: any): AdminErrorResult {
  const message = error?.message || String(error);
  
  // Check for stopped canister error (IC0508 / Reject code 5 / "is stopped")
  const isStoppedCanister = 
    message.includes('is stopped') ||
    message.includes('IC0508') ||
    message.includes('Reject code: 5');
  
  if (isStoppedCanister) {
    return {
      userMessage: `The backend canister (${CANISTER_ID}) is currently stopped. Please restart or redeploy the canister, then refresh this page and try again.`,
      shouldLockSession: true,
      isStoppedCanister: true,
      isAuthorizationError: false,
    };
  }
  
  // Check for authorization errors
  const isAuthorizationError = 
    message.includes('Unauthorized') ||
    message.includes('Only admins') ||
    message.includes('trap');
  
  if (isAuthorizationError) {
    return {
      userMessage: 'Access denied. Admin privileges required. Please unlock the admin panel again.',
      shouldLockSession: true,
      isStoppedCanister: false,
      isAuthorizationError: true,
    };
  }
  
  // Generic error
  return {
    userMessage: message || 'An unexpected error occurred. Please try again.',
    shouldLockSession: false,
    isStoppedCanister: false,
    isAuthorizationError: false,
  };
}
