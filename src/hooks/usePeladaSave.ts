
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { peladaService } from '@/services/dataService';
import { TimeNaPelada, Partida } from '@/types';

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

interface UsePeladaSaveProps {
  peladaAtual: string;
  jogadoresPresentes: JogadorPresente[];
  partidas: Partida[];
  eventos: EventoPartida[];
  resetStates: () => void;
  onTabChange?: (tab: string) => void;
}

export const usePeladaSave = ({
  peladaAtual,
  jogadoresPresentes,
  partidas,
  eventos,
  resetStates,
  onTabChange
}: UsePeladaSaveProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
        placarA: p.placarA,
        placarB: p.placarB,
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
        presencas: presencasAtualizadas,
        jogadoresPresentes: jogadoresPresentes.filter(j => j.presente)
      };

      peladaService.update(peladaAtual, peladaAtualizada);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-admin'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-reports'] });

      resetStates();

      // Navegar automaticamente para a aba "nova-pelada"
      if (onTabChange) {
        onTabChange('nova-pelada');
      }

      toast({
        title: "Sucesso",
        description: "Pelada salva com sucesso! Você pode criar uma nova pelada."
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
    salvarPelada
  };
};
