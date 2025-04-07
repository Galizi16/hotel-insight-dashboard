
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import TarifsPage from "./pages/TarifsPage";
import DisponibilitesPage from "./pages/DisponibilitesPage";
import StaffPage from "./pages/StaffPage";
import ConcurrencePage from "./pages/ConcurrencePage";
import AlertesPage from "./pages/AlertesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tarifs" element={<TarifsPage />} />
          <Route path="/disponibilites" element={<DisponibilitesPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/concurrence" element={<ConcurrencePage />} />
          <Route path="/alertes" element={<AlertesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
