
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Edit, ArrowLeft, Settings } from 'lucide-react';
import { Pelada, Temporada } from '@/types';

interface PeladaHeaderProps {
  pelada: Pelada;
  temporada?: Temporada;
  isAdminRoute: boolean;
  isAdmin?: boolean;
  backUrl: string;
  totalPartidas: number;
}

const PeladaHeader: React.FC<PeladaHeaderProps> = ({
  pelada,
  temporada,
  isAdminRoute,
  isAdmin = false,
  backUrl,
  totalPartidas
}) => {
  return (
    <div className="space-y-4">
      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Link to={backUrl}>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to={`/admin/pelada/${pelada.id}/editar`} className="w-full sm:w-auto">
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <Settings className="h-4 w-4 mr-2" />
                Editar Dados
              </Button>
            </Link>
            {isAdminRoute && (
              <Link to={`/admin/peladas/editar/${pelada.id}`} className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <Edit className="h-4 w-4 mr-2" />
                  Recriar Pelada
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Título e informações */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-start sm:items-center space-x-2">
          <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary mt-1 sm:mt-0 flex-shrink-0" />
          <span className="break-words">
            Pelada - {new Date(pelada.data).toLocaleDateString('pt-BR')}
          </span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Temporada {temporada?.nome} • {totalPartidas} partida{totalPartidas !== 1 ? 's' : ''} realizada{totalPartidas !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};

export default PeladaHeader;
