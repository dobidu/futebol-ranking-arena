
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Trophy, Target, Users, ArrowLeft, Calendar } from 'lucide-react';
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
        <p className="text-muted-foreground">Jogador não encontrado</p>
      </div>
    );
  }

  // Calcular estatísticas do jogador
  const estatisticasJogador = rankingGeral.find(r => r.jogador.id === jogador.id);
  
  // Calcular histórico por temporadas
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
      assistencias: posicaoJogador?.assistencias || 0
    };
  }).filter(h => h.presencas > 0);

  // Calcular últimas peladas do jogador
  const ultimasPeladas = peladas
    .filter(pelada => pelada.presencas?.some(p => p.jogadorId === jogador.id && p.presente))
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 5)
    .map(pelada => {
      const temporada = temporadas.find(t => t.id === pelada.temporadaId);
      let gols = 0;
      let assistencias = 0;
      let pontos = 1; // Ponto por presença
      
      // Contar gols e assistências
      pelada.partidas?.forEach(partida => {
        const jogadorNoTimeA = partida.timeA?.includes(jogador.id);
        const jogadorNoTimeB = partida.timeB?.includes(jogador.id);
        
        if (jogadorNoTimeA || jogadorNoTimeB) {
          // Calcular pontos da partida
          if (partida.golsTimeA > partida.golsTimeB) {
            pontos += jogadorNoTimeA ? (temporada?.pontosVitoria || 3) : (temporada?.pontosDerrota || 0);
          } else if (partida.golsTimeB > partida.golsTimeA) {
            pontos += jogadorNoTimeB ? (temporada?.pontosVitoria || 3) : (temporada?.pontosDerrota || 0);
          } else {
            pontos += temporada?.pontosEmpate || 1;
          }
        }
        
        partida.eventos?.forEach(evento => {
          if (evento.jogadorId === jogador.id && evento.tipo === 'gol') {
            gols++;
          }
          if (evento.assistidoPor === jogador.id) {
            assistencias++;
          }
        });
      });
      
      return {
        id: pelada.id,
        data: new Date(pelada.data),
        temporada: temporada?.nome || 'N/A',
        pontos: Number(pontos.toFixed(1)),
        status: 'Presente',
        gols,
        assistencias
      };
    });

  const estatisticasGerais = {
    totalPontos: estatisticasJogador?.pontuacaoTotal || 0,
    totalPresencas: estatisticasJogador?.presencas || 0,
    totalGols: estatisticasJogador?.gols || 0,
    totalAssistencias: estatisticasJogador?.assistencias || 0,
    mediaPresenca: ultimasPeladas.length > 0 ? Math.round((ultimasPeladas.length / peladas.length) * 100) : 0,
    temporadasParticipadas: historicoTemporadas.length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/jogadores">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <User className="h-8 w-8 text-primary" />
            <span>{jogador.nome}</span>
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
              {jogador.tipo}
            </Badge>
            <Badge variant={jogador.ativo ? 'default' : 'destructive'}>
              {jogador.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            <span className="text-muted-foreground">
              • Membro desde {new Date(jogador.criadoEm).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pontos</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalPontos}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalGols}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assistências</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalAssistencias}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Presenças</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalPresencas}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico por Temporada */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico por Temporada</CardTitle>
            <CardDescription>Performance em cada temporada participada</CardDescription>
          </CardHeader>
          <CardContent>
            {historicoTemporadas.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Temporada</TableHead>
                    <TableHead className="text-center">Pos.</TableHead>
                    <TableHead className="text-center">Pontos</TableHead>
                    <TableHead className="text-center">Gols</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historicoTemporadas.map((temporada, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link to={`/temporada/${temporada.temporadaId}`} className="hover:underline">
                          {temporada.temporada}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={temporada.posicao <= 3 ? 'default' : 'secondary'}>
                          {temporada.posicao}º
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {temporada.pontos}
                      </TableCell>
                      <TableCell className="text-center">
                        {temporada.gols}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Nenhuma participação em temporadas registrada
              </p>
            )}
          </CardContent>
        </Card>

        {/* Médias e Estatísticas Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Avançadas</CardTitle>
            <CardDescription>Médias e indicadores de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Pontos por Pelada:</span>
              <span className="text-sm font-medium">
                {estatisticasGerais.totalPresencas > 0 ? (estatisticasGerais.totalPontos / estatisticasGerais.totalPresencas).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Gols por Pelada:</span>
              <span className="text-sm font-medium">
                {estatisticasGerais.totalPresencas > 0 ? (estatisticasGerais.totalGols / estatisticasGerais.totalPresencas).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Assistências:</span>
              <span className="text-sm font-medium">
                {estatisticasGerais.totalPresencas > 0 ? (estatisticasGerais.totalAssistencias / estatisticasGerais.totalPresencas).toFixed(1) : '0.0'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Presença:</span>
              <span className="text-sm font-medium">{estatisticasGerais.mediaPresenca}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Temporadas Participadas:</span>
              <span className="text-sm font-medium">{estatisticasGerais.temporadasParticipadas}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Peladas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Peladas</CardTitle>
          <CardDescription>Performance nas peladas mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          {ultimasPeladas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Temporada</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Pontos</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                  <TableHead className="text-center">Assistências</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimasPeladas.map((pelada) => (
                  <TableRow key={pelada.id}>
                    <TableCell>
                      {pelada.data.toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {pelada.temporada}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default">
                        {pelada.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {pelada.pontos}
                    </TableCell>
                    <TableCell className="text-center">
                      {pelada.gols}
                    </TableCell>
                    <TableCell className="text-center">
                      {pelada.assistencias}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link to={`/pelada/${pelada.id}`}>
                        <Button variant="outline" size="sm">
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
