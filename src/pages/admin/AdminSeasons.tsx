
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { temporadaService } from '@/services/dataService';
import { Temporada } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const AdminSeasons = () => {
  const [temporadas, setTemporadas] = useState<Temporada[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemporada, setEditingTemporada] = useState<Temporada | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    pontosVitoria: 3,
    pontosEmpate: 1,
    pontosDerrota: 0,
    penalidadeAtraso1: -1,
    penalidadeAtraso2: -2,
    penalidadeCartaoAmarelo: -0.5,
    penalidadeCartaoAzul: -1,
    penalidadeCartaoVermelho: -2,
    numeroDescartes: 2,
    ativa: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemporadas();
  }, []);

  const loadTemporadas = async () => {
    try {
      const data = await temporadaService.getAll();
      setTemporadas(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar temporadas",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemporada) {
        await temporadaService.update(editingTemporada.id, formData);
        toast({
          title: "Sucesso",
          description: "Temporada atualizada com sucesso"
        });
      } else {
        await temporadaService.create(formData);
        toast({
          title: "Sucesso",
          description: "Temporada criada com sucesso"
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadTemporadas();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar temporada",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (temporada: Temporada) => {
    setEditingTemporada(temporada);
    setFormData({
      nome: temporada.nome,
      pontosVitoria: temporada.pontosVitoria,
      pontosEmpate: temporada.pontosEmpate,
      pontosDerrota: temporada.pontosDerrota,
      penalidadeAtraso1: temporada.penalidadeAtraso1,
      penalidadeAtraso2: temporada.penalidadeAtraso2,
      penalidadeCartaoAmarelo: temporada.penalidadeCartaoAmarelo,
      penalidadeCartaoAzul: temporada.penalidadeCartaoAzul,
      penalidadeCartaoVermelho: temporada.penalidadeCartaoVermelho,
      numeroDescartes: temporada.numeroDescartes,
      ativa: temporada.ativa
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta temporada?')) {
      try {
        await temporadaService.delete(id);
        toast({
          title: "Sucesso",
          description: "Temporada excluída com sucesso"
        });
        loadTemporadas();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir temporada",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingTemporada(null);
    setFormData({
      nome: '',
      pontosVitoria: 3,
      pontosEmpate: 1,
      pontosDerrota: 0,
      penalidadeAtraso1: -1,
      penalidadeAtraso2: -2,
      penalidadeCartaoAmarelo: -0.5,
      penalidadeCartaoAzul: -1,
      penalidadeCartaoVermelho: -2,
      numeroDescartes: 2,
      ativa: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Temporadas</h1>
          <p className="text-muted-foreground">Configure as regras e pontuações para cada temporada</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Temporada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingTemporada ? 'Editar Temporada' : 'Nova Temporada'}
              </DialogTitle>
              <DialogDescription>
                Configure as regras de pontuação para a temporada
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nome">Nome da Temporada</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Ex: 2024.1"
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="ativa"
                    checked={formData.ativa}
                    onCheckedChange={(checked) => setFormData({...formData, ativa: checked})}
                  />
                  <Label htmlFor="ativa">Temporada Ativa</Label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="pontosVitoria">Pontos por Vitória</Label>
                  <Input
                    id="pontosVitoria"
                    type="number"
                    value={formData.pontosVitoria}
                    onChange={(e) => setFormData({...formData, pontosVitoria: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="pontosEmpate">Pontos por Empate</Label>
                  <Input
                    id="pontosEmpate"
                    type="number"
                    value={formData.pontosEmpate}
                    onChange={(e) => setFormData({...formData, pontosEmpate: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="pontosDerrota">Pontos por Derrota</Label>
                  <Input
                    id="pontosDerrota"
                    type="number"
                    value={formData.pontosDerrota}
                    onChange={(e) => setFormData({...formData, pontosDerrota: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="penalidadeAtraso1">Penalidade Atraso Tipo 1</Label>
                  <Input
                    id="penalidadeAtraso1"
                    type="number"
                    step="0.1"
                    value={formData.penalidadeAtraso1}
                    onChange={(e) => setFormData({...formData, penalidadeAtraso1: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="penalidadeAtraso2">Penalidade Atraso Tipo 2</Label>
                  <Input
                    id="penalidadeAtraso2"
                    type="number"
                    step="0.1"
                    value={formData.penalidadeAtraso2}
                    onChange={(e) => setFormData({...formData, penalidadeAtraso2: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="penalidadeCartaoAmarelo">Penalidade Cartão Amarelo</Label>
                  <Input
                    id="penalidadeCartaoAmarelo"
                    type="number"
                    step="0.1"
                    value={formData.penalidadeCartaoAmarelo}
                    onChange={(e) => setFormData({...formData, penalidadeCartaoAmarelo: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="penalidadeCartaoAzul">Penalidade Cartão Azul</Label>
                  <Input
                    id="penalidadeCartaoAzul"
                    type="number"
                    step="0.1"
                    value={formData.penalidadeCartaoAzul}
                    onChange={(e) => setFormData({...formData, penalidadeCartaoAzul: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="penalidadeCartaoVermelho">Penalidade Cartão Vermelho</Label>
                  <Input
                    id="penalidadeCartaoVermelho"
                    type="number"
                    step="0.1"
                    value={formData.penalidadeCartaoVermelho}
                    onChange={(e) => setFormData({...formData, penalidadeCartaoVermelho: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numeroDescartes">Número de Descartes</Label>
                <Input
                  id="numeroDescartes"
                  type="number"
                  value={formData.numeroDescartes}
                  onChange={(e) => setFormData({...formData, numeroDescartes: Number(e.target.value)})}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingTemporada ? 'Atualizar' : 'Criar'} Temporada
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Temporadas Cadastradas</CardTitle>
          <CardDescription>
            Gerencie todas as temporadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pontos V/E/D</TableHead>
                <TableHead>Descartes</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {temporadas.map((temporada) => (
                <TableRow key={temporada.id}>
                  <TableCell className="font-medium">{temporada.nome}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      temporada.ativa 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {temporada.ativa ? 'Ativa' : 'Inativa'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {temporada.pontosVitoria}/{temporada.pontosEmpate}/{temporada.pontosDerrota}
                  </TableCell>
                  <TableCell>{temporada.numeroDescartes}</TableCell>
                  <TableCell>
                    {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(temporada)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(temporada.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeasons;
