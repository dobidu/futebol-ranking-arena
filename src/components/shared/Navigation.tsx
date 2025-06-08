
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, BarChart3, Settings, LogIn, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  isAdmin?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAdmin = false, onLogin, onLogout }) => {
  const location = useLocation();

  const publicRoutes = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/rankings', label: 'Rankings', icon: Trophy },
    { path: '/jogadores', label: 'Jogadores', icon: Users },
    { path: '/temporadas', label: 'Temporadas', icon: Calendar },
    { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  ];

  const adminRoutes = [
    { path: '/admin', label: 'Painel Admin', icon: Settings },
    { path: '/admin/temporadas', label: 'Temporadas', icon: Trophy },
    { path: '/admin/jogadores', label: 'Gerenciar Jogadores', icon: Users },
    { path: '/admin/peladas', label: 'Súmula Digital', icon: BarChart3 },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Pelada Bravo</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* Links públicos */}
            <div className="hidden md:flex space-x-4">
              {publicRoutes.map((route) => {
                const Icon = route.icon;
                const isActive = location.pathname === route.path;
                return (
                  <Link
                    key={route.path}
                    to={route.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Links administrativos */}
            {isAdmin && (
              <div className="hidden md:flex space-x-4 border-l border-border pl-4">
                {adminRoutes.map((route) => {
                  const Icon = route.icon;
                  const isActive = location.pathname === route.path;
                  return (
                    <Link
                      key={route.path}
                      to={route.path}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{route.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Botão de login/logout */}
            <div className="flex items-center">
              {isAdmin ? (
                <Button variant="outline" onClick={onLogout} className="flex items-center space-x-1">
                  <span>Logout</span>
                </Button>
              ) : (
                <Button onClick={onLogin} className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
