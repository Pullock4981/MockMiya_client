// import { Github, Linkedin, Mail } from "lucide-react";
// import { FaXTwitter } from "react-icons/fa6";
// import Logo from "./Logo";

// const Footer = () => {
//   return (
//     <footer className="bg-background-tertiary border-t border-border">
//       <div className="container mx-auto px-6 lg:px-8 py-16">
//         <div className="grid lg:grid-cols-4 gap-8">
//           {/* Brand */}
//           <div className="lg:col-span-1">
//             <div className="flex items-center mb-4">
//               <Logo></Logo>
//             </div>
//             <p className="text-foreground-secondary mb-6 max-w-sm">
//               AI-powered platform helping developers ace technical interviews and build amazing careers.
//             </p>

//             {/* Social links */}
//             <div className="flex space-x-4">
//               <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
//                 <FaXTwitter className="h-4 w-4 text-foreground-secondary" />
//               </a>
//               <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
//                 <Github className="h-4 w-4 text-foreground-secondary" />
//               </a>
//               <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
//                 <Linkedin className="h-4 w-4 text-foreground-secondary" />
//               </a>
//               <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
//                 <Mail className="h-4 w-4 text-foreground-secondary" />
//               </a>
//             </div>
//           </div>

//           {/* Company Links */}
//           <div>
//             <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
//             <ul className="space-y-3">
//               <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">About</a></li>
//               <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Blog</a></li>
//               <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Contact</a></li>
//             </ul>
//           </div>

//           {/* Support Links */}
//           <div>
//             <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
//             <ul className="space-y-3">
//               <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Documentation</a></li>
//               <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
//             </ul>
//           </div>
//         </div>

//         {/* Bottom bar */}
//         <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
//           <p className="text-foreground-muted text-sm">
//             © 2025 MockMiya. All rights reserved.
//           </p>
//           <div className="flex space-x-6 mt-4 md:mt-0">
//             <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Terms</a>
//             <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Privacy</a>
//             <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Cookies</a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;







"use client";

import React, { useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext/AuthContext";

export default function Footer() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState(""); // 👈 controlled input state

  const { user } = useAuth();
  const userEmail = user?.email || "";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!emailInput || !emailInput.includes("@")) {
      setError("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("sending");

    // mock sending (replace with your API call)
    setTimeout(() => {
      setStatus("success");
      setEmailInput("");
    }, 700);
  };

  return (
    <footer className="relative bg-background-tertiary border-t border-border pt-24">
      {/* Newsletter overlay card */}
      <div className="absolute inset-x-0 -top-36">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="mx-auto max-w-6xl bg-card backdrop-blur-md border border-border rounded-2xl shadow-xl py-24 px-10 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-foreground">Join our newsletter</h4>
              <p className="text-sm text-foreground-secondary mt-1">
                Get interview tips, new features, and curated problems — delivered weekly.
              </p>
            </div>

            <form onSubmit={submit} className="flex-1 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <label htmlFor="footer-email" className="sr-only">Email</label>
                <input
                  id="footer-email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onFocus={() => {
                    // 👇 When focused, if empty, fill with user's email
                    if (!emailInput && userEmail) setEmailInput(userEmail);
                  }}
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />

                <Button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium shadow-sm hover:opacity-95 transition-opacity"
                  aria-live="polite"
                >
                  {status === "sending"
                    ? "Subscribing..."
                    : status === "success"
                      ? "Subscribed"
                      : "Subscribe"}
                </Button>
              </div>

              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            </form>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-6 pt-36 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div>
              <div className="flex items-center mb-4 justify-center md:justify-start">
                <Logo />
              </div>
              <p className="text-foreground-secondary mb-6 max-w-sm">
                AI-powered platform helping developers ace technical interviews and build amazing careers.
              </p>
            </div>

            {/* Social links */}
            <div className="flex space-x-3">
              <a
                href="#"
                aria-label="X / Twitter"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors"
              >
                <FaXTwitter className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a
                href="#"
                aria-label="GitHub"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors"
              >
                <Github className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors"
              >
                <Linkedin className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors"
              >
                <Mail className="h-4 w-4 text-foreground-secondary" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="text-foreground-secondary hover:text-primary transition-colors">About</a></li>
                <li><a href="/blog" className="text-foreground-secondary hover:text-primary transition-colors">Blog</a></li>
                <li><a href="/contact" className="text-foreground-secondary hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="https://docs.google.com/document/d/1OUfkGXjVB8UbEVBfqqgZVO6v5qwJjOWQz8Z46UAPXHw/edit?tab=t.0" target="blank" className="text-foreground-secondary hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-24 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground-muted text-sm">© 2025 MockMiya. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Terms</a>
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Privacy</a>
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
