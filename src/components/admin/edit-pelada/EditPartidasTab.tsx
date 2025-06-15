
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
    console.log('EditPartidasTab - Carregando partidas:', pelada.partidas);
    setPartidas(pelada.partidas || []);
  }, [pelada]);

  const adicionarEvento = (partidaIndex: number, tipo: string, jogadorId: string, assistidoPor?: string) => {
    if (!tipo || !jogadorId) return;

    const partidaAtual = partidas[partidaIndex];
    if (!partidaAtual) return;

    const novoEvento: EventoPelada = {
      id: crypto.randomUUID(),
      partidaId: partidaAtual.id, // Usar o ID correto da partida
      jogadorId,
      tipo: tipo as any,
      minuto: 0,
      assistidoPor: assistidoPor && assistidoPor !== 'nenhuma' ? assistidoPor : undefined
    };

    console.log('EditPartidasTab - Adicionando evento:', novoEvento);
    console.log('EditPartidasTab - Para partida:', partidaAtual.id);

    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        // Filtrar eventos existentes desta partida e adicionar o novo
        const eventosExistentes = partida.eventos?.filter(e => e.partidaId === partida.id) || [];
        const eventosAtualizados = [...eventosExistentes, novoEvento];
        
        console.log('EditPartidasTab - Eventos atualizados para partida', partida.id, ':', eventosAtualizados);
        
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
        // Filtrar apenas eventos desta partida específica
        const eventosAtualizados = partida.eventos?.filter(e => e.id !== eventoId && e.partidaId === partida.id) || [];
        
        console.log('EditPartidasTab - Removendo evento', eventoId, 'da partida', partida.id);
        console.log('EditPartidasTab - Eventos restantes:', eventosAtualizados);
        
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
    console.log('EditPartidasTab - Salvando partidas:', partidas);
    
    // Garantir que cada partida tenha apenas seus próprios eventos
    const partidasLimpas = partidas.map(partida => ({
      ...partida,
      eventos: (partida.eventos || []).filter(evento => evento.partidaId === partida.id)
    }));

    console.log('EditPartidasTab - Partidas limpas para salvar:', partidasLimpas);

    const peladaAtualizada = {
      ...pelada,
      partidas: partidasLimpas
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
