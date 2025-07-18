
import { useToast } from '@/hooks/use-toast';
import { peladaService } from '@/services/dataService';
import { Jogador, JogadorPresente } from '@/types';

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

interface UsePeladaCreationProps {
  selectedTemporada: string;
  dataPelada: string;
  jogadores: Jogador[];
  setJogadoresPresentes: (value: JogadorPresente[] | ((prev: JogadorPresente[]) => JogadorPresente[])) => void;
  setPeladaAtual: (value: string) => void;
  setTimes: (value: any[] | ((prev: any[]) => any[])) => void;
  setPartidas: (value: any[] | ((prev: any[]) => any[])) => void;
  setProximaLetra: (value: string) => void;
  setPartidaAtual: (value: any) => void;
  setEventos: (value: EventoPartida[] | ((prev: EventoPartida[]) => EventoPartida[])) => void;
  onTabChange?: (tab: string) => void;
}

export const usePeladaCreation = ({
  selectedTemporada,
  dataPelada,
  jogadores,
  setJogadoresPresentes,
  setPeladaAtual,
  setTimes,
  setPartidas,
  setProximaLetra,
  setPartidaAtual,
  setEventos,
  onTabChange
}: UsePeladaCreationProps) => {
  const { toast } = useToast();

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
      // Corrigir o problema de data - criar data corretamente sem problemas de timezone
      const dataCorrigida = new Date(dataPelada + 'T12:00:00.000Z');
      console.log('usePeladaCreation - Data selecionada:', dataPelada);
      console.log('usePeladaCreation - Data corrigida para salvar:', dataCorrigida);

      const novaPelada = {
        id: crypto.randomUUID(),
        data: dataCorrigida,
        temporadaId: selectedTemporada,
        partidas: [],
        presencas: [],
        times: [],
        jogadoresPresentes: []
      };

      peladaService.create(novaPelada);
      setPeladaAtual(novaPelada.id);

      // Reset states
      setTimes([]);
      setPartidas([]);
      setProximaLetra('A');
      setPartidaAtual(null);
      setEventos([]);

      // Preparar lista de jogadores com campo de atraso
      const jogadoresComPresenca: JogadorPresente[] = jogadores.map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false,
        atraso: 'nenhum'
      }));

      setJogadoresPresentes(jogadoresComPresenca);

      toast({
        title: "Sucesso",
        description: "Pelada criada com sucesso!"
      });

      // Remove automatic tab navigation
      // onTabChange?.('times'); // This line was removed
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
      prev.map(jogador => 
        jogador.id === jogadorId 
          ? { ...jogador, presente: !jogador.presente, atraso: !jogador.presente ? 'nenhum' : jogador.atraso }
          : jogador
      )
    );
  };

  const setAtrasoJogador = (jogadorId: string, atraso: 'nenhum' | 'tipo1' | 'tipo2') => {
    setJogadoresPresentes(prev => 
      prev.map(jogador => 
        jogador.id === jogadorId 
          ? { ...jogador, atraso }
          : jogador
      )
    );
  };

  return {
    criarPelada,
    togglePresenca,
    setAtrasoJogador
  };
};
