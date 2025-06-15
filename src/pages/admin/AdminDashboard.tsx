
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, Trophy, Calendar, Target, TrendingUp, AlertTriangle, Award, Zap, Clock, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService, calcularRanking } from '@/services/dataService';

const AdminDashboard: React.FC = () => {
  const { data: temporadas = [], refetch: refetchTemporadas } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [], refetch: refetchJogadores } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const { data: peladas = [], refetch: refetchPeladas } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);

  const { data: ranking = [], refetch: refetchRanking } = useQuery({
    queryKey: ['ranking-admin', temporadaAtiva?.id],
    queryFn: () => temporadaAtiva ? calcularRanking(temporadaAtiva.id) : [],
    enabled: !!temporadaAtiva,
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      refetchTemporadas();
      refetchJogadores();
      refetchPeladas();
      refetchRanking();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetchTemporadas, refetchJogadores, refetchPeladas, refetchRanking]);

  const peladasTemporadaAtiva = temporadaAtiva ? peladas.filter(p => p.temporadaId === temporadaAtiva.id) : [];
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const jogadoresMensalistas = jogadores.filter(j => j.tipo === 'Mensalista' && j.ativo);
  const jogadoresConvidados = jogadores.filter(j => j.tipo === 'Convidado' && j.ativo);

  // Calcular estatísticas avançadas
  const totalGols = ranking.reduce((acc, r) => acc + r.gols, 0);
  const totalCartoes = ranking.reduce((acc, r) => acc + r.cartoesAmarelos + r.cartoesAzuis + r.cartoesVermelhos, 0);
  const totalPartidas = peladasTemporadaAtiva.reduce((acc, p) => acc + (p.partidas?.length || 0), 0);
  const totalAssistencias = ranking.reduce((acc, r) => acc + r.assistencias, 0);
  
  const artilheiro = ranking.length > 0 ? [...ranking].sort((a, b) => b.gols - a.gols)[0] : null;
  const liderRanking = ranking.length > 0 ? ranking[0] : null;
  const assistidor = ranking.length > 0 ? [...ranking].sort((a, b) => b.assistencias - a.assistencias)[0] : null;
  const maisPresente = ranking.length > 0 ? [...ranking].sort((a, b) => b.presencas - a.presencas)[0] : null;

  // Calcular percentuais e médias
  const percentualMensalistas = jogadoresAtivos.length > 0 ? (jogadoresMensalistas.length / jogadoresAtivos.length) * 100 : 0;
  const mediaGolsPorPartida = totalPartidas > 0 ? (totalGols / totalPartidas).toFixed(1) : '0';
  const mediaPresencaGeral = ranking.length > 0 ? (ranking.reduce((acc, r) => acc + r.mediaPresenca, 0) / ranking.length).toFixed(1) : '0';

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
      descricao: temporadaAtiva ? `${totalPartidas} partidas` : 'Nenhuma temporada ativa',
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
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-blue-100 text-lg">Controle total do sistema Pelada Bravo</p>
        {temporadaAtiva && (
          <div className="mt-4 inline-flex items-center bg-white/20 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Temporada Ativa: {temporadaAtiva.nome}</span>
          </div>
        )}
      </div>

      {/* Estatísticas Principais */}
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

      {/* Estatísticas Avançadas */}
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top 10 Ranking */}
        <Card className="xl:col-span-2 border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <span>Top 10 Ranking Geral</span>
            </CardTitle>
            <CardDescription>
              Classificação atual da temporada {temporadaAtiva?.nome || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ranking.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Jogador</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                    <TableHead className="text-center">Assist.</TableHead>
                    <TableHead className="text-right">Pontos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.slice(0, 10).map((item, index) => (
                    <TableRow key={item.jogador.id} className="hover:bg-muted/50">
                      <TableCell className="font-bold">
                        <span className={`${index < 3 ? 'text-yellow-600' : ''}`}>
                          {index + 1}
                          {index === 0 && ' 🥇'}
                          {index === 1 && ' 🥈'}
                          {index === 2 && ' 🥉'}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{item.jogador.nome}</TableCell>
                      <TableCell>
                        <Badge variant={item.jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                          {item.jogador.tipo}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{item.gols}</TableCell>
                      <TableCell className="text-center font-medium">{item.assistencias}</TableCell>
                      <TableCell className="text-right font-bold text-lg">{item.pontuacaoTotal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Nenhum dado de ranking disponível</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumo dos Destaques */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span>Destaques da Temporada</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {artilheiro && (
              <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">🎯 Artilheiro</span>
                  <Badge variant="outline" className="text-red-700 border-red-300">{artilheiro.gols} gols</Badge>
                </div>
                <p className="font-bold text-red-900">{artilheiro.jogador.nome}</p>
                <Progress value={(artilheiro.gols / Math.max(totalGols, 1)) * 100} className="mt-2 h-2" />
              </div>
            )}

            {assistidor && (
              <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">⚡ Maior Assistidor</span>
                  <Badge variant="outline" className="text-purple-700 border-purple-300">{assistidor.assistencias} assist.</Badge>
                </div>
                <p className="font-bold text-purple-900">{assistidor.jogador.nome}</p>
                <Progress value={(assistidor.assistencias / Math.max(totalAssistencias, 1)) * 100} className="mt-2 h-2" />
              </div>
            )}

            {liderRanking && (
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-700">👑 Líder Geral</span>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-300">{liderRanking.pontuacaoTotal} pts</Badge>
                </div>
                <p className="font-bold text-yellow-900">{liderRanking.jogador.nome}</p>
                <div className="text-xs text-yellow-700 mt-1">
                  {liderRanking.vitorias}V • {liderRanking.gols}G • {liderRanking.assistencias}A
                </div>
              </div>
            )}

            {maisPresente && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">📅 Mais Assíduo</span>
                  <Badge variant="outline" className="text-green-700 border-green-300">{maisPresente.presencas} presenças</Badge>
                </div>
                <p className="font-bold text-green-900">{maisPresente.jogador.nome}</p>
                <Progress value={maisPresente.mediaPresenca} className="mt-2 h-2" />
                <p className="text-xs text-green-700 mt-1">{maisPresente.mediaPresenca.toFixed(1)}% de presença</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo das Últimas Peladas */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Últimas Peladas Realizadas</span>
          </CardTitle>
          <CardDescription>
            Histórico recente de peladas com detalhes das partidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {peladas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead className="text-center">Partidas</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                  <TableHead className="text-center">Jogadores</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {peladas.slice(-8).reverse().map((pelada) => {
                  const golsDaPelada = pelada.partidas?.reduce((acc, p) => acc + p.placarA + p.placarB, 0) || 0;
                  const jogadoresDaPelada = pelada.jogadoresPresentes?.length || 0;
                  
                  return (
                    <TableRow key={pelada.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {new Date(pelada.data).toLocaleDateString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {temporadas.find(t => t.id === pelada.temporadaId)?.nome || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">{pelada.partidas?.length || 0}</TableCell>
                      <TableCell className="text-center font-medium text-red-600">{golsDaPelada}</TableCell>
                      <TableCell className="text-center font-medium text-blue-600">{jogadoresDaPelada}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-green-600">Concluída</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Nenhuma pelada cadastrada ainda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertas e Status do Sistema */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Status do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!temporadaAtiva ? (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Atenção necessária</p>
                  <p className="text-sm text-yellow-700">Nenhuma temporada está ativa</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Trophy className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Temporada ativa</p>
                  <p className="text-sm text-green-700">{temporadaAtiva.nome} em andamento</p>
                </div>
              </div>
            )}
            
            {jogadoresAtivos.length === 0 ? (
              <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Problema crítico</p>
                  <p className="text-sm text-red-700">Nenhum jogador ativo cadastrado</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Jogadores ativos</p>
                  <p className="text-sm text-blue-700">{jogadoresAtivos.length} jogadores cadastrados</p>
                </div>
              </div>
            )}

            {temporadaAtiva && peladasTemporadaAtiva.length === 0 ? (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Informação</p>
                  <p className="text-sm text-orange-700">Temporada sem peladas cadastradas</p>
                </div>
              </div>
            ) : temporadaAtiva && peladasTemporadaAtiva.length > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Sistema operacional</p>
                  <p className="text-sm text-green-700">{peladasTemporadaAtiva.length} peladas na temporada</p>
                </div>
              </div>
            )}

            {ranking.length > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Dados atualizados</p>
                  <p className="text-sm text-purple-700">Ranking com {ranking.length} jogadores</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
