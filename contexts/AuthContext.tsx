import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, pin?: string, username?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CREDENTIALS = {
  supervisor: { username: 'admin', pin: 'admin123' },
  waiter: { pin: '101' },
  kitchen: { pin: '111' },
  bar: { pin: '222' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (role: UserRole, pin?: string, username?: string): Promise<boolean> => {
    let authenticated = false;
    let userName = 'User';

    if (role === 'supervisor' && username === CREDENTIALS.supervisor.username && pin === CREDENTIALS.supervisor.pin) {
      authenticated = true;
      userName = 'مدير النظام';
    } else if (role === 'waiter' && pin === CREDENTIALS.waiter.pin) {
      authenticated = true;
      userName = `نادل #${pin}`;
    } else if (role === 'kitchen' && pin === CREDENTIALS.kitchen.pin) {
      authenticated = true;
      userName = 'شاشة المطبخ';
    } else if (role === 'bar' && pin === CREDENTIALS.bar.pin) {
      authenticated = true;
      userName = 'شاشة المشروبات';
    }

    if (authenticated) {
      const newUser = { name: userName, role };
      setUser(newUser);
      sessionStorage.setItem('user', JSON.stringify(newUser));
      
      switch (role) {
        case 'kitchen': navigate('/kds'); break;
        case 'bar': navigate('/drinks'); break;
        default: navigate('/dashboard'); break;
      }
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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
