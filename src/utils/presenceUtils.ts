
import { Pelada, Jogador } from '@/types';

export const detectarPresencaJogador = (pelada: Pelada, jogador: Jogador): boolean => {
  console.log('detectarPresencaJogador - Verificando presença para jogador:', jogador.nome);
  
  // Método 1: presencas
  if (pelada.presencas) {
    const presenca = pelada.presencas.find(p => p.jogadorId === jogador.id);
    if (presenca && presenca.presente) {
      console.log('detectarPresencaJogador - Encontrado via presencas');
      return true;
    }
  }
  
  // Método 2: jogadoresPresentes
  if (pelada.jogadoresPresentes) {
    const jogadorPresenteObj = pelada.jogadoresPresentes.find(jp => jp.id === jogador.id);
    if (jogadorPresenteObj && jogadorPresenteObj.presente) {
      console.log('detectarPresencaJogador - Encontrado via jogadoresPresentes');
      return true;
    }
  }
  
  // Método 3: verificar se jogador está em algum time
  if (pelada.times) {
    const estaEmTime = pelada.times.some(time => time.jogadores.includes(jogador.id));
    if (estaEmTime) {
      console.log('detectarPresencaJogador - Encontrado via times');
      return true;
    }
  }

  return false;
};

export const calcularPenalidadeAtraso = (pelada: Pelada, jogador: Jogador, temporada: any): number => {
  if (pelada.presencas) {
    const presenca = pelada.presencas.find(p => p.jogadorId === jogador.id);
    if (presenca && presenca.presente) {
      if (presenca.atraso === 'tipo1') {
        return temporada.penalidadeAtraso1;
      } else if (presenca.atraso === 'tipo2') {
        return temporada.penalidadeAtraso2;
      }
    }
  }
  return 0;
};
