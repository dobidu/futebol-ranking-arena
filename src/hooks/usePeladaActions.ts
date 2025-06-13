
import { usePeladaCreation } from './usePeladaCreation';
import { useTeamManagement } from './useTeamManagement';
import { useMatchManagement } from './useMatchManagement';
import { usePeladaSave } from './usePeladaSave';
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

export const usePeladaActions = (props: UsePeladaActionsProps) => {
  const peladaCreation = usePeladaCreation({
    selectedTemporada: props.selectedTemporada,
    dataPelada: props.dataPelada,
    jogadores: props.jogadores,
    setJogadoresPresentes: props.setJogadoresPresentes,
    setPeladaAtual: props.setPeladaAtual,
    setTimes: props.setTimes,
    setPartidas: props.setPartidas,
    setProximaLetra: props.setProximaLetra,
    setPartidaAtual: props.setPartidaAtual,
    setEventos: props.setEventos,
    onTabChange: props.onTabChange
  });

  const teamManagement = useTeamManagement({
    peladaAtual: props.peladaAtual,
    proximaLetra: props.proximaLetra,
    jogadoresPresentes: props.jogadoresPresentes,
    setTimes: props.setTimes,
    setProximaLetra: props.setProximaLetra
  });

  const matchManagement = useMatchManagement({
    peladaAtual: props.peladaAtual,
    times: props.times,
    partidaAtual: props.partidaAtual,
    placarA: props.placarA,
    placarB: props.placarB,
    partidas: props.partidas,
    setPartidaAtual: props.setPartidaAtual,
    setPlacarA: props.setPlacarA,
    setPlacarB: props.setPlacarB,
    setEventos: props.setEventos,
    setPartidas: props.setPartidas
  });

  const peladaSave = usePeladaSave({
    peladaAtual: props.peladaAtual,
    jogadoresPresentes: props.jogadoresPresentes,
    partidas: props.partidas,
    eventos: props.eventos,
    resetStates: props.resetStates,
    onTabChange: props.onTabChange
  });

  return {
    ...peladaCreation,
    ...teamManagement,
    ...matchManagement,
    ...peladaSave
  };
};
