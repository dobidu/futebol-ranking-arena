
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Trophy, Plus, Trash2, Target } from 'lucide-react';
import { Pelada, Jogador, PartidaPelada, EventoPelada } from '@/types';

interface EditPartidasTabProps {
  pelada: Pelada;
  jogadores: Jogador[];
  onSave: (dadosAtualizados: any) => void;
}

const EditPartidasTab: React.FC<EditPartidasTabProps> = ({
  pelada,
  jogadores,
  onSave
}) => {
  const [partidas, setPartidas] = useState<PartidaPelada[]>([]);

  useEffect(() => {
    setPartidas(pelada.partidas || []);
  }, [pelada]);

  const adicionarEvento = (partidaIndex: number, tipo: string, jogadorId: string, assistidoPor?: string) => {
    if (!tipo || !jogadorId) return;

    const novoEvento: EventoPelada = {
      id: crypto.randomUUID(),
      partidaId: partidas[partidaIndex].id,
      jogadorId,
      tipo: tipo as any,
      minuto: 0,
      assistidoPor: assistidoPor && assistidoPor !== 'nenhuma' ? assistidoPor : undefined
    };

    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        const eventosAtualizados = [...(partida.eventos || []), novoEvento];
        
        // Se for gol, atualizar placar
        let novosPlacarA = partida.placarA;
        let novosPlacarB = partida.placarB;
        
        if (tipo === 'gol') {
          const timeDoJogador = partida.timeA.includes(jogadorId) ? 'A' : 'B';
          if (timeDoJogador === 'A') {
            novosPlacarA += 1;
          } else {
            novosPlacarB += 1;
          }
        }

        return {
          ...partida,
          eventos: eventosAtualizados,
          placarA: novosPlacarA,
          placarB: novosPlacarB,
          golsTimeA: novosPlacarA,
          golsTimeB: novosPlacarB
        };
      }
      return partida;
    }));
  };

  const removerEvento = (partidaIndex: number, eventoId: string) => {
    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        const eventoRemovido = partida.eventos?.find(e => e.id === eventoId);
        const eventosAtualizados = partida.eventos?.filter(e => e.id !== eventoId) || [];
        
        // Se for gol, atualizar placar
        let novosPlacarA = partida.placarA;
        let novosPlacarB = partida.placarB;
        
        if (eventoRemovido?.tipo === 'gol') {
          const timeDoJogador = partida.timeA.includes(eventoRemovido.jogadorId) ? 'A' : 'B';
          if (timeDoJogador === 'A') {
            novosPlacarA = Math.max(0, novosPlacarA - 1);
          } else {
            novosPlacarB = Math.max(0, novosPlacarB - 1);
          }
        }

        return {
          ...partida,
          eventos: eventosAtualizados,
          placarA: novosPlacarA,
          placarB: novosPlacarB,
          golsTimeA: novosPlacarA,
          golsTimeB: novosPlacarB
        };
      }
      return partida;
    }));
  };

  const atualizarPlacar = (partidaIndex: number, timeA: number, timeB: number) => {
    setPartidas(prev => prev.map((partida, index) => {
      if (index === partidaIndex) {
        return {
          ...partida,
          placarA: timeA,
          placarB: timeB,
          golsTimeA: timeA,
          golsTimeB: timeB
        };
      }
      return partida;
    }));
  };

  const getJogadorNome = (jogadorId: string) => {
    return jogadores.find(j => j.id === jogadorId)?.nome || 'Jogador não encontrado';
  };

  const getEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return <Target className="h-4 w-4 text-green-600" />;
      case 'cartao_amarelo':
        return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />;
      case 'cartao_azul':
        return <div className="w-3 h-4 bg-blue-400 rounded-sm" />;
      case 'cartao_vermelho':
        return <div className="w-3 h-4 bg-red-500 rounded-sm" />;
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

  const handleSave = () => {
    const peladaAtualizada = {
      ...pelada,
      partidas
    };

    onSave(peladaAtualizada);
  };

  if (!partidas.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Nenhuma partida encontrada para esta pelada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {partidas.map((partida, partidaIndex) => (
        <Card key={partida.id}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Partida {partida.numeroPartida}</span>
            </CardTitle>
            <CardDescription>
              Time A vs Time B
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Placar */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-2">
                <Label>Time A</Label>
                <Input
                  type="number"
                  min="0"
                  value={partida.placarA}
                  onChange={(e) => atualizarPlacar(partidaIndex, parseInt(e.target.value) || 0, partida.placarB)}
                />
              </div>
              <div className="text-center">
                <span className="text-2xl font-bold">{partida.placarA} x {partida.placarB}</span>
              </div>
              <div className="space-y-2">
                <Label>Time B</Label>
                <Input
                  type="number"
                  min="0"
                  value={partida.placarB}
                  onChange={(e) => atualizarPlacar(partidaIndex, partida.placarA, parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Adicionar Evento */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Adicionar Evento</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select onValueChange={(tipo) => {
                  const jogadorSelect = document.getElementById(`jogador-${partidaIndex}`) as HTMLSelectElement;
                  const assistSelect = document.getElementById(`assist-${partidaIndex}`) as HTMLSelectElement;
                  if (jogadorSelect?.value) {
                    adicionarEvento(partidaIndex, tipo, jogadorSelect.value, assistSelect?.value);
                    jogadorSelect.value = '';
                    if (assistSelect) assistSelect.value = '';
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gol">Gol</SelectItem>
                    <SelectItem value="cartao_amarelo">Cartão Amarelo</SelectItem>
                    <SelectItem value="cartao_azul">Cartão Azul</SelectItem>
                    <SelectItem value="cartao_vermelho">Cartão Vermelho</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger id={`jogador-${partidaIndex}`}>
                    <SelectValue placeholder="Jogador" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...partida.timeA, ...partida.timeB].map(jogadorId => (
                      <SelectItem key={jogadorId} value={jogadorId}>
                        {getJogadorNome(jogadorId)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger id={`assist-${partidaIndex}`}>
                    <SelectValue placeholder="Assistência (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nenhuma">Nenhuma</SelectItem>
                    {[...partida.timeA, ...partida.timeB].map(jogadorId => (
                      <SelectItem key={jogadorId} value={jogadorId}>
                        {getJogadorNome(jogadorId)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Lista de Eventos */}
            {partida.eventos && partida.eventos.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Eventos da Partida</h4>
                <div className="space-y-2">
                  {partida.eventos.map((evento) => (
                    <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getEventoIcon(evento.tipo)}
                        <div>
                          <span className="font-medium">{getEventoTexto(evento.tipo)}</span>
                          <p className="text-sm text-muted-foreground">
                            {getJogadorNome(evento.jogadorId)}
                            {evento.assistidoPor && ` (assist: ${getJogadorNome(evento.assistidoPor)})`}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removerEvento(partidaIndex, evento.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Partidas
        </Button>
      </div>
    </div>
  );
};

export default EditPartidasTab;
