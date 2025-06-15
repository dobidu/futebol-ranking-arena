
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Calendar, Target } from 'lucide-react';
import { Temporada, Jogador } from '@/types';

interface StatisticsCardsProps {
  temporadas: Temporada[];
  jogadoresAtivos: Jogador[];
  peladasTemporadaAtiva: any[];
  totalPartidas: number;
  totalGols: number;
  mediaGolsPorPartida: string;
  percentualMensalistas: number;
  temporadaAtiva?: Temporada;
}

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  temporadas,
  jogadoresAtivos,
  peladasTemporadaAtiva,
  totalPartidas,
  totalGols,
  mediaGolsPorPartida,
  percentualMensalistas,
  temporadaAtiva
}) => {
  // Calcular assiduidade correta
  const calcularAssiduidade = () => {
    if (!temporadaAtiva || !peladasTemporadaAtiva.length) return 0;
    
    let totalPresencas = 0;
    let totalPossivel = 0;
    
    peladasTemporadaAtiva.forEach(pelada => {
      // Contar jogadores que estavam presentes
      let presentes = 0;
      
      if (pelada.presencas) {
        presentes = pelada.presencas.filter((p: any) => p.presente).length;
      } else if (pelada.jogadoresPresentes) {
        presentes = pelada.jogadoresPresentes.filter((jp: any) => jp.presente).length;
      } else if (pelada.times) {
        const jogadoresUnicos = new Set();
        pelada.times.forEach((time: any) => {
          time.jogadores.forEach((jogadorId: string) => jogadoresUnicos.add(jogadorId));
        });
        presentes = jogadoresUnicos.size;
      }
      
      totalPresencas += presentes;
      totalPossivel += jogadoresAtivos.length; // Todos os jogadores poderiam estar presentes
    });
    
    return totalPossivel > 0 ? Math.round((totalPresencas / totalPossivel) * 100) : 0;
  };

  const assiduidade = calcularAssiduidade();

  const estatisticasGerais = [
    {
      titulo: 'Temporadas',
      valor: temporadas.length,
      descricao: `${temporadas.filter(t => t.ativa).length} ativa(s)`,
      icon: Trophy,
      cor: 'text-yellow-600',
      bgCor: 'bg-yellow-50 border-yellow-200'
    },
    {
      titulo: 'Jogadores Ativos',
      valor: jogadoresAtivos.length,
      descricao: `${percentualMensalistas.toFixed(0)}% mensalistas`,
      icon: Users,
      cor: 'text-blue-600',
      bgCor: 'bg-blue-50 border-blue-200'
    },
    {
      titulo: 'Peladas Realizadas',
      valor: peladasTemporadaAtiva.length,
      descricao: temporadaAtiva ? `${assiduidade}% assiduidade média` : 'Nenhuma temporada ativa',
      icon: Calendar,
      cor: 'text-green-600',
      bgCor: 'bg-green-50 border-green-200'
    },
    {
      titulo: 'Gols na Temporada',
      valor: totalGols,
      descricao: `Média: ${mediaGolsPorPartida} por partida`,
      icon: Target,
      cor: 'text-red-600',
      bgCor: 'bg-red-50 border-red-200'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {estatisticasGerais.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className={`${stat.bgCor} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.titulo}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.valor}</p>
                  <p className="text-xs text-muted-foreground mt-2">{stat.descricao}</p>
                </div>
                <div className={`p-3 rounded-full bg-white/80`}>
                  <Icon className={`h-6 w-6 ${stat.cor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatisticsCards;
