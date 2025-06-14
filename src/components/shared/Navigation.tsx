
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Trophy, Users, BarChart3, Settings, LogIn, Calendar, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  isAdmin?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isAdmin = false, onLogin, onLogout }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const NavLink = ({ route, onClick }: { route: any; onClick?: () => void }) => {
    const Icon = route.icon;
    const isActive = location.pathname === route.path;
    
    return (
      <Link
        to={route.path}
        onClick={onClick}
        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-accent'
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{route.label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground hidden sm:block">Pelada Bravo</span>
              <span className="text-lg font-bold text-foreground sm:hidden">PB</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {publicRoutes.map((route) => (
              <NavLink key={route.path} route={route} />
            ))}
            
            {isAdmin && (
              <>
                <div className="h-6 w-px bg-border mx-2" />
                {adminRoutes.map((route) => (
                  <NavLink key={route.path} route={route} />
                ))}
              </>
            )}
          </div>

          {/* Login/Logout Button */}
          <div className="flex items-center space-x-2">
            {isAdmin ? (
              <Button variant="outline" size="sm" onClick={onLogout}>
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Sair</span>
              </Button>
            ) : (
              <Button size="sm" onClick={onLogin}>
                <LogIn className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}

            {/* Mobile Menu Trigger */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <SheetHeader>
                    <SheetTitle className="flex items-center space-x-2">
                      <Trophy className="h-6 w-6 text-primary" />
                      <span>Pelada Bravo</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-1">
                    <div className="space-y-1">
                      <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Menu Principal
                      </h3>
                      {publicRoutes.map((route) => (
                        <NavLink 
                          key={route.path} 
                          route={route} 
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      ))}
                    </div>
                    
                    {isAdmin && (
                      <div className="space-y-1 pt-4">
                        <h3 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Administração
                        </h3>
                        {adminRoutes.map((route) => (
                          <NavLink 
                            key={route.path} 
                            route={route} 
                            onClick={() => setIsMobileMenuOpen(false)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
