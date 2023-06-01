import { useEffect, useState } from 'react';

const TIME_LIMIT = 1000 * 60 * 30; // 30분
export default function useCheckUserActive() {
  const [userActive, setUserActive] = useState(true);

  useEffect(() => {
    let timeoutId: any;

    const resetTimeout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setUserActive(false);
      }, TIME_LIMIT);
    };

    const handleUserActivity = () => {
      resetTimeout();
      setUserActive(true);
    };

    document.addEventListener('mousemove', handleUserActivity);
    document.addEventListener('keydown', handleUserActivity);
    document.addEventListener('click', handleUserActivity);

    resetTimeout();

    return () => {
      document.removeEventListener('mousemove', handleUserActivity);
      document.removeEventListener('keydown', handleUserActivity);
      document.removeEventListener('click', handleUserActivity);
      clearTimeout(timeoutId);
    };
  }, []);
  return { userActive };
}
