import { Switch, Route } from "wouter";
import { ServerProtectedRoute } from "./lib/server-protected-route";
import { ProtectedRoute } from "./lib/protected-route";
import { SupabaseProtectedRoute } from "./lib/supabase-protected-route";
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
import SupabaseAuth from "@/pages/auth/supabase-auth";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBookings from "@/pages/admin/bookings";
import AdminAnalytics from "@/pages/admin/analytics";
import AdminReminders from "@/pages/admin/reminders";
import NotFound from "@/pages/not-found";
import TestPage from "@/pages/test-page";

// Client pages
import ClientDashboard from "@/pages/client/dashboard";
import ClientDashboardPage from "@/pages/client/dashboard-page";
import SupabaseDashboard from "@/pages/client/supabase-dashboard";
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
        <Route path="/auth/supabase" component={SupabaseAuth} />
        
        {/* Booking - protection optional as guests can book too, 
            but if logged in we'll use their profile info */}
        <Route path="/booking" component={BookingPage} />
        
        {/* Legal pages */}
        <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
        <Route path="/legal/terms" component={TermsAndConditions} />
        <Route path="/legal/refund-policy" component={RefundPolicy} />
        <Route path="/test-page" component={TestPage} />
        
        {/* Supabase Auth Routes */}
        
        {/* Client routes - protected with server auth */}
        <ServerProtectedRoute path="/client/dashboard" component={ClientDashboardPage} />
        
        {/* Client routes - protected with Supabase auth */}
        <SupabaseProtectedRoute path="/client/supabase-dashboard" component={SupabaseDashboard} />
        <SupabaseProtectedRoute path="/client/supabase-profile" component={ProfilePage} />
        <SupabaseProtectedRoute path="/client/supabase-simulator" component={HairSimulator} />
        
        {/* Legacy routes - will be migrated */}
        <ProtectedRoute path="/client/dashboard-new" component={ClientDashboardPage} />
        <ServerProtectedRoute path="/client/dashboard-old" component={ClientDashboard} />
        <ServerProtectedRoute path="/client/hair-simulator" component={HairSimulator} />
        <ServerProtectedRoute path="/client/profile" component={ProfilePage} />

        {/* Admin routes - protected with server auth */}
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
  return <Router />;
}

export default App;
