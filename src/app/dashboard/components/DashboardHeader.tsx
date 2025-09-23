'use client';

import { useAuth } from '@/app/auth/context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronDown, LogOut, Search, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ThemeSwitch from './ThemeSwitch';

interface DashboardHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export function DashboardHeader() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logoutUser } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between"
    >
      <div>
        <Link href="/">
          <Button variant="secondary">Home</Button>
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-2 md:px-0">
        <form onSubmit={handleSearch} className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts, users, analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-input border border-border rounded-lg
                 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                 hover:bg-input-hover transition-colors"
          />
        </form>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Theme Switch */}
        <div className="scale-46 -mr-12 -ml-7">
          <ThemeSwitch />
        </div>

        {/* Profile */}
        <div className="relative ml-3" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">{user?.displayName ?? 'User'}</div>
              {/* <div className="text-xs text-foreground-muted">{user?.role ?? 'Member'}</div> */}
            </div>
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.displayName?.charAt(0).toUpperCase() ?? 'U'}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-foreground-muted" />
          </button>

          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 w-56 bg-card border border-card-border rounded-lg shadow-lg z-50"
            >
              <div className="p-3 border-b border-border">
                <div className="font-medium">{user?.displayName ?? 'User'}</div>
                <div className="text-sm text-foreground-muted">
                  {user?.email ?? 'example@email.com'}
                </div>
              </div>

              <div className="p-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => {
                    logoutUser(); // Firebase logout
                    setShowProfileDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
