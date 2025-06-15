
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService } from '@/services/dataService';
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
            temporada={selectedTemporadaObj} 
            tipo="geral"
          />
        </TabsContent>

        <TabsContent value="artilheiros">
          <RankingTable 
            temporada={selectedTemporadaObj} 
            tipo="artilheiros"
          />
        </TabsContent>

        <TabsContent value="assistencias">
          <RankingTable 
            temporada={selectedTemporadaObj} 
            tipo="assistencias"
          />
        </TabsContent>

        <TabsContent value="disciplina">
          <RankingTable 
            temporada={selectedTemporadaObj} 
            tipo="disciplina"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
