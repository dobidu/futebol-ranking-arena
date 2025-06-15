
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';
import { PartidaPelada, Jogador } from '@/types';
import MatchScore from './MatchScore';
import AddEventForm from './AddEventForm';
import EventsList from './EventsList';

interface MatchCardProps {
  partida: PartidaPelada;
  partidaIndex: number;
  jogadores: Jogador[];
  onScoreUpdate: (partidaIndex: number, timeA: number, timeB: number) => void;
  onAddEvent: (partidaIndex: number, tipo: string, jogadorId: string, assistidoPor?: string) => void;
  onRemoveEvent: (partidaIndex: number, eventoId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  partida,
  partidaIndex,
  jogadores,
  onScoreUpdate,
  onAddEvent,
  onRemoveEvent
}) => {
  const getJogadorNome = (jogadorId: string) => {
    return jogadores.find(j => j.id === jogadorId)?.nome || 'Jogador não encontrado';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Partida {partida.numeroPartida}</span>
        </CardTitle>
        <CardDescription>
          Time A vs Time B
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <MatchScore
          placarA={partida.placarA}
          placarB={partida.placarB}
          onScoreChange={(timeA, timeB) => onScoreUpdate(partidaIndex, timeA, timeB)}
        />

        <AddEventForm
          partidaIndex={partidaIndex}
          timeA={partida.timeA}
          timeB={partida.timeB}
          getJogadorNome={getJogadorNome}
          onAddEvent={onAddEvent}
        />

        <EventsList
          eventos={partida.eventos || []}
          getJogadorNome={getJogadorNome}
          onRemoveEvent={(eventoId) => onRemoveEvent(partidaIndex, eventoId)}
        />
      </CardContent>
    </Card>
  );
};

export default MatchCard;
