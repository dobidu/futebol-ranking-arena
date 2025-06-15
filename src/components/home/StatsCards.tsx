
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Calendar, Target, Award } from 'lucide-react';

interface StatsCardsProps {
  jogadoresAtivos: number;
  peladasTemporadaAtiva: number;
  totalGols: number;
  totalTemporadas: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  jogadoresAtivos,
  peladasTemporadaAtiva,
  totalGols,
  totalTemporadas
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className={`gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-${stat.color}-500`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 bg-${stat.color}-100 rounded-full`}>
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
