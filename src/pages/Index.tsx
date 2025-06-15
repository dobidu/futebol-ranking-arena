
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService, jogadorService, calcularRanking } from '@/services/dataService';
import HomeHeader from '@/components/home/HomeHeader';
import StatsCards from '@/components/home/StatsCards';
import LastPeladaCard from '@/components/home/LastPeladaCard';
import HighlightsCards from '@/components/home/HighlightsCards';
import CurrentSeasonCard from '@/components/home/CurrentSeasonCard';
import QuickActionsCard from '@/components/home/QuickActionsCard';
import SystemInfoCard from '@/components/home/SystemInfoCard';

const Index: React.FC = () => {
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);
  
  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-home', temporadaAtiva?.id],
    queryFn: () => temporadaAtiva ? calcularRanking(temporadaAtiva.id) : [],
    enabled: !!temporadaAtiva,
  });

  // Calcular estatísticas dinâmicas
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const peladasTemporadaAtiva = temporadaAtiva ? peladas.filter(p => p.temporadaId === temporadaAtiva.id) : [];
  const ultimaPelada = peladas.length > 0 ? [...peladas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0] : null;
  const totalGols = ranking.reduce((total, jogador) => total + jogador.gols, 0);
  
  const liderRanking = ranking.length > 0 ? ranking[0] : null;
  const artilheiro = ranking.length > 0 ? [...ranking].sort((a, b) => b.gols - a.gols)[0] : null;
  const assistente = ranking.length > 0 ? [...ranking].sort((a, b) => b.assistencias - a.assistencias)[0] : null;

  // Calcular pelada com mais gols
  const peladaComMaisGols = peladasTemporadaAtiva.length > 0 ? 
    peladasTemporadaAtiva.reduce((maxPelada, pelada) => {
      const golsPelada = pelada.partidas?.reduce((total, partida) => {
        return total + (partida.placarA || 0) + (partida.placarB || 0);
      }, 0) || 0;
      
      const golsMaxPelada = maxPelada.partidas?.reduce((total, partida) => {
        return total + (partida.placarA || 0) + (partida.placarB || 0);
      }, 0) || 0;
      
      return golsPelada > golsMaxPelada ? pelada : maxPelada;
    }) : null;

  // Calcular pelada com mais cartões
  const peladaComMaisCartoes = peladasTemporadaAtiva.length > 0 ?
    peladasTemporadaAtiva.reduce((maxPelada, pelada) => {
      const cartoesPelada = pelada.partidas?.reduce((total, partida) => {
        return total + (partida.eventos?.filter(e => 
          e.tipo === 'cartao_amarelo' || e.tipo === 'cartao_azul' || e.tipo === 'cartao_vermelho'
        ).length || 0);
      }, 0) || 0;
      
      const cartoesMaxPelada = maxPelada.partidas?.reduce((total, partida) => {
        return total + (partida.eventos?.filter(e => 
          e.tipo === 'cartao_amarelo' || e.tipo === 'cartao_azul' || e.tipo === 'cartao_vermelho'
        ).length || 0);
      }, 0) || 0;
      
      return cartoesPelada > cartoesMaxPelada ? pelada : maxPelada;
    }) : null;

  // Preparar dados das estatísticas especiais
  const statsPeladaMaisGols = peladaComMaisGols ? {
    nome: peladaComMaisGols.nome || `Pelada ${new Date(peladaComMaisGols.data).toLocaleDateString('pt-BR')}`,
    gols: peladaComMaisGols.partidas?.reduce((total, partida) => total + (partida.placarA || 0) + (partida.placarB || 0), 0) || 0,
    data: new Date(peladaComMaisGols.data).toLocaleDateString('pt-BR')
  } : undefined;

  const statsPeladaMaisCartoes = peladaComMaisCartoes ? {
    nome: peladaComMaisCartoes.nome || `Pelada ${new Date(peladaComMaisCartoes.data).toLocaleDateString('pt-BR')}`,
    cartoes: peladaComMaisCartoes.partidas?.reduce((total, partida) => {
      return total + (partida.eventos?.filter(e => 
        e.tipo === 'cartao_amarelo' || e.tipo === 'cartao_azul' || e.tipo === 'cartao_vermelho'
      ).length || 0);
    }, 0) || 0,
    data: new Date(peladaComMaisCartoes.data).toLocaleDateString('pt-BR')
  } : undefined;

  console.log('Index - Temporada ativa:', temporadaAtiva);
  console.log('Index - Ranking:', ranking);
  console.log('Index - Peladas da temporada:', peladasTemporadaAtiva);

  return (
    <div className="space-y-8 animate-fade-in">
      <HomeHeader />

      <StatsCards
        jogadoresAtivos={jogadoresAtivos.length}
        peladasTemporadaAtiva={peladasTemporadaAtiva.length}
        totalGols={totalGols}
        totalTemporadas={temporadas.length}
        peladaComMaisGols={statsPeladaMaisGols}
        peladaComMaisCartoes={statsPeladaMaisCartoes}
      />

      {ultimaPelada && (
        <LastPeladaCard ultimaPelada={ultimaPelada} temporadas={temporadas} />
      )}

      <HighlightsCards
        liderRanking={liderRanking}
        artilheiro={artilheiro}
        assistente={assistente}
      />

      {temporadaAtiva && (
        <CurrentSeasonCard
          temporadaAtiva={temporadaAtiva}
          peladasTemporadaAtiva={peladasTemporadaAtiva.length}
        />
      )}

      <QuickActionsCard />

      <SystemInfoCard />
    </div>
  );
};

export default Index;
