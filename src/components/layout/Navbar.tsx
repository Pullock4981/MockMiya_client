"use client";

import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Code2,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import Link from "next/link";
import ThemeSwitch from "../ui/ThemeSwitch";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const router = useRouter();
  const { user, logoutUser } = useAuth();

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blogs", href: "/blogs", isRoute: true },
    { name: "About", href: "/about", isRoute: true },
    { name: "FAQ", href: "#faq" },
  ];

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error) {
      console.error(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MockMiya</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) =>
              item.isRoute ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground-secondary hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground-secondary hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </a>
              )
            )}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-16">
            <ThemeSwitch />

            {user ? (
              <>
                <div className="relative ml-3" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-2 transition"
                  >
                    <div className="text-right hidden md:block">
                      <div className="text-sm font-medium">
                        {user?.displayName ?? "User"}
                      </div>
                      {/* <div className="text-xs text-foreground-muted">{user?.role ?? 'Member'}</div> */}
                    </div>
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      {/* <span className="text-sm font-medium text-white">
                        {user?.displayName?.charAt(0).toUpperCase() ?? "U"}
                      </span> */}
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
                        <div className="font-medium">
                          {user?.displayName ?? "User"}
                        </div>
                        <div className="text-sm text-foreground-muted">
                          {user?.email ?? "example@email.com"}
                        </div>
                      </div>

                      <div className="p-1">
                        <Link href={"/dashboard/profile"} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                        <Link href={"/dashboard/settings"} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-secondary rounded-md transition-colors">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <div className="border-t border-border my-1" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </>
            ) : (
              <>
                {" "}
                <Button
                  variant="outline"
                  className="border-border-light hover:bg-card-secondary"
                  asChild
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-dark text-primary-foreground glow-effect"
                  asChild
                >
                  <Link href="/auth">Get Started Free</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="border-border-light"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) =>
                item.isRoute ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground-secondary hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground-secondary hover:text-primary transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                )
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                <div className="flex justify-center pb-2">
                  <ThemeSwitch />
                </div>
                <Button
                  variant="outline"
                  className="border-border-light hover:bg-card-secondary"
                  asChild
                >
                  <Link href="/auth">Sign In</Link>
                </Button>
                <Button
                  className="bg-primary hover:bg-primary-dark text-primary-foreground"
                  asChild
                >
                  <Link href="/auth">Get Started Free</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
