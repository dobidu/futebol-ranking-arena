
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAdmin, onLogin, onLogout }) => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation isAdmin={isAdmin} onLogin={onLogin} onLogout={onLogout} />
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
