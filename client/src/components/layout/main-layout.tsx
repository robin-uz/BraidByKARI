import { ReactNode, useEffect } from "react";
import { useLocation } from "wouter";
import { NavHeader } from "./nav-header";
import { Footer } from "./footer";

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
      {!isAdminPage && !isPasswordResetPage && <NavHeader />}
      <main className="flex-grow pt-[var(--header-height-mobile)] md:pt-[var(--header-height-tablet)] lg:pt-[var(--header-height)]">
        {children}
      </main>
      {!isAdminPage && !isPasswordResetPage && <Footer />}
    </div>
  );
}
