import { Button } from "@/components/ui/button";
import { useThemeContext } from "./theme-provider";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function MainNav() {
  const { theme, setTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { user, signOut, loading } = useAuth();
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

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoggingOut(false);
    }
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
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme} 
              className="text-neutral-900 dark:text-neutral-100 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
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
              <Button variant="outline" size="sm" onClick={logout} disabled={isLoggingOut}>
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
