import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Wallet, Notification } from '../types';

interface AuthContextType {
  currentUser: User;
  wallet: Wallet | null;
  activeMode: 'CLIENT' | 'FREELANCER' | 'ADMIN';
  allUsers: User[];
  notifications: Notification[];
  unreadNotificationCount: number;
  impersonatedAdmin: User | null;
  isImpersonating: boolean;
  impersonateUser: (targetUserId: string) => Promise<void>;
  exitImpersonation: () => Promise<void>;
  switchUser: (userId: string) => Promise<void>;
  switchMode: (mode: 'CLIENT' | 'FREELANCER' | 'ADMIN') => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [impersonatedAdmin, setImpersonatedAdmin] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-user-id': currentUser?.id || '',
        'x-admin-id': currentUser?.id || '',
      },
    });
  };

  const fetchUsers = async (retries = 5) => {
    try {
      const res = await fetch('/api/auth/users');
      if (res.status === 503 && retries > 0) {
        console.log(`System initializing... retrying in 2s (${retries} left)`);
        setTimeout(() => fetchUsers(retries - 1), 2000);
        return;
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      if (data.users && data.users.length > 0) {
        setAllUsers(data.users);
        if (!currentUser) {
          // Default to Elena Rostova (Freelancer) or David Chen (Client)
          const defaultUser = data.users.find((u: User) => u.id === 'usr-1') || data.users[0];
          setCurrentUser(defaultUser);
        }
      }
    } catch (e) {
      console.error('Failed to fetch users', e);
      if (retries > 0) {
        console.log(`Fetch failed, retrying in 3s (${retries} left)`);
        setTimeout(() => fetchUsers(retries - 1), 3000);
      }
    }
  };

  const refreshWallet = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/wallet/${currentUser.id}`, {
        headers: { 'x-user-id': currentUser.id }
      });
      const data = await res.json();
      if (data.wallet) {
        setWallet(data.wallet);
      }
    } catch (e) {
      console.error('Failed to refresh wallet', e);
    }
  };

  const refreshNotifications = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/notifications/${currentUser.id}`, {
        headers: { 'x-user-id': currentUser.id }
      });
      const data = await res.json();
      if (data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (e) {
      console.error('Failed to refresh notifications', e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (currentUser) {
      refreshWallet();
      refreshNotifications();
    }
  }, [currentUser]);

  const switchUser = async (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
    }
  };

  const impersonateUser = async (targetUserId: string) => {
    const targetUser = allUsers.find(u => u.id === targetUserId);
    if (!targetUser) return;
    try {
      await fetch('/api/admin/impersonate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-id': currentUser?.id || 'admin-super'
        },
        body: JSON.stringify({
          adminId: currentUser?.id,
          targetUserId,
        }),
      });
      if (!impersonatedAdmin && currentUser) {
        setImpersonatedAdmin(currentUser);
      }
      setCurrentUser(targetUser);
    } catch (e) {
      console.error('Failed to impersonate user', e);
    }
  };

  const exitImpersonation = async () => {
    if (impersonatedAdmin) {
      setCurrentUser(impersonatedAdmin);
      setImpersonatedAdmin(null);
    }
  };

  const switchMode = async (mode: 'CLIENT' | 'FREELANCER' | 'ADMIN') => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/auth/switch-mode', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({ userId: currentUser.id, mode }),
      });
      const data = await res.json();
      if (data.user) {
        setCurrentUser(data.user);
        setAllUsers(prev => prev.map(u => u.id === data.user.id ? data.user : u));
      }
    } catch (e) {
      console.error('Failed to switch mode', e);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!currentUser) return;
    try {
      await fetch(`/api/notifications/${id}/read`, { 
        method: 'PATCH',
        headers: { 'x-user-id': currentUser.id }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {
      console.error('Failed to mark notification read', e);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Initializing WorkSphere Secure Runtime...</p>
        </div>
      </div>
    );
  }

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        wallet,
        activeMode: currentUser.activeMode,
        allUsers,
        notifications,
        unreadNotificationCount,
        impersonatedAdmin,
        isImpersonating: Boolean(impersonatedAdmin),
        impersonateUser,
        exitImpersonation,
        switchUser,
        switchMode,
        refreshWallet,
        refreshNotifications,
        markNotificationRead,
        fetchWithAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
