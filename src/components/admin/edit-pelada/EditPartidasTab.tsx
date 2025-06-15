
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Trophy } from 'lucide-react';
import { Pelada, Jogador, PartidaPelada, EventoPelada } from '@/types';
import MatchCard from './MatchCard';

interface EditPartidasTabProps {
  pelada: Pelada;
  jogadores: Jogador[];
  onSave: (dadosAtualizados: any) => void;
}

const EditPartidasTab: React.FC<EditPartidasTabProps> = ({
  pelada,
  jogadores,
  onSave
}) => {
  const [partidas, setPartidas] = useState<PartidaPelada[]>([]);

  useEffect(() => {
    setPartidas(pelada.partidas || []);
  }, [pelada]);

  const adicionarEvento = (partidaIndex: number, tipo: string, jogadorId: string, assistidoPor?: string) => {
    if (!tipo || !jogadorId) return;

    const novoEvento: EventoPelada = {
      id: crypto.randomUUID(),
      partidaId: partidas[partidaIndex].id,
      jogadorId,
      tipo: tipo as any,
      minuto: 0,
      assistidoPor: assistidoPor && assistidoPor !== 'nenhuma' ? assistidoPor : undefined
    };

    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        const eventosAtualizados = [...(partida.eventos || []), novoEvento];
        
        // Se for gol, atualizar placar
        let novosPlacarA = partida.placarA;
        let novosPlacarB = partida.placarB;
        
        if (tipo === 'gol') {
          const timeDoJogador = partida.timeA.includes(jogadorId) ? 'A' : 'B';
          if (timeDoJogador === 'A') {
            novosPlacarA += 1;
          } else {
            novosPlacarB += 1;
          }
        }

        return {
          ...partida,
          eventos: eventosAtualizados,
          placarA: novosPlacarA,
          placarB: novosPlacarB,
          golsTimeA: novosPlacarA,
          golsTimeB: novosPlacarB
        };
      }
      return partida;
    }));
  };

  const removerEvento = (partidaIndex: number, eventoId: string) => {
    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        const eventoRemovido = partida.eventos?.find(e => e.id === eventoId);
        const eventosAtualizados = partida.eventos?.filter(e => e.id !== eventoId) || [];
        
        // Se for gol, atualizar placar
        let novosPlacarA = partida.placarA;
        let novosPlacarB = partida.placarB;
        
        if (eventoRemovido?.tipo === 'gol') {
          const timeDoJogador = partida.timeA.includes(eventoRemovido.jogadorId) ? 'A' : 'B';
          if (timeDoJogador === 'A') {
            novosPlacarA = Math.max(0, novosPlacarA - 1);
          } else {
            novosPlacarB = Math.max(0, novosPlacarB - 1);
          }
        }

        return {
          ...partida,
          eventos: eventosAtualizados,
          placarA: novosPlacarA,
          placarB: novosPlacarB,
          golsTimeA: novosPlacarA,
          golsTimeB: novosPlacarB
        };
      }
      return partida;
    }));
  };

  const atualizarPlacar = (partidaIndex: number, timeA: number, timeB: number) => {
    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        return {
          ...partida,
          placarA: timeA,
          placarB: timeB,
          golsTimeA: timeA,
          golsTimeB: timeB
        };
      }
      return partida;
    }));
  };

  const handleSave = () => {
    const peladaAtualizada = {
      ...pelada,
      partidas
    };

    onSave(peladaAtualizada);
  };

  if (!partidas.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhuma partida encontrada para esta pelada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {partidas.map((partida, partidaIndex) => (
        <MatchCard
          key={partida.id}
          partida={partida}
          partidaIndex={partidaIndex}
          jogadores={jogadores}
          onScoreUpdate={atualizarPlacar}
          onAddEvent={adicionarEvento}
          onRemoveEvent={removerEvento}
        />
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Partidas
        </Button>
      </div>
    </div>
  );
};

export default EditPartidasTab;
