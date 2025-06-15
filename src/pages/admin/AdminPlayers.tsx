
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jogadorService } from '@/services/dataService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Jogador } from '@/types';
import { Plus, Edit, Trash2, Users, UserCheck, UserX } from 'lucide-react';

const AdminPlayers: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Jogador | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<string>('all');
  const [filterAtivo, setFilterAtivo] = useState<string>('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const handleSavePlayer = async (data: FormData) => {
    const nome = data.get('nome') as string;
    const tipo = data.get('tipo') as 'Mensalista' | 'Convidado';
    const ativo = data.get('ativo') === 'true';

    try {
      if (editingPlayer) {
        jogadorService.update(editingPlayer.id, {
          nome,
          tipo,
          ativo,
        });
      } else {
        jogadorService.create({
          nome,
          tipo,
          ativo,
          criadoEm: new Date(),
        });
      }

      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      
      toast({
        title: "Sucesso",
        description: `Jogador ${editingPlayer ? 'atualizado' : 'criado'} com sucesso!`,
      });

      setIsDialogOpen(false);
      setEditingPlayer(null);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar jogador",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlayer = async (id: string) => {
    try {
      jogadorService.delete(id);
      queryClient.invalidateQueries({ queryKey: ['jogadores'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      
      toast({
        title: "Sucesso",
        description: "Jogador removido com sucesso!",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao remover jogador",
        variant: "destructive",
      });
    }
  };

  const filteredJogadores = jogadores.filter(jogador => {
    const matchesSearch = jogador.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'all' || jogador.tipo === filterTipo;
    const matchesAtivo = filterAtivo === 'all' || 
      (filterAtivo === 'true' && jogador.ativo) || 
      (filterAtivo === 'false' && !jogador.ativo);
    
    return matchesSearch && matchesTipo && matchesAtivo;
  });

  const totalJogadores = jogadores.length;
  const jogadoresAtivos = jogadores.filter(j => j.ativo).length;
  const mensalistas = jogadores.filter(j => j.tipo === 'Mensalista').length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Jogadores</h1>
        <p className="text-muted-foreground">Administre os jogadores cadastrados no sistema</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total de Jogadores</p>
                <p className="text-3xl font-bold text-blue-900">{totalJogadores}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Jogadores Ativos</p>
                <p className="text-3xl font-bold text-green-900">{jogadoresAtivos}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Mensalistas</p>
                <p className="text-3xl font-bold text-purple-900">{mensalistas}</p>
              </div>
              <UserX className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Jogadores</CardTitle>
          <CardDescription>Visualize e gerencie todos os jogadores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Buscar jogador..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="Mensalista">Mensalista</SelectItem>
                <SelectItem value="Convidado">Convidado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterAtivo} onValueChange={setFilterAtivo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="true">Ativos</SelectItem>
                <SelectItem value="false">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPlayer(null)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Jogador
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form action={handleSavePlayer}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPlayer ? 'Editar Jogador' : 'Novo Jogador'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPlayer ? 'Edite as informações do jogador' : 'Adicione um novo jogador ao sistema'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="nome" className="text-right">
                        Nome
                      </Label>
                      <Input
                        id="nome"
                        name="nome"
                        defaultValue={editingPlayer?.nome || ''}
                        className="col-span-3"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tipo" className="text-right">
                        Tipo
                      </Label>
                      <Select name="tipo" defaultValue={editingPlayer?.tipo || 'Mensalista'}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mensalista">Mensalista</SelectItem>
                          <SelectItem value="Convidado">Convidado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="ativo" className="text-right">
                        Status
                      </Label>
                      <Select name="ativo" defaultValue={editingPlayer?.ativo ? 'true' : 'false'}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>
                          <SelectItem value="false">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingPlayer ? 'Salvar' : 'Criar'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJogadores.map((jogador) => (
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
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingPlayer(jogador);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePlayer(jogador.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredJogadores.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum jogador encontrado</p>
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

export default AdminPlayers;
