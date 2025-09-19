"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ExternalLink } from "lucide-react";
import { RiCodeSSlashFill } from "react-icons/ri";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Change navbar style on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#work", text: "Work" },
    { href: "#about", text: "About" },
    { href: "#services", text: "Services" },
    { href: "#blog", text: "Blog" },
    { href: "#contact", text: "Contact" },
  ];

  return (
    <header
      className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg shadow-lg"
          : "bg-white/40 dark:bg-gray-900/40 backdrop-blur-md"
        } border-b border-gray-200 dark:border-gray-800`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex h-14 sm:h-16 lg:h-20 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-400 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
                <span className="text-white dark:text-gray-900 font-extrabold text-base sm:text-lg lg:text-xl">
                  <RiCodeSSlashFill />
                </span>
              </div>
              <span className="font-bold text-lg sm:text-xl lg:text-2xl text-gray-900 dark:text-gray-100">
                MockMiya
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                href={link.href}
                className="text-sm lg:text-base font-medium text-white hover:text-gray-900 dark:hover:text-green-500 transition-colors relative group"
              >
                {link.text}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gray-900 dark:bg-green-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 lg:space-x-2 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all hover:shadow-md"
            >
              <span>Sign In</span>
              <ExternalLink className="h-3 w-3 lg:h-4 lg:w-4" />
            </a>
            <Link
              href="/contact"
              className="px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm bg-gradient-to-r from-green-400 to-green-600 dark:from-green-400 dark:to-green-400 rounded-lg font-semibold text-black transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3 py-2.5 text-sm sm:text-base font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.text}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-gray-200 dark:border-gray-700 flex flex-col space-y-2">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2 px-3 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>Sign In</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href="/contact"
                  className="text-center px-3 py-2.5 text-sm font-medium bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
