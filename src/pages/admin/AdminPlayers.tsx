
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { jogadorService } from '@/services/dataService';
import { Jogador } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const AdminPlayers = () => {
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingJogador, setEditingJogador] = useState<Jogador | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: 'Mensalista' as 'Mensalista' | 'Convidado',
    ativo: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadJogadores();
  }, []);

  const loadJogadores = async () => {
    try {
      const data = await jogadorService.getAll();
      setJogadores(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar jogadores",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJogador) {
        await jogadorService.update(editingJogador.id, formData);
        toast({
          title: "Sucesso",
          description: "Jogador atualizado com sucesso"
        });
      } else {
        await jogadorService.create(formData);
        toast({
          title: "Sucesso",
          description: "Jogador criado com sucesso"
        });
      }
      setIsDialogOpen(false);
      resetForm();
      loadJogadores();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar jogador",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (jogador: Jogador) => {
    setEditingJogador(jogador);
    setFormData({
      nome: jogador.nome,
      tipo: jogador.tipo,
      ativo: jogador.ativo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este jogador?')) {
      try {
        await jogadorService.delete(id);
        toast({
          title: "Sucesso",
          description: "Jogador excluído com sucesso"
        });
        loadJogadores();
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao excluir jogador",
          variant: "destructive"
        });
      }
    }
  };

  const resetForm = () => {
    setEditingJogador(null);
    setFormData({
      nome: '',
      tipo: 'Mensalista',
      ativo: true
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Jogadores</h1>
          <p className="text-muted-foreground">Cadastre e gerencie todos os jogadores do sistema</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingJogador ? 'Editar Jogador' : 'Novo Jogador'}
              </DialogTitle>
              <DialogDescription>
                Preencha as informações do jogador
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome do Jogador</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                  required
                />
              </div>

              <div>
                <Label htmlFor="tipo">Tipo de Jogador</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({...formData, tipo: value as 'Mensalista' | 'Convidado'})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mensalista">Mensalista</SelectItem>
                    <SelectItem value="Convidado">Convidado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="ativo"
                  checked={formData.ativo}
                  onCheckedChange={(checked) => setFormData({...formData, ativo: checked})}
                />
                <Label htmlFor="ativo">Jogador Ativo</Label>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingJogador ? 'Atualizar' : 'Criar'} Jogador
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Jogadores Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os jogadores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastrado em</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jogadores.map((jogador) => (
                <TableRow key={jogador.id}>
                  <TableCell className="font-medium">{jogador.nome}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      jogador.tipo === 'Mensalista' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {jogador.tipo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      jogador.ativo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {jogador.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(jogador.criadoEm).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(jogador)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlayers;
