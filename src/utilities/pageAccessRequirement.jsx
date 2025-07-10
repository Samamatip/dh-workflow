import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const usePageAccessRequirement = (accessLevelRequired) => {
  const { user, isAuthenticated, loading, logOut } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== accessLevelRequired) {
      logOut();
    }
  }, [user, isAuthenticated, loading, accessLevelRequired, logOut]);
};