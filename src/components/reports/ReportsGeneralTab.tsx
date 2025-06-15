
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, TrendingUp, Award, PieChart } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RankingJogador, Pelada } from '@/types';

interface ReportsGeneralTabProps {
  ranking: RankingJogador[];
  peladas: Pelada[];
}

const ReportsGeneralTab: React.FC<ReportsGeneralTabProps> = ({ ranking, peladas }) => {
  // Calcular estatísticas dinâmicas
  const totalGols = ranking.reduce((total, j) => total + (j.gols || 0), 0);
  const totalPartidas = peladas.reduce((total, pelada) => {
    const partidasCount = pelada.partidas?.length || 0;
    return total + partidasCount;
  }, 0);
  const mediaGolsPorJogo = totalPartidas > 0 ? (totalGols / totalPartidas).toFixed(1) : '0.0';
  const presencaMedia = ranking.length > 0 && peladas.length > 0
    ? (ranking.reduce((total, j) => total + (j.presencas || 0), 0) / ranking.length / peladas.length * 100).toFixed(0)
    : '0';

  // Dados para gráficos
  const topArtilheiros = ranking
    .sort((a, b) => b.gols - a.gols)
    .slice(0, 10)
    .map(j => ({
      nome: j.jogador.nome.split(' ')[0],
      gols: j.gols
    }));

  const topAssistencias = ranking
    .sort((a, b) => b.assistencias - a.assistencias)
    .slice(0, 10)
    .map(j => ({
      nome: j.jogador.nome.split(' ')[0],
      assistencias: j.assistencias
    }));

  const chartConfig = {
    gols: {
      label: "Gols",
      color: "#8884d8",
    },
    assistencias: {
      label: "Assistências", 
      color: "#82ca9d",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                <p className="text-2xl font-bold">{totalGols}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Média por Jogo</p>
                <p className="text-2xl font-bold">{mediaGolsPorJogo}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Peladas Realizadas</p>
                <p className="text-2xl font-bold">{peladas.length}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Participação Média</p>
                <p className="text-2xl font-bold">{presencaMedia}%</p>
              </div>
              <PieChart className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Artilheiros</CardTitle>
            <CardDescription>Maiores goleadores da temporada</CardDescription>
          </CardHeader>
          <CardContent>
            {topArtilheiros.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topArtilheiros}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="gols" fill="var(--color-gols)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Assistências</CardTitle>
            <CardDescription>Quem mais deu assistências</CardDescription>
          </CardHeader>
          <CardContent>
            {topAssistencias.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topAssistencias}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nome" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="assistencias" fill="var(--color-assistencias)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum dado disponível</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsGeneralTab;
