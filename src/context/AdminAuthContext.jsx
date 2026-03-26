import { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI } from '../utils/api';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    const loadAdmin = async () => {
      if (token) {
        try {
          const response = await adminAuthAPI.getMe();
          setAdmin(response.data.admin);
        } catch (error) {
          console.error('Failed to load admin:', error);
          localStorage.removeItem('adminToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    loadAdmin();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await adminAuthAPI.login({ email, password });
      const { token, admin } = response.data;

      localStorage.setItem('adminToken', token);
      setToken(token);
      setAdmin(admin);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Admin login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setAdmin(null);
  };

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    isAdminAuthenticated: !!admin
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
