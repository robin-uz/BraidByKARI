import { Button } from "@/components/ui/button";
import { useThemeContext } from "./theme-provider";
import { Menu, X, Search, ShoppingCart } from "lucide-react";
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
    <header className="sticky top-0 z-50 bg-minerva-beige/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/">
            <div className="cursor-pointer">
              <span className="text-minerva-brown font-serif text-2xl md:text-3xl font-bold tracking-wide">MINERVA</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/") ? "text-minerva-red" : ""}`}>
                Home
              </span>
            </Link>
            <Link href="/about">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/about") ? "text-minerva-red" : ""}`}>
                About Us
              </span>
            </Link>
            <Link href="/services">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/services") ? "text-minerva-red" : ""}`}>
                Services
              </span>
            </Link>
            <Link href="/gallery">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/gallery") ? "text-minerva-red" : ""}`}>
                Gallery
              </span>
            </Link>
            <Link href="/products">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/products") ? "text-minerva-red" : ""}`}>
                Products
              </span>
            </Link>
            <Link href="/booking">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/booking") ? "text-minerva-red" : ""}`}>
                Booking
              </span>
            </Link>
            <Link href="/contact">
              <span className={`text-sm font-medium hover:text-minerva-red transition-all cursor-pointer ${isActive("/contact") ? "text-minerva-red" : ""}`}>
                Contact
              </span>
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-minerva-brown hover:text-minerva-red"
            >
              <Search size={18} />
            </Button>

            {/* Cart Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-minerva-brown hover:text-minerva-red"
            >
              <ShoppingCart size={18} />
            </Button>

            {/* Login/Logout Button */}
            {user ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout} 
                disabled={logoutMutation.isPending}
                className="bg-minerva-cream border-minerva-brown text-minerva-brown hover:bg-minerva-red hover:text-white rounded-full text-xs px-4"
              >
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            ) : (
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-minerva-cream border-minerva-brown text-minerva-brown hover:bg-minerva-red hover:text-white rounded-full text-xs px-4"
                >
                  Login
                </Button>
              </Link>
            )}
            
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-minerva-brown"
              onClick={toggleMobileMenu}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-minerva-beige py-4 border-t border-minerva-brown/20">
            <nav className="flex flex-col space-y-4">
              <Link href="/">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Home
                </span>
              </Link>
              <Link href="/about">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/about") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  About Us
                </span>
              </Link>
              <Link href="/services">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/services") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Services
                </span>
              </Link>
              <Link href="/gallery">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/gallery") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Gallery
                </span>
              </Link>
              <Link href="/products">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/products") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Products
                </span>
              </Link>
              <Link href="/booking">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/booking") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Booking
                </span>
              </Link>
              <Link href="/contact">
                <span 
                  className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/contact") ? "text-minerva-red" : ""}`} 
                  onClick={closeMobileMenu}
                >
                  Contact
                </span>
              </Link>
              
              {/* Client Portal in Mobile Menu */}
              {user && (
                <Link href="/client/dashboard">
                  <span 
                    className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/client/dashboard") ? "text-minerva-red" : ""}`} 
                    onClick={closeMobileMenu}
                  >
                    My Account
                  </span>
                </Link>
              )}
              
              {/* Admin Link in Mobile Menu */}
              {user?.role === "admin" && (
                <Link href="/admin/dashboard">
                  <span 
                    className={`text-sm font-medium hover:text-minerva-red transition-all px-4 cursor-pointer ${isActive("/admin/dashboard") ? "text-minerva-red" : ""}`} 
                    onClick={closeMobileMenu}
                  >
                    Admin
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
