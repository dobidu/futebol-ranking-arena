
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Zap, AlertTriangle, Clock } from 'lucide-react';
import { RankingJogador, Temporada } from '@/types';

interface AdvancedStatsProps {
  totalAssistencias: number;
  totalCartoes: number;
  totalPartidas: number;
  mediaPresencaGeral: string;
  assistidor?: RankingJogador;
  maisPresente?: RankingJogador;
  peladasTemporadaAtiva: any[];
  temporadaAtiva?: Temporada;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({
  totalAssistencias,
  totalCartoes,
  totalPartidas,
  mediaPresencaGeral,
  assistidor,
  maisPresente,
  peladasTemporadaAtiva,
  temporadaAtiva
}) => {
  const estatisticasAvancadas = [
    {
      titulo: 'Total de Assistências',
      valor: totalAssistencias,
      descricao: assistidor ? `Líder: ${assistidor.jogador.nome} (${assistidor.assistencias})` : 'Sem dados',
      icon: Zap,
      cor: 'text-purple-600'
    },
    {
      titulo: 'Cartões Aplicados',
      valor: totalCartoes,
      descricao: 'Total na temporada',
      icon: AlertTriangle,
      cor: 'text-orange-600'
    },
    {
      titulo: 'Média de Presença',
      valor: `${mediaPresencaGeral}%`,
      descricao: maisPresente ? `Mais assíduo: ${maisPresente.jogador.nome}` : 'Sem dados',
      icon: Clock,
      cor: 'text-indigo-600'
    },
    {
      titulo: 'Partidas Totais',
      valor: totalPartidas,
      descricao: `${peladasTemporadaAtiva.length} peladas realizadas`,
      icon: Activity,
      cor: 'text-teal-600'
    }
  ];

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5 text-blue-600" />
          <span>Estatísticas Avançadas da Temporada</span>
        </CardTitle>
        <CardDescription>
          Métricas detalhadas da temporada {temporadaAtiva?.nome || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {estatisticasAvancadas.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border">
                <Icon className={`h-8 w-8 ${stat.cor} mx-auto mb-2`} />
                <p className="text-2xl font-bold text-foreground">{stat.valor}</p>
                <p className="text-sm text-muted-foreground">{stat.titulo}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.descricao}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedStats;
