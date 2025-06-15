
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Target, Plus, Trash2, ArrowRight, Trophy, Users } from 'lucide-react';
import { TimeNaPelada, Partida, Jogador } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

interface MatchManagementProps {
  times: TimeNaPelada[];
  partidas: Partida[];
  partidaAtual: Partida | null;
  placarA: number;
  placarB: number;
  setPlacarA: (value: number) => void;
  setPlacarB: (value: number) => void;
  criarPartida: (timeAId: string, timeBId: string) => void;
  finalizarPartida: () => void;
  jogadoresPresentes: JogadorPresente[];
  jogadores: Jogador[];
  eventos: EventoPartida[];
  adicionarEvento: (tipo: string, jogadorId: string, assistidoPor?: string) => void;
  removerEvento: (eventoId: string) => void;
  onNextStep?: () => void;
}

const MatchManagement: React.FC<MatchManagementProps> = ({
  times,
  partidas,
  partidaAtual,
  placarA,
  placarB,
  setPlacarA,
  setPlacarB,
  criarPartida,
  finalizarPartida,
  jogadoresPresentes,
  jogadores,
  eventos,
  adicionarEvento,
  removerEvento,
  onNextStep
}) => {
  const [timeASelecionado, setTimeASelecionado] = useState('');
  const [timeBSelecionado, setTimeBSelecionado] = useState('');
  const [tipoEvento, setTipoEvento] = useState<string>('gol');
  const [jogadorEvento, setJogadorEvento] = useState('');
  const [assistenciaEvento, setAssistenciaEvento] = useState('');

  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
  };

  const getTimeLetra = (timeId: string) => {
    const time = times.find(t => t.id === timeId);
    return time?.identificadorLetra || '';
  };

  const handleCriarPartida = () => {
    if (timeASelecionado && timeBSelecionado && timeASelecionado !== timeBSelecionado) {
      criarPartida(timeASelecionado, timeBSelecionado);
      setTimeASelecionado('');
      setTimeBSelecionado('');
    }
  };

  const handleAdicionarEvento = () => {
    if (jogadorEvento && tipoEvento) {
      const assistencia = tipoEvento === 'gol' && assistenciaEvento && assistenciaEvento !== 'sem-assistencia' ? assistenciaEvento : undefined;
      adicionarEvento(tipoEvento, jogadorEvento, assistencia);
      setJogadorEvento('');
      setAssistenciaEvento('');
    }
  };

  const getJogadoresDoTime = (timeId: string) => {
    const time = times.find(t => t.id === timeId);
    if (!time) return [];
    
    return time.jogadores.map(jogadorId => {
      const jogador = jogadores.find(j => j.id === jogadorId);
      return jogador ? { id: jogador.id, nome: jogador.nome } : null;
    }).filter((jogador): jogador is { id: string; nome: string } => jogador !== null);
  };

  const jogadoresPartidaAtual = partidaAtual ? [
    ...getJogadoresDoTime(partidaAtual.timeAId),
    ...getJogadoresDoTime(partidaAtual.timeBId)
  ] : [];

  // Obter jogadores do mesmo time do autor do gol para assistência
  const getJogadoresDoMesmoTime = () => {
    if (!partidaAtual || !jogadorEvento || tipoEvento !== 'gol') return [];
    
    const timeDoJogador = partidaAtual.timeA?.jogadores.includes(jogadorEvento) ? 
      partidaAtual.timeA : partidaAtual.timeB;
    
    if (!timeDoJogador) return [];
    
    return timeDoJogador.jogadores
      .filter(id => id !== jogadorEvento) // Não incluir o próprio autor do gol
      .map(jogadorId => {
        const jogador = jogadores.find(j => j.id === jogadorId);
        return jogador ? { id: jogador.id, nome: jogador.nome } : null;
      })
      .filter((jogador): jogador is { id: string; nome: string } => jogador !== null);
  };

  const canProceed = partidas.length > 0;

  if (times.length < 2) {
    return (
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Forme pelo menos 2 times para registrar partidas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!partidaAtual && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <Play className="h-6 w-6 text-blue-600" />
              <span>Nova Partida</span>
            </CardTitle>
            <CardDescription>Selecione os times que irão se enfrentar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label className="text-blue-700 font-medium">Primeiro Time</Label>
                <Select value={timeASelecionado} onValueChange={setTimeASelecionado}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Selecione o primeiro time" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-blue-700 font-medium">Segundo Time</Label>
                <Select value={timeBSelecionado} onValueChange={setTimeBSelecionado}>
                  <SelectTrigger className="border-blue-200 focus:border-blue-400">
                    <SelectValue placeholder="Selecione o segundo time" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.filter(t => t.id !== timeASelecionado).map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleCriarPartida} 
                disabled={!timeASelecionado || !timeBSelecionado}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Play className="h-4 w-4 mr-2" />
                Iniciar Partida
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {partidaAtual && (
        <Card className="bg-gradient-to-br from-green-50 to-yellow-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Time {getTimeLetra(partidaAtual.timeAId)} {placarA} x {placarB} Time {getTimeLetra(partidaAtual.timeBId)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controle de Placar */}
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center space-y-3 bg-white p-4 rounded-lg border shadow-sm">
                <Label className="text-lg font-semibold text-green-700">Time {getTimeLetra(partidaAtual.timeAId)}</Label>
                <div className="flex items-center justify-center space-x-3">
                  <Button variant="outline" size="lg" onClick={() => setPlacarA(Math.max(0, placarA - 1))} className="border-green-300 hover:bg-green-50">-</Button>
                  <Input 
                    type="number" 
                    value={placarA} 
                    onChange={(e) => setPlacarA(Number(e.target.value))}
                    className="w-24 text-center text-2xl font-bold border-green-300"
                  />
                  <Button variant="outline" size="lg" onClick={() => setPlacarA(placarA + 1)} className="border-green-300 hover:bg-green-50">+</Button>
                </div>
              </div>
              
              <div className="text-center space-y-3 bg-white p-4 rounded-lg border shadow-sm">
                <Label className="text-lg font-semibold text-blue-700">Time {getTimeLetra(partidaAtual.timeBId)}</Label>
                <div className="flex items-center justify-center space-x-3">
                  <Button variant="outline" size="lg" onClick={() => setPlacarB(Math.max(0, placarB - 1))} className="border-blue-300 hover:bg-blue-50">-</Button>
                  <Input 
                    type="number" 
                    value={placarB} 
                    onChange={(e) => setPlacarB(Number(e.target.value))}
                    className="w-24 text-center text-2xl font-bold border-blue-300"
                  />
                  <Button variant="outline" size="lg" onClick={() => setPlacarB(placarB + 1)} className="border-blue-300 hover:bg-blue-50">+</Button>
                </div>
              </div>
            </div>

            {/* Adicionar Eventos */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-700">
                <Target className="h-5 w-5 mr-2" />
                Registrar Eventos
              </h3>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <Label className="text-purple-700 font-medium">Tipo de Evento</Label>
                    <Select value={tipoEvento} onValueChange={(value) => {
                      setTipoEvento(value);
                      setAssistenciaEvento(''); // Reset assistência quando mudar tipo
                    }}>
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gol">⚽ Gol</SelectItem>
                        <SelectItem value="cartao_amarelo">🟨 Cartão Amarelo</SelectItem>
                        <SelectItem value="cartao_azul">🟦 Cartão Azul</SelectItem>
                        <SelectItem value="cartao_vermelho">🟥 Cartão Vermelho</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-purple-700 font-medium">Jogador</Label>
                    <Select value={jogadorEvento} onValueChange={(value) => {
                      setJogadorEvento(value);
                      setAssistenciaEvento(''); // Reset assistência quando mudar jogador
                    }}>
                      <SelectTrigger className="border-purple-200 focus:border-purple-400">
                        <SelectValue placeholder="Selecione o jogador" />
                      </SelectTrigger>
                      <SelectContent>
                        {jogadoresPartidaAtual.map((jogador) => (
                          <SelectItem key={jogador.id} value={jogador.id}>
                            {jogador.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Campo de assistência apenas para gols */}
                  {tipoEvento === 'gol' && (
                    <div>
                      <Label className="text-purple-700 font-medium">Assistência (opcional)</Label>
                      <Select value={assistenciaEvento} onValueChange={setAssistenciaEvento}>
                        <SelectTrigger className="border-purple-200 focus:border-purple-400">
                          <SelectValue placeholder="Selecione a assistência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sem-assistencia">Sem assistência</SelectItem>
                          {getJogadoresDoMesmoTime().map((jogador) => (
                            <SelectItem key={jogador.id} value={jogador.id}>
                              {jogador.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className={tipoEvento === 'gol' ? "lg:col-span-1" : "lg:col-span-2"}>
                    <Button 
                      onClick={handleAdicionarEvento} 
                      disabled={!jogadorEvento}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Evento
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Eventos */}
            {eventos.length > 0 && (
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-700">
                  <Trophy className="h-5 w-5 mr-2" />
                  Eventos da Partida
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Jogador</TableHead>
                      <TableHead>Assistência</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventos.map((evento) => (
                      <TableRow key={evento.id}>
                        <TableCell>
                          <Badge variant={evento.tipo === 'gol' ? 'default' : 'secondary'} className="text-sm">
                            {evento.tipo === 'gol' && <Target className="h-3 w-3 mr-1" />}
                            {evento.tipo === 'gol' && '⚽'}
                            {evento.tipo === 'cartao_amarelo' && '🟨'}
                            {evento.tipo === 'cartao_azul' && '🟦'}
                            {evento.tipo === 'cartao_vermelho' && '🟥'}
                            {' ' + evento.tipo.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{getJogadorNome(evento.jogadorId)}</TableCell>
                        <TableCell>
                          {evento.assistidoPor ? getJogadorNome(evento.assistidoPor) : '-'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removerEvento(evento.id)}
                            className="hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button 
              onClick={finalizarPartida} 
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 py-3"
              size="lg"
            >
              <Trophy className="h-5 w-5 mr-2" />
              Finalizar Partida
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Partidas Finalizadas */}
      {partidas.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gray-800">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <span>Partidas Finalizadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partidas.map((partida, index) => (
                <div key={partida.id} className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center text-lg font-semibold mb-2 text-gray-800">
                    Time {getTimeLetra(partida.timeAId)} {partida.placarA} x {partida.placarB} Time {getTimeLetra(partida.timeBId)}
                  </div>
                  {partida.eventos && partida.eventos.length > 0 && (
                    <div className="text-sm text-muted-foreground text-center">
                      <Badge variant="outline" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        {partida.eventos.length} eventos registrados
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {canProceed && onNextStep && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={onNextStep}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  Próximo: Finalizar Pelada
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchManagement;
