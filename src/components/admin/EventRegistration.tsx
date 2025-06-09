
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, Plus, Trash2, Trophy } from 'lucide-react';
import { Jogador } from '@/types';

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

interface EventRegistrationProps {
  eventos: EventoPartida[];
  tipoEvento: string;
  jogadorEvento: string;
  assistenciaEvento: string;
  jogadoresPresentes: JogadorPresente[];
  jogadores: Jogador[];
  peladaAtual: string;
  partidas: any[];
  setTipoEvento: (value: string) => void;
  setJogadorEvento: (value: string) => void;
  setAssistenciaEvento: (value: string) => void;
  adicionarEvento: () => void;
  removerEvento: (eventoId: string) => void;
  salvarPelada: () => void;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventos,
  tipoEvento,
  jogadorEvento,
  assistenciaEvento,
  jogadoresPresentes,
  jogadores,
  peladaAtual,
  partidas,
  setTipoEvento,
  setJogadorEvento,
  setAssistenciaEvento,
  adicionarEvento,
  removerEvento,
  salvarPelada
}) => {
  const getJogadorNome = (id: string) => {
    return jogadores.find(j => j.id === id)?.nome || 'Jogador não encontrado';
  };

  const jogadoresDisponiveis = jogadoresPresentes.filter(j => j.presente);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>Registrar Eventos</span>
        </CardTitle>
        <CardDescription>
          Adicione gols, assistências e cartões
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                {jogadoresDisponiveis.map(jogador => (
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
                <SelectItem value="">Nenhuma</SelectItem>
                {jogadoresDisponiveis.map(jogador => (
                  <SelectItem key={jogador.id} value={jogador.id}>
                    {jogador.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>&nbsp;</Label>
            <Button onClick={adicionarEvento} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Eventos Registrados</h3>
          {eventos.length > 0 ? (
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
                      <Badge variant={
                        evento.tipo === 'gol' ? 'default' :
                        evento.tipo === 'cartao_amarelo' ? 'outline' :
                        evento.tipo === 'cartao_azul' ? 'outline' :
                        'destructive'
                      }>
                        {evento.tipo === 'gol' ? 'Gol' : 
                         evento.tipo === 'cartao_amarelo' ? 'Cartão Amarelo' :
                         evento.tipo === 'cartao_azul' ? 'Cartão Azul' :
                         'Cartão Vermelho'}
                      </Badge>
                    </TableCell>
                    <TableCell>{getJogadorNome(evento.jogadorId)}</TableCell>
                    <TableCell>
                      {evento.assistidoPor ? getJogadorNome(evento.assistidoPor) : '-'}
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
          ) : (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              Nenhum evento registrado ainda
            </div>
          )}
        </div>

        <Button onClick={salvarPelada} className="w-full" disabled={!peladaAtual || partidas.length === 0}>
          <Trophy className="h-4 w-4 mr-2" />
          Salvar Pelada Completa
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventRegistration;
