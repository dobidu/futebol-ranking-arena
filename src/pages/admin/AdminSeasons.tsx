
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temporadaService } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Temporada } from '@/types';
import { Plus, Edit, Trash2, Trophy, CheckCircle, XCircle } from 'lucide-react';

const AdminSeasons: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Temporada | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const handleSaveSeason = async (data: FormData) => {
    const nome = data.get('nome') as string;
    const pontosVitoria = Number(data.get('pontosVitoria'));
    const pontosEmpate = Number(data.get('pontosEmpate'));
    const pontosDerrota = Number(data.get('pontosDerrota'));
    const penalidadeAtraso1 = Number(data.get('penalidadeAtraso1'));
    const penalidadeAtraso2 = Number(data.get('penalidadeAtraso2'));
    const penalidadeCartaoAmarelo = Number(data.get('penalidadeCartaoAmarelo'));
    const penalidadeCartaoAzul = Number(data.get('penalidadeCartaoAzul'));
    const penalidadeCartaoVermelho = Number(data.get('penalidadeCartaoVermelho'));
    const numeroDescartes = Number(data.get('numeroDescartes'));
    const ativa = data.get('ativa') === 'true';

    try {
      if (editingSeason) {
        temporadaService.update(editingSeason.id, {
          nome,
          pontosVitoria,
          pontosEmpate,
          pontosDerrota,
          penalidadeAtraso1,
          penalidadeAtraso2,
          penalidadeCartaoAmarelo,
          penalidadeCartaoAzul,
          penalidadeCartaoVermelho,
          numeroDescartes,
          ativa,
        });
      } else {
        temporadaService.create({
          nome,
          pontosVitoria,
          pontosEmpate,
          pontosDerrota,
          penalidadeAtraso1,
          penalidadeAtraso2,
          penalidadeCartaoAmarelo,
          penalidadeCartaoAzul,
          penalidadeCartaoVermelho,
          numeroDescartes,
          ativa,
          criadaEm: new Date(),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['temporadas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      
      toast({
        title: "Sucesso",
        description: `Temporada ${editingSeason ? 'atualizada' : 'criada'} com sucesso!`,
      });

      setIsDialogOpen(false);
      setEditingSeason(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar temporada",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSeason = async (id: string) => {
    try {
      temporadaService.delete(id);
      queryClient.invalidateQueries({ queryKey: ['temporadas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      
      toast({
        title: "Sucesso",
        description: "Temporada removida com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover temporada",
        variant: "destructive",
      });
    }
  };

  const temporadasAtivas = temporadas.filter(t => t.ativa).length;
  const totalTemporadas = temporadas.length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Temporadas</h1>
        <p className="text-muted-foreground">Administre as temporadas e suas configurações</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Total de Temporadas</p>
                <p className="text-3xl font-bold text-yellow-900">{totalTemporadas}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Temporadas Ativas</p>
                <p className="text-3xl font-bold text-green-900">{temporadasAtivas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Lista de Temporadas</CardTitle>
              <CardDescription>Visualize e gerencie todas as temporadas</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingSeason(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Temporada
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <form action={handleSaveSeason}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSeason ? 'Editar Temporada' : 'Nova Temporada'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingSeason ? 'Edite as configurações da temporada' : 'Configure uma nova temporada'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">Nome</Label>
                      <Input
                        id="nome"
                        name="nome"
                        defaultValue={editingSeason?.nome || ''}
                        className="col-span-3"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pontosVitoria">Pontos por Vitória</Label>
                        <Input
                          id="pontosVitoria"
                          name="pontosVitoria"
                          type="number"
                          defaultValue={editingSeason?.pontosVitoria || 3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pontosEmpate">Pontos por Empate</Label>
                        <Input
                          id="pontosEmpate"
                          name="pontosEmpate"
                          type="number"
                          defaultValue={editingSeason?.pontosEmpate || 1}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pontosDerrota">Pontos por Derrota</Label>
                        <Input
                          id="pontosDerrota"
                          name="pontosDerrota"
                          type="number"
                          defaultValue={editingSeason?.pontosDerrota || 0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="numeroDescartes">Número de Descartes</Label>
                        <Input
                          id="numeroDescartes"
                          name="numeroDescartes"
                          type="number"
                          defaultValue={editingSeason?.numeroDescartes || 2}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="penalidadeAtraso1">Penalidade Atraso Tipo 1</Label>
                        <Input
                          id="penalidadeAtraso1"
                          name="penalidadeAtraso1"
                          type="number"
                          defaultValue={editingSeason?.penalidadeAtraso1 || -1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="penalidadeAtraso2">Penalidade Atraso Tipo 2</Label>
                        <Input
                          id="penalidadeAtraso2"
                          name="penalidadeAtraso2"
                          type="number"
                          defaultValue={editingSeason?.penalidadeAtraso2 || -2}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="penalidadeCartaoAmarelo">Penalidade Cartão Amarelo</Label>
                        <Input
                          id="penalidadeCartaoAmarelo"
                          name="penalidadeCartaoAmarelo"
                          type="number"
                          defaultValue={editingSeason?.penalidadeCartaoAmarelo || -1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="penalidadeCartaoAzul">Penalidade Cartão Azul</Label>
                        <Input
                          id="penalidadeCartaoAzul"
                          name="penalidadeCartaoAzul"
                          type="number"
                          defaultValue={editingSeason?.penalidadeCartaoAzul || -2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="penalidadeCartaoVermelho">Penalidade Cartão Vermelho</Label>
                        <Input
                          id="penalidadeCartaoVermelho"
                          name="penalidadeCartaoVermelho"
                          type="number"
                          defaultValue={editingSeason?.penalidadeCartaoVermelho || -3}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="ativa"
                        name="ativa"
                        defaultChecked={editingSeason?.ativa || false}
                      />
                      <Label htmlFor="ativa">Temporada Ativa</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingSeason ? 'Salvar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Penalidades</TableHead>
                  <TableHead>Data de Criação</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temporadas.map((temporada) => (
                  <TableRow key={temporada.id}>
                    <TableCell className="font-medium">{temporada.nome}</TableCell>
                    <TableCell>
                      <Badge variant={temporada.ativa ? 'default' : 'secondary'}>
                        {temporada.ativa ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Ativa
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Inativa
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        V: {temporada.pontosVitoria} | E: {temporada.pontosEmpate} | D: {temporada.pontosDerrota}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        A1: {temporada.penalidadeAtraso1} | A2: {temporada.penalidadeAtraso2}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSeason(temporada);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteSeason(temporada.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {temporadas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhuma temporada encontrada</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeasons;
