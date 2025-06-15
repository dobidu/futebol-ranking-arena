
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, PieChart, TrendingUp, Award, AlertTriangle, Users, Target } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart as RechartsPieChart, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { calcularRanking, temporadaService, peladaService } from '@/services/dataService';

const Reports: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  // Definir temporada padrão (ativa) se não tiver selecionada
  React.useEffect(() => {
    if (temporadas.length > 0 && !selectedTemporada) {
      const temporadaAtiva = temporadas.find(t => t.ativa);
      setSelectedTemporada(temporadaAtiva?.id || temporadas[0].id);
    }
  }, [temporadas, selectedTemporada]);

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-reports', selectedTemporada],
    queryFn: () => {
      if (!selectedTemporada) return [];
      return calcularRanking(selectedTemporada === 'all' ? undefined : selectedTemporada);
    },
    enabled: !!selectedTemporada,
  });

  // Filtrar peladas da temporada selecionada
  const peladasFiltradas = selectedTemporada && selectedTemporada !== 'all' 
    ? peladas.filter(p => p.temporadaId === selectedTemporada)
    : peladas;

  // Calcular estatísticas dinâmicas
  const totalGols = ranking.reduce((total, j) => total + (j.gols || 0), 0);
  const totalPartidas = peladasFiltradas.reduce((total, pelada) => {
    const partidasCount = pelada.partidas?.length || 0;
    return total + partidasCount;
  }, 0);
  const mediaGolsPorJogo = totalPartidas > 0 ? (totalGols / totalPartidas).toFixed(1) : '0.0';
  const presencaMedia = ranking.length > 0 && peladasFiltradas.length > 0
    ? (ranking.reduce((total, j) => total + (j.presencas || 0), 0) / ranking.length / peladasFiltradas.length * 100).toFixed(0)
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

  // Dados de evolução temporal (peladas ao longo do tempo)
  const evolucaoTemporal = peladasFiltradas
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

  // Calcular parcerias (simplificado - jogadores que mais jogaram juntos)
  const calcularParcerias = () => {
    const parcerias: { [key: string]: { jogos: number; vitorias: number; gols: number } } = {};
    
    peladasFiltradas.forEach(pelada => {
      if (pelada.times) {
        pelada.times.forEach(time => {
          if (time.jogadores.length >= 2) {
            for (let i = 0; i < time.jogadores.length; i++) {
              for (let j = i + 1; j < time.jogadores.length; j++) {
                const jogador1 = ranking.find(r => r.jogador.id === time.jogadores[i])?.jogador;
                const jogador2 = ranking.find(r => r.jogador.id === time.jogadores[j])?.jogador;
                
                if (jogador1 && jogador2) {
                  const chave = [jogador1.nome, jogador2.nome].sort().join(' & ');
                  if (!parcerias[chave]) {
                    parcerias[chave] = { jogos: 0, vitorias: 0, gols: 0 };
                  }
                  parcerias[chave].jogos++;
                  
                  // Calcular gols combinados da dupla
                  const golsJogador1 = ranking.find(r => r.jogador.id === jogador1.id)?.gols || 0;
                  const golsJogador2 = ranking.find(r => r.jogador.id === jogador2.id)?.gols || 0;
                  parcerias[chave].gols = Math.floor((golsJogador1 + golsJogador2) / parcerias[chave].jogos);
                }
              }
            }
          }
        });
      }
    });

    return Object.entries(parcerias)
      .map(([nomes, stats]) => ({ nomes, ...stats }))
      .sort((a, b) => b.jogos - a.jogos)
      .slice(0, 5);
  };

  const topParcerias = calcularParcerias();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground">Análises detalhadas do campeonato</p>
        </div>
        
        <Select value={selectedTemporada} onValueChange={setSelectedTemporada}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione a temporada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Temporadas</SelectItem>
            {temporadas.filter(t => t.id && t.nome).map((temporada) => (
              <SelectItem key={temporada.id} value={temporada.id}>
                {temporada.nome} {temporada.ativa && '(Ativa)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
                    <p className="text-2xl font-bold">{peladasFiltradas.length}</p>
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
        </TabsContent>

        <TabsContent value="disciplina" className="space-y-6">
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
                      <RechartsPieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <RechartsPieChart data={dadosCartoes} dataKey="valor" nameKey="nome" cx="50%" cy="50%" outerRadius={80}>
                          {dadosCartoes.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.cor} />
                          ))}
                        </RechartsPieChart>
                      </RechartsPieChart>
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
        </TabsContent>

        <TabsContent value="parcerias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Análise de Parcerias</span>
              </CardTitle>
              <CardDescription>Duplas que mais jogaram juntas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parceria</TableHead>
                    <TableHead className="text-center">Jogos Juntos</TableHead>
                    <TableHead className="text-center">Gols Médios</TableHead>
                    <TableHead className="text-center">Efetividade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topParcerias.map((parceria, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{parceria.nomes}</TableCell>
                      <TableCell className="text-center">{parceria.jogos}</TableCell>
                      <TableCell className="text-center">{parceria.gols}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={parceria.jogos >= 3 ? "default" : "secondary"}>
                          {parceria.jogos >= 3 ? "Alta" : "Média"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {topParcerias.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Dados insuficientes para análise de parcerias</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-6">
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
                      <Line type="monotone" dataKey="jogadores" stroke="var(--color-assistencias)" strokeWidth={2} />
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
                    const presencaPercent = peladasFiltradas.length > 0 
                      ? ((player.presencas / peladasFiltradas.length) * 100).toFixed(0)
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
