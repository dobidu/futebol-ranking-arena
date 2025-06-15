
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { calcularRanking, temporadaService, peladaService } from '@/services/dataService';
import ReportsGeneralTab from '@/components/reports/ReportsGeneralTab';
import ReportsDisciplineTab from '@/components/reports/ReportsDisciplineTab';
import ReportsPartnershipsTab from '@/components/reports/ReportsPartnershipsTab';
import ReportsEvolutionTab from '@/components/reports/ReportsEvolutionTab';

const Reports: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  // Definir temporada padrão (ativa) se não tiver selecionada
  React.useEffect(() => {
    if (temporadas.length > 0 && !selectedTemporada) {
      const temporadaAtiva = temporadas.find(t => t.ativa);
      setSelectedTemporada(temporadaAtiva?.id || temporadas[0].id);
    }
  }, [temporadas, selectedTemporada]);

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-reports', selectedTemporada],
    queryFn: () => {
      if (!selectedTemporada) return [];
      return calcularRanking(selectedTemporada === 'all' ? undefined : selectedTemporada);
    },
    enabled: !!selectedTemporada,
  });

  // Filtrar peladas da temporada selecionada
  const peladasFiltradas = selectedTemporada && selectedTemporada !== 'all' 
    ? peladas.filter(p => p.temporadaId === selectedTemporada)
    : peladas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios e Estatísticas</h1>
          <p className="text-muted-foreground">Análises detalhadas do campeonato</p>
        </div>
        
        <Select value={selectedTemporada} onValueChange={setSelectedTemporada}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Selecione a temporada" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Temporadas</SelectItem>
            {temporadas.filter(t => t.id && t.nome).map((temporada) => (
              <SelectItem key={temporada.id} value={temporada.id}>
                {temporada.nome} {temporada.ativa && '(Ativa)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="disciplina">Disciplina</TabsTrigger>
          <TabsTrigger value="parcerias">Parcerias</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <ReportsGeneralTab 
            ranking={ranking} 
            peladas={peladasFiltradas} 
          />
        </TabsContent>

        <TabsContent value="disciplina">
          <ReportsDisciplineTab ranking={ranking} />
        </TabsContent>

        <TabsContent value="parcerias">
          <ReportsPartnershipsTab 
            ranking={ranking} 
            peladas={peladasFiltradas} 
          />
        </TabsContent>

        <TabsContent value="evolucao">
          <ReportsEvolutionTab 
            ranking={ranking} 
            peladas={peladasFiltradas} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
