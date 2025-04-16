import { ReactNode, useEffect } from "react";
import MainNav from "./main-nav";
import Footer from "./footer";
import { useLocation } from "wouter";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to top on location change
    window.scrollTo(0, 0);
  }, [location]);
  
  // Check if we're on the admin dashboard or auth-related pages
  const isAdminPage = location.startsWith('/admin');
  const isAuthPage = location === '/auth';
  const isPasswordResetPage = location.startsWith('/auth/forgot-password') || location.startsWith('/auth/reset-password');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && !isPasswordResetPage && <MainNav />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && !isPasswordResetPage && <Footer />}
    </div>
  );
}
