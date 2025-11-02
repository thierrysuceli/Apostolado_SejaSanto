import React, { createContext, useState, useContext, useEffect } from 'react';
import { dbUsers } from '../data/mockDatabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Check if user has at least one of the required roles
  const hasAccess = (requiredRoles) => {
    // Empty array means public content
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    // Not logged in and content requires roles
    if (!currentUser) {
      return false;
    }
    
    // Check if user has at least one of the required roles
    return requiredRoles.some(role => currentUser.roles.includes(role));
  };

  const login = (email, password) => {
    const user = dbUsers.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return { success: true };
    }
    return { success: false, error: 'Credenciais inválidas' };
  };

  const loginAsMember = () => {
    const user = dbUsers.find(u => u.id === 1);
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const loginAsAdmin = () => {
    const user = dbUsers.find(u => u.id === 0);
    const { password: _, ...userWithoutPassword } = user;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
  };

  const register = (name, email, password) => {
    // Check if email already exists
    const existingUser = dbUsers.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'Email já cadastrado' };
    }

    const newUser = {
      id: dbUsers.length,
      name,
      email,
      password,
      roles: ['Inscrito', 'user']
    };
    
    dbUsers.push(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    setCurrentUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => {
    return currentUser?.roles?.includes('Admin') || false;
  };

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Error loading user from localStorage', e);
      }
    }
  }, []);

  const value = {
    currentUser,
    login,
    loginAsMember,
    loginAsAdmin,
    register,
    logout,
    hasAccess,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
