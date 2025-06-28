
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
                <Route path="/cybersecurity-certificates" element={<div>Cybersecurity Certificates - Coming Soon</div>} />
                <Route path="/blockchain-certificates" element={<div>Blockchain Certificates - Coming Soon</div>} />
                <Route path="/projects" element={<div>Projects - Coming Soon</div>} />
                <Route path="/journey" element={<div>Journey - Coming Soon</div>} />
                <Route path="/tracker" element={<div>Tracker - Coming Soon</div>} />
                <Route path="/roadmap" element={<div>Roadmap - Coming Soon</div>} />
                <Route path="/admin" element={<div>Admin Dashboard - Coming Soon</div>} />
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
