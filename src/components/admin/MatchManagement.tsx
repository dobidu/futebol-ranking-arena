
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Trophy } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Criar Partida</span>
          </CardTitle>
          <CardDescription>
            Selecione dois times para criar uma partida
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Select onValueChange={(timeAId) => {
              const timeBId = times.find(t => t.id !== timeAId)?.id;
              if (timeBId) criarPartida(timeAId, timeBId);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione os times" />
              </SelectTrigger>
              <SelectContent>
                {times.filter(t => t.jogadores.length >= 5).map(time => (
                  <SelectItem key={time.id} value={time.id}>
                    Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
