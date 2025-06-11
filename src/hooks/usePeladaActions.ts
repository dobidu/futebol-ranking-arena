import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { peladaService } from '@/services/dataService';
import { TimeNaPelada, Partida, Jogador } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

interface UsePeladaActionsProps {
  selectedTemporada: string;
  dataPelada: string;
  jogadores: Jogador[];
  setJogadoresPresentes: (value: JogadorPresente[] | ((prev: JogadorPresente[]) => JogadorPresente[])) => void;
  setPeladaAtual: (value: string) => void;
  setTimes: (value: TimeNaPelada[] | ((prev: TimeNaPelada[]) => TimeNaPelada[])) => void;
  setPartidas: (value: Partida[] | ((prev: Partida[]) => Partida[])) => void;
  setProximaLetra: (value: string) => void;
  peladaAtual: string;
  proximaLetra: string;
  jogadoresPresentes: JogadorPresente[];
  times: TimeNaPelada[];
  partidaAtual: Partida | null;
  setPartidaAtual: (value: Partida | null) => void;
  setPlacarA: (value: number) => void;
  setPlacarB: (value: number) => void;
  setEventos: (value: EventoPartida[] | ((prev: EventoPartida[]) => EventoPartida[])) => void;
  placarA: number;
  placarB: number;
  partidas: Partida[];
  eventos: EventoPartida[];
  resetStates: () => void;
  onTabChange?: (tab: string) => void;
}

export const usePeladaActions = ({
  selectedTemporada,
  dataPelada,
  jogadores,
  setJogadoresPresentes,
  setPeladaAtual,
  setTimes,
  setPartidas,
  setProximaLetra,
  peladaAtual,
  proximaLetra,
  jogadoresPresentes,
  times,
  partidaAtual,
  setPartidaAtual,
  setPlacarA,
  setPlacarB,
  setEventos,
  placarA,
  placarB,
  partidas,
  eventos,
  resetStates,
  onTabChange
}: UsePeladaActionsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const criarPelada = async () => {
    if (!selectedTemporada || !dataPelada) {
      toast({
        title: "Erro",
        description: "Selecione uma temporada e data",
        variant: "destructive"
      });
      return;
    }

    try {
      const novaPelada = {
        data: new Date(dataPelada),
        temporadaId: selectedTemporada,
        partidas: [],
        presencas: []
      };

      await peladaService.create(novaPelada);

      const jogadoresComPresenca = jogadores.filter(j => j.ativo).map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false
      }));

      setJogadoresPresentes(jogadoresComPresenca);
      
      const peladas = peladaService.getAll();
      const ultimaPelada = peladas[peladas.length - 1];
      setPeladaAtual(ultimaPelada.id);

      setTimes([]);
      setPartidas([]);
      setProximaLetra('A');
      setPartidaAtual(null);
      setEventos([]);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      
      toast({
        title: "Sucesso",
        description: "Pelada criada com sucesso!"
      });

      // Navegar automaticamente para a aba "times"
      if (onTabChange) {
        onTabChange('times');
      }
    } catch (error) {
      console.error('Erro ao criar pelada:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar pelada",
        variant: "destructive"
      });
    }
  };

  const togglePresenca = (jogadorId: string) => {
    setJogadoresPresentes(prev => 
      prev.map(j => 
        j.id === jogadorId ? { ...j, presente: !j.presente } : j
      )
    );
  };

  const criarTime = () => {
    if (!peladaAtual) {
      toast({
        title: "Erro",
        description: "Crie uma pelada primeiro",
        variant: "destructive"
      });
      return;
    }

    const novoTime: TimeNaPelada = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      identificadorLetra: proximaLetra,
      jogadores: []
    };

    setTimes(prev => [...prev, novoTime]);
    
    const proximaChr = String.fromCharCode(proximaLetra.charCodeAt(0) + 1);
    setProximaLetra(proximaChr);

    toast({
      title: "Sucesso",
      description: `Time ${proximaLetra} criado!`
    });
  };

  const adicionarJogadorAoTime = (jogadorId: string, timeId: string) => {
    const jogadorPresente = jogadoresPresentes.find(j => j.id === jogadorId && j.presente);
    if (!jogadorPresente) return;

    setTimes(prev => prev.map(time => {
      if (time.id === timeId && !time.jogadores.includes(jogadorId) && time.jogadores.length < 6) {
        return { ...time, jogadores: [...time.jogadores, jogadorId] };
      }
      return time;
    }));
  };

  const removerJogadorDoTime = (jogadorId: string, timeId: string) => {
    setTimes(prev => prev.map(time => {
      if (time.id === timeId) {
        return { ...time, jogadores: time.jogadores.filter(id => id !== jogadorId) };
      }
      return time;
    }));
  };

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

    // Se for um gol, atualizar automaticamente o placar
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

  const salvarPelada = async () => {
    if (!peladaAtual || partidas.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma partida antes de salvar",
        variant: "destructive"
      });
      return;
    }

    try {
      const pelada = peladaService.getById(peladaAtual);
      if (!pelada) {
        toast({
          title: "Erro",
          description: "Pelada não encontrada",
          variant: "destructive"
        });
        return;
      }

      const presencasAtualizadas = jogadoresPresentes
        .filter(j => j.presente)
        .map(j => ({
          id: crypto.randomUUID(),
          peladaId: peladaAtual,
          jogadorId: j.id,
          presente: true,
          atraso: 'nenhum' as const
        }));

      const partidasFormatadas = partidas.map(p => ({
        id: p.id,
        peladaId: p.peladaId,
        numeroPartida: partidas.indexOf(p) + 1,
        timeA: p.timeA?.jogadores || [],
        timeB: p.timeB?.jogadores || [],
        golsTimeA: p.placarA,
        golsTimeB: p.placarB,
        eventos: eventos
          .filter(e => eventos.some(ev => ev.id === e.id))
          .map(e => ({
            ...e,
            partidaId: p.id,
            minuto: 0
          }))
      }));

      const peladaAtualizada = {
        ...pelada,
        partidas: partidasFormatadas,
        presencas: presencasAtualizadas
      };

      peladaService.update(peladaAtual, peladaAtualizada);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-admin'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-reports'] });

      resetStates();

      toast({
        title: "Sucesso",
        description: "Pelada salva com sucesso!"
      });
    } catch (error) {
      console.error('Erro ao salvar pelada:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar pelada",
        variant: "destructive"
      });
    }
  };

  return {
    criarPelada,
    togglePresenca,
    criarTime,
    adicionarJogadorAoTime,
    removerJogadorDoTime,
    criarPartida,
    adicionarEvento,
    removerEvento,
    finalizarPartida,
    salvarPelada
  };
};
