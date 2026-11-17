import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cognevance_user');
      return saved
        ? JSON.parse(saved)
        : {
            _id: 'user-demo-customer',
            name: 'Demo Client',
            email: 'customer@cognevance.com',
            role: 'customer',
            token: 'demo-token'
          };
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('cognevance_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cognevance_user');
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.success && res.data) {
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const register = async (name, email, password, role = 'customer') => {
    const res = await registerUser({ name, email, password, role });
    if (res.success && res.data) {
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
  };

  // Switch role helper for easy demoing (Customer vs Admin)
  const switchRole = (role) => {
    if (!user) {
      setUser({
        _id: `user-${role}`,
        name: role === 'admin' ? 'Executive Admin' : 'Demo Client',
        email: `${role}@cognevance.com`,
        role,
        token: `token-${role}`
      });
      return;
    }
    setUser((prev) => ({
      ...prev,
      role,
      name: role === 'admin' ? 'Executive Admin' : 'Demo Client',
      email: `${role}@cognevance.com`
    }));
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
