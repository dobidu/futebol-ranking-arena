
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Trophy, Calendar, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService, calcularRanking } from '@/services/dataService';

const AdminDashboard: React.FC = () => {
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking'],
    queryFn: () => calcularRanking(),
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);
  const peladasTemporadaAtiva = peladas.filter(p => p.temporadaId === temporadaAtiva?.id);
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const jogadoresMensalistas = jogadores.filter(j => j.tipo === 'Mensalista' && j.ativo);
  const jogadoresConvidados = jogadores.filter(j => j.tipo === 'Convidado' && j.ativo);

  // Calcular estatísticas baseadas nos dados reais
  const totalGols = ranking.reduce((acc, r) => acc + r.gols, 0);
  const totalCartoes = ranking.reduce((acc, r) => acc + r.cartoesAmarelos + r.cartoesAzuis + r.cartoesVermelhos, 0);
  const artilheiro = ranking.sort((a, b) => b.gols - a.gols)[0];
  const liderRanking = ranking[0];

  const estatisticasGerais = [
    {
      titulo: 'Temporadas',
      valor: temporadas.length,
      descricao: `${temporadas.filter(t => t.ativa).length} ativa(s)`,
      icon: Trophy,
      cor: 'text-yellow-600'
    },
    {
      titulo: 'Jogadores Ativos',
      valor: jogadoresAtivos.length,
      descricao: `${jogadoresMensalistas.length} mensalistas, ${jogadoresConvidados.length} convidados`,
      icon: Users,
      cor: 'text-blue-600'
    },
    {
      titulo: 'Peladas na Temporada',
      valor: peladasTemporadaAtiva.length,
      descricao: temporadaAtiva ? `Temporada ${temporadaAtiva.nome}` : 'Nenhuma temporada ativa',
      icon: Calendar,
      cor: 'text-green-600'
    },
    {
      titulo: 'Gols na Temporada',
      valor: totalGols,
      descricao: artilheiro ? `Artilheiro: ${artilheiro.jogador.nome} (${artilheiro.gols} gols)` : 'Sem dados',
      icon: Target,
      cor: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Painel Administrativo</h1>
        <p className="text-muted-foreground">Visão geral do sistema Pelada Bravo</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {estatisticasGerais.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.titulo}</p>
                    <p className="text-2xl font-bold">{stat.valor}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.descricao}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.cor}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Ranking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Top 5 Ranking Geral</span>
            </CardTitle>
            <CardDescription>
              Classificação atual da temporada {temporadaAtiva?.nome || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Jogador</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Pontos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ranking.slice(0, 5).map((item) => (
                  <TableRow key={item.jogador.id}>
                    <TableCell className="font-medium">{item.posicao}</TableCell>
                    <TableCell>{item.jogador.nome}</TableCell>
                    <TableCell>
                      <Badge variant={item.jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                        {item.jogador.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.pontuacaoTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estatísticas da Temporada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Estatísticas da Temporada</span>
            </CardTitle>
            <CardDescription>
              Dados consolidados da temporada {temporadaAtiva?.nome || 'N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{totalGols}</p>
                <p className="text-sm text-muted-foreground">Total de Gols</p>
              </div>
              <div className="text-center p-4 bg-accent/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{totalCartoes}</p>
                <p className="text-sm text-muted-foreground">Total de Cartões</p>
              </div>
            </div>

            {artilheiro && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Artilheiro da Temporada</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{artilheiro.jogador.nome}</span>
                  <Badge variant="outline">{artilheiro.gols} gols</Badge>
                </div>
              </div>
            )}

            {liderRanking && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Líder do Ranking</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{liderRanking.jogador.nome}</span>
                  <Badge variant="outline">{liderRanking.pontuacaoTotal} pontos</Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo das Últimas Peladas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Últimas Peladas</span>
          </CardTitle>
          <CardDescription>
            Histórico recente de peladas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Temporada</TableHead>
                <TableHead>Jogadores</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peladas.slice(-5).reverse().map((pelada) => (
                <TableRow key={pelada.id}>
                  <TableCell>
                    {new Date(pelada.data).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {temporadas.find(t => t.id === pelada.temporadaId)?.nome || 'N/A'}
                  </TableCell>
                  <TableCell>6 jogadores</TableCell>
                  <TableCell>
                    <Badge variant="default">Concluída</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alertas e Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <span>Alertas do Sistema</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!temporadaAtiva && (
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Nenhuma temporada está ativa no momento</span>
              </div>
            )}
            
            {jogadoresAtivos.length === 0 && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Nenhum jogador ativo cadastrado</span>
              </div>
            )}

            {temporadaAtiva && peladasTemporadaAtiva.length === 0 && (
              <div className="flex items-center space-x-2 text-blue-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Temporada ativa não possui peladas cadastradas</span>
              </div>
            )}

            {jogadoresAtivos.length > 0 && temporadaAtiva && peladasTemporadaAtiva.length > 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <Trophy className="h-4 w-4" />
                <span className="text-sm">Sistema funcionando normalmente</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
