// =====================================================
// AUTH CONTEXT - Gerenciar autenticação do usuário
// =====================================================

import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

const API_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar usuário ao montar
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        console.log('User loaded with roles:', data.user.roles);
        console.log('User permissions:', data.user.permissions);
        setUser(data.user);
        // Permissions já vem como array de códigos combinados do backend
        setPermissions(data.user.permissions || []);
      } else {
        // Token inválido
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setPermissions(data.user.permissions || []);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao registrar');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      setPermissions(data.user.permissions || []);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (permissionCode) => {
    // Permissions já vem como array de strings (códigos) do backend
    return permissions.includes(permissionCode);
  };

  const hasRole = (roleName) => {
    return user?.roles?.some(r => r.name === roleName) || false;
  };

  const isAdmin = () => {
    return hasRole('ADMIN');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user, // Alias para compatibilidade
        permissions,
        loading,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
