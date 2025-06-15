import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { peladaService, temporadaService, jogadorService } from '@/services/dataService';
import PeladaHeader from '@/components/pelada/PeladaHeader';
import PeladaStats from '@/components/pelada/PeladaStats';
import PeladaTeams from '@/components/pelada/PeladaTeams';
import PeladaMatches from '@/components/pelada/PeladaMatches';
import PeladaPlayers from '@/components/pelada/PeladaPlayers';
import { TimeNaPelada } from '@/types';

interface PeladaDetailProps {
  isAdmin?: boolean;
}

const PeladaDetail: React.FC<PeladaDetailProps> = ({ isAdmin = false }) => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin/');

  const { data: pelada } = useQuery({
    queryKey: ['pelada', id],
    queryFn: () => peladaService.getById(id!),
    enabled: !!id,
  });

  const { data: temporada } = useQuery({
    queryKey: ['temporada', pelada?.temporadaId],
    queryFn: () => temporadaService.getById(pelada?.temporadaId!),
    enabled: !!pelada?.temporadaId,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  if (!pelada) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Pelada não encontrada</p>
      </div>
    );
  }

  console.log('PeladaDetail - Pelada completa carregada:', pelada);

  const calcularEstatisticas = () => {
    let totalGols = 0;
    let cartoes = 0;
    let totalPartidas = pelada.partidas?.length || 0;
    
    console.log('PeladaDetail - Calculando estatísticas para pelada:', pelada);
    
    pelada.partidas?.forEach(partida => {
      console.log('PeladaDetail - Processando partida:', partida);
      const golsA = Number(partida.placarA) || 0;
      const golsB = Number(partida.placarB) || 0;
      console.log('PeladaDetail - Gols da partida:', { golsA, golsB });
      totalGols += golsA + golsB;
      
      partida.eventos?.forEach(evento => {
        console.log('PeladaDetail - Evento:', evento);
        if (evento.tipo !== 'gol') cartoes++;
      });
    });

    // Calcular jogadores presentes de forma mais robusta
    let jogadoresPresentes = 0;
    if (pelada.jogadoresPresentes) {
      jogadoresPresentes = pelada.jogadoresPresentes.filter(j => j.presente).length;
    } else if (pelada.presencas) {
      jogadoresPresentes = pelada.presencas.filter(p => p.presente).length;
    } else if (pelada.times) {
      const jogadoresUnicos = new Set();
      pelada.times.forEach(time => {
        time.jogadores.forEach(jogadorId => jogadoresUnicos.add(jogadorId));
      });
      jogadoresPresentes = jogadoresUnicos.size;
    }

    console.log('PeladaDetail - Estatísticas calculadas:', { totalGols, cartoes, totalPartidas, jogadoresPresentes });

    return { 
      totalGols, 
      cartoes, 
      totalPartidas,
      jogadoresPresentes
    };
  };

  const stats = calcularEstatisticas();

  // Função para obter times da pelada de forma mais robusta
  const getTimesFromPelada = (): TimeNaPelada[] => {
    if (pelada.times && pelada.times.length > 0) {
      return pelada.times;
    }
    
    // Se não temos times diretos, tentar extrair das partidas
    if (pelada.partidas && pelada.partidas.length > 0) {
      const timesMap = new Map();
      
      pelada.partidas.forEach(partida => {
        // Criar times baseados nas partidas
        if (partida.timeA && partida.timeA.length > 0) {
          const timeAKey = partida.timeA.sort().join(',');
          if (!timesMap.has(timeAKey)) {
            timesMap.set(timeAKey, {
              id: `time-a-${timesMap.size}`,
              peladaId: pelada.id,
              identificadorLetra: String.fromCharCode(65 + timesMap.size), // A, B, C...
              jogadores: partida.timeA
            });
          }
        }
        
        if (partida.timeB && partida.timeB.length > 0) {
          const timeBKey = partida.timeB.sort().join(',');
          if (!timesMap.has(timeBKey)) {
            timesMap.set(timeBKey, {
              id: `time-b-${timesMap.size}`,
              peladaId: pelada.id,
              identificadorLetra: String.fromCharCode(65 + timesMap.size), // A, B, C...
              jogadores: partida.timeB
            });
          }
        }
      });
      
      return Array.from(timesMap.values());
    }
    
    return [];
  };

  const timesDisponiveis = getTimesFromPelada();
  const backUrl = isAdminRoute ? `/admin/temporadas/${pelada.temporadaId}` : `/temporada/${pelada.temporadaId}`;

  return (
    <div className="space-y-6">
      <PeladaHeader 
        pelada={pelada}
        temporada={temporada}
        isAdminRoute={isAdminRoute}
        isAdmin={isAdmin}
        backUrl={backUrl}
        totalPartidas={stats.totalPartidas}
      />

      <PeladaStats 
        jogadoresPresentes={stats.jogadoresPresentes}
        totalPartidas={stats.totalPartidas}
        totalGols={stats.totalGols}
        cartoes={stats.cartoes}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PeladaTeams 
          times={timesDisponiveis}
          jogadores={jogadores}
        />

        <PeladaMatches 
          partidas={pelada.partidas || []}
          times={timesDisponiveis}
          jogadores={jogadores}
        />
      </div>

      <PeladaPlayers 
        pelada={pelada}
        times={timesDisponiveis}
        jogadores={jogadores}
        jogadoresPresentes={stats.jogadoresPresentes}
      />
    </div>
  );
};

export default PeladaDetail;
