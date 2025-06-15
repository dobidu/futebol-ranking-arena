
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Trophy, Target, Users, ArrowLeft, Calendar, TrendingUp, Award, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { jogadorService, peladaService, temporadaService, calcularRanking } from '@/services/dataService';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: jogador } = useQuery({
    queryKey: ['jogador', id],
    queryFn: () => jogadorService.getById(id!),
    enabled: !!id,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: rankingGeral = [] } = useQuery({
    queryKey: ['ranking-geral'],
    queryFn: () => calcularRanking(),
  });

  if (!jogador) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Jogador não encontrado</p>
        </div>
      </div>
    );
  }

  const estatisticasJogador = rankingGeral.find(r => r.jogador.id === jogador.id);
  
  // Calcular histórico por temporada
  const historicoTemporadas = temporadas.map(temporada => {
    const rankingTemporada = calcularRanking(temporada.id);
    const posicaoJogador = rankingTemporada.find(r => r.jogador.id === jogador.id);
    
    return {
      temporada: temporada.nome,
      temporadaId: temporada.id,
      posicao: posicaoJogador?.posicao || 0,
      pontos: posicaoJogador?.pontuacaoTotal || 0,
      presencas: posicaoJogador?.presencas || 0,
      gols: posicaoJogador?.gols || 0,
      assistencias: posicaoJogador?.assistencias || 0,
      vitorias: posicaoJogador?.vitorias || 0
    };
  }).filter(h => h.presencas > 0);

  // Calcular peladas do jogador
  const peladasDoJogador = peladas
    .filter(pelada => {
      return pelada.presencas?.some(p => p.jogadorId === jogador.id && p.presente) ||
             pelada.jogadoresPresentes?.some(jp => jp.id === jogador.id && jp.presente);
    })
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const ultimasPeladas = peladasDoJogador.slice(0, 5).map(pelada => {
    const temporada = temporadas.find(t => t.id === pelada.temporadaId);
    let gols = 0;
    let assistencias = 0;
    let pontos = 1; // Ponto base por presença
    let vitorias = 0;
    
    pelada.partidas?.forEach(partida => {
      const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
      const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
      
      if (jogadorNoTimeA || jogadorNoTimeB) {
        // Calcular pontos da partida
        if (partida.golsTimeA > partida.golsTimeB) {
          if (jogadorNoTimeA) {
            pontos += temporada?.pontosVitoria || 3;
            vitorias++;
          } else {
            pontos += temporada?.pontosDerrota || 0;
          }
        } else if (partida.golsTimeB > partida.golsTimeA) {
          if (jogadorNoTimeB) {
            pontos += temporada?.pontosVitoria || 3;
            vitorias++;
          } else {
            pontos += temporada?.pontosDerrota || 0;
          }
        } else {
          pontos += temporada?.pontosEmpate || 1;
        }
      }
      
      // Contar gols e assistências
      partida.eventos?.forEach(evento => {
        if (evento.jogadorId === jogador.id && evento.tipo === 'gol') {
          gols++;
        }
        if (evento.assistidoPor === jogador.id) {
          assistencias++;
        }
      });
    });
    
    // Calcular penalidades de atraso
    const presenca = pelada.presencas?.find(p => p.jogadorId === jogador.id);
    if (presenca) {
      if (presenca.atraso === 'tipo1') {
        pontos += temporada?.penalidadeAtraso1 || -1;
      } else if (presenca.atraso === 'tipo2') {
        pontos += temporada?.penalidadeAtraso2 || -2;
      }
    }
    
    return {
      id: pelada.id,
      data: new Date(pelada.data),
      temporada: temporada?.nome || 'N/A',
      pontos: Number(pontos.toFixed(1)),
      status: 'Presente',
      gols,
      assistencias,
      vitorias: vitorias > 0
    };
  });

  // Estatísticas gerais melhoradas
  const estatisticasGerais = {
    totalPontos: estatisticasJogador?.pontuacaoTotal || 0,
    totalPresencas: estatisticasJogador?.presencas || 0,
    totalGols: estatisticasJogador?.gols || 0,
    totalAssistencias: estatisticasJogador?.assistencias || 0,
    totalVitorias: estatisticasJogador?.vitorias || 0,
    posicaoAtual: estatisticasJogador?.posicao || 0,
    mediaPresenca: peladas.length > 0 ? Math.round((peladasDoJogador.length / peladas.length) * 100) : 0,
    temporadasParticipadas: historicoTemporadas.length,
    mediaPontosPorPelada: estatisticasJogador?.presencas > 0 ? (estatisticasJogador.pontuacaoTotal / estatisticasJogador.presencas) : 0,
    mediaGolsPorPelada: estatisticasJogador?.presencas > 0 ? (estatisticasJogador.gols / estatisticasJogador.presencas) : 0,
    percentualVitorias: estatisticasJogador?.presencas > 0 ? (estatisticasJogador.vitorias / estatisticasJogador.presencas * 100) : 0
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
        <Link to="/jogadores">
          <Button variant="outline" size="sm" className="shadow-sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <span>{jogador.nome}</span>
            {estatisticasGerais.posicaoAtual > 0 && estatisticasGerais.posicaoAtual <= 3 && (
              <Badge variant="default" className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                <Trophy className="h-3 w-3 mr-1" />
                {estatisticasGerais.posicaoAtual}º lugar
              </Badge>
            )}
          </h1>
          <div className="flex items-center space-x-3 mt-2">
            <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'} className="font-medium">
              {jogador.tipo}
            </Badge>
            <Badge variant={jogador.ativo ? 'default' : 'destructive'}>
              {jogador.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            <span className="text-muted-foreground flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Membro desde {new Date(jogador.criadoEm).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gradient-card border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pontos</p>
                <p className="text-3xl font-bold text-blue-600">{estatisticasGerais.totalPontos}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Média: {estatisticasGerais.mediaPontosPorPelada.toFixed(1)}/pelada
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                <p className="text-3xl font-bold text-green-600">{estatisticasGerais.totalGols}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Média: {estatisticasGerais.mediaGolsPorPelada.toFixed(1)}/pelada
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-l-4 border-l-purple-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assistências</p>
                <p className="text-3xl font-bold text-purple-600">{estatisticasGerais.totalAssistencias}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Em {estatisticasGerais.totalPresencas} peladas
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="gradient-card border-l-4 border-l-orange-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Taxa de Vitória</p>
                <p className="text-3xl font-bold text-orange-600">{estatisticasGerais.percentualVitorias.toFixed(0)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {estatisticasGerais.totalVitorias} vitórias
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico por Temporada */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <span>Histórico por Temporada</span>
            </CardTitle>
            <CardDescription>Performance detalhada em cada temporada</CardDescription>
          </CardHeader>
          <CardContent>
            {historicoTemporadas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Temporada</TableHead>
                    <TableHead className="text-center">Pos.</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                    <TableHead className="text-center">Vit.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoTemporadas.map((temporada, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
                      <TableCell>
                        <Link 
                          to={`/temporada/${temporada.temporadaId}`} 
                          className="hover:underline font-medium text-primary"
                        >
                          {temporada.temporada}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge 
                          variant={temporada.posicao <= 3 ? 'default' : 'secondary'}
                          className={temporada.posicao <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : ''}
                        >
                          {temporada.posicao}º
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-bold">
                        {temporada.pontos}
                      </TableCell>
                      <TableCell className="text-center text-green-600 font-medium">
                        {temporada.gols}
                      </TableCell>
                      <TableCell className="text-center text-blue-600 font-medium">
                        {temporada.vitorias}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium text-muted-foreground">Nenhuma participação registrada</p>
                <p className="text-sm text-muted-foreground">As temporadas aparecerão aqui quando o jogador participar</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Estatísticas Avançadas */}
        <Card className="gradient-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Estatísticas Avançadas</span>
            </CardTitle>
            <CardDescription>Indicadores detalhados de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Presença Total</div>
                <div className="text-xl font-bold text-blue-600">{estatisticasGerais.totalPresencas}</div>
                <div className="text-xs text-muted-foreground">de {peladas.length} peladas</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Taxa de Presença</div>
                <div className="text-xl font-bold text-green-600">{estatisticasGerais.mediaPresenca}%</div>
                <div className="text-xs text-muted-foreground">frequência</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Temporadas</div>
                <div className="text-xl font-bold text-purple-600">{estatisticasGerais.temporadasParticipadas}</div>
                <div className="text-xs text-muted-foreground">participadas</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Posição Atual</div>
                <div className="text-xl font-bold text-orange-600">
                  {estatisticasGerais.posicaoAtual > 0 ? `${estatisticasGerais.posicaoAtual}º` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground">no ranking</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Peladas */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Últimas Peladas</span>
          </CardTitle>
          <CardDescription>Performance nas peladas mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {ultimasPeladas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead className="text-center">Pontos</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                  <TableHead className="text-center">Assists</TableHead>
                  <TableHead className="text-center">Resultado</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasPeladas.map((pelada) => (
                  <TableRow key={pelada.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {pelada.data.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {pelada.temporada}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="font-bold">
                        {pelada.pontos}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-green-600 font-medium">{pelada.gols}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-blue-600 font-medium">{pelada.assistencias}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={pelada.vitorias ? 'default' : 'secondary'}>
                        {pelada.vitorias ? 'Vitória' : 'Outros'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/pelada/${pelada.id}`}>
                        <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhuma pelada registrada</p>
              <p className="text-sm text-muted-foreground">As peladas aparecerão aqui quando o jogador participar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProfile;
