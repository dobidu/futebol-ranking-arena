import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jogadorService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Jogador } from '@/types';

const AdminPlayers: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const nome = formData.get('nome') as string;
    const tipo = formData.get('tipo') as 'Mensalista' | 'Convidado';
    
    if (!nome || !tipo) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingPlayer) {
        jogadorService.update(editingPlayer.id, { 
          nome, 
          tipo,
          ativo: editingPlayer.ativo,
          criadoEm: editingPlayer.criadoEm
        });
        toast({
          title: "Sucesso",
          description: "Jogador atualizado com sucesso!"
        });
      } else {
        jogadorService.create({ 
          nome, 
          tipo,
          ativo: true,
          criadoEm: new Date()
        });
        toast({
          title: "Sucesso",
          description: "Jogador criado com sucesso!"
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      setIsOpen(false);
      setEditingPlayer(null);
      event.currentTarget.reset();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar jogador",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este jogador?')) return;
    
    try {
      jogadorService.delete(id);
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      toast({
        title: "Sucesso",
        description: "Jogador excluído com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir jogador",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (jogador: Jogador) => {
    setEditingPlayer(jogador);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingPlayer(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Jogadores</h1>
        <p className="text-muted-foreground">
          Adicione, edite e gerencie os jogadores da pelada
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Jogadores Cadastrados</h2>
          <p className="text-sm text-muted-foreground">
            Total: {jogadores.length} jogadores
          </p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Novo Jogador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}
              </DialogTitle>
              <DialogDescription>
                {editingPlayer 
                  ? 'Edite os dados do jogador abaixo.'
                  : 'Preencha os dados do novo jogador.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  name="nome"
                  defaultValue={editingPlayer?.nome || ''}
                  placeholder="Digite o nome do jogador"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select name="tipo" defaultValue={editingPlayer?.tipo || 'Mensalista'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensalista">Mensalista</SelectItem>
                    <SelectItem value="Convidado">Convidado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingPlayer ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Jogadores</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os jogadores cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jogadores.map((jogador) => (
                  <TableRow key={jogador.id}>
                    <TableCell className="font-medium">{jogador.nome}</TableCell>
                    <TableCell>
                      <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                        {jogador.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={jogador.ativo ? 'default' : 'destructive'}>
                        {jogador.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(jogador.criadoEm).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(jogador)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(jogador.id)}
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

export default AdminPlayers;
