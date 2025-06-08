
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Trophy, Users, ArrowLeft, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService, calcularRanking } from '@/services/dataService';

const SeasonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: temporada } = useQuery({
    queryKey: ['temporada', id],
    queryFn: () => temporadaService.getById(id!),
    enabled: !!id,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas-temporada', id],
    queryFn: peladaService.getAll,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-temporada', id],
    queryFn: () => calcularRanking(id),
    enabled: !!id,
  });

  if (!temporada) {
    return <div>Temporada não encontrada</div>;
  }

  const peladasTemporada = peladas.filter(p => p.temporadaId === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/temporadas">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span>Temporada {temporada.nome}</span>
            {temporada.ativa && <Badge variant="default">Ativa</Badge>}
          </h1>
          <p className="text-muted-foreground">
            Criada em {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configurações da Temporada */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Regras de pontuação da temporada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Vitória:</span>
              <span className="text-sm font-medium">{temporada.pontosVitoria} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Empate:</span>
              <span className="text-sm font-medium">{temporada.pontosEmpate} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Derrota:</span>
              <span className="text-sm font-medium">{temporada.pontosDerrota} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Atraso Tipo 1:</span>
              <span className="text-sm font-medium">{temporada.penalidadeAtraso1} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Cartão Amarelo:</span>
              <span className="text-sm font-medium">{temporada.penalidadeCartaoAmarelo} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Descartes:</span>
              <span className="text-sm font-medium">{temporada.numeroDescartes}</span>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas</CardTitle>
            <CardDescription>Resumo da temporada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total de Peladas:</span>
              <span className="text-sm font-medium">{peladasTemporada.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Jogadores Ativos:</span>
              <span className="text-sm font-medium">{ranking.length}</span>
            </div>
          </CardContent>
        </Card>

        {/* Últimas Peladas */}
        <Card>
          <CardHeader>
            <CardTitle>Últimas Peladas</CardTitle>
            <CardDescription>Peladas mais recentes</CardDescription>
          </CardHeader>
          <CardContent>
            {peladasTemporada.slice(-3).reverse().map(pelada => (
              <Link key={pelada.id} to={`/pelada/${pelada.id}`}>
                <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <PlayCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">{new Date(pelada.data).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </Link>
            ))}
            {peladasTemporada.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma pelada registrada</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ranking da Temporada */}
      <Card>
        <CardHeader>
          <CardTitle>Ranking da Temporada</CardTitle>
          <CardDescription>Classificação atual dos jogadores</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Pos.</TableHead>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
                <TableHead className="text-center">Presenças</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Assistências</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.map((item) => (
                <TableRow key={item.jogador.id}>
                  <TableCell className="font-medium">
                    {item.posicao}º
                  </TableCell>
                  <TableCell>
                    <Link to={`/jogador/${item.jogador.id}`} className="hover:underline">
                      {item.jogador.nome}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.pontuacaoTotal}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.presencas}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.gols}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.assistencias}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {ranking.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhum dado de ranking</p>
              <p className="text-sm text-muted-foreground">Os dados aparecerão após as primeiras peladas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Todas as Peladas */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Peladas</CardTitle>
          <CardDescription>Histórico completo de peladas da temporada</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peladasTemporada.map(pelada => (
              <Link key={pelada.id} to={`/pelada/${pelada.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">
                          {new Date(pelada.data).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          
          {peladasTemporada.length === 0 && (
            <div className="text-center py-8">
              <PlayCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhuma pelada registrada</p>
              <p className="text-sm text-muted-foreground">As peladas aparecerão aqui quando forem criadas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonDetail;
