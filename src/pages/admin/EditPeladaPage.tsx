
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { peladaService, temporadaService, jogadorService } from '@/services/dataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditPresencaTab from '@/components/admin/edit-pelada/EditPresencaTab';
import EditPartidasTab from '@/components/admin/edit-pelada/EditPartidasTab';

const EditPeladaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('presenca');

  const { data: pelada } = useQuery({
    queryKey: ['pelada', id],
    queryFn: () => peladaService.getById(id!),
    enabled: !!id,
  });

  const { data: temporada } = useQuery({
    queryKey: ['temporada', pelada?.temporadaId],
    queryFn: () => temporadaService.getById(pelada?.temporadaId!),
    enabled: !!pelada?.temporadaId,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const handleSave = async (dadosAtualizados: any) => {
    if (!pelada) return;

    try {
      peladaService.update(pelada.id, dadosAtualizados);
      
      queryClient.invalidateQueries({ queryKey: ['pelada', id] });
      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      
      toast({
        title: "Sucesso",
        description: "Pelada atualizada com sucesso!"
      });

      navigate(`/admin/pelada/${id}`);
    } catch (error) {
      console.error('Erro ao salvar pelada:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar alterações",
        variant: "destructive"
      });
    }
  };

  if (!pelada) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Pelada não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/admin/pelada/${id}`)}
          className="w-full sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Editar Pelada
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Data: {new Date(pelada.data).toLocaleDateString('pt-BR')} • Temporada: {temporada?.nome}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 min-w-max sm:min-w-0">
            <TabsTrigger 
              value="presenca"
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              Presença
            </TabsTrigger>
            <TabsTrigger 
              value="partidas"
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              Partidas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="presenca">
          <EditPresencaTab
            pelada={pelada}
            jogadores={jogadores}
            temporada={temporada}
            onSave={handleSave}
          />
        </TabsContent>

        <TabsContent value="partidas">
          <EditPartidasTab
            pelada={pelada}
            jogadores={jogadores}
            onSave={handleSave}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditPeladaPage;
