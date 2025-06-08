
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3, PieChart, TrendingUp, Award, AlertTriangle, Users, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { calcularRanking } from '@/services/dataService';

const Reports: React.FC = () => {
  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking'],
    queryFn: () => calcularRanking(),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios e Estatísticas</h1>
        <p className="text-muted-foreground">Análises detalhadas do campeonato</p>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="disciplina">Disciplina</TabsTrigger>
          <TabsTrigger value="parcerias">Parcerias</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                    <p className="text-2xl font-bold">{ranking.reduce((total, j) => total + j.gols, 0)}</p>
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
                    <p className="text-2xl font-bold">2.5</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Jogos Realizados</p>
                    <p className="text-2xl font-bold">2</p>
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
                    <p className="text-2xl font-bold">83%</p>
                  </div>
                  <PieChart className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Artilheiros</CardTitle>
                <CardDescription>Maiores goleadores da temporada</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ranking
                    .sort((a, b) => b.gols - a.gols)
                    .slice(0, 5)
                    .map((player, index) => (
                    <div key={player.jogador.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        <span className="font-medium">{player.jogador.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{player.gols} gols</p>
                        <p className="text-sm text-muted-foreground">{(player.gols / Math.max(player.presencas, 1)).toFixed(2)} por jogo</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Assistências</CardTitle>
                <CardDescription>Quem mais deu assistências</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ranking
                    .sort((a, b) => b.assistencias - a.assistencias)
                    .slice(0, 5)
                    .map((player, index) => (
                    <div key={player.jogador.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        <span className="font-medium">{player.jogador.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{player.assistencias} assists</p>
                        <p className="text-sm text-muted-foreground">{(player.assistencias / Math.max(player.presencas, 1)).toFixed(2)} por jogo</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="disciplina" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Relatório de Disciplina</span>
              </CardTitle>
              <CardDescription>Estatísticas de cartões e punições</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jogador</TableHead>
                    <TableHead className="text-center">Cartões Amarelos</TableHead>
                    <TableHead className="text-center">Cartões Azuis</TableHead>
                    <TableHead className="text-center">Cartões Vermelhos</TableHead>
                    <TableHead className="text-center">Total de Cartões</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking
                    .filter(p => p.cartoesAmarelos + p.cartoesAzuis + p.cartoesVermelhos > 0)
                    .sort((a, b) => (b.cartoesAmarelos + b.cartoesAzuis + b.cartoesVermelhos) - (a.cartoesAmarelos + a.cartoesAzuis + a.cartoesVermelhos))
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
        </TabsContent>

        <TabsContent value="parcerias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Análise de Parcerias</span>
              </CardTitle>
              <CardDescription>Duplas que mais pontuaram juntas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parceria</TableHead>
                    <TableHead className="text-center">Jogos Juntos</TableHead>
                    <TableHead className="text-center">Vitórias</TableHead>
                    <TableHead className="text-center">Gols Combinados</TableHead>
                    <TableHead className="text-center">Assistências Mútuas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">João Silva & Pedro Santos</TableCell>
                    <TableCell className="text-center">2</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">3</TableCell>
                    <TableCell className="text-center">1</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Carlos Oliveira & Ana Costa</TableCell>
                    <TableCell className="text-center">1</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">0</TableCell>
                    <TableCell className="text-center">1</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Gráfico de Evolução</span>
              </CardTitle>
              <CardDescription>Evolução dos jogadores ao longo da temporada</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jogador</TableHead>
                    <TableHead className="text-center">Primeira Pelada</TableHead>
                    <TableHead className="text-center">Última Pelada</TableHead>
                    <TableHead className="text-center">Tendência</TableHead>
                    <TableHead className="text-center">Média Atual</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.slice(0, 6).map((player) => (
                    <TableRow key={player.jogador.id}>
                      <TableCell className="font-medium">{player.jogador.nome}</TableCell>
                      <TableCell className="text-center">1.5</TableCell>
                      <TableCell className="text-center">{player.mediaPresenca.toFixed(1)}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={player.mediaPresenca > 1.5 ? "default" : "secondary"}>
                          {player.mediaPresenca > 1.5 ? "↗️ Subindo" : "→ Estável"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{player.mediaPresenca.toFixed(1)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
