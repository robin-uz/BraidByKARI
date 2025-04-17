import React from 'react';
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext';
import SupabaseTestPage from './supabase-test-page';

export default function SupabaseAuthPage() {
  return (
    <SupabaseAuthProvider>
      <SupabaseTestPage />
    </SupabaseAuthProvider>
  );
}