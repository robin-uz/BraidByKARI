import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/auth';
import { 
  Menu, X, Moon, Sun, User, LogOut, Settings, 
  ChevronDown, ShoppingBag, Calendar 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Container, TouchableArea } from '@/components/ui/container';

interface NavLink {
  name: string;
  href: string;
  admin?: boolean;
}

const NAV_LINKS: NavLink[] = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Booking', href: '/booking' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Admin', href: '/admin', admin: true },
];

export function NavHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Set dark mode based on localStorage or system preference
  useEffect(() => {
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        // Header height from specs
        "fixed top-0 left-0 right-0 z-50",
        "h-[var(--header-height-mobile)] md:h-[var(--header-height-tablet)] lg:h-[var(--header-height)]",
        // Transition for header styling
        "transition-all duration-300 ease-in-out",
        // Conditional styling based on scroll
        isScrolled 
          ? "bg-white/95 dark:bg-neutral-950/95 shadow-md backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between h-full">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex flex-col items-start">
            <span 
              className={cn(
                "font-serif font-bold text-2xl md:text-3xl bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent",
                "max-w-[var(--logo-max-width-mobile)] md:max-w-[var(--logo-max-width)]"
              )}
            >
              KARI STYLEZ
            </span>
            <span className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
              Luxury Hair Braiding
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-[var(--nav-link-gap)]">
          {NAV_LINKS.filter(link => link.admin ? user?.isAdmin : true).map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={cn(
                "relative text-base font-medium py-2",
                "hover:text-amber-600 dark:hover:text-amber-400 transition-colors",
                location === link.href 
                  ? "text-amber-600 dark:text-amber-400 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-amber-600 dark:after:bg-amber-400" 
                  : "text-neutral-700 dark:text-neutral-300"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Theme Toggle */}
          <TouchableArea
            onClick={toggleDarkMode}
            className="text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </TouchableArea>
          
          {/* Auth Button or Account Menu */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchableArea>
                  <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400">
                    <User size={20} />
                    <span className="font-medium">{user.username}</span>
                    <ChevronDown size={16} />
                  </div>
                </TouchableArea>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/appointments">
                  <DropdownMenuItem className="cursor-pointer">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Appointments</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/loyalty">
                  <DropdownMenuItem className="cursor-pointer">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    <span>Loyalty Points</span>
                  </DropdownMenuItem>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin">
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500 focus:text-red-500"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Book Now Button */}
          <Link href="/booking">
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 lg:hidden">
          {/* Theme Toggle */}
          <TouchableArea
            onClick={toggleDarkMode}
            className="text-neutral-700 dark:text-neutral-300"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </TouchableArea>
          
          {/* Menu Toggle */}
          <TouchableArea
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "text-neutral-700 dark:text-neutral-300",
              "transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </TouchableArea>
        </div>
      </Container>

      {/* Mobile Navigation Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 right-0 z-40",
          "w-[var(--mobile-drawer-width)]",
          "bg-white dark:bg-neutral-900",
          "shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          "transform",
          "p-[var(--mobile-drawer-padding)]",
          "flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:hidden"
        )}
      >
        {/* Mobile Menu Content */}
        <div className="flex flex-col pt-16">
          {/* User Info for Mobile */}
          {user && (
            <div className="mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-800 dark:text-amber-200 text-lg font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{user.username}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-1 mt-3">
                <Link href="/profile">
                  <span className="flex items-center gap-2 text-sm py-2 text-neutral-700 dark:text-neutral-300">
                    <User size={16} />
                    <span>My Profile</span>
                  </span>
                </Link>
                <Link href="/appointments">
                  <span className="flex items-center gap-2 text-sm py-2 text-neutral-700 dark:text-neutral-300">
                    <Calendar size={16} />
                    <span>My Appointments</span>
                  </span>
                </Link>
                <Link href="/loyalty">
                  <span className="flex items-center gap-2 text-sm py-2 text-neutral-700 dark:text-neutral-300">
                    <ShoppingBag size={16} />
                    <span>Loyalty & Rewards</span>
                  </span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.filter(link => link.admin ? user?.isAdmin : true).map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "py-3 px-2 text-lg font-medium",
                  "border-l-2",
                  "transition-colors duration-200",
                  location === link.href 
                    ? "border-amber-600 dark:border-amber-400 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-900/20" 
                    : "border-transparent text-neutral-700 dark:text-neutral-300 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/30 dark:hover:bg-amber-900/10"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* Mobile Action Buttons */}
          <div className="mt-auto pt-6 flex flex-col space-y-3">
            {!user ? (
              <Link href="/auth" className="w-full">
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </Link>
            ) : (
              <Button 
                variant="outline" 
                className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-800"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            )}
            
            <Link href="/booking" className="w-full">
              <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile menu backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
}