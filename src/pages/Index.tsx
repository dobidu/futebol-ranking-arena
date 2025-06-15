
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Trophy, Users, BarChart3, Target, Calendar, Award, TrendingUp, Clock, Star, Zap, Crown, Medal } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService, jogadorService, calcularRanking } from '@/services/dataService';

const Index: React.FC = () => {
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);
  
  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-home', temporadaAtiva?.id],
    queryFn: () => temporadaAtiva ? calcularRanking(temporadaAtiva.id) : [],
    enabled: !!temporadaAtiva,
  });

  // Calcular estatísticas dinâmicas
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const peladasTemporadaAtiva = temporadaAtiva ? peladas.filter(p => p.temporadaId === temporadaAtiva.id) : [];
  const ultimaPelada = peladas.length > 0 ? [...peladas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0] : null;
  const totalGols = ranking.reduce((total, jogador) => total + jogador.gols, 0);
  
  const liderRanking = ranking.length > 0 ? ranking[0] : null;
  const artilheiro = ranking.length > 0 ? [...ranking].sort((a, b) => b.gols - a.gols)[0] : null;
  const assistente = ranking.length > 0 ? [...ranking].sort((a, b) => b.assistencias - a.assistencias)[0] : null;

  console.log('Index - Temporada ativa:', temporadaAtiva);
  console.log('Index - Ranking:', ranking);
  console.log('Index - Peladas da temporada:', peladasTemporadaAtiva);

  const quickActions = [
    {
      title: 'Ver Rankings',
      description: 'Classificações e estatísticas',
      icon: Trophy,
      link: '/rankings',
      gradient: 'from-yellow-400 to-orange-500',
      iconColor: 'text-yellow-600',
    },
    {
      title: 'Jogadores',
      description: 'Perfis e desempenho',
      icon: Users,
      link: '/jogadores',
      gradient: 'from-blue-400 to-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Relatórios',
      description: 'Análises detalhadas',
      icon: BarChart3,
      link: '/relatorios',
      gradient: 'from-green-400 to-emerald-500',
      iconColor: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header com gradiente */}
      <div className="text-center space-y-6 py-8 px-4 bg-gradient-to-br from-primary/5 to-blue-50 rounded-3xl border shadow-sm">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Pelada Bravo
          </h1>
        </div>
        <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Sistema completo de gestão e acompanhamento do campeonato amador. 
          Acompanhe rankings, estatísticas e evolução dos jogadores em tempo real.
        </p>
      </div>

      {/* Estatísticas principais com cards melhorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Jogadores Ativos</p>
                <p className="text-3xl font-bold text-blue-600">{jogadoresAtivos.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Na temporada atual</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Peladas Realizadas</p>
                <p className="text-3xl font-bold text-green-600">{peladasTemporadaAtiva.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Nesta temporada</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Total de Gols</p>
                <p className="text-3xl font-bold text-orange-600">{totalGols}</p>
                <p className="text-xs text-muted-foreground mt-1">Na temporada</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-card hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Temporadas</p>
                <p className="text-3xl font-bold text-purple-600">{temporadas.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Total criadas</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Última Pelada com design melhorado */}
      {ultimaPelada && (
        <Card className="gradient-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">Última Pelada Realizada</CardTitle>
                <CardDescription>Pelada mais recente cadastrada no sistema</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold text-lg">{new Date(ultimaPelada.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Trophy className="h-3 w-3" />
                    <span>{temporadas.find(t => t.id === ultimaPelada.temporadaId)?.nome || 'N/A'}</span>
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{ultimaPelada.partidas?.length || 0} partidas</span>
                  </Badge>
                </div>
              </div>
              <Link to={`/pelada/${ultimaPelada.id}`}>
                <Button className="gradient-button hover:scale-105 transition-transform">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destaques da temporada com design premium */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-3">
              <div className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Crown className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">🏆 Líder do Ranking</CardTitle>
            <CardDescription>Primeiro colocado na classificação geral</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {liderRanking ? liderRanking.jogador.nome : 'Aguardando dados'}
              </p>
              {liderRanking && (
                <div className="flex items-center justify-center space-x-2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {liderRanking.pontuacaoTotal} pontos
                  </Badge>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {liderRanking ? 'Dominando a competição!' : 'Sem dados disponíveis'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-3">
              <div className="p-4 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">⚽ Artilheiro</CardTitle>
            <CardDescription>Maior goleador da temporada</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {artilheiro ? artilheiro.jogador.nome : 'Aguardando dados'}
              </p>
              {artilheiro && (
                <div className="flex items-center justify-center space-x-2">
                  <Badge className="bg-gradient-to-r from-red-400 to-red-600 text-white">
                    <Target className="h-3 w-3 mr-1" />
                    {artilheiro.gols} gols
                  </Badge>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {artilheiro ? 'Máquina de fazer gols!' : 'Sem dados disponíveis'}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="text-center pb-3">
            <div className="flex justify-center mb-3">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform">
                <Medal className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">🎯 Rei das Assistências</CardTitle>
            <CardDescription>Quem mais deu assistências</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <p className="text-2xl font-bold text-foreground">
                {assistente ? assistente.jogador.nome : 'Aguardando dados'}
              </p>
              {assistente && (
                <div className="flex items-center justify-center space-x-2">
                  <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {assistente.assistencias} assistências
                  </Badge>
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {assistente ? 'Especialista em passes!' : 'Sem dados disponíveis'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temporada Atual com layout melhorado */}
      {temporadaAtiva && (
        <Card className="gradient-card hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">🏆 Temporada Atual</CardTitle>
                <CardDescription>Informações da temporada ativa</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-xl mb-2 text-primary">{temporadaAtiva.nome}</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Peladas: {peladasTemporadaAtiva.length}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Descartes: {temporadaAtiva.numeroDescartes}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-muted/30 rounded-lg p-4">
                <h4 className="font-semibold mb-3 text-primary">Sistema de Pontuação:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">🏆 Vitória:</span>
                    <Badge variant="secondary">+{temporadaAtiva.pontosVitoria}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-yellow-600">🤝 Empate:</span>
                    <Badge variant="secondary">+{temporadaAtiva.pontosEmpate}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">❌ Derrota:</span>
                    <Badge variant="secondary">+{temporadaAtiva.pontosDerrota}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">📅 Presença:</span>
                    <Badge variant="secondary">+1</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações rápidas com design aprimorado */}
      <Card className="gradient-card hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">⚡ Acesso Rápido</CardTitle>
              <CardDescription>Navegue rapidamente pelas principais seções</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link} className="group">
                  <div className="h-full p-6 rounded-xl border-2 border-muted hover:border-primary/50 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre o sistema com visual moderno */}
      <Card className="gradient-card hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">📊 Sobre o Sistema</CardTitle>
              <CardDescription>Conheça as funcionalidades disponíveis</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary mb-3">🚀 Funcionalidades Principais:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">Rankings automáticos com sistema de descartes</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Gestão completa de jogadores e temporadas</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm">Súmula digital para registro de jogos</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-orange-100 rounded">
                    <BarChart3 className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-sm">Relatórios e estatísticas avançadas</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-red-100 rounded">
                    <Clock className="h-4 w-4 text-red-600" />
                  </div>
                  <span className="text-sm">Controle de presenças e disciplina</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-primary mb-3">👨‍💼 Para Administradores:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-indigo-100 rounded">
                    <Award className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm">Acesso completo ao painel administrativo</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-yellow-100 rounded">
                    <Target className="h-4 w-4 text-yellow-600" />
                  </div>
                  <span className="text-sm">Configuração de regras por temporada</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-green-100 rounded">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">Gestão de jogadores mensalistas e convidados</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-blue-100 rounded">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm">Preenchimento da súmula digital</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-purple-100 rounded">
                    <BarChart3 className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm">Relatórios detalhados de desempenho</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
