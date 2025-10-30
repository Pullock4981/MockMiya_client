import { Github, Linkedin, Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-background-tertiary border-t border-border">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Logo></Logo>
            </div>
            <p className="text-foreground-secondary mb-6 max-w-sm">
              AI-powered platform helping developers ace technical interviews and build amazing careers.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
                <FaXTwitter className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
                <Github className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
                <Linkedin className="h-4 w-4 text-foreground-secondary" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center hover:border-primary/50 hover:bg-primary/10 transition-colors">
                <Mail className="h-4 w-4 text-foreground-secondary" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Status</a></li>
              <li><a href="#" className="text-foreground-secondary hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground-muted text-sm">
            © 2025 MockMiya. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Terms</a>
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Privacy</a>
            <a href="#" className="text-foreground-muted hover:text-primary text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;