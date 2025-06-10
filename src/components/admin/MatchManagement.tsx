
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Play, Trophy, AlertTriangle, Target, Plus, Trash2 } from 'lucide-react';
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
  adicionarEvento: (tipo: string, jogadorId: string, assistenciaId?: string) => void;
  removerEvento: (eventoId: string) => void;
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
  removerEvento
}) => {
  const [timeAId, setTimeAId] = useState('');
  const [timeBId, setTimeBId] = useState('');
  const [tipoEvento, setTipoEvento] = useState('');
  const [jogadorEvento, setJogadorEvento] = useState('');
  const [assistenciaEvento, setAssistenciaEvento] = useState('');

  // Garantir que só times com pelo menos 5 jogadores apareçam
  const timesDisponiveis = times.filter(t => t.jogadores && t.jogadores.length >= 5);

  console.log('MatchManagement - Times disponíveis:', timesDisponiveis);
  console.log('MatchManagement - Partida atual:', partidaAtual);

  const verificarJogadoresComuns = (timeA: TimeNaPelada, timeB: TimeNaPelada) => {
    if (!timeA.jogadores || !timeB.jogadores) return [];
    const jogadoresComuns = timeA.jogadores.filter(jogadorId => 
      timeB.jogadores.includes(jogadorId)
    );
    return jogadoresComuns;
  };

  const podeIniciarPartida = () => {
    if (!timeAId || !timeBId || timeAId === timeBId) return false;
    
    const timeA = times.find(t => t.id === timeAId);
    const timeB = times.find(t => t.id === timeBId);
    
    if (!timeA || !timeB) return false;
    
    const jogadoresComuns = verificarJogadoresComuns(timeA, timeB);
    return jogadoresComuns.length === 0;
  };

  const getConflitMessage = () => {
    if (!timeAId || !timeBId || timeAId === timeBId) return null;
    
    const timeA = times.find(t => t.id === timeAId);
    const timeB = times.find(t => t.id === timeBId);
    
    if (!timeA || !timeB) return null;
    
    const jogadoresComuns = verificarJogadoresComuns(timeA, timeB);
    
    if (jogadoresComuns.length > 0) {
      return `Conflito: ${jogadoresComuns.length} jogador(es) em comum entre os times`;
    }
    
    return null;
  };

  const handleCriarPartida = () => {
    if (podeIniciarPartida()) {
      criarPartida(timeAId, timeBId);
      setTimeAId('');
      setTimeBId('');
    }
  };

  const getJogadorNome = (id: string) => {
    const jogador = jogadores.find(j => j.id === id);
    return jogador ? jogador.nome : 'Jogador não encontrado';
  };

  const jogadoresDaPartida = partidaAtual ? [
    ...(partidaAtual.timeA?.jogadores || []),
    ...(partidaAtual.timeB?.jogadores || [])
  ] : [];

  const jogadoresPartidaComNomes = jogadoresDaPartida.map(id => ({
    id,
    nome: getJogadorNome(id)
  }));

  const handleAdicionarEvento = () => {
    if (!tipoEvento || !jogadorEvento || !partidaAtual) {
      return;
    }

    adicionarEvento(tipoEvento, jogadorEvento, assistenciaEvento || undefined);
    setTipoEvento('');
    setJogadorEvento('');
    setAssistenciaEvento('');
  };

  const getTipoEventoLabel = (tipo: string) => {
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

  const getTipoEventoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return 'default';
      case 'cartao_amarelo':
        return 'outline';
      case 'cartao_azul':
        return 'outline';
      case 'cartao_vermelho':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {!partidaAtual && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Criar Partida</span>
            </CardTitle>
            <CardDescription>
              Selecione dois times para criar uma partida (mínimo 5 jogadores por time)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time A</Label>
                <Select value={timeAId} onValueChange={setTimeAId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Time A" />
                  </SelectTrigger>
                  <SelectContent>
                    {timesDisponiveis.map(time => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time B</Label>
                <Select value={timeBId} onValueChange={setTimeBId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o Time B" />
                  </SelectTrigger>
                  <SelectContent>
                    {timesDisponiveis.filter(t => t.id !== timeAId).map(time => (
                      <SelectItem key={time.id} value={time.id}>
                        Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {getConflitMessage() && (
              <div className="flex items-center space-x-2 p-3 bg-destructive/15 border border-destructive/20 rounded-md">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">{getConflitMessage()}</span>
              </div>
            )}

            <Button 
              onClick={handleCriarPartida}
              disabled={!podeIniciarPartida()}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Iniciar Partida
            </Button>
          </CardContent>
        </Card>
      )}

      {partidaAtual && (
        <Card>
          <CardHeader>
            <CardTitle>
              Partida Ativa: Time {partidaAtual.timeA?.identificadorLetra} x Time {partidaAtual.timeB?.identificadorLetra}
            </CardTitle>
            <CardDescription>
              Gerencie o placar e registre eventos da partida
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Seção do Placar */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Placar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                  <Label>Time {partidaAtual.timeA?.identificadorLetra}</Label>
                  <Input 
                    type="number" 
                    value={placarA}
                    onChange={(e) => setPlacarA(Number(e.target.value))}
                    placeholder="Gols" 
                    min="0" 
                  />
                </div>
                
                <div className="text-center">
                  <span className="text-3xl font-bold">{placarA} x {placarB}</span>
                </div>
                
                <div className="space-y-2">
                  <Label>Time {partidaAtual.timeB?.identificadorLetra}</Label>
                  <Input 
                    type="number" 
                    value={placarB}
                    onChange={(e) => setPlacarB(Number(e.target.value))}
                    placeholder="Gols" 
                    min="0" 
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Seção de Eventos */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Registrar Eventos</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="space-y-2">
                  <Label>Tipo de Evento</Label>
                  <Select value={tipoEvento} onValueChange={setTipoEvento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gol">Gol</SelectItem>
                      <SelectItem value="cartao_amarelo">Cartão Amarelo</SelectItem>
                      <SelectItem value="cartao_azul">Cartão Azul</SelectItem>
                      <SelectItem value="cartao_vermelho">Cartão Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Jogador</Label>
                  <Select value={jogadorEvento} onValueChange={setJogadorEvento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o jogador" />
                    </SelectTrigger>
                    <SelectContent>
                      {jogadoresPartidaComNomes.map(jogador => (
                        <SelectItem key={jogador.id} value={jogador.id}>
                          {jogador.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Assistência (opcional)</Label>
                  <Select value={assistenciaEvento} onValueChange={setAssistenciaEvento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Jogador da assistência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nenhuma">Nenhuma</SelectItem>
                      {jogadoresPartidaComNomes
                        .filter(j => j.id !== jogadorEvento)
                        .map(jogador => (
                          <SelectItem key={jogador.id} value={jogador.id}>
                            {jogador.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>&nbsp;</Label>
                  <Button onClick={handleAdicionarEvento} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>

              {/* Lista de Eventos */}
              {eventos.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Eventos Registrados</h4>
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
                            <Badge variant={getTipoEventoBadgeVariant(evento.tipo)}>
                              {getTipoEventoLabel(evento.tipo)}
                            </Badge>
                          </TableCell>
                          <TableCell>{getJogadorNome(evento.jogadorId)}</TableCell>
                          <TableCell>
                            {evento.assistidoPor && evento.assistidoPor !== 'nenhuma' 
                              ? getJogadorNome(evento.assistidoPor) 
                              : '-'}
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="ghost"
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
            </div>

            <Separator />

            <Button onClick={finalizarPartida} className="w-full">
              <Trophy className="h-4 w-4 mr-2" />
              Finalizar Partida
            </Button>
          </CardContent>
        </Card>
      )}

      {partidas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Partidas Finalizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Partida</TableHead>
                  <TableHead>Resultado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partidas.map((partida, index) => (
                  <TableRow key={partida.id}>
                    <TableCell>
                      Time {partida.timeA?.identificadorLetra} x Time {partida.timeB?.identificadorLetra}
                    </TableCell>
                    <TableCell>
                      {partida.placarA} x {partida.placarB}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MatchManagement;
