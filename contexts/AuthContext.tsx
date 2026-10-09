import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Employee } from '../types';
import { EMPLOYEES } from '../data/mock';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, pin?: string, username?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Login labels per role for nicer display
const ROLE_LABELS: Record<UserRole, string> = {
  supervisor: 'مدير النظام',
  waiter: 'نادل',
  kitchen: 'شاشة المطبخ',
  bar: 'شاشة المشروبات',
};

/**
 * Find a matching employee by role + PIN (+ username for supervisor).
 * Returns the Employee record if found, otherwise null.
 *
 * Security note: in a real application PINs must be hashed server-side
 * (bcrypt/argon2) and validated via an API call. This client-side
 * implementation is intended for the demo/mock data only.
 */
const findEmployee = (
  role: UserRole,
  pin?: string,
  username?: string
): Employee | null => {
  if (!pin) return null;
  return (
    EMPLOYEES.find(
      (e) =>
        e.role === role &&
        e.pin === pin &&
        e.status === 'Active' &&
        (role !== 'supervisor' || username === 'admin')
    ) || null
  );
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
      console.error('Failed to parse user from sessionStorage', error);
      sessionStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (
    role: UserRole,
    pin?: string,
    username?: string
  ): Promise<boolean> => {
    const employee = findEmployee(role, pin, username);
    if (!employee) return false;

    // Use the employee name when available, fallback to a generic role label.
    const displayName =
      role === 'supervisor' || role === 'kitchen' || role === 'bar'
        ? ROLE_LABELS[role]
        : `${ROLE_LABELS[role]} ${employee.name}`;

    const newUser: User = { name: displayName, role };
    setUser(newUser);
    sessionStorage.setItem('user', JSON.stringify(newUser));

    switch (role) {
      case 'kitchen':
        navigate('/kds');
        break;
      case 'bar':
        navigate('/drinks');
        break;
      default:
        navigate('/dashboard');
        break;
    }
    return true;
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
