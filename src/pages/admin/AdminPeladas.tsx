import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { temporadaService, jogadorService, peladaService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import { TimeNaPelada, Partida } from '@/types';
import PeladaCreationForm from '@/components/admin/PeladaCreationForm';
import TeamFormation from '@/components/admin/TeamFormation';
import MatchManagement from '@/components/admin/MatchManagement';
import EventRegistration from '@/components/admin/EventRegistration';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

const AdminPeladas: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Estados para criação de pelada
  const [selectedTemporada, setSelectedTemporada] = useState('');
  const [dataPelada, setDataPelada] = useState('');
  const [peladaAtual, setPeladaAtual] = useState<string>('');
  const [jogadoresPresentes, setJogadoresPresentes] = useState<JogadorPresente[]>([]);
  
  // Estados para times
  const [times, setTimes] = useState<TimeNaPelada[]>([]);
  const [proximaLetra, setProximaLetra] = useState('A');
  
  // Estados para partidas
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [partidaAtual, setPartidaAtual] = useState<Partida | null>(null);
  const [placarA, setPlacarA] = useState(0);
  const [placarB, setPlacarB] = useState(0);
  const [eventos, setEventos] = useState<EventoPartida[]>([]);
  const [tipoEvento, setTipoEvento] = useState('');
  const [jogadorEvento, setJogadorEvento] = useState('');
  const [assistenciaEvento, setAssistenciaEvento] = useState('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const criarPelada = async () => {
    if (!selectedTemporada || !dataPelada) {
      toast({
        title: "Erro",
        description: "Selecione uma temporada e data",
        variant: "destructive"
      });
      return;
    }

    try {
      const novaPelada = {
        data: new Date(dataPelada),
        temporadaId: selectedTemporada,
        partidas: [],
        presencas: []
      };

      await peladaService.create(novaPelada);

      const jogadoresComPresenca = jogadores.filter(j => j.ativo).map(jogador => ({
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: false
      }));

      setJogadoresPresentes(jogadoresComPresenca);
      
      const peladas = peladaService.getAll();
      const ultimaPelada = peladas[peladas.length - 1];
      setPeladaAtual(ultimaPelada.id);

      setTimes([]);
      setPartidas([]);
      setProximaLetra('A');

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      
      toast({
        title: "Sucesso",
        description: "Pelada criada com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar pelada",
        variant: "destructive"
      });
    }
  };

  const togglePresenca = (jogadorId: string) => {
    setJogadoresPresentes(prev => 
      prev.map(j => 
        j.id === jogadorId ? { ...j, presente: !j.presente } : j
      )
    );
  };

  const criarTime = () => {
    if (!peladaAtual) {
      toast({
        title: "Erro",
        description: "Crie uma pelada primeiro",
        variant: "destructive"
      });
      return;
    }

    const novoTime: TimeNaPelada = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      identificadorLetra: proximaLetra,
      jogadores: []
    };

    setTimes(prev => [...prev, novoTime]);
    
    const proximaChr = String.fromCharCode(proximaLetra.charCodeAt(0) + 1);
    setProximaLetra(proximaChr);

    toast({
      title: "Sucesso",
      description: `Time ${proximaLetra} criado!`
    });
  };

  const adicionarJogadorAoTime = (jogadorId: string, timeId: string) => {
    const jogadorPresente = jogadoresPresentes.find(j => j.id === jogadorId && j.presente);
    if (!jogadorPresente) return;

    setTimes(prev => prev.map(time => {
      if (time.id === timeId && !time.jogadores.includes(jogadorId) && time.jogadores.length < 6) {
        return { ...time, jogadores: [...time.jogadores, jogadorId] };
      }
      return time;
    }));
  };

  const removerJogadorDoTime = (jogadorId: string, timeId: string) => {
    setTimes(prev => prev.map(time => {
      if (time.id === timeId) {
        return { ...time, jogadores: time.jogadores.filter(id => id !== jogadorId) };
      }
      return time;
    }));
  };

  const criarPartida = (timeAId: string, timeBId: string) => {
    const timeA = times.find(t => t.id === timeAId);
    const timeB = times.find(t => t.id === timeBId);

    if (!timeA || !timeB) {
      toast({
        title: "Erro",
        description: "Selecione dois times válidos",
        variant: "destructive"
      });
      return;
    }

    if (timeA.jogadores.length < 5 || timeB.jogadores.length < 5) {
      toast({
        title: "Erro",
        description: "Cada time deve ter pelo menos 5 jogadores",
        variant: "destructive"
      });
      return;
    }

    const novaPartida: Partida = {
      id: crypto.randomUUID(),
      peladaId: peladaAtual,
      timeAId,
      timeBId,
      placarA: 0,
      placarB: 0,
      timeA,
      timeB
    };

    setPartidaAtual(novaPartida);
    setPlacarA(0);
    setPlacarB(0);
    setEventos([]);

    toast({
      title: "Sucesso",
      description: `Partida ${timeA.identificadorLetra} x ${timeB.identificadorLetra} iniciada!`
    });
  };

  const adicionarEvento = () => {
    if (!tipoEvento || !jogadorEvento || !partidaAtual) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de evento e o jogador",
        variant: "destructive"
      });
      return;
    }

    const novoEvento: EventoPartida = {
      id: Date.now().toString(),
      tipo: tipoEvento as any,
      jogadorId: jogadorEvento,
      assistidoPor: assistenciaEvento || undefined
    };

    setEventos(prev => [...prev, novoEvento]);
    setTipoEvento('');
    setJogadorEvento('');
    setAssistenciaEvento('');

    toast({
      title: "Sucesso",
      description: "Evento adicionado!"
    });
  };

  const removerEvento = (eventoId: string) => {
    setEventos(prev => prev.filter(e => e.id !== eventoId));
  };

  const finalizarPartida = () => {
    if (!partidaAtual) {
      toast({
        title: "Erro",
        description: "Nenhuma partida ativa",
        variant: "destructive"
      });
      return;
    }

    const partidaFinalizada: Partida = {
      ...partidaAtual,
      placarA,
      placarB
    };

    setPartidas(prev => [...prev, partidaFinalizada]);
    setPartidaAtual(null);
    setPlacarA(0);
    setPlacarB(0);
    setEventos([]);

    toast({
      title: "Sucesso",
      description: "Partida finalizada!"
    });
  };

  const salvarPelada = async () => {
    if (!peladaAtual || partidas.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos uma partida antes de salvar",
        variant: "destructive"
      });
      return;
    }

    try {
      const pelada = peladaService.getById(peladaAtual);
      if (!pelada) {
        toast({
          title: "Erro",
          description: "Pelada não encontrada",
          variant: "destructive"
        });
        return;
      }

      const presencasAtualizadas = jogadoresPresentes
        .filter(j => j.presente)
        .map(j => ({
          id: crypto.randomUUID(),
          peladaId: peladaAtual,
          jogadorId: j.id,
          presente: true,
          atraso: 'nenhum' as const
        }));

      const partidasFormatadas = partidas.map(p => ({
        id: p.id,
        peladaId: p.peladaId,
        numeroPartida: partidas.indexOf(p) + 1,
        timeA: p.timeA?.jogadores || [],
        timeB: p.timeB?.jogadores || [],
        golsTimeA: p.placarA,
        golsTimeB: p.placarB,
        eventos: eventos.map(e => ({
          ...e,
          partidaId: p.id,
          minuto: 0
        }))
      }));

      const peladaAtualizada = {
        ...pelada,
        partidas: partidasFormatadas,
        presencas: presencasAtualizadas
      };

      peladaService.update(peladaAtual, peladaAtualizada);

      queryClient.invalidateQueries({ queryKey: ['peladas'] });
      queryClient.invalidateQueries({ queryKey: ['ranking'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-admin'] });
      queryClient.invalidateQueries({ queryKey: ['ranking-reports'] });

      setTimes([]);
      setPartidas([]);
      setJogadoresPresentes([]);
      setPeladaAtual('');
      setProximaLetra('A');
      setPartidaAtual(null);

      toast({
        title: "Sucesso",
        description: "Pelada salva com sucesso!"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar pelada",
        variant: "destructive"
      });
    }
  };

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
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="nova-pelada">
          <PeladaCreationForm
            temporadas={temporadas}
            jogadores={jogadores}
            selectedTemporada={selectedTemporada}
            setSelectedTemporada={setSelectedTemporada}
            dataPelada={dataPelada}
            setDataPelada={setDataPelada}
            jogadoresPresentes={jogadoresPresentes}
            criarPelada={criarPelada}
            togglePresenca={togglePresenca}
          />
        </TabsContent>

        <TabsContent value="times">
          <TeamFormation
            times={times}
            proximaLetra={proximaLetra}
            jogadoresPresentes={jogadoresPresentes}
            jogadores={jogadores}
            peladaAtual={peladaAtual}
            criarTime={criarTime}
            adicionarJogadorAoTime={adicionarJogadorAoTime}
            removerJogadorDoTime={removerJogadorDoTime}
          />
        </TabsContent>

        <TabsContent value="partidas">
          <MatchManagement
            times={times}
            partidas={partidas}
            partidaAtual={partidaAtual}
            placarA={placarA}
            placarB={placarB}
            setPlacarA={setPlacarA}
            setPlacarB={setPlacarB}
            criarPartida={criarPartida}
            finalizarPartida={finalizarPartida}
          />
        </TabsContent>

        <TabsContent value="eventos">
          <EventRegistration
            eventos={eventos}
            tipoEvento={tipoEvento}
            jogadorEvento={jogadorEvento}
            assistenciaEvento={assistenciaEvento}
            jogadoresPresentes={jogadoresPresentes}
            jogadores={jogadores}
            peladaAtual={peladaAtual}
            partidas={partidas}
            setTipoEvento={setTipoEvento}
            setJogadorEvento={setJogadorEvento}
            setAssistenciaEvento={setAssistenciaEvento}
            adicionarEvento={adicionarEvento}
            removerEvento={removerEvento}
            salvarPelada={salvarPelada}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPeladas;
