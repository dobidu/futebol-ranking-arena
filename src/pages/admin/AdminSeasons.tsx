import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temporadaService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Temporada } from '@/types';

const AdminSeasons: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Temporada | null>(null);

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const dados = {
      nome: formData.get('nome') as string,
      pontosVitoria: parseInt(formData.get('pontosVitoria') as string),
      pontosEmpate: parseInt(formData.get('pontosEmpate') as string),
      pontosDerrota: parseInt(formData.get('pontosDerrota') as string),
      penalidadeAtraso1: parseInt(formData.get('penalidadeAtraso1') as string),
      penalidadeAtraso2: parseInt(formData.get('penalidadeAtraso2') as string),
      penalidadeCartaoAmarelo: parseInt(formData.get('penalidadeCartaoAmarelo') as string),
      penalidadeCartaoAzul: parseInt(formData.get('penalidadeCartaoAzul') as string),
      penalidadeCartaoVermelho: parseInt(formData.get('penalidadeCartaoVermelho') as string),
      numeroDescartes: parseInt(formData.get('numeroDescartes') as string),
      ativa: formData.get('ativa') === 'on',
      criadaEm: editingSeason?.criadaEm || new Date()
    };

    try {
      if (editingSeason) {
        temporadaService.update(editingSeason.id, dados);
        toast({
          title: "Sucesso",
          description: "Temporada atualizada com sucesso!"
        });
      } else {
        temporadaService.create(dados);
        toast({
          title: "Sucesso",
          description: "Temporada criada com sucesso!"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['temporadas'] });
      setIsOpen(false);
      setEditingSeason(null);
      event.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar temporada",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta temporada?')) return;
    
    try {
      temporadaService.delete(id);
      queryClient.invalidateQueries({ queryKey: ['temporadas'] });
      toast({
        title: "Sucesso",
        description: "Temporada excluída com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir temporada",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (temporada: Temporada) => {
    setEditingSeason(temporada);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingSeason(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Temporadas</h1>
        <p className="text-muted-foreground">
          Configure temporadas e suas regras de pontuação
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Temporadas Cadastradas</h2>
          <p className="text-sm text-muted-foreground">
            Total: {temporadas.length} temporadas
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Temporada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSeason ? 'Editar Temporada' : 'Nova Temporada'}
              </DialogTitle>
              <DialogDescription>
                {editingSeason 
                  ? 'Edite a configuração da temporada abaixo.'
                  : 'Configure uma nova temporada com suas regras de pontuação.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Temporada</Label>
                  <Input
                    id="nome"
                    name="nome"
                    defaultValue={editingSeason?.nome || ''}
                    placeholder="Ex: Temporada 2024"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="numeroDescartes">Número de Descartes</Label>
                  <Input
                    id="numeroDescartes"
                    name="numeroDescartes"
                    type="number"
                    defaultValue={editingSeason?.numeroDescartes || 2}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pontosVitoria">Pontos por Vitória</Label>
                  <Input
                    id="pontosVitoria"
                    name="pontosVitoria"
                    type="number"
                    defaultValue={editingSeason?.pontosVitoria || 3}
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pontosEmpate">Pontos por Empate</Label>
                  <Input
                    id="pontosEmpate"
                    name="pontosEmpate"
                    type="number"
                    defaultValue={editingSeason?.pontosEmpate || 1}
                    min="0"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pontosDerrota">Pontos por Derrota</Label>
                  <Input
                    id="pontosDerrota"
                    name="pontosDerrota"
                    type="number"
                    defaultValue={editingSeason?.pontosDerrota || 0}
                    min="0"
                    required
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
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="penalidadeAtraso2">Penalidade Atraso Tipo 2</Label>
                  <Input
                    id="penalidadeAtraso2"
                    name="penalidadeAtraso2"
                    type="number"
                    defaultValue={editingSeason?.penalidadeAtraso2 || -2}
                    required
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
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="penalidadeCartaoAzul">Penalidade Cartão Azul</Label>
                  <Input
                    id="penalidadeCartaoAzul"
                    name="penalidadeCartaoAzul"
                    type="number"
                    defaultValue={editingSeason?.penalidadeCartaoAzul || -2}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="penalidadeCartaoVermelho">Penalidade Cartão Vermelho</Label>
                  <Input
                    id="penalidadeCartaoVermelho"
                    name="penalidadeCartaoVermelho"
                    type="number"
                    defaultValue={editingSeason?.penalidadeCartaoVermelho || -3}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativa"
                  name="ativa"
                  defaultChecked={editingSeason?.ativa || false}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="ativa">Temporada Ativa</Label>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSeason ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Temporadas</CardTitle>
          <CardDescription>
            Visualize e gerencie todas as temporadas cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Vitória/Empate/Derrota</TableHead>
                  <TableHead>Descartes</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temporadas.map((temporada) => (
                  <TableRow key={temporada.id}>
                    <TableCell className="font-medium">{temporada.nome}</TableCell>
                    <TableCell>
                      <Badge variant={temporada.ativa ? 'default' : 'secondary'}>
                        {temporada.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {temporada.pontosVitoria}/{temporada.pontosEmpate}/{temporada.pontosDerrota}
                    </TableCell>
                    <TableCell>{temporada.numeroDescartes}</TableCell>
                    <TableCell>
                      {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(temporada)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeasons;
