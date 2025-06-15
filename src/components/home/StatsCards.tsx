
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Target, Award, TrendingUp, AlertTriangle } from 'lucide-react';

interface StatsCardsProps {
  jogadoresAtivos: number;
  peladasTemporadaAtiva: number;
  totalGols: number;
  totalTemporadas: number;
  peladaComMaisGols?: { nome: string; gols: number; data: string };
  peladaComMaisCartoes?: { nome: string; cartoes: number; data: string };
}

const StatsCards: React.FC<StatsCardsProps> = ({
  jogadoresAtivos,
  peladasTemporadaAtiva,
  totalGols,
  totalTemporadas,
  peladaComMaisGols,
  peladaComMaisCartoes
}) => {
  const stats = [
    {
      title: 'Jogadores Ativos',
      value: jogadoresAtivos,
      subtitle: 'Na temporada atual',
      color: 'blue',
      icon: Users,
    },
    {
      title: 'Peladas Realizadas',
      value: peladasTemporadaAtiva,
      subtitle: 'Nesta temporada',
      color: 'green',
      icon: Calendar,
    },
    {
      title: 'Total de Gols',
      value: totalGols,
      subtitle: 'Na temporada',
      color: 'orange',
      icon: Target,
    },
    {
      title: 'Temporadas',
      value: totalTemporadas,
      subtitle: 'Total criadas',
      color: 'purple',
      icon: Award,
    },
  ];

  // Adicionar estatísticas especiais se disponíveis
  if (peladaComMaisGols) {
    stats.push({
      title: 'Pelada + Gols',
      value: peladaComMaisGols.gols,
      subtitle: `${peladaComMaisGols.nome} - ${peladaComMaisGols.data}`,
      color: 'red',
      icon: TrendingUp,
    });
  }

  if (peladaComMaisCartoes) {
    stats.push({
      title: 'Pelada + Cartões',
      value: peladaComMaisCartoes.cartoes,
      subtitle: `${peladaComMaisCartoes.nome} - ${peladaComMaisCartoes.data}`,
      color: 'yellow',
      icon: AlertTriangle,
    });
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-${stat.color}-500`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.subtitle}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-full flex-shrink-0`}>
                  <Icon className={`h-8 w-8 text-${stat.color}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;
