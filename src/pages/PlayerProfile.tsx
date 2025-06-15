import React from 'react';
import { useParams } from 'react-router-dom';
import { User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jogadorService, peladaService, temporadaService, calcularRanking } from '@/services/dataService';
import PlayerHeader from '@/components/player/PlayerHeader';
import PlayerStatsCards from '@/components/player/PlayerStatsCards';
import PlayerSeasonHistory from '@/components/player/PlayerSeasonHistory';
import PlayerAdvancedStats from '@/components/player/PlayerAdvancedStats';
import PlayerRecentGames from '@/components/player/PlayerRecentGames';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: jogador } = useQuery({
    queryKey: ['jogador', id],
    queryFn: () => jogadorService.getById(id!),
    enabled: !!id,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: rankingGeral = [] } = useQuery({
    queryKey: ['ranking-geral'],
    queryFn: () => calcularRanking(),
  });

  if (!jogador) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Jogador não encontrado</p>
        </div>
      </div>
    );
  }

  const estatisticasJogador = rankingGeral.find(r => r.jogador.id === jogador.id);
  
  // Calcular histórico por temporada
  const historicoTemporadas = temporadas.map(temporada => {
    const rankingTemporada = calcularRanking(temporada.id);
    const posicaoJogador = rankingTemporada.find(r => r.jogador.id === jogador.id);
    
    return {
      temporada: temporada.nome,
      temporadaId: temporada.id,
      posicao: posicaoJogador?.posicao || 0,
      pontos: posicaoJogador?.pontuacaoTotal || 0,
      presencas: posicaoJogador?.presencas || 0,
      gols: posicaoJogador?.gols || 0,
      assistencias: posicaoJogador?.assistencias || 0,
      vitorias: posicaoJogador?.vitorias || 0
    };
  }).filter(h => h.presencas > 0);

  // Calcular peladas do jogador
  const peladasDoJogador = peladas
    .filter(pelada => {
      return pelada.presencas?.some(p => p.jogadorId === jogador.id && p.presente) ||
             pelada.jogadoresPresentes?.some(jp => jp.id === jogador.id && jp.presente);
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const ultimasPeladas = peladasDoJogador.slice(0, 5).map(pelada => {
    const temporada = temporadas.find(t => t.id === pelada.temporadaId);
    let gols = 0;
    let assistencias = 0;
    let pontos = 1; // Ponto base por presença
    let vitorias = 0;
    
    pelada.partidas?.forEach(partida => {
      const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
      const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
      
      if (jogadorNoTimeA || jogadorNoTimeB) {
        // Calcular pontos da partida
        if (partida.golsTimeA > partida.golsTimeB) {
          if (jogadorNoTimeA) {
            pontos += temporada?.pontosVitoria || 3;
            vitorias++;
          } else {
            pontos += temporada?.pontosDerrota || 0;
          }
        } else if (partida.golsTimeB > partida.golsTimeA) {
          if (jogadorNoTimeB) {
            pontos += temporada?.pontosVitoria || 3;
            vitorias++;
          } else {
            pontos += temporada?.pontosDerrota || 0;
          }
        } else {
          pontos += temporada?.pontosEmpate || 1;
        }
      }
      
      // Contar gols e assistências
      partida.eventos?.forEach(evento => {
        if (evento.jogadorId === jogador.id && evento.tipo === 'gol') {
          gols++;
        }
        if (evento.assistidoPor === jogador.id) {
          assistencias++;
        }
      });
    });
    
    // Calcular penalidades de atraso
    const presenca = pelada.presencas?.find(p => p.jogadorId === jogador.id);
    if (presenca) {
      if (presenca.atraso === 'tipo1') {
        pontos += temporada?.penalidadeAtraso1 || -1;
      } else if (presenca.atraso === 'tipo2') {
        pontos += temporada?.penalidadeAtraso2 || -2;
      }
    }
    
    return {
      id: pelada.id,
      data: new Date(pelada.data),
      temporada: temporada?.nome || 'N/A',
      pontos: Number(pontos.toFixed(1)),
      status: 'Presente',
      gols,
      assistencias,
      vitorias: vitorias > 0
    };
  });

  // Estatísticas gerais melhoradas com correção na taxa de vitória
  const estatisticasGerais = {
    totalPontos: estatisticasJogador?.pontuacaoTotal || 0,
    totalPresencas: estatisticasJogador?.presencas || 0,
    totalGols: estatisticasJogador?.gols || 0,
    totalAssistencias: estatisticasJogador?.assistencias || 0,
    totalVitorias: estatisticasJogador?.vitorias || 0,
    posicaoAtual: estatisticasJogador?.posicao || 0,
    mediaPresenca: peladas.length > 0 ? Math.round((peladasDoJogador.length / peladas.length) * 100) : 0,
    temporadasParticipadas: historicoTemporadas.length,
    mediaPontosPorPelada: estatisticasJogador?.presencas > 0 ? (estatisticasJogador.pontuacaoTotal / estatisticasJogador.presencas) : 0,
    mediaGolsPorPelada: estatisticasJogador?.presencas > 0 ? (estatisticasJogador.gols / estatisticasJogador.presencas) : 0,
    // Corrigindo o cálculo da taxa de vitória - deve ser baseado nas partidas jogadas, não nas presenças
    percentualVitorias: (() => {
      let totalPartidas = 0;
      let vitoriasCount = 0;
      
      peladasDoJogador.forEach(pelada => {
        const temporada = temporadas.find(t => t.id === pelada.temporadaId);
        
        pelada.partidas?.forEach(partida => {
          const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
          const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
          
          if (jogadorNoTimeA || jogadorNoTimeB) {
            totalPartidas++;
            
            if (partida.golsTimeA > partida.golsTimeB && jogadorNoTimeA) {
              vitoriasCount++;
            } else if (partida.golsTimeB > partida.golsTimeA && jogadorNoTimeB) {
              vitoriasCount++;
            }
          }
        });
      });
      
      return totalPartidas > 0 ? (vitoriasCount / totalPartidas * 100) : 0;
    })()
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PlayerHeader jogador={jogador} posicaoAtual={estatisticasGerais.posicaoAtual} />
      
      <PlayerStatsCards 
        totalPontos={estatisticasGerais.totalPontos}
        totalGols={estatisticasGerais.totalGols}
        totalAssistencias={estatisticasGerais.totalAssistencias}
        totalPresencas={estatisticasGerais.totalPresencas}
        percentualVitorias={estatisticasGerais.percentualVitorias}
        totalVitorias={estatisticasJogador?.vitorias || 0}
        mediaPontosPorPelada={estatisticasGerais.mediaPontosPorPelada}
        mediaGolsPorPelada={estatisticasGerais.mediaGolsPorPelada}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlayerSeasonHistory historicoTemporadas={historicoTemporadas} />
        <PlayerAdvancedStats 
          totalPresencas={estatisticasGerais.totalPresencas}
          totalPeladas={peladas.length}
          mediaPresenca={estatisticasGerais.mediaPresenca}
          temporadasParticipadas={estatisticasGerais.temporadasParticipadas}
          posicaoAtual={estatisticasGerais.posicaoAtual}
        />
      </div>

      <PlayerRecentGames ultimasPeladas={ultimasPeladas} />
    </div>
  );
};

export default PlayerProfile;
