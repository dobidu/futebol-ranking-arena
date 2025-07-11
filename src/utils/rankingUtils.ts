
import { RankingJogador } from '@/types';

export const ordenarRanking = (ranking: RankingJogador[]): RankingJogador[] => {
  const rankingOrdenado = [...ranking].sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  
  rankingOrdenado.forEach((item, index) => {
    item.posicao = index + 1;
  });

  return rankingOrdenado;
};

export const criarItemRanking = (
  jogador: any,
  pontuacaoTotal: number,
  vitorias: number,
  presencas: number,
  eventStats: any,
  atrasosTipo1: number = 0,
  atrasosTipo2: number = 0
): RankingJogador => {
  return {
    jogador,
    pontuacaoTotal: Number(pontuacaoTotal.toFixed(1)),
    vitorias,
    presencas,
    gols: eventStats.gols,
    assistencias: eventStats.assistencias,
    cartoesAmarelos: eventStats.cartoesAmarelos,
    cartoesAzuis: eventStats.cartoesAzuis,
    cartoesVermelhos: eventStats.cartoesVermelhos,
    atrasosTipo1,
    atrasosTipo2,
    mediaPresenca: presencas > 0 ? pontuacaoTotal / presencas : 0,
    posicao: 0
  };
};
