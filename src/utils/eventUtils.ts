
import { EventoPelada, Jogador } from '@/types';

export interface EventStats {
  gols: number;
  assistencias: number;
  cartoesAmarelos: number;
  cartoesAzuis: number;
  cartoesVermelhos: number;
  penalizacoes: number;
}

export const processarEventosJogador = (
  eventos: EventoPelada[], 
  jogador: Jogador, 
  temporada: any
): EventStats => {
  const stats: EventStats = {
    gols: 0,
    assistencias: 0,
    cartoesAmarelos: 0,
    cartoesAzuis: 0,
    cartoesVermelhos: 0,
    penalizacoes: 0
  };

  eventos.forEach(evento => {
    if (evento.jogadorId === jogador.id) {
      switch (evento.tipo) {
        case 'gol':
          stats.gols++;
          break;
        case 'cartao_amarelo':
          stats.cartoesAmarelos++;
          stats.penalizacoes += temporada.penalidadeCartaoAmarelo;
          break;
        case 'cartao_azul':
          stats.cartoesAzuis++;
          stats.penalizacoes += temporada.penalidadeCartaoAzul;
          break;
        case 'cartao_vermelho':
          stats.cartoesVermelhos++;
          stats.penalizacoes += temporada.penalidadeCartaoVermelho;
          break;
      }
    }
    
    if (evento.assistidoPor === jogador.id) {
      stats.assistencias++;
    }
  });

  return stats;
};
