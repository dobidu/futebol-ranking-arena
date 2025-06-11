
import { useToast } from '@/hooks/use-toast';
import { TimeNaPelada } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface UseTeamManagementProps {
  peladaAtual: string;
  proximaLetra: string;
  jogadoresPresentes: JogadorPresente[];
  setTimes: (value: TimeNaPelada[] | ((prev: TimeNaPelada[]) => TimeNaPelada[])) => void;
  setProximaLetra: (value: string) => void;
}

export const useTeamManagement = ({
  peladaAtual,
  proximaLetra,
  jogadoresPresentes,
  setTimes,
  setProximaLetra
}: UseTeamManagementProps) => {
  const { toast } = useToast();

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

  return {
    criarTime,
    adicionarJogadorAoTime,
    removerJogadorDoTime
  };
};
