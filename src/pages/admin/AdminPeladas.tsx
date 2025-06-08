
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Plus, Users, Trophy, Target, Trash2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface Time {
  letra: string;
  jogadores: string[];
}

interface EventoPartida {
  id: string;
  tipo: 'Gol' | 'Assistência' | 'Cartão Amarelo' | 'Cartão Azul' | 'Cartão Vermelho';
  jogadorId: string;
  jogadorAssistenciaId?: string;
}

const AdminPeladas: React.FC = () => {
  const { toast } = useToast();
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [dataPelada, setDataPelada] = useState('');
  const [jogadoresPresentes, setJogadoresPresentes] = useState<JogadorPresente[]>([]);
  const [times, setTimes] = useState<Time[]>([
    { letra: 'A', jogadores: [] },
    { letra: 'B', jogadores: [] }
  ]);
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [eventos, setEventos] = useState<EventoPartida[]>([]);
  const [tipoEvento, setTipoEvento] = useState('');
  const [jogadorEvento, setJogadorEvento] = useState('');
  const [assistenciaEvento, setAssistenciaEvento] = useState('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const criarPelada = async () => {
    if (!selectedTemporada || !dataPelada) {
      toast({
        title: "Erro",
        description: "Selecione uma temporada e data",
        variant: "destructive"
      });
      return;
    }

    try {
      await peladaService.create({
        data: new Date(dataPelada),
        temporadaId: selectedTemporada
      });

      const jogadoresComPresenca = jogadores.filter(j => j.ativo).map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false
      }));

      setJogadoresPresentes(jogadoresComPresenca);
      
      toast({
        title: "Sucesso",
        description: "Pelada criada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar pelada",
        variant: "destructive"
      });
    }
  };

  const togglePresenca = (jogadorId: string) => {
    setJogadoresPresentes(prev => 
      prev.map(j => 
        j.id === jogadorId ? { ...j, presente: !j.presente } : j
      )
    );
  };

  const adicionarAoTime = (jogadorId: string, timeLeta: string) => {
    const jogadorPresente = jogadoresPresentes.find(j => j.id === jogadorId && j.presente);
    if (!jogadorPresente) return;

    setTimes(prev => prev.map(time => {
      if (time.letra === timeLeta && !time.jogadores.includes(jogadorId)) {
        return { ...time, jogadores: [...time.jogadores, jogadorId] };
      }
      return time;
    }));
  };

  const removerDoTime = (jogadorId: string, timeLeta: string) => {
    setTimes(prev => prev.map(time => {
      if (time.letra === timeLeta) {
        return { ...time, jogadores: time.jogadores.filter(id => id !== jogadorId) };
      }
      return time;
    }));
  };

  const adicionarEvento = () => {
    if (!tipoEvento || !jogadorEvento) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de evento e o jogador",
        variant: "destructive"
      });
      return;
    }

    const novoEvento: EventoPartida = {
      id: Date.now().toString(),
      tipo: tipoEvento as any,
      jogadorId: jogadorEvento,
      jogadorAssistenciaId: assistenciaEvento || undefined
    };

    setEventos(prev => [...prev, novoEvento]);
    setTipoEvento('');
    setJogadorEvento('');
    setAssistenciaEvento('');

    toast({
      title: "Sucesso",
      description: "Evento adicionado!"
    });
  };

  const removerEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
  };

  const getJogadorNome = (id: string) => {
    return jogadores.find(j => j.id === id)?.nome || 'Jogador não encontrado';
  };

  const jogadoresDisponiveis = jogadoresPresentes.filter(j => j.presente);
  const jogadoresNoTimeA = times.find(t => t.letra === 'A')?.jogadores || [];
  const jogadoresNoTimeB = times.find(t => t.letra === 'B')?.jogadores || [];
  const jogadoresSemTime = jogadoresDisponiveis.filter(j => 
    !jogadoresNoTimeA.includes(j.id) && !jogadoresNoTimeB.includes(j.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Súmula Digital</h1>
        <p className="text-muted-foreground">Registre peladas, times, partidas e eventos</p>
      </div>

      <Tabs defaultValue="nova-pelada" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nova-pelada">Nova Pelada</TabsTrigger>
          <TabsTrigger value="times">Formar Times</TabsTrigger>
          <TabsTrigger value="partida">Registrar Partida</TabsTrigger>
        </TabsList>

        <TabsContent value="nova-pelada">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Criar Nova Pelada</span>
              </CardTitle>
              <CardDescription>
                Inicie uma nova pelada selecionando a temporada e data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temporada">Temporada</Label>
                  <Select value={selectedTemporada} onValueChange={setSelectedTemporada}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma temporada" />
                    </SelectTrigger>
                    <SelectContent>
                      {temporadas.map(temporada => (
                        <SelectItem key={temporada.id} value={temporada.id}>
                          {temporada.nome} {temporada.ativa && '(Ativa)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="data">Data da Pelada</Label>
                  <Input
                    id="data"
                    type="date"
                    value={dataPelada}
                    onChange={(e) => setDataPelada(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={criarPelada} className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Criar Pelada
              </Button>

              {jogadoresPresentes.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">Marcar Presenças</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {jogadoresPresentes.map(jogador => (
                      <div key={jogador.id} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center space-x-2">
                          <span>{jogador.nome}</span>
                          <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                            {jogador.tipo}
                          </Badge>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={jogador.presente}
                          onChange={() => togglePresenca(jogador.id)}
                          className="w-4 h-4" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="times">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Jogadores Disponíveis</CardTitle>
                <CardDescription>
                  Jogadores presentes sem time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {jogadoresSemTime.map(jogador => (
                    <div key={jogador.id} className="flex items-center justify-between p-2 border rounded">
                      <span>{jogador.nome}</span>
                      <div className="space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => adicionarAoTime(jogador.id, 'A')}
                        >
                          A
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => adicionarAoTime(jogador.id, 'B')}
                        >
                          B
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge variant="outline">Time A</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {jogadoresNoTimeA.map(jogadorId => (
                    <div key={jogadorId} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span>{getJogadorNome(jogadorId)}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removerDoTime(jogadorId, 'A')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {jogadoresNoTimeA.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Nenhum jogador no time</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Badge variant="outline">Time B</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {jogadoresNoTimeB.map(jogadorId => (
                    <div key={jogadorId} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <span>{getJogadorNome(jogadorId)}</span>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => removerDoTime(jogadorId, 'B')}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {jogadoresNoTimeB.length === 0 && (
                    <p className="text-muted-foreground text-center py-4">Nenhum jogador no time</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partida">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Registrar Resultado e Eventos</span>
                </CardTitle>
                <CardDescription>
                  Insira o placar final e os eventos da partida
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div className="space-y-2">
                    <Label>Time A</Label>
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
                    <Label>Time B</Label>
                    <Input 
                      type="number" 
                      value={placarB}
                      onChange={(e) => setPlacarB(Number(e.target.value))}
                      placeholder="Gols" 
                      min="0" 
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Adicionar Eventos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Tipo de Evento</Label>
                      <Select value={tipoEvento} onValueChange={setTipoEvento}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Gol">Gol</SelectItem>
                          <SelectItem value="Assistência">Assistência</SelectItem>
                          <SelectItem value="Cartão Amarelo">Cartão Amarelo</SelectItem>
                          <SelectItem value="Cartão Azul">Cartão Azul</SelectItem>
                          <SelectItem value="Cartão Vermelho">Cartão Vermelho</SelectItem>
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
                                evento.tipo === 'Gol' ? 'default' :
                                evento.tipo === 'Assistência' ? 'secondary' :
                                evento.tipo === 'Cartão Amarelo' ? 'outline' :
                                evento.tipo === 'Cartão Azul' ? 'outline' :
                                'destructive'
                              }>
                                {evento.tipo}
                              </Badge>
                            </TableCell>
                            <TableCell>{getJogadorNome(evento.jogadorId)}</TableCell>
                            <TableCell>
                              {evento.jogadorAssistenciaId ? getJogadorNome(evento.jogadorAssistenciaId) : '-'}
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

                <Button className="w-full">
                  <Trophy className="h-4 w-4 mr-2" />
                  Finalizar Registro da Partida
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
