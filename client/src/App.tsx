import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import MainLayout from "@/components/layout/main-layout";

// Pages
import HomePage from "@/pages/home-page";
import GalleryPage from "@/pages/gallery-page";
import BookingPage from "@/pages/booking-page";
import ContactPage from "@/pages/contact-page";
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBookings from "@/pages/admin/bookings";
import NotFound from "@/pages/not-found";

// Client pages
import ClientDashboard from "@/pages/client/dashboard";
import HairSimulator from "@/pages/client/hair-simulator";

// Legal Pages
import PrivacyPolicy from "@/pages/legal/privacy-policy";
import TermsAndConditions from "@/pages/legal/terms";
import RefundPolicy from "@/pages/legal/refund-policy";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/booking" component={BookingPage} />
        <Route path="/services" component={HomePage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/auth" component={AuthPage} />
        
        {/* Legal pages */}
        <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsAndConditions} />
        <Route path="/legal/refund-policy" component={RefundPolicy} />
        
        {/* Client routes - protected */}
        <ProtectedRoute path="/client/dashboard" component={ClientDashboard} />
        <ProtectedRoute path="/client/hair-simulator" component={HairSimulator} />

        {/* Admin routes - protected */}
        <ProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly={true} />
        <ProtectedRoute path="/admin/bookings" component={AdminBookings} adminOnly={true} />
        
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
