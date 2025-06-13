
import { RankingJogador } from '@/types';
import { peladaService, temporadaService, jogadorService } from './dataService';

export const calcularRanking = (temporadaId?: string): RankingJogador[] => {
  const peladas = peladaService.getAll();
  const temporadas = temporadaService.getAll();
  const jogadores = jogadorService.getAll();
  
  console.log('calcularRanking - Peladas carregadas:', peladas.length);
  console.log('calcularRanking - Temporada ID:', temporadaId);
  
  const peladasFiltradas = temporadaId 
    ? peladas.filter(p => p.temporadaId === temporadaId)
    : peladas;
  
  console.log('calcularRanking - Peladas filtradas:', peladasFiltradas.length);
  
  const temporadaSelecionada = temporadaId 
    ? temporadas.find(t => t.id === temporadaId)
    : temporadas.find(t => t.ativa) || temporadas[0];
  
  if (!temporadaSelecionada) {
    console.log('calcularRanking - Nenhuma temporada encontrada');
    return [];
  }

  console.log('calcularRanking - Temporada selecionada:', temporadaSelecionada.nome);

  const ranking: RankingJogador[] = [];

  jogadores.forEach(jogador => {
    let pontuacaoTotal = 0;
    let presencas = 0;
    let vitorias = 0;
    let gols = 0;
    let assistencias = 0;
    let cartoesAmarelos = 0;
    let cartoesAzuis = 0;
    let cartoesVermelhos = 0;

    peladasFiltradas.forEach(pelada => {
      console.log('calcularRanking - Processando pelada:', pelada.id);
      
      // Verificar presença de múltiplas formas
      let jogadorPresente = false;
      
      // Método 1: presencas
      if (pelada.presencas) {
        const presenca = pelada.presencas.find(p => p.jogadorId === jogador.id);
        if (presenca && presenca.presente) {
          jogadorPresente = true;
          presencas++;
          pontuacaoTotal += 1;
          
          if (presenca.atraso === 'tipo1') {
            pontuacaoTotal += temporadaSelecionada.penalidadeAtraso1;
          } else if (presenca.atraso === 'tipo2') {
            pontuacaoTotal += temporadaSelecionada.penalidadeAtraso2;
          }
        }
      }
      
      // Método 2: jogadoresPresentes
      if (!jogadorPresente && pelada.jogadoresPresentes) {
        const jogadorPresenteObj = pelada.jogadoresPresentes.find(jp => jp.id === jogador.id);
        if (jogadorPresenteObj && jogadorPresenteObj.presente) {
          jogadorPresente = true;
          presencas++;
          pontuacaoTotal += 1;
        }
      }
      
      // Método 3: verificar se jogador está em algum time
      if (!jogadorPresente && pelada.times) {
        const estaEmTime = pelada.times.some(time => time.jogadores.includes(jogador.id));
        if (estaEmTime) {
          jogadorPresente = true;
          presencas++;
          pontuacaoTotal += 1;
        }
      }

      // Se jogador esteve presente, processar partidas
      if (jogadorPresente && pelada.partidas && pelada.partidas.length > 0) {
        pelada.partidas.forEach(partida => {
          const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
          const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
          
          if (jogadorNoTimeA || jogadorNoTimeB) {
            let pontos = 0;
            
            // Usar placarA e placarB para determinar resultado
            const golsA = partida.placarA || partida.golsTimeA || 0;
            const golsB = partida.placarB || partida.golsTimeB || 0;
            
            if (golsA > golsB) {
              if (jogadorNoTimeA) {
                pontos = temporadaSelecionada.pontosVitoria;
                vitorias++;
              } else {
                pontos = temporadaSelecionada.pontosDerrota;
              }
            } else if (golsB > golsA) {
              if (jogadorNoTimeB) {
                pontos = temporadaSelecionada.pontosVitoria;
                vitorias++;
              } else {
                pontos = temporadaSelecionada.pontosDerrota;
              }
            } else {
              pontos = temporadaSelecionada.pontosEmpate;
            }
            
            pontuacaoTotal += pontos;
          }

          // Processar eventos da partida
          if (partida.eventos && partida.eventos.length > 0) {
            partida.eventos.forEach(evento => {
              if (evento.jogadorId === jogador.id) {
                switch (evento.tipo) {
                  case 'gol':
                    gols++;
                    break;
                  case 'cartao_amarelo':
                    cartoesAmarelos++;
                    pontuacaoTotal += temporadaSelecionada.penalidadeCartaoAmarelo;
                    break;
                  case 'cartao_azul':
                    cartoesAzuis++;
                    pontuacaoTotal += temporadaSelecionada.penalidadeCartaoAzul;
                    break;
                  case 'cartao_vermelho':
                    cartoesVermelhos++;
                    pontuacaoTotal += temporadaSelecionada.penalidadeCartaoVermelho;
                    break;
                }
              }
              
              if (evento.assistidoPor === jogador.id) {
                assistencias++;
              }
            });
          }
        });
      }
    });

    if (presencas > 0) {
      ranking.push({
        jogador,
        pontuacaoTotal: Number(pontuacaoTotal.toFixed(1)),
        vitorias,
        presencas,
        gols,
        assistencias,
        cartoesAmarelos,
        cartoesAzuis,
        cartoesVermelhos,
        mediaPresenca: presencas > 0 ? pontuacaoTotal / presencas : 0,
        posicao: 0
      });
    }
  });

  ranking.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  ranking.forEach((item, index) => {
    item.posicao = index + 1;
  });

  console.log('calcularRanking - Ranking final:', ranking.length, 'jogadores');
  console.log('calcularRanking - Dados do ranking:', ranking);
  return ranking;
};
