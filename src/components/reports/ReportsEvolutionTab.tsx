
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { RankingJogador, Pelada } from '@/types';

interface ReportsEvolutionTabProps {
  ranking: RankingJogador[];
  peladas: Pelada[];
}

const ReportsEvolutionTab: React.FC<ReportsEvolutionTabProps> = ({ ranking, peladas }) => {
  // Dados de evolução temporal (peladas ao longo do tempo)
  const evolucaoTemporal = peladas
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
    .map((pelada, index) => {
      const golsTotais = pelada.partidas?.reduce((total, partida) => {
        return total + (partida.placarA || 0) + (partida.placarB || 0);
      }, 0) || 0;
      
      return {
        pelada: `Pelada ${index + 1}`,
        data: new Date(pelada.data).toLocaleDateString('pt-BR'),
        gols: golsTotais,
        jogadores: pelada.jogadoresPresentes?.filter(j => j.presente).length || 0
      };
    });

  const chartConfig = {
    gols: {
      label: "Gols",
      color: "#8884d8",
    },
    jogadores: {
      label: "Jogadores",
      color: "#82ca9d",
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Evolução ao Longo do Tempo</span>
          </CardTitle>
          <CardDescription>Gols e participação por pelada</CardDescription>
        </CardHeader>
        <CardContent>
          {evolucaoTemporal.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoTemporal}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="pelada" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="gols" stroke="var(--color-gols)" strokeWidth={2} />
                  <Line type="monotone" dataKey="jogadores" stroke="var(--color-jogadores)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Dados insuficientes para análise temporal</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Evolução Individual</CardTitle>
          <CardDescription>Performance dos jogadores ao longo da temporada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-center">Presença %</TableHead>
                <TableHead className="text-center">Média de Gols</TableHead>
                <TableHead className="text-center">Tendência</TableHead>
                <TableHead className="text-center">Pontuação Média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.slice(0, 10).map((player) => {
                const presencaPercent = peladas.length > 0 
                  ? ((player.presencas / peladas.length) * 100).toFixed(0)
                  : 0;
                const mediaGols = player.presencas > 0 ? (player.gols / player.presencas).toFixed(1) : '0.0';
                
                return (
                  <TableRow key={player.jogador.id}>
                    <TableCell className="font-medium">{player.jogador.nome}</TableCell>
                    <TableCell className="text-center">{presencaPercent}%</TableCell>
                    <TableCell className="text-center">{mediaGols}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={player.mediaPresenca > 2 ? "default" : "secondary"}>
                        {player.mediaPresenca > 2 ? "↗️ Crescendo" : "→ Estável"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{player.mediaPresenca.toFixed(1)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsEvolutionTab;
