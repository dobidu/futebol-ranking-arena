
import { useToast } from '@/hooks/use-toast';
import { peladaService } from '@/services/dataService';
import { Jogador } from '@/types';

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
      const novaPelada = {
        id: crypto.randomUUID(),
        data: new Date(dataPelada),
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

      // Preparar lista de jogadores
      const jogadoresComPresenca: JogadorPresente[] = jogadores.map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false
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
          ? { ...jogador, presente: !jogador.presente }
          : jogador
      )
    );
  };

  return {
    criarPelada,
    togglePresenca
  };
};
