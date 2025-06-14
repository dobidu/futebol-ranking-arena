
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

      console.log('usePeladaSave - Salvando pelada:', pelada);
      console.log('usePeladaSave - Data original da pelada:', pelada.data);
      console.log('usePeladaSave - Partidas:', partidas);
      console.log('usePeladaSave - Eventos:', eventos);

      const presencasAtualizadas = jogadoresPresentes
        .filter(j => j.presente)
        .map(j => ({
          id: crypto.randomUUID(),
          peladaId: peladaAtual,
          jogadorId: j.id,
          presente: true,
          atraso: j.atraso || 'nenhum' as const
        }));

      const partidasFormatadas = partidas.map((p, index) => {
        const eventosPartida = eventos
          .filter(e => {
            // Associar eventos por índice da partida ou por timeA/timeB
            const isEventoPartida = p.timeA?.jogadores?.includes(e.jogadorId) || 
                                   p.timeB?.jogadores?.includes(e.jogadorId);
            console.log('usePeladaSave - Verificando evento para partida:', { 
              partidaIndex: index, 
              eventoId: e.id, 
              jogadorId: e.jogadorId, 
              isEventoPartida 
            });
            return isEventoPartida;
          })
          .map(e => ({
            ...e,
            partidaId: p.id,
            minuto: 0
          }));

        console.log('usePeladaSave - Eventos da partida', index + 1, ':', eventosPartida);

        return {
          id: p.id,
          peladaId: p.peladaId,
          numeroPartida: index + 1,
          timeA: p.timeA?.jogadores || [],
          timeB: p.timeB?.jogadores || [],
          golsTimeA: p.placarA,
          golsTimeB: p.placarB,
          placarA: p.placarA,
          placarB: p.placarB,
          eventos: eventosPartida
        };
      });

      // Corrigir o problema de data - preservar a data selecionada sem conversão de timezone
      let dataCorrigida: Date;
      if (pelada.data instanceof Date) {
        const dataString = pelada.data.toISOString().split('T')[0];
        dataCorrigida = new Date(dataString + 'T12:00:00.000Z');
      } else {
        const dataString = String(pelada.data).split('T')[0];
        dataCorrigida = new Date(dataString + 'T12:00:00.000Z');
      }
      
      console.log('usePeladaSave - Data corrigida:', dataCorrigida);

      const peladaAtualizada = {
        ...pelada,
        data: dataCorrigida,
        partidas: partidasFormatadas,
        presencas: presencasAtualizadas,
        jogadoresPresentes: jogadoresPresentes.filter(j => j.presente)
      };

      console.log('usePeladaSave - Pelada atualizada final:', peladaAtualizada);

      peladaService.update(peladaAtual, peladaAtualizada);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-admin'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-reports'] });

      resetStates();

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
