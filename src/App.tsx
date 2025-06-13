
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/shared/Layout';
import LoginModal from '@/components/auth/LoginModal';

// Pages
import Index from '@/pages/Index';
import Rankings from '@/pages/Rankings';
import Players from '@/pages/Players';
import PlayerProfile from '@/pages/PlayerProfile';
import Seasons from '@/pages/Seasons';
import SeasonDetail from '@/pages/SeasonDetail';
import PeladaDetail from '@/pages/PeladaDetail';
import Reports from '@/pages/Reports';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminPlayers from '@/pages/admin/AdminPlayers';
import AdminSeasons from '@/pages/admin/AdminSeasons';
import AdminPeladas from '@/pages/admin/AdminPeladas';
import NotFound from '@/pages/NotFound';

import './App.css';

const queryClient = new QueryClient();

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLogin = (username: string, password: string) => {
    // Simple authentication check
    if (username === 'admin' && password === 'admin') {
      setIsAdmin(true);
      setShowLoginModal(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleOpenLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout 
          isAdmin={isAdmin} 
          onLogin={handleOpenLogin} 
          onLogout={handleLogout}
        >
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/jogadores" element={<Players />} />
            <Route path="/jogador/:id" element={<PlayerProfile />} />
            <Route path="/temporadas" element={<Seasons />} />
            <Route path="/temporada/:id" element={<SeasonDetail />} />
            <Route path="/pelada/:id" element={<PeladaDetail />} />
            <Route path="/relatorios" element={<Reports />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/jogadores" element={<AdminPlayers />} />
            <Route path="/admin/temporadas" element={<AdminSeasons />} />
            <Route path="/admin/temporadas/:id" element={<SeasonDetail />} />
            <Route path="/admin/pelada/:id" element={<PeladaDetail />} />
            <Route path="/admin/peladas" element={<AdminPeladas />} />
            <Route path="/admin/peladas/editar/:id" element={<AdminPeladas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
