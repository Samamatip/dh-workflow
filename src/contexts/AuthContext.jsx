'use client';
import React, { useEffect, useState, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { getUserService } from '@/services/authServices';

// Create a context for authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

    try {
      setLoading(true);

      if (token && token !== 'undefined' && token !== null) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp < currentTime) {
            // Token has expired
            console.log('Token has expired');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
            setUser(null);
            if (pathname && !pathname.startsWith('/auth')) {
              router.push('/auth');
            }
          } else {
            // Token is valid
            setIsAuthenticated(true);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              // Fetch user data from API
              try {
                const userData = await getUserService();
                if (userData.data) {
                  setUser(userData.data);
                  localStorage.setItem('user', JSON.stringify(userData.data));
                } else {
                  console.error('Error getting user data:', userData.error);
                  localStorage.removeItem('token');
                  setIsAuthenticated(false);
                  setUser(null);
                  if (pathname && !pathname.startsWith('/auth')) {
                    router.push('/auth');
                  }
                }
              } catch (error) {
                console.error('Error fetching user data:', error);
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
                if (pathname && !pathname.startsWith('/auth')) {
                  router.push('/auth');
                }
              }
            }
          }
        } catch (error) {
          console.error('Invalid token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          setUser(null);
          if (pathname && !pathname.startsWith('/auth')) {
            router.push('/auth');
          }
        }
      } else {
        // No token found
        setIsAuthenticated(false);
        setUser(null);
        if (pathname && !pathname.startsWith('/auth')) {
          router.push('/auth');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated && pathname && !pathname.startsWith('/auth')) {
    return <div>Redirecting...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setUser,
        logOut,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};