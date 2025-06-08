
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, PieChart, TrendingUp, Award } from 'lucide-react';

const Reports: React.FC = () => {
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
                    <p className="text-2xl font-bold">158</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Média por Jogo</p>
                    <p className="text-2xl font-bold">6.3</p>
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
                    <p className="text-2xl font-bold">25</p>
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
                  {[
                    { nome: 'Pedro Santos', gols: 12, media: 0.67 },
                    { nome: 'João Silva', gols: 8, media: 0.40 },
                    { nome: 'Carlos Oliveira', gols: 6, media: 0.38 },
                    { nome: 'Ana Costa', gols: 4, media: 0.21 },
                    { nome: 'Bruno Lima', gols: 3, media: 0.38 },
                  ].map((player, index) => (
                    <div key={player.nome} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        <span className="font-medium">{player.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{player.gols} gols</p>
                        <p className="text-sm text-muted-foreground">{player.media} por jogo</p>
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
                  {[
                    { nome: 'Carlos Oliveira', assistencias: 8, media: 0.50 },
                    { nome: 'Ana Costa', gols: 6, media: 0.32 },
                    { nome: 'João Silva', assistencias: 5, media: 0.25 },
                    { nome: 'Pedro Santos', assistencias: 3, media: 0.17 },
                    { nome: 'Maria Santos', assistencias: 2, media: 0.18 },
                  ].map((player, index) => (
                    <div key={player.nome} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                        <span className="font-medium">{player.nome}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{player.assistencias} assists</p>
                        <p className="text-sm text-muted-foreground">{player.media} por jogo</p>
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
              <CardTitle>Relatório de Disciplina</CardTitle>
              <CardDescription>Estatísticas de cartões e punições</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Relatório em desenvolvimento</p>
                <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parcerias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Parcerias</CardTitle>
              <CardDescription>Duplas que mais pontuaram juntas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Relatório em desenvolvimento</p>
                <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Evolução</CardTitle>
              <CardDescription>Evolução dos jogadores ao longo da temporada</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Gráficos em desenvolvimento</p>
                <p className="text-sm text-muted-foreground">Esta funcionalidade será implementada em breve</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
