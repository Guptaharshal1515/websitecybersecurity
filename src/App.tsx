import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EditModeProvider } from "@/contexts/EditModeContext";
import { Header } from "@/components/layout/Header";
import { AdaptiveNavigation } from "@/components/layout/AdaptiveNavigation";
import { Footer } from "@/components/layout/Footer";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { GlobalEditModeToolbar } from "@/components/editor/GlobalEditModeToolbar";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { AnimatePresence } from "framer-motion";
import { Homepage } from "@/pages/Homepage";
import { Login } from "@/pages/Login";
import { CybersecurityCertificates } from "@/pages/CybersecurityCertificates";
import { BlockchainCertificates } from "@/pages/BlockchainCertificates";
import { Projects } from "@/pages/Projects";
import { Journey } from "@/pages/Journey";
import Achievements from "@/pages/Achievements";
import { Roadmap } from "@/pages/Roadmap";
import { DigitalBadges } from "@/pages/DigitalBadges";
import { Admin } from "@/pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <EditModeProvider>
                <AppContent />
                <GlobalEditModeToolbar />
              </EditModeProvider>
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const { isEnabled } = useFeatureFlags();
  const location = useLocation();
  useSessionManagement();

  return (
    <div className="min-h-screen dark">
      {isEnabled('adaptive_navigation') ? <AdaptiveNavigation /> : <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cybersecurity-certificates" element={<CybersecurityCertificates />} />
          <Route path="/blockchain-certificates" element={<BlockchainCertificates />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/journey" element={<ProtectedRoute requiredRole="customer"><Journey /></ProtectedRoute>} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/roadmap" element={<ProtectedRoute requiredRole="customer"><Roadmap /></ProtectedRoute>} />
          <Route path="/digital-badges" element={<DigitalBadges />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;
