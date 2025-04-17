import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LoadingProvider } from "./contexts/LoadingContext";
import { LoadingScreen } from "./components/ui/loading-screen";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "./components/layout/theme-provider";
import { ServerAuthProvider } from "./contexts/DebugAuthContext";
import { AuthProvider } from "./hooks/use-auth";
import { SupabaseAuthProvider } from "./contexts/SupabaseAuthContext";
import { Toaster } from "./components/ui/toaster";

// Log the environment variables for debugging (we'll remove these in production)
console.log("Supabase URL available:", !!import.meta.env.VITE_SUPABASE_URL);
console.log("Supabase Anon Key available:", !!import.meta.env.VITE_SUPABASE_ANON_KEY);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      {/* Keep both authentication providers running in parallel for now */}
      <ServerAuthProvider>
        <AuthProvider>
          {/* Add the Supabase Auth Provider as an additional layer */}
          <SupabaseAuthProvider>
            <LoadingProvider>
              <LoadingScreen />
              <App />
              <Toaster />
            </LoadingProvider>
          </SupabaseAuthProvider>
        </AuthProvider>
      </ServerAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
