
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Trophy, Users, ArrowLeft, Target, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { peladaService, temporadaService, jogadorService } from '@/services/dataService';

const PeladaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

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
    
    pelada.partidas?.forEach(partida => {
      totalGols += partida.placarA + partida.placarB;
      partida.eventos?.forEach(evento => {
        if (evento.tipo !== 'gol') cartoes++;
      });
    });

    return { 
      totalGols, 
      cartoes, 
      jogadoresPresentes: pelada.jogadoresPresentes?.length || pelada.presencas?.filter(p => p.presente).length || 0 
    };
  };

  const stats = calcularEstatisticas();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/temporada/${pelada.temporadaId}`}>
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
            Temporada {temporada?.nome}
          </p>
        </div>
        <Link to={`/admin/peladas/editar/${pelada.id}`}>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Times */}
        <Card>
          <CardHeader>
            <CardTitle>Times da Pelada</CardTitle>
            <CardDescription>Composição dos times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pelada.times?.map(time => (
                <div key={time.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center space-x-2">
                    <Badge variant="outline">Time {time.identificadorLetra}</Badge>
                  </h3>
                  <div className="space-y-1">
                    {time.jogadores.map((jogadorId, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {getJogadorNome(jogadorId)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!pelada.times || pelada.times.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhum time registrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Partidas e Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Partidas e Resultados</CardTitle>
            <CardDescription>Jogos realizados na pelada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pelada.partidas?.map((partida, index) => {
                const timeALetra = pelada.times?.find(t => t.jogadores.some(j => partida.timeA.includes(j)))?.identificadorLetra || 'A';
                const timeBLetra = pelada.times?.find(t => t.jogadores.some(j => partida.timeB.includes(j)))?.identificadorLetra || 'B';
                
                return (
                  <div key={partida.id} className="border rounded-lg p-4">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold">
                        Time {timeALetra} {partida.placarA} x {partida.placarB} Time {timeBLetra}
                      </div>
                    </div>
                    
                    {partida.eventos && partida.eventos.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Eventos:</h4>
                        {partida.eventos.map((evento, eventIndex) => (
                          <div key={eventIndex} className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-2">
                              {evento.tipo === 'gol' && <Target className="h-4 w-4 text-green-500" />}
                              {evento.tipo === 'cartao_amarelo' && <div className="w-4 h-4 bg-yellow-500 rounded-sm" />}
                              {evento.tipo === 'cartao_azul' && <div className="w-4 h-4 bg-blue-500 rounded-sm" />}
                              {evento.tipo === 'cartao_vermelho' && <div className="w-4 h-4 bg-red-500 rounded-sm" />}
                              <span>{getJogadorNome(evento.jogadorId)}</span>
                              {evento.assistidoPor && (
                                <span className="text-muted-foreground">
                                  (Assistência: {getJogadorNome(evento.assistidoPor)})
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {(!pelada.partidas || pelada.partidas.length === 0) && (
                <p className="text-center text-muted-foreground py-4">
                  Nenhuma partida registrada
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pontuação dos Jogadores */}
      {((pelada.jogadoresPresentes && pelada.jogadoresPresentes.length > 0) || 
        (pelada.presencas && pelada.presencas.filter(p => p.presente).length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Jogadores da Pelada</CardTitle>
            <CardDescription>Status dos jogadores nesta pelada</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Jogador</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pelada.jogadoresPresentes ? 
                  pelada.jogadoresPresentes.map((jogadorPresente, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Link to={`/jogador/${jogadorPresente.id}`} className="hover:underline">
                          {jogadorPresente.nome}
                        </Link>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={jogadorPresente.presente ? 'default' : 'secondary'}>
                          {jogadorPresente.presente ? 'Presente' : 'Ausente'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )) :
                  pelada.presencas?.filter(p => p.presente).map((presenca, index) => {
                    const jogador = jogadores.find(j => j.id === presenca.jogadorId);
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <Link to={`/jogador/${presenca.jogadorId}`} className="hover:underline">
                            {jogador?.nome || 'Jogador não encontrado'}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="default">
                            Presente
                            {presenca.atraso !== 'nenhum' && ` (${presenca.atraso})`}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p className="text-sm font-medium text-muted-foreground">Jogadores Presentes</p>
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
                <p className="text-sm font-medium text-muted-foreground">Cartões Aplicados</p>
                <p className="text-2xl font-bold">{stats.cartoes}</p>
              </div>
              <div className="w-8 h-8 bg-yellow-500 rounded-sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeladaDetail;
