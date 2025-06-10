
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Trophy, AlertTriangle } from 'lucide-react';
import { TimeNaPelada, Partida } from '@/types';

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
  finalizarPartida
}) => {
  const [timeAId, setTimeAId] = useState('');
  const [timeBId, setTimeBId] = useState('');

  const timesDisponiveis = times.filter(t => t.jogadores.length >= 5);

  const verificarJogadoresComuns = (timeA: TimeNaPelada, timeB: TimeNaPelada) => {
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

  return (
    <div className="space-y-6">
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

      {partidaAtual && (
        <Card>
          <CardHeader>
            <CardTitle>
              Partida: Time {partidaAtual.timeA?.identificadorLetra} x Time {partidaAtual.timeB?.identificadorLetra}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
                <span className="text-2xl font-bold">X</span>
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
