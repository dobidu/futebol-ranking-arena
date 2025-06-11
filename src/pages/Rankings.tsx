import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, calcularRanking } from '@/services/dataService';
import RankingTable from '@/components/rankings/RankingTable';
import SeasonSelector from '@/components/rankings/SeasonSelector';

const Rankings: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  React.useEffect(() => {
    if (temporadas.length > 0 && !selectedTemporada) {
      const temporadaAtiva = temporadas.find(t => t.ativa);
      setSelectedTemporada(temporadaAtiva?.id || temporadas[0].id);
    }
  }, [temporadas, selectedTemporada]);

  const { data: rankingData = [] } = useQuery({
    queryKey: ['ranking', selectedTemporada],
    queryFn: () => {
      if (!selectedTemporada) return [];
      return calcularRanking(selectedTemporada === 'all' ? undefined : selectedTemporada);
    },
    enabled: !!selectedTemporada,
  });

  console.log('Rankings - Temporada selecionada:', selectedTemporada);
  console.log('Rankings - Dados do ranking:', rankingData);

  const artilheiroData = [...rankingData].sort((a, b) => b.gols - a.gols);
  const assistenciaData = [...rankingData].sort((a, b) => b.assistencias - a.assistencias);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rankings</h1>
          <p className="text-muted-foreground">Acompanhe as classificações e estatísticas</p>
        </div>
        
        <SeasonSelector
          temporadas={temporadas}
          selectedTemporada={selectedTemporada}
          onSelectionChange={setSelectedTemporada}
        />
      </div>

      {rankingData.length === 0 && selectedTemporada && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Nenhum dado encontrado para esta temporada</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Ranking Geral</span>
          </TabsTrigger>
          <TabsTrigger value="artilharia" className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Artilharia</span>
          </TabsTrigger>
          <TabsTrigger value="assistencias" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Assistências</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5" />
                <span>Ranking Geral</span>
              </CardTitle>
              <CardDescription>
                Classificação baseada na pontuação total, considerando vitórias, presenças e descartes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RankingTable data={rankingData} type="geral" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="artilharia">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Ranking de Artilharia</span>
              </CardTitle>
              <CardDescription>
                Maiores goleadores da temporada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RankingTable data={artilheiroData} type="artilharia" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistencias">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Ranking de Assistências</span>
              </CardTitle>
              <CardDescription>
                Jogadores que mais deram assistências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RankingTable data={assistenciaData} type="assistencia" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Rankings;
