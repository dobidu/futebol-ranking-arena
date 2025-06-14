
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
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
  return (
    <>
      {jogadoresPresentes > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Jogadores da Pelada</span>
            </CardTitle>
            <CardDescription>Lista completa dos jogadores presentes ({jogadoresPresentes} jogadores)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Exibir jogadores presentes */}
              {pelada.jogadoresPresentes ? 
                pelada.jogadoresPresentes.filter(j => j.presente).map((jogadorPresente, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <Link to={`/jogador/${jogadorPresente.id}`} className="hover:underline">
                      <div className="font-medium text-sm">{jogadorPresente.nome}</div>
                      <Badge variant="default" className="text-xs mt-1">
                        {jogadorPresente.tipo}
                      </Badge>
                    </Link>
                  </div>
                )) :
                pelada.presencas?.filter(p => p.presente).map((presenca, index) => {
                  const jogador = jogadores.find(j => j.id === presenca.jogadorId);
                  return (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <Link to={`/jogador/${presenca.jogadorId}`} className="hover:underline">
                        <div className="font-medium text-sm">{jogador?.nome || 'Jogador não encontrado'}</div>
                        <Badge variant="default" className="text-xs mt-1">
                          Presente{presenca.atraso !== 'nenhum' && ` (${presenca.atraso})`}
                        </Badge>
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
                      <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <Link to={`/jogador/${jogadorId}`} className="hover:underline">
                          <div className="font-medium text-sm">{jogador?.nome || 'Jogador não encontrado'}</div>
                          <Badge variant="default" className="text-xs mt-1">
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
