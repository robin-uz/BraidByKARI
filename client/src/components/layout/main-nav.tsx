import { Button } from "@/components/ui/button";
import { useThemeContext } from "./theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { ServerAuthContext } from "@/contexts/DebugAuthContext";

export default function MainNav() {
  const { theme, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  // Access context directly with fallback for when context isn't available yet
  const authContext = useContext(ServerAuthContext);
  const user = authContext?.user ?? null;
  const logout = authContext?.logout ?? (() => Promise.resolve());
  const loading = authContext?.loading ?? false;
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
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
              <span className="text-purple-600 dark:text-purple-400 font-serif text-3xl" style={{ fontFamily: "'Great Vibes', cursive" }}>Divine</span>
              <span className="text-neutral-900 dark:text-neutral-100 font-heading text-xl font-semibold">Braids</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer ${isActive("/") ? "text-purple-600 dark:text-purple-400" : ""}`}>
                Home
              </span>
            </Link>
            <Link href="/pricing">
              <span className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer ${isActive("/pricing") ? "text-purple-600 dark:text-purple-400" : ""}`}>
                Pricing
              </span>
            </Link>
            <Link href="/gallery">
              <span className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer ${isActive("/gallery") ? "text-purple-600 dark:text-purple-400" : ""}`}>
                Gallery
              </span>
            </Link>
            <Link href="/booking">
              <span className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer ${isActive("/booking") ? "text-purple-600 dark:text-purple-400" : ""}`}>
                Book Now
              </span>
            </Link>
            <Link href="/contact">
              <span className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all cursor-pointer ${isActive("/contact") ? "text-purple-600 dark:text-purple-400" : ""}`}>
                Contact
              </span>
            </Link>
          </nav>

          {/* Theme Toggle & Mobile Menu Trigger */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle - Enhanced and More Visible */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme} 
              className="relative overflow-hidden border-2 border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-all duration-300 p-2 rounded-full"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-200/40 to-amber-100/0 dark:from-amber-800/40 dark:to-amber-900/0 z-0"></div>
              <span className="relative z-10">
                {theme === "light" ? <Moon size={20} className="transition-all duration-500" /> : <Sun size={20} className="transition-all duration-500" />}
              </span>
              <span className="sr-only">{theme === "light" ? "Switch to dark mode" : "Switch to light mode"}</span>
            </Button>

            {/* Client Portal Link (if user is logged in) */}
            {user && (
              <div className="flex items-center space-x-2">
                <Link href="/client/dashboard">
                  <Button variant="outline" size="sm">
                    My Portal
                  </Button>
                </Link>
                <Link href="/client/profile">
                  <Button variant="ghost" size="sm">
                    Profile
                  </Button>
                </Link>
              </div>
            )}

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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsLoggingOut(true);
                  logout().finally(() => setIsLoggingOut(false));
                }} 
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
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
                <span 
                  className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Home
                </span>
              </Link>
              <Link href="/pricing">
                <span 
                  className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/pricing") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Pricing
                </span>
              </Link>
              <Link href="/gallery">
                <span 
                  className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/gallery") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Gallery
                </span>
              </Link>
              <Link href="/booking">
                <span 
                  className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/booking") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Book Now
                </span>
              </Link>
              <Link href="/contact">
                <span 
                  className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/contact") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Contact
                </span>
              </Link>
              
              {/* Client Portal in Mobile Menu */}
              {user && (
                <>
                  <Link href="/client/dashboard">
                    <span 
                      className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/client/dashboard") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                      onClick={closeMobileMenu}
                    >
                      My Portal
                    </span>
                  </Link>
                  <Link href="/client/profile">
                    <span 
                      className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/client/profile") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                      onClick={closeMobileMenu}
                    >
                      Profile Settings
                    </span>
                  </Link>
                </>
              )}
              
              {/* Admin Link in Mobile Menu */}
              {user?.role === "admin" && (
                <Link href="/admin/dashboard">
                  <span 
                    className={`font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-all px-4 cursor-pointer ${isActive("/admin/dashboard") ? "text-purple-600 dark:text-purple-400" : ""}`} 
                    onClick={closeMobileMenu}
                  >
                    Admin Dashboard
                  </span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
