
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Target, Plus, Trash2, ArrowRight } from 'lucide-react';
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
      adicionarEvento(tipoEvento, jogadorEvento);
      setJogadorEvento('');
    }
  };

  const getJogadoresDoTime = (timeId: string) => {
    const time = times.find(t => t.id === timeId);
    if (!time) return [];
    
    return time.jogadores.map(jogadorId => {
      const jogador = jogadores.find(j => j.id === jogadorId);
      return jogador ? { id: jogador.id, nome: jogador.nome } : null;
    }).filter(Boolean);
  };

  const jogadoresPartidaAtual = partidaAtual ? [
    ...getJogadoresDoTime(partidaAtual.timeAId),
    ...getJogadoresDoTime(partidaAtual.timeBId)
  ] : [];

  const canProceed = partidas.length > 0;

  if (times.length < 2) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Forme pelo menos 2 times para registrar partidas</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!partidaAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Nova Partida</span>
            </CardTitle>
            <CardDescription>Selecione os times que irão se enfrentar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <Label>Time A</Label>
                <Select value={timeASelecionado} onValueChange={setTimeASelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time A" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Time B</Label>
                <Select value={timeBSelecionado} onValueChange={setTimeBSelecionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o time B" />
                  </SelectTrigger>
                  <SelectContent>
                    {times.filter(t => t.id !== timeASelecionado).map((time) => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCriarPartida} disabled={!timeASelecionado || !timeBSelecionado}>
                Iniciar Partida
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {partidaAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Time {getTimeLetra(partidaAtual.timeAId)} {placarA} x {placarB} Time {getTimeLetra(partidaAtual.timeBId)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controle de Placar */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center space-y-2">
                <Label>Time {getTimeLetra(partidaAtual.timeAId)}</Label>
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" onClick={() => setPlacarA(Math.max(0, placarA - 1))}>-</Button>
                  <Input 
                    type="number" 
                    value={placarA} 
                    onChange={(e) => setPlacarA(Number(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" onClick={() => setPlacarA(placarA + 1)}>+</Button>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <Label>Time {getTimeLetra(partidaAtual.timeBId)}</Label>
                <div className="flex items-center justify-center space-x-2">
                  <Button variant="outline" onClick={() => setPlacarB(Math.max(0, placarB - 1))}>-</Button>
                  <Input 
                    type="number" 
                    value={placarB} 
                    onChange={(e) => setPlacarB(Number(e.target.value))}
                    className="w-20 text-center"
                  />
                  <Button variant="outline" onClick={() => setPlacarB(placarB + 1)}>+</Button>
                </div>
              </div>
            </div>

            {/* Adicionar Eventos */}
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-4">Registrar Eventos</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label>Tipo de Evento</Label>
                  <Select value={tipoEvento} onValueChange={setTipoEvento}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gol">Gol</SelectItem>
                      <SelectItem value="cartao_amarelo">Cartão Amarelo</SelectItem>
                      <SelectItem value="cartao_azul">Cartão Azul</SelectItem>
                      <SelectItem value="cartao_vermelho">Cartão Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jogador</Label>
                  <Select value={jogadorEvento} onValueChange={setJogadorEvento}>
                    <SelectTrigger>
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

                <div className="md:col-span-2">
                  <Button onClick={handleAdicionarEvento} disabled={!jogadorEvento}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Evento
                  </Button>
                </div>
              </div>
            </div>

            {/* Lista de Eventos */}
            {eventos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Eventos da Partida</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Jogador</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventos.map((evento) => (
                      <TableRow key={evento.id}>
                        <TableCell>
                          <Badge variant={evento.tipo === 'gol' ? 'default' : 'secondary'}>
                            {evento.tipo === 'gol' && <Target className="h-3 w-3 mr-1" />}
                            {evento.tipo.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>{getJogadorNome(evento.jogadorId)}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removerEvento(evento.id)}
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

            <Button onClick={finalizarPartida} className="w-full">
              Finalizar Partida
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Partidas Finalizadas */}
      {partidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Partidas Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partidas.map((partida) => (
                <div key={partida.id} className="p-4 border rounded-lg">
                  <div className="text-center text-lg font-semibold mb-2">
                    Time {getTimeLetra(partida.timeAId)} {partida.placarA} x {partida.placarB} Time {getTimeLetra(partida.timeBId)}
                  </div>
                  {partida.eventos && partida.eventos.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <strong>Eventos:</strong> {partida.eventos.length} registrados
                    </div>
                  )}
                </div>
              ))}
            </div>

            {canProceed && onNextStep && (
              <div className="mt-6 flex justify-end">
                <Button onClick={onNextStep}>
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
