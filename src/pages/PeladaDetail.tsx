
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users, ArrowLeft, Target, Edit, Clock, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { peladaService, temporadaService, jogadorService } from '@/services/dataService';

const PeladaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin/');

  const { data: pelada } = useQuery({
    queryKey: ['pelada', id],
    queryFn: () => peladaService.getById(id!),
    enabled: !!id,
  });

  const { data: temporada } = useQuery({
    queryKey: ['temporada', pelada?.temporadaId],
    queryFn: () => temporadaService.getById(pelada?.temporadaId!),
    enabled: !!pelada?.temporadaId,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  if (!pelada) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Pelada não encontrada</p>
      </div>
    );
  }

  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
  };

  const calcularEstatisticas = () => {
    let totalGols = 0;
    let cartoes = 0;
    let totalPartidas = pelada.partidas?.length || 0;
    
    pelada.partidas?.forEach(partida => {
      totalGols += partida.placarA + partida.placarB;
      partida.eventos?.forEach(evento => {
        if (evento.tipo !== 'gol') cartoes++;
      });
    });

    // Calcular jogadores presentes de forma mais robusta
    let jogadoresPresentes = 0;
    if (pelada.jogadoresPresentes) {
      jogadoresPresentes = pelada.jogadoresPresentes.filter(j => j.presente).length;
    } else if (pelada.presencas) {
      jogadoresPresentes = pelada.presencas.filter(p => p.presente).length;
    } else if (pelada.times) {
      // Se não temos dados de presença, contar jogadores únicos nos times
      const jogadoresUnicos = new Set();
      pelada.times.forEach(time => {
        time.jogadores.forEach(jogadorId => jogadoresUnicos.add(jogadorId));
      });
      jogadoresPresentes = jogadoresUnicos.size;
    }

    return { 
      totalGols, 
      cartoes, 
      totalPartidas,
      jogadoresPresentes
    };
  };

  const stats = calcularEstatisticas();

  const getEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return <Target className="h-4 w-4 text-green-600" />;
      case 'cartao_amarelo':
        return <div className="w-4 h-4 bg-yellow-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>;
      case 'cartao_azul':
        return <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>;
      case 'cartao_vermelho':
        return <div className="w-4 h-4 bg-red-500 rounded-sm flex items-center justify-center">
          <Shield className="h-2 w-2 text-white" />
        </div>;
      default:
        return null;
    }
  };

  const getEventoTexto = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return 'Gol';
      case 'cartao_amarelo':
        return 'Cartão Amarelo';
      case 'cartao_azul':
        return 'Cartão Azul';
      case 'cartao_vermelho':
        return 'Cartão Vermelho';
      default:
        return tipo;
    }
  };

  // Função para obter times da pelada de forma mais robusta
  const getTimesFromPelada = () => {
    if (pelada.times && pelada.times.length > 0) {
      return pelada.times;
    }
    
    // Se não temos times diretos, tentar extrair dos partidas
    if (pelada.partidas && pelada.partidas.length > 0) {
      const timesMap = new Map();
      
      pelada.partidas.forEach(partida => {
        // Criar times baseados nas partidas
        if (partida.timeA && partida.timeA.length > 0) {
          const timeAKey = partida.timeA.sort().join(',');
          if (!timesMap.has(timeAKey)) {
            timesMap.set(timeAKey, {
              id: `time-a-${timesMap.size}`,
              peladaId: pelada.id,
              identificadorLetra: String.fromCharCode(65 + timesMap.size), // A, B, C...
              jogadores: partida.timeA
            });
          }
        }
        
        if (partida.timeB && partida.timeB.length > 0) {
          const timeBKey = partida.timeB.sort().join(',');
          if (!timesMap.has(timeBKey)) {
            timesMap.set(timeBKey, {
              id: `time-b-${timesMap.size}`,
              peladaId: pelada.id,
              identificadorLetra: String.fromCharCode(65 + timesMap.size), // A, B, C...
              jogadores: partida.timeB
            });
          }
        }
      });
      
      return Array.from(timesMap.values());
    }
    
    return [];
  };

  const timesDisponiveis = getTimesFromPelada();

  const backUrl = isAdminRoute ? `/admin/temporadas/${pelada.temporadaId}` : `/temporada/${pelada.temporadaId}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={backUrl}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span>Pelada - {new Date(pelada.data).toLocaleDateString('pt-BR')}</span>
          </h1>
          <p className="text-muted-foreground">
            Temporada {temporada?.nome} • {stats.totalPartidas} partida{stats.totalPartidas !== 1 ? 's' : ''} realizada{stats.totalPartidas !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdminRoute && (
          <Link to={`/admin/peladas/editar/${pelada.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
        )}
      </div>

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jogadores</p>
                <p className="text-2xl font-bold">{stats.jogadoresPresentes}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Partidas</p>
                <p className="text-2xl font-bold">{stats.totalPartidas}</p>
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
                <p className="text-2xl font-bold">{stats.totalGols}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cartões</p>
                <p className="text-2xl font-bold">{stats.cartoes}</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Times */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Times da Pelada</span>
            </CardTitle>
            <CardDescription>Composição dos times ({timesDisponiveis.length} times registrados)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timesDisponiveis.map(time => (
                <div key={time.id} className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-purple-50">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-lg font-semibold px-3 py-1">
                      Time {time.identificadorLetra}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {time.jogadores.length} jogadores
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {time.jogadores.map((jogadorId, index) => (
                      <div key={index} className="text-sm bg-white px-2 py-1 rounded border">
                        <Link to={`/jogador/${jogadorId}`} className="hover:underline text-blue-600">
                          {getJogadorNome(jogadorId)}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {timesDisponiveis.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Nenhum time registrado</p>
                  <p className="text-sm text-muted-foreground">Os times aparecerão quando as partidas forem criadas</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Partidas e Resultados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span>Partidas e Resultados</span>
            </CardTitle>
            <CardDescription>Jogos realizados na pelada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pelada.partidas?.map((partida, index) => {
                // Encontrar times correspondentes
                const timeA = timesDisponiveis.find(t => 
                  t.jogadores.length === partida.timeA.length && 
                  t.jogadores.every(j => partida.timeA.includes(j))
                );
                const timeB = timesDisponiveis.find(t => 
                  t.jogadores.length === partida.timeB.length && 
                  t.jogadores.every(j => partida.timeB.includes(j))
                );
                
                const timeALetra = timeA?.identificadorLetra || 'A';
                const timeBLetra = timeB?.identificadorLetra || 'B';
                
                return (
                  <div key={partida.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="mb-2">
                        Partida {index + 1}
                      </Badge>
                      <div className="text-2xl font-bold flex items-center justify-center space-x-4">
                        <span className="bg-blue-100 px-3 py-1 rounded">Time {timeALetra}</span>
                        <span className="text-3xl">{partida.placarA}</span>
                        <span className="text-muted-foreground">x</span>
                        <span className="text-3xl">{partida.placarB}</span>
                        <span className="bg-purple-100 px-3 py-1 rounded">Time {timeBLetra}</span>
                      </div>
                    </div>
                    
                    {partida.eventos && partida.eventos.length > 0 && (
                      <div className="bg-white rounded-lg p-3 border">
                        <h4 className="font-medium text-sm mb-3 flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          Eventos da Partida ({partida.eventos.length})
                        </h4>
                        <div className="space-y-2">
                          {partida.eventos.map((evento, eventIndex) => (
                            <div key={eventIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center space-x-3">
                                {getEventoIcon(evento.tipo)}
                                <div>
                                  <span className="font-medium text-sm">
                                    <Link to={`/jogador/${evento.jogadorId}`} className="hover:underline text-blue-600">
                                      {getJogadorNome(evento.jogadorId)}
                                    </Link>
                                  </span>
                                  {evento.assistidoPor && (
                                    <div className="text-xs text-muted-foreground">
                                      Assistência: <Link to={`/jogador/${evento.assistidoPor}`} className="hover:underline text-blue-600">
                                        {getJogadorNome(evento.assistidoPor)}
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {getEventoTexto(evento.tipo)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {(!pelada.partidas || pelada.partidas.length === 0) && (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">Nenhuma partida registrada</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jogadores da Pelada */}
      {stats.jogadoresPresentes > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Jogadores da Pelada</span>
            </CardTitle>
            <CardDescription>Lista completa dos jogadores presentes ({stats.jogadoresPresentes} jogadores)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {/* Exibir jogadores presentes */}
              {pelada.jogadoresPresentes ? 
                pelada.jogadoresPresentes.filter(j => j.presente).map((jogadorPresente, index) => (
                  <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                    <Link to={`/jogador/${jogadorPresente.id}`} className="hover:underline">
                      <div className="font-medium text-sm">{jogadorPresente.nome}</div>
                      <Badge variant="default" className="text-xs mt-1">
                        {jogadorPresente.tipo}
                      </Badge>
                    </Link>
                  </div>
                )) :
                pelada.presencas?.filter(p => p.presente).map((presenca, index) => {
                  const jogador = jogadores.find(j => j.id === presenca.jogadorId);
                  return (
                    <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                      <Link to={`/jogador/${presenca.jogadorId}`} className="hover:underline">
                        <div className="font-medium text-sm">{jogador?.nome || 'Jogador não encontrado'}</div>
                        <Badge variant="default" className="text-xs mt-1">
                          Presente{presenca.atraso !== 'nenhum' && ` (${presenca.atraso})`}
                        </Badge>
                      </Link>
                    </div>
                  );
                })
              }
              
              {/* Se não há dados de presença, exibir jogadores dos times */}
              {!pelada.jogadoresPresentes && !pelada.presencas && timesDisponiveis.length > 0 && (
                (() => {
                  const jogadoresUnicos = new Set();
                  timesDisponiveis.forEach(time => {
                    time.jogadores.forEach(jogadorId => jogadoresUnicos.add(jogadorId));
                  });
                  return Array.from(jogadoresUnicos).map((jogadorId, index) => {
                    const jogador = jogadores.find(j => j.id === jogadorId);
                    return (
                      <div key={index} className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                        <Link to={`/jogador/${jogadorId}`} className="hover:underline">
                          <div className="font-medium text-sm">{jogador?.nome || 'Jogador não encontrado'}</div>
                          <Badge variant="default" className="text-xs mt-1">
                            {jogador?.tipo || 'Tipo não definido'}
                          </Badge>
                        </Link>
                      </div>
                    );
                  });
                })()
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PeladaDetail;
