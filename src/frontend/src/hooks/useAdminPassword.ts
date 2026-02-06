import { useState, useEffect } from 'react';

const ADMIN_PASSWORD_KEY = 'admin_session_password';
const CORRECT_PASSWORD = '@rewan10';

export function useAdminPassword() {
  const [sessionPassword, setSessionPassword] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(ADMIN_PASSWORD_KEY);
    if (stored === CORRECT_PASSWORD) {
      setSessionPassword(stored);
      setIsUnlocked(true);
    }
  }, []);

  const unlock = (password: string): boolean => {
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(ADMIN_PASSWORD_KEY, password);
      setSessionPassword(password);
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const lock = () => {
    sessionStorage.removeItem(ADMIN_PASSWORD_KEY);
    setSessionPassword(null);
    setIsUnlocked(false);
  };

  return {
    sessionPassword,
    isUnlocked,
    unlock,
    lock,
  };
}
