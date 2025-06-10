
import { useState } from 'react';
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

export const usePeladaState = () => {
  // Estados para criação de pelada
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [dataPelada, setDataPelada] = useState('');
  const [peladaAtual, setPeladaAtual] = useState<string>('');
  const [jogadoresPresentes, setJogadoresPresentes] = useState<JogadorPresente[]>([]);
  
  // Estados para times
  const [times, setTimes] = useState<TimeNaPelada[]>([]);
  const [proximaLetra, setProximaLetra] = useState('A');
  
  // Estados para partidas
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [partidaAtual, setPartidaAtual] = useState<Partida | null>(null);
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [eventos, setEventos] = useState<EventoPartida[]>([]);

  const resetStates = () => {
    setTimes([]);
    setPartidas([]);
    setJogadoresPresentes([]);
    setPeladaAtual('');
    setProximaLetra('A');
    setPartidaAtual(null);
    setEventos([]);
    setSelectedTemporada('');
    setDataPelada('');
  };

  return {
    // Pelada states
    selectedTemporada,
    setSelectedTemporada,
    dataPelada,
    setDataPelada,
    peladaAtual,
    setPeladaAtual,
    jogadoresPresentes,
    setJogadoresPresentes,
    
    // Team states
    times,
    setTimes,
    proximaLetra,
    setProximaLetra,
    
    // Match states
    partidas,
    setPartidas,
    partidaAtual,
    setPartidaAtual,
    placarA,
    setPlacarA,
    placarB,
    setPlacarB,
    eventos,
    setEventos,
    
    // Reset function
    resetStates
  };
};
