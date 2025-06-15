
import { RankingJogador } from '@/types';
import { peladaService, temporadaService, jogadorService } from './dataService';
import { detectarPresencaJogador, calcularPenalidadeAtraso } from '@/utils/presenceUtils';
import { calcularPontosPartida } from '@/utils/matchUtils';
import { processarEventosJogador } from '@/utils/eventUtils';
import { ordenarRanking, criarItemRanking } from '@/utils/rankingUtils';

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
    let atrasosTipo1 = 0;
    let atrasosTipo2 = 0;
    let eventStatsTotal = {
      gols: 0,
      assistencias: 0,
      cartoesAmarelos: 0,
      cartoesAzuis: 0,
      cartoesVermelhos: 0,
      penalizacoes: 0
    };

    peladasFiltradas.forEach(pelada => {
      console.log('calcularRanking - Processando pelada:', pelada.id);
      
      // Verificar presença
      const jogadorPresente = detectarPresencaJogador(pelada, jogador);
      
      if (jogadorPresente) {
        presencas++;
        pontuacaoTotal += 1; // Ponto por presença
        
        // Calcular penalidade de atraso e contar atrasos
        const penalidadeAtraso = calcularPenalidadeAtraso(pelada, jogador, temporadaSelecionada);
        pontuacaoTotal += penalidadeAtraso;

        // Contar tipos de atraso
        if (pelada.presencas) {
          const presenca = pelada.presencas.find(p => p.jogadorId === jogador.id);
          if (presenca && presenca.presente) {
            if (presenca.atraso === 'tipo1') {
              atrasosTipo1++;
            } else if (presenca.atraso === 'tipo2') {
              atrasosTipo2++;
            }
          }
        }

        // Processar partidas se jogador esteve presente
        if (pelada.partidas && pelada.partidas.length > 0) {
          pelada.partidas.forEach(partida => {
            // Calcular pontos da partida
            const { pontos, vitoria } = calcularPontosPartida(partida, jogador, temporadaSelecionada);
            pontuacaoTotal += pontos;
            if (vitoria) vitorias++;

            // Processar eventos da partida
            if (partida.eventos && partida.eventos.length > 0) {
              const eventStats = processarEventosJogador(partida.eventos, jogador, temporadaSelecionada);
              
              eventStatsTotal.gols += eventStats.gols;
              eventStatsTotal.assistencias += eventStats.assistencias;
              eventStatsTotal.cartoesAmarelos += eventStats.cartoesAmarelos;
              eventStatsTotal.cartoesAzuis += eventStats.cartoesAzuis;
              eventStatsTotal.cartoesVermelhos += eventStats.cartoesVermelhos;
              pontuacaoTotal += eventStats.penalizacoes;
            }
          });
        }
      }
    });

    if (presencas > 0) {
      const itemRanking = criarItemRanking(
        jogador,
        pontuacaoTotal,
        vitorias,
        presencas,
        eventStatsTotal,
        atrasosTipo1,
        atrasosTipo2
      );
      ranking.push(itemRanking);
    }
  });

  const rankingFinal = ordenarRanking(ranking);

  console.log('calcularRanking - Ranking final:', rankingFinal.length, 'jogadores');
  console.log('calcularRanking - Dados do ranking:', rankingFinal);
  return rankingFinal;
};
