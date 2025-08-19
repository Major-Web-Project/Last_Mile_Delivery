import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AgentView from "./pages/AgentView";
import NotFound from "./pages/NotFound";
import DefaultView from "./components/DefaultView";
import About from "./pages/About";


const queryClient = new QueryClient();

const App = () => (
  <>
  
  <QueryClientProvider client={queryClient}>
    
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/agent" element={<AgentView />} />
            <Route path="/default" element={<DefaultView />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
  </>
  
);

export default App;
