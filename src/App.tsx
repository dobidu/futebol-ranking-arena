
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
import PlayerProfile from "./pages/PlayerProfile";
import Reports from "./pages/Reports";
import Seasons from "./pages/Seasons";
import SeasonDetail from "./pages/SeasonDetail";
import PeladaDetail from "./pages/PeladaDetail";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminSeasons from "./pages/admin/AdminSeasons";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminPeladas from "./pages/admin/AdminPeladas";
import LoginModal from "./components/auth/LoginModal";

const queryClient = new QueryClient();

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Credenciais hardcoded simples
    if (username === 'admin' && password === 'admin12345!') {
      setIsAdmin(true);
      setShowLoginModal(false);
      console.log("Login realizado com sucesso");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
    console.log("Logout realizado com sucesso");
  };

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout isAdmin={isAdmin} onLogin={openLoginModal} onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/rankings" element={<Rankings />} />
              <Route path="/jogadores" element={<Players />} />
              <Route path="/jogador/:id" element={<PlayerProfile />} />
              <Route path="/temporadas" element={<Seasons />} />
              <Route path="/temporada/:id" element={<SeasonDetail />} />
              <Route path="/pelada/:id" element={<PeladaDetail />} />
              <Route path="/relatorios" element={<Reports />} />
              {/* Rotas administrativas */}
              {isAdmin && (
                <>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/temporadas" element={<AdminSeasons />} />
                  <Route path="/admin/jogadores" element={<AdminPlayers />} />
                  <Route path="/admin/peladas" element={<AdminPeladas />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <LoginModal 
            isOpen={showLoginModal} 
            onClose={closeLoginModal} 
            onLogin={handleLogin} 
          />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
