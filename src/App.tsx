
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Homepage } from "@/pages/Homepage";
import { Login } from "@/pages/Login";
import { CybersecurityCertificates } from "@/pages/CybersecurityCertificates";
import { BlockchainCertificates } from "@/pages/BlockchainCertificates";
import { Projects } from "@/pages/Projects";
import { Journey } from "@/pages/Journey";
import { Tracker } from "@/pages/Tracker";
import { Roadmap } from "@/pages/Roadmap";
import { Admin } from "@/pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen">
              <Header />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cybersecurity-certificates" element={<CybersecurityCertificates />} />
                <Route path="/blockchain-certificates" element={<BlockchainCertificates />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/journey" element={<Journey />} />
                <Route path="/tracker" element={<Tracker />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
