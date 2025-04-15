import { Button } from "@/components/ui/button";
import { useThemeContext } from "./theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function MainNav() {
  const { theme, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const logout = () => {
    logoutMutation.mutate();
  };

  const isActive = (path: string) => {
    // Handle root path
    if (path === "/" && location === "/") return true;
    
    // Handle other paths
    if (path !== "/" && location.startsWith(path)) return true;
    
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-primary font-serif text-3xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Divine</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-heading text-xl font-semibold">Braids</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <a className={`font-medium hover:text-primary transition-all ${isActive("/") ? "text-primary" : ""}`}>
                Home
              </a>
            </Link>
            <Link href="/services">
              <a className={`font-medium hover:text-primary transition-all ${isActive("/services") ? "text-primary" : ""}`}>
                Services
              </a>
            </Link>
            <Link href="/gallery">
              <a className={`font-medium hover:text-primary transition-all ${isActive("/gallery") ? "text-primary" : ""}`}>
                Gallery
              </a>
            </Link>
            <Link href="/booking">
              <a className={`font-medium hover:text-primary transition-all ${isActive("/booking") ? "text-primary" : ""}`}>
                Book Now
              </a>
            </Link>
            <Link href="/contact">
              <a className={`font-medium hover:text-primary transition-all ${isActive("/contact") ? "text-primary" : ""}`}>
                Contact
              </a>
            </Link>
          </nav>

          {/* Theme Toggle & Mobile Menu Trigger */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="text-neutral-900 dark:text-neutral-100 hover:text-primary dark:hover:text-primary transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </Button>

            {/* Admin Link (if user is admin) */}
            {user?.role === "admin" && (
              <Link href="/admin/dashboard">
                <Button variant="outline" size="sm">
                  Admin
                </Button>
              </Link>
            )}

            {/* Login/Logout Button */}
            {user ? (
              <Button variant="outline" size="sm" onClick={logout} disabled={logoutMutation.isPending}>
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-neutral-900 dark:text-neutral-100"
              onClick={toggleMobileMenu}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-neutral-900 py-4 border-t border-neutral-200 dark:border-neutral-800">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <a 
                  className={`font-medium hover:text-primary transition-all px-4 ${isActive("/") ? "text-primary" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Home
                </a>
              </Link>
              <Link href="/services">
                <a 
                  className={`font-medium hover:text-primary transition-all px-4 ${isActive("/services") ? "text-primary" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Services
                </a>
              </Link>
              <Link href="/gallery">
                <a 
                  className={`font-medium hover:text-primary transition-all px-4 ${isActive("/gallery") ? "text-primary" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Gallery
                </a>
              </Link>
              <Link href="/booking">
                <a 
                  className={`font-medium hover:text-primary transition-all px-4 ${isActive("/booking") ? "text-primary" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Book Now
                </a>
              </Link>
              <Link href="/contact">
                <a 
                  className={`font-medium hover:text-primary transition-all px-4 ${isActive("/contact") ? "text-primary" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Contact
                </a>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
