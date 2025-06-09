
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Users, BarChart3, Target, Calendar, Award } from 'lucide-react';
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
      description: 'Confira as classificações atuais',
      icon: Trophy,
      link: '/rankings',
      color: 'bg-yellow-500',
    },
    {
      title: 'Jogadores',
      description: 'Explore perfis e estatísticas',
      icon: Users,
      link: '/jogadores',
      color: 'bg-blue-500',
    },
    {
      title: 'Relatórios',
      description: 'Análises detalhadas',
      icon: BarChart3,
      link: '/relatorios',
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">Pelada Bravo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema completo de gestão e acompanhamento do campeonato amador. 
          Acompanhe rankings, estatísticas e evolução dos jogadores.
        </p>
      </div>

      {/* Estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{jogadoresAtivos.length}</span>
            </div>
            <p className="text-muted-foreground">Jogadores Ativos</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{peladasTemporadaAtiva.length}</span>
            </div>
            <p className="text-muted-foreground">Peladas na Temporada</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{totalGols}</span>
            </div>
            <p className="text-muted-foreground">Gols na Temporada</p>
          </CardContent>
        </Card>
      </div>

      {/* Última Pelada */}
      {ultimaPelada && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Última Pelada</span>
            </CardTitle>
            <CardDescription>Pelada mais recente cadastrada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{new Date(ultimaPelada.data).toLocaleDateString('pt-BR')}</p>
                <p className="text-sm text-muted-foreground">
                  Temporada: {temporadas.find(t => t.id === ultimaPelada.temporadaId)?.nome || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Partidas: {ultimaPelada.partidas?.length || 0}
                </p>
              </div>
              <Link to={`/pelada/${ultimaPelada.id}`}>
                <Button variant="outline">Ver Detalhes</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Destaques da temporada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Líder do Ranking</CardTitle>
            <CardDescription>Primeiro colocado na classificação geral</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {liderRanking ? liderRanking.jogador.nome : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {liderRanking ? `${liderRanking.pontuacaoTotal} pontos` : 'Sem dados disponíveis'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Target className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle>Artilheiro</CardTitle>
            <CardDescription>Maior goleador da temporada</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {artilheiro ? artilheiro.jogador.nome : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {artilheiro ? `${artilheiro.gols} gols` : 'Sem dados disponíveis'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Award className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>Rei das Assistências</CardTitle>
            <CardDescription>Quem mais deu assistências</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {assistente ? assistente.jogador.nome : 'N/A'}
            </p>
            <p className="text-sm text-muted-foreground">
              {assistente ? `${assistente.assistencias} assistências` : 'Sem dados disponíveis'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Temporada Atual */}
      {temporadaAtiva && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Temporada Atual</span>
            </CardTitle>
            <CardDescription>Informações da temporada ativa</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">{temporadaAtiva.nome}</h3>
                <p className="text-sm text-muted-foreground">
                  Peladas realizadas: {peladasTemporadaAtiva.length}
                </p>
                <p className="text-sm text-muted-foreground">
                  Descartes permitidos: {temporadaAtiva.numeroDescartes}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Pontuação:</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Vitória:</span>
                    <span>{temporadaAtiva.pontosVitoria} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empate:</span>
                    <span>{temporadaAtiva.pontosEmpate} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Derrota:</span>
                    <span>{temporadaAtiva.pontosDerrota} pts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acesso Rápido</CardTitle>
          <CardDescription>Navegue rapidamente pelas principais seções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link}>
                  <Button 
                    variant="outline" 
                    className="w-full h-auto p-6 flex flex-col items-center space-y-3 hover:shadow-lg transition-all"
                  >
                    <div className={`p-3 rounded-full ${action.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Informações sobre o sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Funcionalidades Principais:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Rankings automáticos com sistema de descartes</li>
                <li>• Gestão completa de jogadores e temporadas</li>
                <li>• Súmula digital para registro de jogos</li>
                <li>• Relatórios e estatísticas avançadas</li>
                <li>• Controle de presenças e disciplina</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-foreground">Para Administradores:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Acesso completo ao painel administrativo</li>
                <li>• Configuração de regras por temporada</li>
                <li>• Gestão de jogadores mensalistas e convidados</li>
                <li>• Preenchimento da súmula digital</li>
                <li>• Relatórios detalhados de desempenho</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
