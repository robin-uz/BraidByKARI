import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useServerAuth } from "@/contexts/DebugAuthContext";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Users,
  Home, 
  Settings, 
  LogOut,
  BarChart3,
  MessageSquare,
  Bell,
  Image,
  Clipboard,
  Sparkles,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useServerAuth();
  const [location] = useLocation();
  const { toast } = useToast();
  
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      window.location.href = "/";
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/admin/dashboard" },
    { icon: <Calendar className="h-5 w-5" />, label: "Bookings", href: "/admin/bookings" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Analytics", href: "/admin/analytics" },
    { icon: <Bell className="h-5 w-5" />, label: "Reminders", href: "/admin/reminders" },
    { icon: <Image className="h-5 w-5" />, label: "Gallery", href: "/admin/gallery" },
    { icon: <Users className="h-5 w-5" />, label: "Services", href: "/admin/services" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Testimonials", href: "/admin/testimonials" }
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white dark:bg-neutral-800 dark:border-neutral-700">
          <div className="px-6 pb-5 flex items-center border-b border-neutral-100 dark:border-neutral-700">
            <Link href="/">
              <a className="flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center mr-2">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-transparent bg-clip-text">Divine Braids</span>
              </a>
            </Link>
          </div>
          
          <div className="flex-1 px-4 py-5">
            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium">{user?.fullName || user?.username}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Admin</p>
                </div>
              </div>
            </div>
          
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Management
              </h3>
              <nav className="space-y-1 mt-3">
                {menuItems.map((item, index) => (
                  <Link key={index} href={item.href}>
                    <a
                      className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium ${
                        isActive(item.href)
                          ? "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-900 dark:from-purple-900/50 dark:to-fuchsia-900/50 dark:text-purple-100"
                          : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <span className={`mr-3 ${isActive(item.href) ? "text-purple-700 dark:text-purple-300" : ""}`}>
                        {item.icon}
                      </span>
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
          
          <div className="p-4 border-t border-neutral-100 dark:border-neutral-700">
            <div className="space-y-2">
              <Link href="/admin/settings">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </a>
              </Link>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-red-50 hover:text-red-900 dark:hover:bg-red-900/20 dark:hover:text-red-200"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="mr-3 h-5 w-5" />
                {logoutMutation.isPending ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="lg:hidden bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 fixed w-full top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="mr-2">
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <Link href="/">
              <a className="flex items-center">
                <span className="text-lg font-semibold">Divine Braids</span>
              </a>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link href="/admin/settings">
              <a
                className={`p-2 rounded-md ${
                  isActive("/admin/settings")
                    ? "bg-neutral-100 dark:bg-neutral-700 text-purple-700 dark:text-purple-300"
                    : "text-neutral-700 dark:text-neutral-200"
                }`}
              >
                <Settings className="h-5 w-5" />
              </a>
            </Link>
            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <User className="h-4 w-4 text-purple-700 dark:text-purple-300" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu (slide over) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-25"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
            
            <div className="relative flex flex-col w-72 h-full max-w-xs py-4 pb-12 bg-white dark:bg-neutral-800 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="px-4 mb-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-lg flex items-center justify-center mr-2">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-transparent bg-clip-text">
                      Divine Braids
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{user?.fullName || user?.username}</h3>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Admin</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-1">
                <h3 className="px-4 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  Management
                </h3>
                <nav className="mt-3 space-y-1">
                  {menuItems.map((item, index) => (
                    <Link key={index} href={item.href}>
                      <a
                        className={`flex items-center px-4 py-2.5 text-sm font-medium ${
                          isActive(item.href)
                            ? "bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-900 dark:from-purple-900/50 dark:to-fuchsia-900/50 dark:text-purple-100"
                            : "text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className={`mr-3 ${isActive(item.href) ? "text-purple-700 dark:text-purple-300" : ""}`}>
                          {item.icon}
                        </span>
                        {item.label}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
              
              <div className="mt-auto px-4">
                <Separator className="my-4" />
                <Button
                  variant="ghost"
                  className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md text-neutral-700 dark:text-neutral-200 hover:bg-red-50 hover:text-red-900 dark:hover:bg-red-900/20 dark:hover:text-red-200"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  {logoutMutation.isPending ? "Signing out..." : "Sign out"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
      <div className="flex-1">
        <div className="h-full">
          <main className="pt-16 lg:pt-4 pb-10 lg:pl-64">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}