
import React from 'react';
import { Target, Shield } from 'lucide-react';

interface EventIconProps {
  tipo: string;
}

const EventIcon: React.FC<EventIconProps> = ({ tipo }) => {
  switch (tipo) {
    case 'gol':
      return <Target className="h-4 w-4 text-green-600" />;
    case 'cartao_amarelo':
      return (
        <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>
      );
    case 'cartao_azul':
      return (
        <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>
      );
    case 'cartao_vermelho':
      return (
        <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>
      );
    default:
      return null;
  }
};

export default EventIcon;
