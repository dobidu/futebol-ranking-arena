
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService, calcularRanking } from '@/services/dataService';
import AdminHeader from '@/components/admin/dashboard/AdminHeader';
import StatisticsCards from '@/components/admin/dashboard/StatisticsCards';
import AdvancedStats from '@/components/admin/dashboard/AdvancedStats';
import RankingSection from '@/components/admin/dashboard/RankingSection';
import SeasonHighlights from '@/components/admin/dashboard/SeasonHighlights';
import RecentPeladas from '@/components/admin/dashboard/RecentPeladas';
import SystemStatus from '@/components/admin/dashboard/SystemStatus';

const AdminDashboard: React.FC = () => {
  const { data: temporadas = [], refetch: refetchTemporadas } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [], refetch: refetchJogadores } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const { data: peladas = [], refetch: refetchPeladas } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);

  const { data: ranking = [], refetch: refetchRanking } = useQuery({
    queryKey: ['ranking-admin', temporadaAtiva?.id],
    queryFn: () => temporadaAtiva ? calcularRanking(temporadaAtiva.id) : [],
    enabled: !!temporadaAtiva,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchTemporadas();
      refetchJogadores();
      refetchPeladas();
      refetchRanking();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchTemporadas, refetchJogadores, refetchPeladas, refetchRanking]);

  // Calcular dados derivados
  const peladasTemporadaAtiva = temporadaAtiva ? peladas.filter(p => p.temporadaId === temporadaAtiva.id) : [];
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const jogadoresMensalistas = jogadores.filter(j => j.tipo === 'Mensalista' && j.ativo);
  
  const totalGols = ranking.reduce((acc, r) => acc + r.gols, 0);
  const totalCartoes = ranking.reduce((acc, r) => acc + r.cartoesAmarelos + r.cartoesAzuis + r.cartoesVermelhos, 0);
  const totalPartidas = peladasTemporadaAtiva.reduce((acc, p) => acc + (p.partidas?.length || 0), 0);
  const totalAssistencias = ranking.reduce((acc, r) => acc + r.assistencias, 0);
  
  const artilheiro = ranking.length > 0 ? [...ranking].sort((a, b) => b.gols - a.gols)[0] : undefined;
  const liderRanking = ranking.length > 0 ? ranking[0] : undefined;
  const assistidor = ranking.length > 0 ? [...ranking].sort((a, b) => b.assistencias - a.assistencias)[0] : undefined;
  const maisPresente = ranking.length > 0 ? [...ranking].sort((a, b) => b.presencas - a.presencas)[0] : undefined;
  
  const percentualMensalistas = jogadoresAtivos.length > 0 ? (jogadoresMensalistas.length / jogadoresAtivos.length) * 100 : 0;
  const mediaGolsPorPartida = totalPartidas > 0 ? (totalGols / totalPartidas).toFixed(1) : '0';
  const mediaPresencaGeral = ranking.length > 0 ? (ranking.reduce((acc, r) => acc + r.mediaPresenca, 0) / ranking.length).toFixed(1) : '0';

  return (
    <div className="space-y-8 animate-fade-in">
      <AdminHeader temporadaAtiva={temporadaAtiva} />

      <StatisticsCards
        temporadas={temporadas}
        jogadoresAtivos={jogadoresAtivos}
        peladasTemporadaAtiva={peladasTemporadaAtiva}
        totalPartidas={totalPartidas}
        totalGols={totalGols}
        mediaGolsPorPartida={mediaGolsPorPartida}
        percentualMensalistas={percentualMensalistas}
        temporadaAtiva={temporadaAtiva}
      />

      <AdvancedStats
        totalAssistencias={totalAssistencias}
        totalCartoes={totalCartoes}
        totalPartidas={totalPartidas}
        mediaPresencaGeral={mediaPresencaGeral}
        assistidor={assistidor}
        maisPresente={maisPresente}
        peladasTemporadaAtiva={peladasTemporadaAtiva}
        temporadaAtiva={temporadaAtiva}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <RankingSection ranking={ranking} temporadaAtiva={temporadaAtiva} />
        <SeasonHighlights
          artilheiro={artilheiro}
          assistidor={assistidor}
          liderRanking={liderRanking}
          maisPresente={maisPresente}
          totalGols={totalGols}
          totalAssistencias={totalAssistencias}
        />
      </div>

      <RecentPeladas peladas={peladas} temporadas={temporadas} />

      <SystemStatus
        temporadaAtiva={temporadaAtiva}
        jogadoresAtivos={jogadoresAtivos}
        peladasTemporadaAtiva={peladasTemporadaAtiva}
        ranking={ranking}
      />
    </div>
  );
};

export default AdminDashboard;
