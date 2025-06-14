
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService } from '@/services/dataService';
import PeladaCreationForm from '@/components/admin/PeladaCreationForm';
import TeamFormation from '@/components/admin/TeamFormation';
import MatchManagement from '@/components/admin/MatchManagement';
import FinalizarPelada from '@/components/admin/FinalizarPelada';
import { usePeladaState } from '@/hooks/usePeladaState';
import { usePeladaActions } from '@/hooks/usePeladaActions';

const AdminPeladas: React.FC = () => {
  const { id: peladaId } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('nova-pelada');
  const peladaState = usePeladaState();
  
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  // Se estamos editando uma pelada, carregue os dados
  const { data: peladaParaEdicao } = useQuery({
    queryKey: ['pelada-edicao', peladaId],
    queryFn: () => peladaService.getById(peladaId!),
    enabled: !!peladaId,
  });

  const peladaActions = usePeladaActions({
    ...peladaState,
    jogadores,
    onTabChange: setActiveTab
  });

  const isEditMode = !!peladaId;
  const pageTitle = isEditMode ? 'Editar Pelada' : 'Súmula Digital';
  const pageDescription = isEditMode ? 'Edite os dados da pelada selecionada' : 'Registre peladas com múltiplos times e partidas';

  // Determinar quais abas devem estar disponíveis
  const canGoToTimes = peladaState.jogadoresPresentes.some(j => j.presente) || isEditMode;
  const canGoToPartidas = peladaState.times.length >= 2 || isEditMode;
  const canGoToFinalizar = peladaState.partidas.length > 0 || isEditMode;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{pageTitle}</h1>
        <p className="text-sm sm:text-base text-muted-foreground">{pageDescription}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-4 min-w-max sm:min-w-0">
            <TabsTrigger 
              value="nova-pelada" 
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              {isEditMode ? 'Dados' : 'Nova Pelada'}
            </TabsTrigger>
            <TabsTrigger 
              value="times" 
              disabled={!canGoToTimes}
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              Times
            </TabsTrigger>
            <TabsTrigger 
              value="partidas" 
              disabled={!canGoToPartidas}
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              Partidas
            </TabsTrigger>
            <TabsTrigger 
              value="salvar" 
              disabled={!canGoToFinalizar}
              className="text-xs sm:text-sm px-2 sm:px-4 whitespace-nowrap"
            >
              Finalizar
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="nova-pelada">
          <PeladaCreationForm
            temporadas={temporadas}
            jogadores={jogadores}
            selectedTemporada={peladaState.selectedTemporada}
            setSelectedTemporada={peladaState.setSelectedTemporada}
            dataPelada={peladaState.dataPelada}
            setDataPelada={peladaState.setDataPelada}
            jogadoresPresentes={peladaState.jogadoresPresentes}
            criarPelada={peladaActions.criarPelada}
            togglePresenca={peladaActions.togglePresenca}
            setAtrasoJogador={peladaActions.setAtrasoJogador}
            isEditMode={isEditMode}
            peladaParaEdicao={peladaParaEdicao}
            onNextStep={() => setActiveTab('times')}
          />
        </TabsContent>

        <TabsContent value="times">
          <TeamFormation
            times={peladaState.times}
            proximaLetra={peladaState.proximaLetra}
            jogadoresPresentes={peladaState.jogadoresPresentes}
            jogadores={jogadores}
            peladaAtual={peladaState.peladaAtual}
            criarTime={peladaActions.criarTime}
            adicionarJogadorAoTime={peladaActions.adicionarJogadorAoTime}
            removerJogadorDoTime={peladaActions.removerJogadorDoTime}
            onNextStep={() => setActiveTab('partidas')}
          />
        </TabsContent>

        <TabsContent value="partidas">
          <MatchManagement
            times={peladaState.times}
            partidas={peladaState.partidas}
            partidaAtual={peladaState.partidaAtual}
            placarA={peladaState.placarA}
            placarB={peladaState.placarB}
            setPlacarA={peladaState.setPlacarA}
            setPlacarB={peladaState.setPlacarB}
            criarPartida={peladaActions.criarPartida}
            finalizarPartida={peladaActions.finalizarPartida}
            jogadoresPresentes={peladaState.jogadoresPresentes}
            jogadores={jogadores}
            eventos={peladaState.eventos}
            adicionarEvento={peladaActions.adicionarEvento}
            removerEvento={peladaActions.removerEvento}
            onNextStep={() => setActiveTab('salvar')}
          />
        </TabsContent>

        <TabsContent value="salvar">
          <FinalizarPelada
            jogadoresPresentes={peladaState.jogadoresPresentes}
            times={peladaState.times}
            partidas={peladaState.partidas}
            eventos={peladaState.eventos}
            salvarPelada={peladaActions.salvarPelada}
            isEditMode={isEditMode}
            peladaId={peladaId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
