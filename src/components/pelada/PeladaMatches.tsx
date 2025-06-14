
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, Clock } from 'lucide-react';
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

  return (
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
            console.log('PeladaMatches - Total de eventos para exibir:', todosEventos.length);
            
            return (
              <div key={partida.id} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                <div className="text-center mb-4">
                  <Badge variant="outline" className="mb-2">
                    Partida {index + 1}
                  </Badge>
                  <div className="text-2xl font-bold flex items-center justify-center space-x-4">
                    <span className="bg-blue-100 px-3 py-1 rounded">Time {timeALetra}</span>
                    <span className="text-3xl">{placarA}</span>
                    <span className="text-muted-foreground">x</span>
                    <span className="text-3xl">{placarB}</span>
                    <span className="bg-purple-100 px-3 py-1 rounded">Time {timeBLetra}</span>
                  </div>
                </div>
                
                {todosEventos.length > 0 && (
                  <div className="bg-white rounded-lg p-3 border">
                    <h4 className="font-medium text-sm mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      Eventos da Partida ({todosEventos.length})
                    </h4>
                    <ScrollArea className="max-h-96 w-full">
                      <div className="space-y-2 pr-4">
                        {todosEventos.map((evento, eventIndex) => {
                          console.log('PeladaMatches - Renderizando evento:', evento, 'Index:', eventIndex);
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
                  </div>
                )}
                
                {todosEventos.length === 0 && (
                  <div className="bg-white rounded-lg p-3 border text-center text-sm text-muted-foreground">
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
