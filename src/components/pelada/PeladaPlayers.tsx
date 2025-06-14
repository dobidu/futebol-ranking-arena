
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import { Pelada, TimeNaPelada, Jogador } from '@/types';

interface PeladaPlayersProps {
  pelada: Pelada;
  times: TimeNaPelada[];
  jogadores: Jogador[];
  jogadoresPresentes: number;
}

const PeladaPlayers: React.FC<PeladaPlayersProps> = ({ 
  pelada, 
  times, 
  jogadores, 
  jogadoresPresentes 
}) => {
  const getAtrasoTexto = (atraso: string) => {
    switch (atraso) {
      case 'tipo1':
        return 'Atraso Leve';
      case 'tipo2':
        return 'Atraso Grave';
      default:
        return null;
    }
  };

  const getAtrasoVariant = (atraso: string) => {
    switch (atraso) {
      case 'tipo1':
        return 'secondary' as const;
      case 'tipo2':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <>
      {jogadoresPresentes > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Users className="h-5 w-5 text-primary" />
              <span>Jogadores da Pelada</span>
            </CardTitle>
            <CardDescription className="text-sm">
              Lista completa dos jogadores presentes ({jogadoresPresentes} jogador{jogadoresPresentes !== 1 ? 'es' : ''})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {/* Exibir jogadores presentes */}
              {pelada.jogadoresPresentes ? 
                pelada.jogadoresPresentes.filter(j => j.presente).map((jogadorPresente, index) => {
                  const atrasoTexto = getAtrasoTexto(jogadorPresente.atraso || 'nenhum');
                  return (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border hover:shadow-md transition-shadow">
                      <Link to={`/jogador/${jogadorPresente.id}`} className="block hover:underline">
                        <div className="font-medium text-sm mb-2 break-words">{jogadorPresente.nome}</div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="default" className="text-xs w-fit">
                            {jogadorPresente.tipo}
                          </Badge>
                          {atrasoTexto && (
                            <Badge variant={getAtrasoVariant(jogadorPresente.atraso || 'nenhum')} className="text-xs flex items-center gap-1 w-fit">
                              <Clock className="h-3 w-3" />
                              <span className="truncate">{atrasoTexto}</span>
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                }) :
                pelada.presencas?.filter(p => p.presente).map((presenca, index) => {
                  const jogador = jogadores.find(j => j.id === presenca.jogadorId);
                  const atrasoTexto = getAtrasoTexto(presenca.atraso);
                  return (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border hover:shadow-md transition-shadow">
                      <Link to={`/jogador/${presenca.jogadorId}`} className="block hover:underline">
                        <div className="font-medium text-sm mb-2 break-words">{jogador?.nome || 'Jogador não encontrado'}</div>
                        <div className="flex flex-col gap-2">
                          <Badge variant="default" className="text-xs w-fit">
                            Presente
                          </Badge>
                          {atrasoTexto && (
                            <Badge variant={getAtrasoVariant(presenca.atraso)} className="text-xs flex items-center gap-1 w-fit">
                              <Clock className="h-3 w-3" />
                              <span className="truncate">{atrasoTexto}</span>
                            </Badge>
                          )}
                        </div>
                      </Link>
                    </div>
                  );
                })
              }
              
              {/* Se não há dados de presença, exibir jogadores dos times */}
              {!pelada.jogadoresPresentes && !pelada.presencas && times.length > 0 && (
                (() => {
                  const jogadoresUnicos = new Set();
                  times.forEach(time => {
                    time.jogadores.forEach(jogadorId => jogadoresUnicos.add(jogadorId));
                  });
                  return Array.from(jogadoresUnicos).map((jogadorId, index) => {
                    const jogador = jogadores.find(j => j.id === jogadorId);
                    return (
                      <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border hover:shadow-md transition-shadow">
                        <Link to={`/jogador/${jogadorId}`} className="block hover:underline">
                          <div className="font-medium text-sm mb-2 break-words">{jogador?.nome || 'Jogador não encontrado'}</div>
                          <Badge variant="default" className="text-xs w-fit">
                            {jogador?.tipo || 'Tipo não definido'}
                          </Badge>
                        </Link>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default PeladaPlayers;
