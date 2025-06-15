
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RankingJogador } from '@/types';

interface ReportsDisciplineTabProps {
  ranking: RankingJogador[];
}

const ReportsDisciplineTab: React.FC<ReportsDisciplineTabProps> = ({ ranking }) => {
  // Dados de cartões para gráfico de pizza
  const dadosCartoes = [
    { 
      nome: 'Amarelos', 
      valor: ranking.reduce((total, j) => total + j.cartoesAmarelos, 0),
      cor: '#facc15'
    },
    { 
      nome: 'Azuis', 
      valor: ranking.reduce((total, j) => total + j.cartoesAzuis, 0),
      cor: '#3b82f6'
    },
    { 
      nome: 'Vermelhos', 
      valor: ranking.reduce((total, j) => total + j.cartoesVermelhos, 0),
      cor: '#ef4444'
    }
  ].filter(item => item.valor > 0);

  const chartConfig = {
    valor: {
      label: "Cartões",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Distribuição de Cartões</span>
            </CardTitle>
            <CardDescription>Proporção de cartões por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            {dadosCartoes.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie 
                      data={dadosCartoes} 
                      dataKey="valor" 
                      cx="50%" 
                      cy="50%" 
                      outerRadius={80}
                      labelLine={false}
                      label={({ nome, valor }) => `${nome}: ${valor}`}
                    >
                      {dadosCartoes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.cor} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum cartão registrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório de Disciplina</CardTitle>
            <CardDescription>Estatísticas de cartões por jogador</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jogador</TableHead>
                  <TableHead className="text-center">Amarelos</TableHead>
                  <TableHead className="text-center">Azuis</TableHead>
                  <TableHead className="text-center">Vermelhos</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking
                  .filter(p => p.cartoesAmarelos + p.cartoesAzuis + p.cartoesVermelhos > 0)
                  .sort((a, b) => (b.cartoesAmarelos + b.cartoesAzuis + b.cartoesVermelhos) - (a.cartoesAmarelos + a.cartoesAzuis + a.cartoesVermelhos))
                  .slice(0, 10)
                  .map((player) => (
                  <TableRow key={player.jogador.id}>
                    <TableCell className="font-medium">{player.jogador.nome}</TableCell>
                    <TableCell className="text-center">
                      {player.cartoesAmarelos > 0 && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {player.cartoesAmarelos}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {player.cartoesAzuis > 0 && (
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          {player.cartoesAzuis}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {player.cartoesVermelhos > 0 && (
                        <Badge variant="destructive">
                          {player.cartoesVermelhos}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {player.cartoesAmarelos + player.cartoesAzuis + player.cartoesVermelhos}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {ranking.filter(p => p.cartoesAmarelos + p.cartoesAzuis + p.cartoesVermelhos > 0).length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum cartão registrado ainda</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsDisciplineTab;
