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
  
  // Check if we're on the admin dashboard
  const isAdminPage = location.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage && <MainNav />}
      <main className="flex-grow">{children}</main>
      {!isAdminPage && <Footer />}
    </div>
  );
}
