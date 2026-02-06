import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AgentsDashboard from "./pages/AgentsDashboard";
import AppPage from "./pages/App";
import Chat from "./pages/Chat";
import IExecDemo from "./pages/IExecDemo";
import BulkScore from "./pages/BulkScore";
import MultiAgentDashboard from "./pages/MultiAgentDashboard";
import NotFound from "./pages/NotFound";

const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<AgentsDashboard />} />
        <Route path="/orchestration" element={<MultiAgentDashboard />} />
        <Route path="/app/*" element={<AppPage />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/iexec-demo" element={<IExecDemo />} />
        <Route path="/bulk-score" element={<BulkScore />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;
