import { createContext, useState, useEffect } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (username: string, email: string, password: string, role: User['role']) => { success: boolean; message: string };
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => ({ success: false, message: '' }),
  register: () => ({ success: false, message: '' }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('vccp_current_user');
      if (stored) {
        setUser(JSON.parse(stored));
        setIsAuthenticated(true);
      }
    } catch (e: any) {}
  }, []);

  const getUsers = (): User[] => {
    try {
      const stored = localStorage.getItem('vccp_users');
      return stored ? JSON.parse(stored) : [];
    } catch (e: any) {
      return [];
    }
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem('vccp_users', JSON.stringify(users));
  };

  const login = (email: string, password: string): { success: boolean; message: string } => {
    const users = getUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) return { success: false, message: 'Invalid email or password.' };
    setUser(found);
    setIsAuthenticated(true);
    localStorage.setItem('vccp_current_user', JSON.stringify(found));
    return { success: true, message: 'Login successful!' };
  };

  const register = (username: string, email: string, password: string, role: User['role']): { success: boolean; message: string } => {
    const users = getUsers();
    if (users.find((u) => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const newUser: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      password,
      role,
      createdAt: Date.now(),
    };
    saveUsers([...users, newUser]);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('vccp_current_user', JSON.stringify(newUser));
    return { success: true, message: 'Registration successful!' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vccp_current_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
