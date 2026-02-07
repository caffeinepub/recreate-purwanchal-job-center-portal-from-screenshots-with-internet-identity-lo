import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { formatAdminError } from '../utils/adminErrorFormatting';

const ADMIN_UNLOCKED_KEY = 'admin_session_unlocked';

export function useAdminPassword() {
  const { actor } = useActor();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [checkError, setCheckError] = useState<string>('');

  useEffect(() => {
    const checkAdminStatus = async () => {
      const stored = sessionStorage.getItem(ADMIN_UNLOCKED_KEY);
      if (stored === 'true' && actor) {
        try {
          const isAdmin = await actor.isCallerAdmin();
          setIsUnlocked(isAdmin);
          if (!isAdmin) {
            sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
          }
          setCheckError('');
        } catch (error: any) {
          const errorResult = formatAdminError(error);
          sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
          setIsUnlocked(false);
          setCheckError(errorResult.userMessage);
        }
      }
      setIsChecking(false);
    };

    if (actor) {
      checkAdminStatus();
    } else {
      // If actor is not available, stop checking to avoid infinite loading
      setIsChecking(false);
    }
  }, [actor]);

  const unlock = async (password: string): Promise<{ success: boolean; error?: string }> => {
    if (!actor) {
      return { success: false, error: 'System not ready. Please try again.' };
    }

    try {
      // Check if user is already an admin
      const isAdmin = await actor.isCallerAdmin();
      
      if (isAdmin) {
        sessionStorage.setItem(ADMIN_UNLOCKED_KEY, 'true');
        setIsUnlocked(true);
        setCheckError('');
        return { success: true };
      } else {
        return { success: false, error: 'Access denied. You do not have admin privileges.' };
      }
    } catch (error: any) {
      console.error('Admin unlock error:', error);
      const errorResult = formatAdminError(error);
      
      // Clear session if needed
      if (errorResult.shouldLockSession) {
        sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
        setIsUnlocked(false);
      }
      
      return { 
        success: false, 
        error: errorResult.userMessage
      };
    }
  };

  const lock = () => {
    sessionStorage.removeItem(ADMIN_UNLOCKED_KEY);
    setIsUnlocked(false);
    setCheckError('');
  };

  return {
    isUnlocked,
    isChecking,
    checkError,
    unlock,
    lock,
  };
}
