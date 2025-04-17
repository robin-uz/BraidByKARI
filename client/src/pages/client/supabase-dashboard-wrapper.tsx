import React from 'react';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import { SupabaseProtectedRoute } from '@/lib/supabase-protected-route';
import SupabaseDashboardPage from './supabase-dashboard-page';

export default function SupabaseDashboardWrapper() {
  return (
    <SupabaseAuthProvider>
      <SupabaseProtectedRoute path="/client/supabase-dashboard" component={SupabaseDashboardPage} />
    </SupabaseAuthProvider>
  );
}