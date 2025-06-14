
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { TimeNaPelada, Jogador } from '@/types';

interface PeladaTeamsProps {
  times: TimeNaPelada[];
  jogadores: Jogador[];
}

const PeladaTeams: React.FC<PeladaTeamsProps> = ({ times, jogadores }) => {
  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-primary" />
          <span>Times da Pelada</span>
        </CardTitle>
        <CardDescription>Composição dos times ({times.length} times registrados)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {times.map(time => (
            <div key={time.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between mb-3">
                <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
                  Time {time.identificadorLetra}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {time.jogadores.length} jogadores
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {time.jogadores.map((jogadorId, index) => (
                  <div key={index} className="text-sm bg-white px-2 py-1 rounded border">
                    <Link to={`/jogador/${jogadorId}`} className="hover:underline text-blue-600">
                      {getJogadorNome(jogadorId)}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {times.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhum time registrado</p>
              <p className="text-sm text-muted-foreground">Os times aparecerão quando as partidas forem criadas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeladaTeams;
