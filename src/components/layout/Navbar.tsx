// 'use client';

// import { Button } from "@/components/ui/button";
// import {
//   Menu,
//   X,
//   Code2,
//   ChevronDown,
//   User,
//   LogOut,
//   LayoutDashboard,
// } from "lucide-react";
// import { useRef, useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import ThemeSwitch from "../ui/ThemeSwitch";
// import { useAuth } from "@/context/AuthContext/AuthContext";
// import Swal from "sweetalert2";
// import Logo from "./Logo";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const { user, logout } = useAuth();

//   const navItems = [
//     { name: "Home", href: "/" },
//     { name: "Blogs", href: "/blogs", isRoute: true },
//     { name: "About", href: "/about", isRoute: true },
//     { name: "Contact", href: "/contact" },
//   ];

//   // ✅ Handle Logout
//   const handleLogout = async () => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out from your account!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, Logout",
//     });

//     if (result.isConfirmed) {
//       try {
//         await logout();
//         await Swal.fire({
//           title: "Logged Out!",
//           text: "You have been logged out successfully.",
//           icon: "success",
//           timer: 1800,
//           showConfirmButton: false,
//         });
//       } catch (err) {
//         const error = err instanceof Error ? err : new Error('Logout failed');
//         // console.error(error);
//         Swal.fire({
//           title: "Failed!",
//           text: error.message,
//           icon: "error",
//         });
//       }
//     }
//   };

//   // ✅ Close profile dropdown on click outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
//       <div className="container mx-auto px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-2">
//            <Logo></Logo>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {navItems.map((item) =>
//               item.isRoute ? (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className="text-foreground-secondary hover:text-primary transition-colors font-medium"
//                 >
//                   {item.name}
//                 </Link>
//               ) : (
//                 <a
//                   key={item.name}
//                   href={item.href}
//                   className="text-foreground-secondary hover:text-primary transition-colors font-medium"
//                 >
//                   {item.name}
//                 </a>
//               )
//             )}
//           </div>

//           {/* CTA Buttons */}
//           <div className="hidden md:flex items-center space-x-16">
//             <ThemeSwitch />

//             {user ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition"
//                   aria-expanded={showProfileDropdown}
//                   aria-label="Profile Menu"
//                 >
//                   <div className="text-right hidden md:block">
//                     <div className="text-sm font-medium">{user?.name ?? "User"}</div>
//                   </div>
//                   <ChevronDown className="w-4 h-4 text-foreground-muted" />
//                 </button>

//                 <AnimatePresence>
//                   {showProfileDropdown && (
//                     <motion.div
//                       initial={{ opacity: 0, y: 10 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: 10 }}
//                       className="absolute top-full right-0 mt-2 w-56 bg-card border border-card-border rounded-lg shadow-lg z-50"
//                     >
//                       <div className="p-3 border-b border-border">
//                         <div className="font-medium">{user?.name ?? "User"}</div>
//                         <div className="text-sm text-foreground-muted">{user?.email ?? "example@email.com"}</div>
//                       </div>

//                       <div className="p-1">
//                         <Link
//                           href="/dashboard/profile"
//                           className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
//                         >
//                           <User className="w-4 h-4" />
//                           Profile
//                         </Link>
//                         <Link
//                           href="/dashboard"
//                           className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors"
//                         >
//                           <LayoutDashboard className="w-4 h-4" />
//                           Dashboard
//                         </Link>
//                         <div className="border-t border-border my-1" />
//                         <button
//                           onClick={handleLogout}
//                           className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-warning/50 rounded-md hover:scale-105 transition-transform"
//                         >
//                           <LogOut className="w-4 h-4" />
//                           Logout
//                         </button>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             ) : (
//               <>
//                 <Button
//                   className="bg-primary hover:bg-primary-dark text-primary-foreground glow-effect"
//                   asChild
//                 >
//                   <Link href="/auth">Get Started Free</Link>
//                 </Button>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="border-border-light"
//               aria-label="Toggle menu"
//             >
//               {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden py-4 border-t border-border overflow-hidden"
//             >
//               <div className="flex flex-col space-y-4">
//                 {navItems.map((item) =>
//                   item.isRoute ? (
//                     <Link
//                       key={item.name}
//                       href={item.href}
//                       className="text-foreground-secondary hover:text-primary transition-colors font-medium"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item.name}
//                     </Link>
//                   ) : (
//                     <a
//                       key={item.name}
//                       href={item.href}
//                       className="text-foreground-secondary hover:text-primary transition-colors font-medium"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item.name}
//                     </a>
//                   )
//                 )}
//                 <div className="flex flex-col space-y-2 pt-4 border-t border-border">
//                   <div className="flex justify-center pb-2">
//                     <ThemeSwitch />
//                   </div>
//                   <Button
//                     className="bg-primary hover:bg-primary-dark text-primary-foreground"
//                     asChild
//                   >
//                     <Link href="/auth">Get Started Free</Link>
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;








'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';
import ThemeSwitch from '../ui/ThemeSwitch';
import { useAuth } from '@/context/AuthContext/AuthContext';
import Swal from 'sweetalert2';
import Logo from './Logo';

type NavItem = {
  name: string;
  href: string;
  isRoute?: boolean;
};

const navItems: NavItem[] = [
  { name: 'Home', href: '/' },
  { name: 'Blogs', href: '/blogs', isRoute: true },
  { name: 'About', href: '/about', isRoute: true },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileDropdown(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowProfileDropdown(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from your account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Logout',
    });

    if (result.isConfirmed) {
      try {
        await logout();
        await Swal.fire({
          title: 'Logged Out!',
          text: 'You have been logged out successfully.',
          icon: 'success',
          timer: 1600,
          showConfirmButton: false,
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Logout failed');
        Swal.fire({
          title: 'Failed!',
          text: error.message,
          icon: 'error',
        });
      }
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Wrap Logo with Link directly, no nested <a> */}
              <div className="cursor-pointer">
                <Logo />
              </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} className="relative flex flex-col items-center px-1 py-2 font-medium text-foreground-secondary hover:text-primary transition-colors">
                <span>{item.name}</span>
                {isActive(item.href) && <span className="block w-2 h-2 mt-2 rounded-full bg-primary" />}
              </Link>
            ))}
          </div>

          {/* Profile & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeSwitch />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setShowProfileDropdown((s) => !s)} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <div className="text-right">
                    <div className="text-sm font-medium">{user?.name ?? 'User'}</div>
                    <div className="text-xs text-foreground-muted truncate" style={{ maxWidth: 160 }}>{user?.email ?? ''}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-foreground-muted" />
                </button>

                <AnimatePresence>
                  {showProfileDropdown && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className="absolute right-0 mt-2 w-56 bg-card border border-card-border rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-border">
                        <div className="font-medium">{user?.name ?? 'User'}</div>
                        <div className="text-sm text-foreground-muted truncate">{user?.email ?? ''}</div>
                      </div>
                      <div className="p-1">
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-warning/20 rounded-md transition">
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth">
                <Button className="bg-primary hover:bg-primary-dark text-primary-foreground w-full">Get Started Free</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeSwitch />
            <Button variant="outline" size="sm" onClick={() => setIsMenuOpen((s) => !s)} aria-expanded={isMenuOpen}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden py-4 border-t border-border overflow-hidden">
              <div className="flex flex-col px-2 space-y-3">
                {navItems.map((item) => (
                  <Link key={item.name} href={item.href} className={`relative w-full text-left px-3 py-2 rounded-md transition-flex items-center font-medium ${isActive(item.href) ? 'text-primary bg-secondary/5' : 'text-foreground-secondary'}`}>
                    <div className="flex items-center justify-between">
                      <span>{item.name}</span>
                      {isActive(item.href) && <span className="ml-3 w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </Link>
                ))}

                <div className="pt-3 border-t border-border">
                  {user ? (
                    <>
                      <div className="px-3">
                        <div className="text-sm font-medium">{user?.name}</div>
                        <div className="text-xs text-foreground-muted truncate">{user?.email}</div>
                      </div>
                      <Link href="/dashboard" className="block px-3 py-2 rounded-md hover:bg-secondary transition">Dashboard</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md hover:bg-warning/20 transition">Logout</button>
                    </>
                  ) : (
                    <Link href="/auth" className="block px-3 py-2 rounded-md bg-primary text-primary-foreground text-center">Get Started Free</Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}