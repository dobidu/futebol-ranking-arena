
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, ArrowLeft } from 'lucide-react';
import { Pelada, Temporada } from '@/types';

interface PeladaHeaderProps {
  pelada: Pelada;
  temporada?: Temporada;
  isAdminRoute: boolean;
  backUrl: string;
  totalPartidas: number;
}

const PeladaHeader: React.FC<PeladaHeaderProps> = ({
  pelada,
  temporada,
  isAdminRoute,
  backUrl,
  totalPartidas
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Link to={backUrl}>
        <Button variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span>Pelada - {new Date(pelada.data).toLocaleDateString('pt-BR')}</span>
        </h1>
        <p className="text-muted-foreground">
          Temporada {temporada?.nome} • {totalPartidas} partida{totalPartidas !== 1 ? 's' : ''} realizada{totalPartidas !== 1 ? 's' : ''}
        </p>
      </div>
      {isAdminRoute && (
        <Link to={`/admin/peladas/editar/${pelada.id}`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PeladaHeader;
