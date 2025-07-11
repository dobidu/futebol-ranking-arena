
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { peladaService } from '@/services/dataService';
import { TimeNaPelada, Partida, JogadorPresente } from '@/types';

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
      console.log('usePeladaSave - Partidas recebidas:', partidas);
      console.log('usePeladaSave - Eventos globais recebidos:', eventos);

      const presencasAtualizadas = jogadoresPresentes
        .filter(j => j.presente)
        .map(j => ({
          id: crypto.randomUUID(),
          peladaId: peladaAtual,
          jogadorId: j.id,
          presente: true,
          atraso: j.atraso || 'nenhum' as const
        }));

      // Mapear eventos globais para cada partida corretamente
      const partidasFormatadas = partidas.map((p, index) => {
        // Filtrar apenas eventos que pertencem aos jogadores desta partida específica
        const jogadoresDaPartida = [...(p.timeA?.jogadores || []), ...(p.timeB?.jogadores || [])];
        
        const eventosPartida = eventos
          .filter(e => jogadoresDaPartida.includes(e.jogadorId))
          .map((e, eventIndex) => {
            // Criar um ID único baseado na partida e no índice do evento
            const eventoUnico = {
              ...e,
              id: `${p.id}-evento-${eventIndex}`,
              partidaId: p.id,
              minuto: 0
            };
            
            console.log('usePeladaSave - Criando evento único para partida', p.id, ':', eventoUnico);
            return eventoUnico;
          });

        console.log('usePeladaSave - Eventos da partida', index + 1, ' (ID:', p.id, '):', eventosPartida);

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
        const dataOriginal = pelada.data as any;
        const dataString = dataOriginal.split ? dataOriginal.split('T')[0] : pelada.data;
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
      console.log('usePeladaSave - Partidas formatadas finais:', partidasFormatadas);

      peladaService.update(peladaAtual, peladaAtualizada);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['pelada', peladaAtual] });
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
