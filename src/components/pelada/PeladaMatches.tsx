
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { PartidaPelada, TimeNaPelada, Jogador } from '@/types';
import MatchCard from './MatchCard';

interface PeladaMatchesProps {
  partidas: PartidaPelada[];
  times: TimeNaPelada[];
  jogadores: Jogador[];
}

const PeladaMatches: React.FC<PeladaMatchesProps> = ({ partidas, times, jogadores }) => {
  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span>Partidas e Resultados</span>
        </CardTitle>
        <CardDescription>Detalhes completos dos jogos realizados na pelada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {partidas?.map((partida, index) => (
            <MatchCard
              key={partida.id}
              partida={partida}
              index={index}
              times={times}
              jogadores={jogadores}
              getJogadorNome={getJogadorNome}
            />
          ))}
          {(!partidas || partidas.length === 0) && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhuma partida registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeladaMatches;
