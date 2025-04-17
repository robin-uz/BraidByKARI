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
import { Toaster } from "./components/ui/toaster";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <ServerAuthProvider>
        <AuthProvider>
          <LoadingProvider>
            <LoadingScreen />
            <App />
            <Toaster />
          </LoadingProvider>
        </AuthProvider>
      </ServerAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
