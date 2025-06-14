
import { PartidaPelada, Jogador } from '@/types';

export const calcularPontosPartida = (
  partida: PartidaPelada, 
  jogador: Jogador, 
  temporada: any
): { pontos: number; vitoria: boolean } => {
  const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
  const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
  
  if (!jogadorNoTimeA && !jogadorNoTimeB) {
    return { pontos: 0, vitoria: false };
  }

  // Usar placarA e placarB para determinar resultado
  const golsA = partida.placarA || partida.golsTimeA || 0;
  const golsB = partida.placarB || partida.golsTimeB || 0;
  
  let pontos = 0;
  let vitoria = false;

  if (golsA > golsB) {
    if (jogadorNoTimeA) {
      pontos = temporada.pontosVitoria;
      vitoria = true;
    } else {
      pontos = temporada.pontosDerrota;
    }
  } else if (golsB > golsA) {
    if (jogadorNoTimeB) {
      pontos = temporada.pontosVitoria;
      vitoria = true;
    } else {
      pontos = temporada.pontosDerrota;
    }
  } else {
    pontos = temporada.pontosEmpate;
  }

  return { pontos, vitoria };
};
