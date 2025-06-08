
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Trophy, Users, BarChart3, Target, Calendar, Award } from 'lucide-react';

const Index: React.FC = () => {
  const stats = {
    totalJogadores: 25,
    jogosSemana: 4,
    golsTemporada: 158,
    liderRanking: 'João Silva',
    artilheiro: 'Pedro Santos',
    assistente: 'Carlos Oliveira',
  };

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
        <h1 className="text-4xl font-bold text-foreground">Ranking de Futebol</h1>
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
              <span className="text-3xl font-bold">{stats.totalJogadores}</span>
            </div>
            <p className="text-muted-foreground">Jogadores Ativos</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{stats.jogosSemana}</span>
            </div>
            <p className="text-muted-foreground">Jogos por Semana</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold">{stats.golsTemporada}</span>
            </div>
            <p className="text-muted-foreground">Gols na Temporada</p>
          </CardContent>
        </Card>
      </div>

      {/* Destaques da temporada */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
            <CardTitle>Líder do Ranking</CardTitle>
            <CardDescription>Primeiro colocado na classificação geral</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">{stats.liderRanking}</p>
            <p className="text-sm text-muted-foreground">450 pontos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Target className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <CardTitle>Artilheiro</CardTitle>
            <CardDescription>Maior goleador da temporada</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">{stats.artilheiro}</p>
            <p className="text-sm text-muted-foreground">12 gols</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="text-center">
            <Award className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <CardTitle>Rei das Assistências</CardTitle>
            <CardDescription>Quem mais deu assistências</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-2xl font-bold text-foreground">{stats.assistente}</p>
            <p className="text-sm text-muted-foreground">8 assistências</p>
          </CardContent>
        </Card>
      </div>

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
