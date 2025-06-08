
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/shared/Layout";
import Index from "./pages/Index";
import Rankings from "./pages/Rankings";
import Players from "./pages/Players";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = () => {
    // Simulação de login - será substituído por autenticação real
    setIsAdmin(true);
    console.log("Login realizado com sucesso");
  };

  const handleLogout = () => {
    setIsAdmin(false);
    console.log("Logout realizado com sucesso");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/jogadores" element={<Players />} />
              <Route path="/relatorios" element={<Reports />} />
              {/* Rotas administrativas serão adicionadas em breve */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
