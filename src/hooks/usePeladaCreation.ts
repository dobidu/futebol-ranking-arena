
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { peladaService } from '@/services/dataService';
import { Jogador } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
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
  setEventos: (value: any[] | ((prev: any[]) => any[])) => void;
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

  return {
    criarPelada,
    togglePresenca
  };
};
