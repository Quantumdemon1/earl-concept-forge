
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedLayout } from "@/components/layout/ProtectedLayout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Concepts from "./pages/Concepts";
import ConceptList from "./pages/ConceptList";
import ConceptDetail from "./pages/ConceptDetail";
import AnalysisView from "./pages/AnalysisView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="earl-ui-theme">
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <ProtectedLayout>
                      <Index />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/concepts"
                  element={
                    <ProtectedLayout>
                      <Concepts />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/concepts/list"
                  element={
                    <ProtectedLayout>
                      <ConceptList />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/concepts/:id"
                  element={
                    <ProtectedLayout>
                      <ConceptDetail />
                    </ProtectedLayout>
                  }
                />
                <Route
                  path="/concepts/:id/analysis/:stage?"
                  element={
                    <ProtectedLayout>
                      <AnalysisView />
                    </ProtectedLayout>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
