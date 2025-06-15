
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temporadaService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Trophy, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSeasons: React.FC = () => {
  const [novaTemporada, setNovaTemporada] = useState({
    nome: '',
    dataInicio: '',
    dataFim: '',
    ativa: false
  });
  const [dialogAberto, setDialogAberto] = useState(false);
  const [editandoTemporada, setEditandoTemporada] = useState<any>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const criarTemporada = () => {
    if (!novaTemporada.nome || !novaTemporada.dataInicio || !novaTemporada.dataFim) {
      toast({
        title: "Erro",
        description: "Todos os campos são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const temporada = temporadaService.create({
      ...novaTemporada,
      id: crypto.randomUUID(),
      valorMensalidade: 50,
      penalidadeAtraso1: 5,
      penalidadeAtraso2: 10,
      penalidadeCartaoAmarelo: 2,
      penalidadeCartaoAzul: 5,
      penalidadeCartaoVermelho: 10
    });

    queryClient.invalidateQueries({ queryKey: ['temporadas'] });
    
    setNovaTemporada({ nome: '', dataInicio: '', dataFim: '', ativa: false });
    setDialogAberto(false);
    
    toast({
      title: "Sucesso",
      description: "Temporada criada com sucesso!"
    });
  };

  const editarTemporada = (temporada: any) => {
    setEditandoTemporada(temporada);
    setNovaTemporada({
      nome: temporada.nome,
      dataInicio: temporada.dataInicio,
      dataFim: temporada.dataFim,
      ativa: temporada.ativa
    });
    setDialogAberto(true);
  };

  const salvarEdicao = () => {
    if (!editandoTemporada) return;

    temporadaService.update(editandoTemporada.id, {
      ...editandoTemporada,
      ...novaTemporada
    });

    queryClient.invalidateQueries({ queryKey: ['temporadas'] });
    
    setEditandoTemporada(null);
    setNovaTemporada({ nome: '', dataInicio: '', dataFim: '', ativa: false });
    setDialogAberto(false);
    
    toast({
      title: "Sucesso",
      description: "Temporada atualizada com sucesso!"
    });
  };

  const excluirTemporada = (id: string) => {
    temporadaService.delete(id);
    queryClient.invalidateQueries({ queryKey: ['temporadas'] });
    
    toast({
      title: "Sucesso",
      description: "Temporada excluída com sucesso!"
    });
  };

  const ativarTemporada = (id: string) => {
    // Desativar todas as temporadas
    temporadas.forEach(t => {
      temporadaService.update(t.id, { ...t, ativa: false });
    });
    
    // Ativar a temporada selecionada
    const temporada = temporadas.find(t => t.id === id);
    if (temporada) {
      temporadaService.update(id, { ...temporada, ativa: true });
    }
    
    queryClient.invalidateQueries({ queryKey: ['temporadas'] });
    
    toast({
      title: "Sucesso",
      description: "Temporada ativada com sucesso!"
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Gerenciar Temporadas</h1>
        <p className="text-muted-foreground">Administre as temporadas do sistema</p>
      </div>

      <div className="flex justify-end">
        <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditandoTemporada(null);
              setNovaTemporada({ nome: '', dataInicio: '', dataFim: '', ativa: false });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Temporada
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editandoTemporada ? 'Editar Temporada' : 'Nova Temporada'}
              </DialogTitle>
              <DialogDescription>
                {editandoTemporada ? 'Edite os dados da temporada' : 'Crie uma nova temporada'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={novaTemporada.nome}
                  onChange={(e) => setNovaTemporada({...novaTemporada, nome: e.target.value})}
                  placeholder="Ex: Temporada 2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data de Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={novaTemporada.dataInicio}
                  onChange={(e) => setNovaTemporada({...novaTemporada, dataInicio: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataFim">Data de Fim</Label>
                <Input
                  id="dataFim"
                  type="date"
                  value={novaTemporada.dataFim}
                  onChange={(e) => setNovaTemporada({...novaTemporada, dataFim: e.target.value})}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogAberto(false)}>
                  Cancelar
                </Button>
                <Button onClick={editandoTemporada ? salvarEdicao : criarTemporada}>
                  {editandoTemporada ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span>Lista de Temporadas</span>
          </CardTitle>
          <CardDescription>
            Gerencie todas as temporadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Nome</TableHead>
                  <TableHead className="font-semibold">Período</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {temporadas.map((temporada) => (
                  <TableRow key={temporada.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">{temporada.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(temporada.dataInicio).toLocaleDateString('pt-BR')} até{' '}
                          {new Date(temporada.dataFim).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={temporada.ativa ? "default" : "secondary"}>
                        {temporada.ativa ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {!temporada.ativa && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => ativarTemporada(temporada.id)}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            Ativar
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => editarTemporada(temporada)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => excluirTemporada(temporada.id)}
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
          {temporadas.length === 0 && (
            <div className="text-center py-8">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Nenhuma temporada criada</p>
              <p className="text-sm text-muted-foreground">Clique em "Nova Temporada" para começar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSeasons;
