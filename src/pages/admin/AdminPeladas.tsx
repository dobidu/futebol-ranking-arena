
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Users, Trophy, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService } from '@/services/dataService';

const AdminPeladas: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [dataPelada, setDataPelada] = useState('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const temporadaAtiva = temporadas.find(t => t.ativa);

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
          <TabsTrigger value="partidas">Registrar Partidas</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>

        {/* Nova Pelada */}
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
              
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Criar Pelada
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formar Times */}
        <TabsContent value="times">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Jogadores Presentes</span>
                </CardTitle>
                <CardDescription>
                  Marque os jogadores presentes na pelada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {jogadores.filter(j => j.ativo).map(jogador => (
                    <div key={jogador.id} className="flex items-center justify-between p-2 border rounded">
                      <span>{jogador.nome}</span>
                      <div className="flex items-center space-x-2">
                        <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                          {jogador.tipo}
                        </Badge>
                        <input type="checkbox" className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Formação dos Times</CardTitle>
                <CardDescription>
                  Distribua os jogadores presentes nos times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                      <Badge variant="outline">Time A</Badge>
                    </h3>
                    <div className="min-h-20 border-2 border-dashed border-muted-foreground/25 rounded p-2 text-center text-muted-foreground">
                      Arraste os jogadores aqui
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center space-x-2">
                      <Badge variant="outline">Time B</Badge>
                    </h3>
                    <div className="min-h-20 border-2 border-dashed border-muted-foreground/25 rounded p-2 text-center text-muted-foreground">
                      Arraste os jogadores aqui
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <Users className="h-4 w-4 mr-2" />
                  Confirmar Times
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Registrar Partidas */}
        <TabsContent value="partidas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Registrar Resultado da Partida</span>
              </CardTitle>
              <CardDescription>
                Insira o placar final da partida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <Label>Time A</Label>
                  <Input type="number" placeholder="Gols" min="0" />
                </div>
                
                <div className="text-center">
                  <span className="text-2xl font-bold">X</span>
                </div>
                
                <div className="space-y-2">
                  <Label>Time B</Label>
                  <Input type="number" placeholder="Gols" min="0" />
                </div>
              </div>
              
              <Button className="w-full md:w-auto mt-4">
                <Trophy className="h-4 w-4 mr-2" />
                Registrar Resultado
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Eventos */}
        <TabsContent value="eventos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Registrar Eventos</span>
              </CardTitle>
              <CardDescription>
                Registre gols, assistências e cartões da partida
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo-evento">Tipo de Evento</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gol">Gol</SelectItem>
                      <SelectItem value="assistencia">Assistência</SelectItem>
                      <SelectItem value="cartao-amarelo">Cartão Amarelo</SelectItem>
                      <SelectItem value="cartao-azul">Cartão Azul</SelectItem>
                      <SelectItem value="cartao-vermelho">Cartão Vermelho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jogador">Jogador</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o jogador" />
                    </SelectTrigger>
                    <SelectContent>
                      {jogadores.filter(j => j.ativo).map(jogador => (
                        <SelectItem key={jogador.id} value={jogador.id}>
                          {jogador.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="assistencia">Assistência (opcional)</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Jogador da assistência" />
                    </SelectTrigger>
                    <SelectContent>
                      {jogadores.filter(j => j.ativo).map(jogador => (
                        <SelectItem key={jogador.id} value={jogador.id}>
                          {jogador.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button className="w-full md:w-auto mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Evento
              </Button>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Eventos Registrados</h3>
                <div className="border rounded-lg p-4 min-h-20 text-center text-muted-foreground">
                  Nenhum evento registrado ainda
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
