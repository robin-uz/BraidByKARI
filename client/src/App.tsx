import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ServerAuthProvider } from "@/contexts/DebugAuthContext";
import { ServerProtectedRoute } from "./lib/server-protected-route";
import MainLayout from "@/components/layout/main-layout";

// Pages
import HomePage from "@/pages/home-page";
import GalleryPage from "@/pages/gallery-page";
import BookingPage from "@/pages/booking-page";
import ContactPage from "@/pages/contact-page";
import PricingPage from "@/pages/pricing-page";
import ServerAuthPage from "@/pages/auth/server-auth-page";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBookings from "@/pages/admin/bookings";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminReminders from "@/pages/admin/reminders";
import NotFound from "@/pages/not-found";

// Client pages
import ClientDashboard from "@/pages/client/dashboard";
import HairSimulator from "@/pages/client/hair-simulator";
import ProfilePage from "@/pages/client/profile";

// Legal Pages
import PrivacyPolicy from "@/pages/legal/privacy-policy";
import TermsAndConditions from "@/pages/legal/terms";
import RefundPolicy from "@/pages/legal/refund-policy";

function Router() {
  return (
    <MainLayout>
      <Switch>
        {/* Public routes */}
        <Route path="/" component={HomePage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/pricing" component={PricingPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/auth" component={ServerAuthPage} />
        <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
        <Route path="/auth/reset-password" component={ResetPasswordPage} />
        
        {/* Booking - protection optional as guests can book too, 
            but if logged in we'll use their profile info */}
        <Route path="/booking" component={BookingPage} />
        
        {/* Legal pages */}
        <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsAndConditions} />
        <Route path="/legal/refund-policy" component={RefundPolicy} />
        
        {/* Client routes - protected */}
        <ServerProtectedRoute path="/client/dashboard" component={ClientDashboard} />
        <ServerProtectedRoute path="/client/hair-simulator" component={HairSimulator} />
        <ServerProtectedRoute path="/client/profile" component={ProfilePage} />

        {/* Admin routes - protected */}
        <ServerProtectedRoute path="/admin/dashboard" component={AdminDashboard} adminOnly={true} />
        <ServerProtectedRoute path="/admin/bookings" component={AdminBookings} adminOnly={true} />
        <ServerProtectedRoute path="/admin/analytics" component={AdminAnalytics} adminOnly={true} />
        <ServerProtectedRoute path="/admin/reminders" component={AdminReminders} adminOnly={true} />
        
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
        <ServerAuthProvider>
          <Router />
          <Toaster />
        </ServerAuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
