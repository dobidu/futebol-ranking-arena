
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

  console.log('PeladaMatches - Partidas recebidas:', partidas);
  
  // Log detalhado de cada partida e seus eventos
  partidas?.forEach((partida, index) => {
    console.log(`PeladaMatches - Partida ${index + 1} (ID: ${partida.id}):`);
    console.log(`  - Total de eventos: ${partida.eventos?.length || 0}`);
    console.log(`  - Placar: ${partida.placarA || 0} x ${partida.placarB || 0}`);
    
    // Log de cada evento para debug
    partida.eventos?.forEach((evento, eventoIndex) => {
      console.log(`  - Evento ${eventoIndex + 1}: ${evento.tipo} por jogador ${evento.jogadorId} (partidaId: ${evento.partidaId})`);
    });
  });

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
          {partidas?.map((partida, index) => {
            console.log(`PeladaMatches - Renderizando partida ${index + 1} (ID: ${partida.id})`);
            
            return (
              <MatchCard
                key={`match-${partida.id}-${index}`}
                partida={partida}
                index={index}
                times={times}
                jogadores={jogadores}
                getJogadorNome={getJogadorNome}
              />
            );
          })}
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
