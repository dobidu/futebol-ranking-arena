
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Plus, Users, Trophy, Target, Trash2, UserPlus, Play } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { TimeNaPelada, Partida } from '@/types';

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

const AdminPeladas: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estados para criação de pelada
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [dataPelada, setDataPelada] = useState('');
  const [peladaAtual, setPeladaAtual] = useState<string>('');
  const [jogadoresPresentes, setJogadoresPresentes] = useState<JogadorPresente[]>([]);
  
  // Estados para times
  const [times, setTimes] = useState<TimeNaPelada[]>([]);
  const [proximaLetra, setProximaLetra] = useState('A');
  
  // Estados para partidas
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [partidaAtual, setPartidaAtual] = useState<Partida | null>(null);
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
      const novaPelada = {
        data: new Date(dataPelada),
        temporadaId: selectedTemporada,
        partidas: [],
        presencas: []
      };

      await peladaService.create(novaPelada);

      const jogadoresComPresenca = jogadores.filter(j => j.ativo).map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false
      }));

      setJogadoresPresentes(jogadoresComPresenca);
      
      // Obter o ID da pelada criada
      const peladas = peladaService.getAll();
      const ultimaPelada = peladas[peladas.length - 1];
      setPeladaAtual(ultimaPelada.id);

      // Reset states
      setTimes([]);
      setPartidas([]);
      setProximaLetra('A');

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      
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

  const criarTime = () => {
    if (!peladaAtual) {
      toast({
        title: "Erro",
        description: "Crie uma pelada primeiro",
        variant: "destructive"
      });
      return;
    }

    const novoTime: TimeNaPelada = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      identificadorLetra: proximaLetra,
      jogadores: []
    };

    setTimes(prev => [...prev, novoTime]);
    
    // Próxima letra
    const proximaChr = String.fromCharCode(proximaLetra.charCodeAt(0) + 1);
    setProximaLetra(proximaChr);

    toast({
      title: "Sucesso",
      description: `Time ${proximaLetra} criado!`
    });
  };

  const adicionarJogadorAoTime = (jogadorId: string, timeId: string) => {
    const jogadorPresente = jogadoresPresentes.find(j => j.id === jogadorId && j.presente);
    if (!jogadorPresente) return;

    setTimes(prev => prev.map(time => {
      if (time.id === timeId && !time.jogadores.includes(jogadorId) && time.jogadores.length < 6) {
        return { ...time, jogadores: [...time.jogadores, jogadorId] };
      }
      return time;
    }));
  };

  const removerJogadorDoTime = (jogadorId: string, timeId: string) => {
    setTimes(prev => prev.map(time => {
      if (time.id === timeId) {
        return { ...time, jogadores: time.jogadores.filter(id => id !== jogadorId) };
      }
      return time;
    }));
  };

  const criarPartida = (timeAId: string, timeBId: string) => {
    const timeA = times.find(t => t.id === timeAId);
    const timeB = times.find(t => t.id === timeBId);

    if (!timeA || !timeB) {
      toast({
        title: "Erro",
        description: "Selecione dois times válidos",
        variant: "destructive"
      });
      return;
    }

    if (timeA.jogadores.length < 4 || timeB.jogadores.length < 4) {
      toast({
        title: "Erro",
        description: "Cada time deve ter pelo menos 4 jogadores",
        variant: "destructive"
      });
      return;
    }

    const novaPartida: Partida = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      timeAId,
      timeBId,
      placarA: 0,
      placarB: 0,
      timeA,
      timeB
    };

    setPartidaAtual(novaPartida);
    setPlacarA(0);
    setPlacarB(0);
    setEventos([]);

    toast({
      title: "Sucesso",
      description: `Partida ${timeA.identificadorLetra} x ${timeB.identificadorLetra} iniciada!`
    });
  };

  const adicionarEvento = () => {
    if (!tipoEvento || !jogadorEvento || !partidaAtual) {
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
      assistidoPor: assistenciaEvento || undefined
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

  const finalizarPartida = () => {
    if (!partidaAtual) {
      toast({
        title: "Erro",
        description: "Nenhuma partida ativa",
        variant: "destructive"
      });
      return;
    }

    const partidaFinalizada: Partida = {
      ...partidaAtual,
      placarA,
      placarB
    };

    setPartidas(prev => [...prev, partidaFinalizada]);
    setPartidaAtual(null);
    setPlacarA(0);
    setPlacarB(0);
    setEventos([]);

    toast({
      title: "Sucesso",
      description: "Partida finalizada!"
    });
  };

  const salvarPelada = async () => {
    if (!peladaAtual || partidas.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma partida antes de salvar",
        variant: "destructive"
      });
      return;
    }

    try {
      const pelada = peladaService.getById(peladaAtual);
      if (!pelada) {
        toast({
          title: "Erro",
          description: "Pelada não encontrada",
          variant: "destructive"
        });
        return;
      }

      const presencasAtualizadas = jogadoresPresentes
        .filter(j => j.presente)
        .map(j => ({
          id: crypto.randomUUID(),
          peladaId: peladaAtual,
          jogadorId: j.id,
          presente: true,
          atraso: 'nenhum' as const
        }));

      const partidasFormatadas = partidas.map(p => ({
        id: p.id,
        peladaId: p.peladaId,
        numeroPartida: partidas.indexOf(p) + 1,
        timeA: p.timeA?.jogadores || [],
        timeB: p.timeB?.jogadores || [],
        golsTimeA: p.placarA,
        golsTimeB: p.placarB,
        eventos: eventos.map(e => ({
          ...e,
          partidaId: p.id,
          minuto: 0
        }))
      }));

      const peladaAtualizada = {
        ...pelada,
        partidas: partidasFormatadas,
        presencas: presencasAtualizadas
      };

      peladaService.update(peladaAtual, peladaAtualizada);

      // Invalidar cache
      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-admin'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-reports'] });

      // Reset completo
      setTimes([]);
      setPartidas([]);
      setJogadoresPresentes([]);
      setPeladaAtual('');
      setProximaLetra('A');
      setPartidaAtual(null);

      toast({
        title: "Sucesso",
        description: "Pelada salva com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar pelada",
        variant: "destructive"
      });
    }
  };

  const getJogadorNome = (id: string) => {
    return jogadores.find(j => j.id === id)?.nome || 'Jogador não encontrado';
  };

  const jogadoresDisponiveis = jogadoresPresentes.filter(j => j.presente);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Súmula Digital</h1>
        <p className="text-muted-foreground">Registre peladas com múltiplos times e partidas</p>
      </div>

      <Tabs defaultValue="nova-pelada" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nova-pelada">Nova Pelada</TabsTrigger>
          <TabsTrigger value="times">Formar Times</TabsTrigger>
          <TabsTrigger value="partidas">Partidas</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Formar Times</span>
                </CardTitle>
                <CardDescription>
                  Crie times e adicione jogadores (4-6 jogadores por time)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={criarTime} disabled={!peladaAtual}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Time {proximaLetra}
                </Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Jogadores Disponíveis</CardTitle>
                  <CardDescription>
                    Jogadores presentes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {jogadoresDisponiveis.map(jogador => (
                      <div key={jogador.id} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{jogador.nome}</span>
                        <div className="flex flex-wrap gap-1">
                          {times.map(time => (
                            <Button 
                              key={time.id}
                              size="sm" 
                              variant="outline"
                              onClick={() => adicionarJogadorAoTime(jogador.id, time.id)}
                              disabled={time.jogadores.length >= 6}
                            >
                              {time.identificadorLetra}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {times.map(time => (
                    <Card key={time.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <Badge variant="outline">Time {time.identificadorLetra}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {time.jogadores.length}/6
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {time.jogadores.map(jogadorId => (
                            <div key={jogadorId} className="flex items-center justify-between p-2 bg-accent rounded">
                              <span className="text-sm">{getJogadorNome(jogadorId)}</span>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => removerJogadorDoTime(jogadorId, time.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {time.jogadores.length === 0 && (
                            <p className="text-muted-foreground text-center py-4 text-sm">
                              Nenhum jogador no time
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="partidas">
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
                      {times.filter(t => t.jogadores.length >= 4).map(time => (
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
        </TabsContent>

        <TabsContent value="eventos">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
