/**
 * User Menu Component
 * 
 * Shows current user info and logout button in the header.
 */

import { useAuthStore } from '../../stores/authStore';
import { User, LogOut } from 'lucide-react';

export function UserMenu() {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
        </div>
        <span className="hidden sm:inline">{user.full_name}</span>
      </div>
      
      <button
        onClick={handleLogout}
        className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 
                   dark:hover:text-red-400 transition-colors"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
