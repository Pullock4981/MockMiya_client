'use client';

import { useAuth } from '@/context/AuthContext/AuthContext';
import { motion } from 'framer-motion';
import { ChevronDown, LogOut, Search, LayoutDashboard, User } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeSwitch from '@/components/ui/ThemeSwitch';
import Swal from 'sweetalert2';

export function DashboardHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

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
      // console.log('Searching for:', searchQuery);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
    });

    if (result.isConfirmed) {
      try {
        await logout();
        await Swal.fire({
          title: "Logged Out!",
          text: "You have been logged out successfully.",
          icon: "success",
          timer: 1800,
          showConfirmButton: false,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Logout failed');
        // console.error(error);
        Swal.fire({
          title: "Failed!",
          text: error.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b border-card-border px-6 py-4 flex items-center justify-between gap-5"
    >

      {/* Center: Search */}
      <div className="hidden md:flex justify-center flex-1 px-2 md:px-0">
        <form onSubmit={handleSearch} className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground-muted w-4 h-4" />
          <input
            type="text"
            placeholder="Search posts, users, analytics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
                       hover:bg-input-hover transition-colors"
          />
        </form>
      </div>


      <div className='block md:hidden'>
        <Link href="/"> <Button>Home</Button> </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="-mr-5 scale-90 md:scale-100">
          <ThemeSwitch />
        </div>

        {/* Profile */}
        <div className="relative ml-3" ref={dropdownRef}>
          <button
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition"
          >
            <div className="text-right hidden md:block">
              <div className="text-sm font-medium">{user?.name ?? 'User'}</div>
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
                <div className="font-medium">{user?.name ?? "User"}</div>
                <div className="text-sm text-foreground-muted">{user?.email ?? "example@email.com"}</div>
              </div>

              <div className="p-1">
                <Link
                  href="/dashboard/profile"
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="border-t border-border my-1" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-warning/50 rounded-md hover:scale-105 transition-transform"
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