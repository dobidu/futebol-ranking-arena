
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, jogadorService } from '@/services/dataService';
import PeladaCreationForm from '@/components/admin/PeladaCreationForm';
import TeamFormation from '@/components/admin/TeamFormation';
import MatchManagement from '@/components/admin/MatchManagement';
import FinalizarPelada from '@/components/admin/FinalizarPelada';
import { usePeladaState } from '@/hooks/usePeladaState';
import { usePeladaActions } from '@/hooks/usePeladaActions';

const AdminPeladas: React.FC = () => {
  const peladaState = usePeladaState();
  
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const peladaActions = usePeladaActions({
    ...peladaState,
    jogadores
  });

  console.log('AdminPeladas - Times:', peladaState.times);
  console.log('AdminPeladas - Partida atual:', peladaState.partidaAtual);
  console.log('AdminPeladas - Jogadores:', jogadores);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Súmula Digital</h1>
        <p className="text-muted-foreground">Registre peladas com múltiplos times e partidas</p>
      </div>

      <Tabs defaultValue="nova-pelada" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nova-pelada">Nova Pelada</TabsTrigger>
          <TabsTrigger value="times">Formar Times</TabsTrigger>
          <TabsTrigger value="partidas">Partidas</TabsTrigger>
          <TabsTrigger value="salvar">Finalizar</TabsTrigger>
        </TabsList>

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
          />
        </TabsContent>

        <TabsContent value="salvar">
          <FinalizarPelada
            jogadoresPresentes={peladaState.jogadoresPresentes}
            times={peladaState.times}
            partidas={peladaState.partidas}
            eventos={peladaState.eventos}
            salvarPelada={peladaActions.salvarPelada}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
