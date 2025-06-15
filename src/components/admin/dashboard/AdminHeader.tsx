
import React from 'react';
import { Trophy } from 'lucide-react';
import { Temporada } from '@/types';

interface AdminHeaderProps {
  temporadaAtiva?: Temporada;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ temporadaAtiva }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-blue-100 text-lg">Controle total do sistema Pelada Bravo</p>
      {temporadaAtiva && (
        <div className="mt-4 inline-flex items-center bg-white/20 px-3 py-1 rounded-full">
          <Trophy className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">Temporada Ativa: {temporadaAtiva.nome}</span>
        </div>
      )}
    </div>
  );
};

export default AdminHeader;
