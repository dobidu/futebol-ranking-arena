
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Target, Clock } from 'lucide-react';
import { PartidaPelada, TimeNaPelada, Jogador } from '@/types';
import EventIcon from './EventIcon';

interface PeladaMatchesProps {
  partidas: PartidaPelada[];
  times: TimeNaPelada[];
  jogadores: Jogador[];
}

const PeladaMatches: React.FC<PeladaMatchesProps> = ({ partidas, times, jogadores }) => {
  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
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

  const getEventosPorTipo = (eventos: any[], tipo: string) => {
    return eventos.filter(e => e.tipo === tipo);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-primary" />
          <span>Partidas e Resultados</span>
        </CardTitle>
        <CardDescription>Detalhes completos dos jogos realizados na pelada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {partidas?.map((partida, index) => {
            console.log('PeladaMatches - Renderizando partida:', partida);
            console.log('PeladaMatches - Eventos da partida:', partida.eventos);
            
            const timeA = times.find(t => 
              t.jogadores.length === partida.timeA.length && 
              t.jogadores.every(j => partida.timeA.includes(j))
            );
            const timeB = times.find(t => 
              t.jogadores.length === partida.timeB.length && 
              t.jogadores.every(j => partida.timeB.includes(j))
            );
            
            const timeALetra = timeA?.identificadorLetra || 'A';
            const timeBLetra = timeB?.identificadorLetra || 'B';
            
            const placarA = partida.placarA || 0;
            const placarB = partida.placarB || 0;
            
            // Garantir que todos os eventos sejam exibidos
            const todosEventos = partida.eventos || [];
            const gols = getEventosPorTipo(todosEventos, 'gol');
            const cartoesAmarelos = getEventosPorTipo(todosEventos, 'cartao_amarelo');
            const cartoesAzuis = getEventosPorTipo(todosEventos, 'cartao_azul');
            const cartoesVermelhos = getEventosPorTipo(todosEventos, 'cartao_vermelho');
            
            return (
              <div key={partida.id} className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="text-center mb-6">
                  <Badge variant="outline" className="mb-3 text-lg font-semibold">
                    Partida {index + 1}
                  </Badge>
                  <div className="text-3xl font-bold flex items-center justify-center space-x-4 mb-4">
                    <span className="bg-blue-100 px-4 py-2 rounded-lg">Time {timeALetra}</span>
                    <span className="text-4xl text-blue-600">{placarA}</span>
                    <span className="text-muted-foreground text-2xl">×</span>
                    <span className="text-4xl text-purple-600">{placarB}</span>
                    <span className="bg-purple-100 px-4 py-2 rounded-lg">Time {timeBLetra}</span>
                  </div>
                  
                  {/* Times da partida */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Time {timeALetra}</h4>
                      <div className="space-y-1">
                        {partida.timeA.map((jogadorId, idx) => (
                          <div key={idx} className="text-sm">
                            <Link to={`/jogador/${jogadorId}`} className="hover:underline text-blue-600">
                              {getJogadorNome(jogadorId)}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Time {timeBLetra}</h4>
                      <div className="space-y-1">
                        {partida.timeB.map((jogadorId, idx) => (
                          <div key={idx} className="text-sm">
                            <Link to={`/jogador/${jogadorId}`} className="hover:underline text-purple-600">
                              {getJogadorNome(jogadorId)}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {todosEventos.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border">
                    <h4 className="font-medium text-lg mb-4 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-primary" />
                      Eventos da Partida ({todosEventos.length})
                    </h4>
                    
                    {/* Seção de Gols */}
                    {gols.length > 0 && (
                      <div className="mb-4">
                        <h5 className="font-medium text-green-700 mb-2 flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          Gols ({gols.length})
                        </h5>
                        <div className="grid gap-2">
                          {gols.map((evento, eventIndex) => (
                            <div key={`gol-${eventIndex}`} className="flex items-center justify-between p-3 bg-green-50 rounded border">
                              <div className="flex items-center space-x-3">
                                <EventIcon tipo={evento.tipo} />
                                <div>
                                  <span className="font-medium">
                                    <Link to={`/jogador/${evento.jogadorId}`} className="hover:underline text-green-700">
                                      {getJogadorNome(evento.jogadorId)}
                                    </Link>
                                  </span>
                                  {evento.assistidoPor && (
                                    <div className="text-sm text-muted-foreground">
                                      Assistência: <Link to={`/jogador/${evento.assistidoPor}`} className="hover:underline text-green-600">
                                        {getJogadorNome(evento.assistidoPor)}
                                      </Link>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Gol
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Seção de Cartões */}
                    {(cartoesAmarelos.length > 0 || cartoesAzuis.length > 0 || cartoesVermelhos.length > 0) && (
                      <div className="mb-4">
                        <h5 className="font-medium text-orange-700 mb-2">
                          Cartões ({cartoesAmarelos.length + cartoesAzuis.length + cartoesVermelhos.length})
                        </h5>
                        <div className="grid gap-2">
                          {[...cartoesAmarelos, ...cartoesAzuis, ...cartoesVermelhos].map((evento, eventIndex) => (
                            <div key={`cartao-${eventIndex}`} className="flex items-center justify-between p-3 bg-orange-50 rounded border">
                              <div className="flex items-center space-x-3">
                                <EventIcon tipo={evento.tipo} />
                                <div>
                                  <span className="font-medium">
                                    <Link to={`/jogador/${evento.jogadorId}`} className="hover:underline text-orange-700">
                                      {getJogadorNome(evento.jogadorId)}
                                    </Link>
                                  </span>
                                </div>
                              </div>
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  evento.tipo === 'cartao_amarelo' ? 'bg-yellow-100 text-yellow-800' :
                                  evento.tipo === 'cartao_azul' ? 'bg-blue-100 text-blue-800' :
                                  'bg-red-100 text-red-800'
                                }`}
                              >
                                {getEventoTexto(evento.tipo)}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Lista completa de eventos (caso queira ver tudo junto) */}
                    <details className="mt-4">
                      <summary className="cursor-pointer font-medium text-sm text-muted-foreground hover:text-foreground">
                        Ver todos os eventos em ordem
                      </summary>
                      <ScrollArea className="max-h-64 w-full mt-2">
                        <div className="space-y-2 pr-4">
                          {todosEventos.map((evento, eventIndex) => {
                            const eventoKey = `${partida.id}-${evento.id}-${eventIndex}`;
                            return (
                              <div key={eventoKey} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                  <EventIcon tipo={evento.tipo} />
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
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </details>
                  </div>
                )}
                
                {todosEventos.length === 0 && (
                  <div className="bg-white rounded-lg p-4 border text-center text-sm text-muted-foreground">
                    Nenhum evento registrado nesta partida
                  </div>
                )}
              </div>
            );
          })}
          {(!partidas || partidas.length === 0) && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhuma partida registrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PeladaMatches;
