
import { useToast } from '@/hooks/use-toast';
import { TimeNaPelada, Partida } from '@/types';

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

interface UseMatchManagementProps {
  peladaAtual: string;
  times: TimeNaPelada[];
  partidaAtual: Partida | null;
  placarA: number;
  placarB: number;
  partidas: Partida[];
  setPartidaAtual: (value: Partida | null) => void;
  setPlacarA: (value: number) => void;
  setPlacarB: (value: number) => void;
  setEventos: (value: EventoPartida[] | ((prev: EventoPartida[]) => EventoPartida[])) => void;
  setPartidas: (value: Partida[] | ((prev: Partida[]) => Partida[])) => void;
}

export const useMatchManagement = ({
  peladaAtual,
  times,
  partidaAtual,
  placarA,
  placarB,
  partidas,
  setPartidaAtual,
  setPlacarA,
  setPlacarB,
  setEventos,
  setPartidas
}: UseMatchManagementProps) => {
  const { toast } = useToast();

  const criarPartida = (timeAId: string, timeBId: string) => {
    const timeA = times.find(t => t.id === timeAId);
    const timeB = times.find(t => t.id === timeBId);

    console.log('Criando partida:', { timeAId, timeBId, timeA, timeB });

    if (!timeA || !timeB) {
      toast({
        title: "Erro",
        description: "Selecione dois times válidos",
        variant: "destructive"
      });
      return;
    }

    if (timeA.jogadores.length < 5 || timeB.jogadores.length < 5) {
      toast({
        title: "Erro",
        description: "Cada time deve ter pelo menos 5 jogadores",
        variant: "destructive"
      });
      return;
    }

    const novaPartida: Partida = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      timeAId,
      timeBId,
      placarA: 0,
      placarB: 0,
      timeA,
      timeB
    };

    console.log('Nova partida criada:', novaPartida);

    setPartidaAtual(novaPartida);
    setPlacarA(0);
    setPlacarB(0);
    setEventos([]);

    toast({
      title: "Sucesso",
      description: `Partida ${timeA.identificadorLetra} x ${timeB.identificadorLetra} iniciada!`
    });
  };

  const adicionarEvento = (tipo: string, jogadorId: string, assistidoPor?: string) => {
    if (!tipo || !jogadorId || !partidaAtual) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de evento e o jogador",
        variant: "destructive"
      });
      return;
    }

    const novoEvento: EventoPartida = {
      id: Date.now().toString(),
      tipo: tipo as any,
      jogadorId: jogadorId,
      assistidoPor: assistidoPor && assistidoPor !== 'nenhuma' ? assistidoPor : undefined
    };

    setEventos(prev => [...prev, novoEvento]);

    if (tipo === 'gol' && partidaAtual) {
      const timeDoJogador = partidaAtual.timeA?.jogadores.includes(jogadorId) ? 'A' : 'B';
      
      if (timeDoJogador === 'A') {
        setPlacarA(placarA + 1);
      } else {
        setPlacarB(placarB + 1);
      }
    }

    toast({
      title: "Sucesso",
      description: "Evento adicionado!"
    });
  };

  const removerEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
  };

  const finalizarPartida = () => {
    if (!partidaAtual) {
      toast({
        title: "Erro",
        description: "Nenhuma partida ativa",
        variant: "destructive"
      });
      return;
    }

    const partidaFinalizada: Partida = {
      ...partidaAtual,
      placarA,
      placarB
    };

    setPartidas(prev => [...prev, partidaFinalizada]);
    setPartidaAtual(null);
    setPlacarA(0);
    setPlacarB(0);

    toast({
      title: "Sucesso",
      description: "Partida finalizada!"
    });
  };

  return {
    criarPartida,
    adicionarEvento,
    removerEvento,
    finalizarPartida
  };
};
