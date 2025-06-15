
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { jogadorService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Users, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPlayers: React.FC = () => {
  const [novoJogador, setNovoJogador] = useState({
    nome: '',
    telefone: '',
    email: '',
    tipoJogador: 'avulso' as 'mensalista' | 'avulso',
    ativo: true
  });
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editandoJogador, setEditandoJogador] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const criarJogador = () => {
    if (!novoJogador.nome) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive"
      });
      return;
    }

    const jogador = jogadorService.create({
      ...novoJogador,
      id: crypto.randomUUID(),
      dataCadastro: new Date().toISOString()
    });

    queryClient.invalidateQueries({ queryKey: ['jogadores'] });
    
    setNovoJogador({ nome: '', telefone: '', email: '', tipoJogador: 'avulso', ativo: true });
    setDialogAberto(false);
    
    toast({
      title: "Sucesso",
      description: "Jogador criado com sucesso!"
    });
  };

  const editarJogador = (jogador: any) => {
    setEditandoJogador(jogador);
    setNovoJogador({
      nome: jogador.nome,
      telefone: jogador.telefone || '',
      email: jogador.email || '',
      tipoJogador: jogador.tipoJogador,
      ativo: jogador.ativo
    });
    setDialogAberto(true);
  };

  const salvarEdicao = () => {
    if (!editandoJogador) return;

    jogadorService.update(editandoJogador.id, {
      ...editandoJogador,
      ...novoJogador
    });

    queryClient.invalidateQueries({ queryKey: ['jogadores'] });
    
    setEditandoJogador(null);
    setNovoJogador({ nome: '', telefone: '', email: '', tipoJogador: 'avulso', ativo: true });
    setDialogAberto(false);
    
    toast({
      title: "Sucesso",
      description: "Jogador atualizado com sucesso!"
    });
  };

  const excluirJogador = (id: string) => {
    jogadorService.delete(id);
    queryClient.invalidateQueries({ queryKey: ['jogadores'] });
    
    toast({
      title: "Sucesso",
      description: "Jogador excluído com sucesso!"
    });
  };

  const toggleAtivo = (jogador: any) => {
    jogadorService.update(jogador.id, {
      ...jogador,
      ativo: !jogador.ativo
    });

    queryClient.invalidateQueries({ queryKey: ['jogadores'] });
    
    toast({
      title: "Sucesso",
      description: `Jogador ${jogador.ativo ? 'desativado' : 'ativado'} com sucesso!`
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Jogadores</h1>
        <p className="text-muted-foreground">Administre todos os jogadores do sistema</p>
      </div>

      <div className="flex justify-end">
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditandoJogador(null);
              setNovoJogador({ nome: '', telefone: '', email: '', tipoJogador: 'avulso', ativo: true });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Jogador
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editandoJogador ? 'Editar Jogador' : 'Novo Jogador'}
              </DialogTitle>
              <DialogDescription>
                {editandoJogador ? 'Edite os dados do jogador' : 'Cadastre um novo jogador'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={novoJogador.nome}
                  onChange={(e) => setNovoJogador({...novoJogador, nome: e.target.value})}
                  placeholder="Nome completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={novoJogador.telefone}
                  onChange={(e) => setNovoJogador({...novoJogador, telefone: e.target.value})}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={novoJogador.email}
                  onChange={(e) => setNovoJogador({...novoJogador, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Jogador</Label>
                <Select 
                  value={novoJogador.tipoJogador} 
                  onValueChange={(value: 'mensalista' | 'avulso') => 
                    setNovoJogador({...novoJogador, tipoJogador: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensalista">Mensalista</SelectItem>
                    <SelectItem value="avulso">Avulso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={editandoJogador ? salvarEdicao : criarJogador}>
                  {editandoJogador ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span>Lista de Jogadores</span>
          </CardTitle>
          <CardDescription>
            Gerencie todos os jogadores cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Contato</TableHead>
                  <TableHead className="font-semibold">Tipo</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jogadores.map((jogador) => (
                  <TableRow key={jogador.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{jogador.nome}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {jogador.telefone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{jogador.telefone}</span>
                          </div>
                        )}
                        {jogador.email && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{jogador.email}</span>
                          </div>
                        )}
                        {!jogador.telefone && !jogador.email && (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={jogador.tipoJogador === 'mensalista' ? "default" : "secondary"}>
                        {jogador.tipoJogador === 'mensalista' ? 'Mensalista' : 'Avulso'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={jogador.ativo ? "default" : "destructive"}>
                        {jogador.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleAtivo(jogador)}
                          className={jogador.ativo ? 
                            "text-orange-600 border-orange-600 hover:bg-orange-50" : 
                            "text-green-600 border-green-600 hover:bg-green-50"
                          }
                        >
                          {jogador.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editarJogador(jogador)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => excluirJogador(jogador.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
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
          {jogadores.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhum jogador cadastrado</p>
              <p className="text-sm text-muted-foreground">Clique em "Novo Jogador" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPlayers;
