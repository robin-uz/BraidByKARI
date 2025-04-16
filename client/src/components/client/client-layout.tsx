import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useServerAuth } from "@/contexts/DebugAuthContext";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  User, 
  Home, 
  Settings, 
  LogOut,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
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

  const menuItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", href: "/client/dashboard" },
    { icon: <CalendarDays className="h-5 w-5" />, label: "My Bookings", href: "/client/bookings" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Hair Simulator", href: "/client/hair-simulator" }
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex min-h-screen bg-[#f8f5f1]">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto border-r bg-white">
          <div className="px-4 pb-2 flex items-center justify-center border-b">
            <Link href="/">
              <a className="flex items-center">
                <span className="text-xl font-semibold">Braided Beauty</span>
              </a>
            </Link>
          </div>
          
          <div className="flex-1 px-3 py-5">
            <div className="bg-[#f9f4eb] rounded-md p-4 mb-6 text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <div className="w-16 h-16 rounded-full bg-amber-300/30 flex items-center justify-center">
                  <User className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <h3 className="font-medium">{user?.fullName || user?.username}</h3>
              <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            </div>
          
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <Link key={index} href={item.href}>
                  <a
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.href)
                        ? "bg-amber-100 text-amber-900"
                        : "text-gray-700 hover:bg-amber-50 hover:text-amber-900"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t">
            <div className="space-y-2">
              <Link href="/client/settings">
                <a className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-amber-50 hover:text-amber-900">
                  <Settings className="mr-3 h-5 w-5" />
                  Account Settings
                </a>
              </Link>
              
              <Button
                variant="ghost"
                className="w-full justify-start px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-red-50 hover:text-red-900"
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
      
      {/* Mobile menu */}
      <div className="md:hidden bg-white w-full border-b shadow-sm fixed top-0 z-10">
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/">
            <a className="text-lg font-semibold">Braided Beauty</a>
          </Link>
          
          <div className="flex space-x-1">
            {menuItems.map((item, index) => (
              <Link key={index} href={item.href}>
                <a
                  className={`p-2 rounded-md ${
                    isActive(item.href)
                      ? "bg-amber-100 text-amber-900"
                      : "text-gray-700"
                  }`}
                >
                  {item.icon}
                </a>
              </Link>
            ))}
            <Link href="/client/settings">
              <a
                className={`p-2 rounded-md ${
                  isActive("/client/settings")
                    ? "bg-amber-100 text-amber-900"
                    : "text-gray-700"
                }`}
              >
                <Settings className="h-5 w-5" />
              </a>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        <main className="md:pt-0 pt-20 pb-10 w-full">
          {children}
        </main>
      </div>
    </div>
  );
}