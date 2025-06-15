
import React from 'react';
import { Trophy } from 'lucide-react';

const HomeHeader: React.FC = () => {
  return (
    <div className="text-center space-y-6 py-8 px-4 bg-gradient-to-br from-primary/5 to-blue-50 rounded-3xl border shadow-sm">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
          <Trophy className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Pelada Bravo
        </h1>
      </div>
      <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        Sistema completo de gestão e acompanhamento do campeonato amador. 
        Acompanhe rankings, estatísticas e evolução dos jogadores em tempo real.
      </p>
    </div>
  );
};

export default HomeHeader;
