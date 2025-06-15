
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, calcularRanking } from '@/services/dataService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SeasonSelector from '@/components/rankings/SeasonSelector';
import RankingTable from '@/components/rankings/RankingTable';

const Rankings: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  // Selecionar temporada ativa por padrão
  React.useEffect(() => {
    if (temporadas.length > 0 && !selectedTemporada) {
      const temporadaAtiva = temporadas.find(t => t.ativa);
      if (temporadaAtiva) {
        setSelectedTemporada(temporadaAtiva.id);
      } else {
        setSelectedTemporada(temporadas[0].id);
      }
    }
  }, [temporadas, selectedTemporada]);

  const selectedTemporadaObj = temporadas.find(t => t.id === selectedTemporada);

  // Calculate ranking data
  const rankingData = React.useMemo(() => {
    if (!selectedTemporada) return [];
    return calcularRanking(selectedTemporada);
  }, [selectedTemporada]);

  // Sort data for different ranking types
  const artilheirosData = React.useMemo(() => {
    return [...rankingData].sort((a, b) => b.gols - a.gols);
  }, [rankingData]);

  const assistenciasData = React.useMemo(() => {
    return [...rankingData].sort((a, b) => b.assistencias - a.assistencias);
  }, [rankingData]);

  const disciplinaData = React.useMemo(() => {
    return [...rankingData].sort((a, b) => {
      const totalCartoesA = a.cartoesAmarelos + a.cartoesAzuis + a.cartoesVermelhos;
      const totalCartoesB = b.cartoesAmarelos + b.cartoesAzuis + b.cartoesVermelhos;
      return totalCartoesB - totalCartoesA;
    });
  }, [rankingData]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Rankings</h1>
        <p className="text-muted-foreground">Classificações e estatísticas dos jogadores</p>
      </div>

      <div className="flex justify-center">
        <SeasonSelector
          temporadas={temporadas}
          selectedTemporada={selectedTemporada}
          onSelectionChange={setSelectedTemporada}
        />
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="artilheiros">Artilheiros</TabsTrigger>
          <TabsTrigger value="assistencias">Assistências</TabsTrigger>
          <TabsTrigger value="disciplina">Disciplina</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <RankingTable 
            data={rankingData}
            type="geral"
            temporada={selectedTemporadaObj}
          />
        </TabsContent>

        <TabsContent value="artilheiros">
          <RankingTable 
            data={artilheirosData}
            type="artilharia"
            temporada={selectedTemporadaObj}
          />
        </TabsContent>

        <TabsContent value="assistencias">
          <RankingTable 
            data={assistenciasData}
            type="assistencia"
            temporada={selectedTemporadaObj}
          />
        </TabsContent>

        <TabsContent value="disciplina">
          <RankingTable 
            data={disciplinaData}
            type="geral"
            temporada={selectedTemporadaObj}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
