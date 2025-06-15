
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService, calcularRanking } from '@/services/dataService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import ReportsGeneralTab from '@/components/reports/ReportsGeneralTab';
import ReportsEvolutionTab from '@/components/reports/ReportsEvolutionTab';
import ReportsPartnershipsTab from '@/components/reports/ReportsPartnershipsTab';
import ReportsDisciplineTab from '@/components/reports/ReportsDisciplineTab';

const Reports: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas', selectedTemporada],
    queryFn: () => {
      const allPeladas = peladaService.getAll();
      return selectedTemporada ? allPeladas.filter(p => p.temporadaId === selectedTemporada) : [];
    },
    enabled: !!selectedTemporada,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking', selectedTemporada],
    queryFn: () => calcularRanking(selectedTemporada),
    enabled: !!selectedTemporada,
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Relatórios e Estatísticas</h1>
        <p className="text-muted-foreground">Análises detalhadas e métricas avançadas</p>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-xs space-y-2">
          <Label htmlFor="temporada">Temporada</Label>
          <Select value={selectedTemporada} onValueChange={setSelectedTemporada}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma temporada" />
            </SelectTrigger>
            <SelectContent>
              {temporadas.map((temporada) => (
                <SelectItem key={temporada.id} value={temporada.id}>
                  {temporada.nome} {temporada.ativa && '(Ativa)'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="geral" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="parcerias">Parcerias</TabsTrigger>
          <TabsTrigger value="disciplina">Disciplina</TabsTrigger>
        </TabsList>

        <TabsContent value="geral">
          <ReportsGeneralTab ranking={ranking} peladas={peladas} />
        </TabsContent>

        <TabsContent value="evolucao">
          <ReportsEvolutionTab ranking={ranking} peladas={peladas} />
        </TabsContent>

        <TabsContent value="parcerias">
          <ReportsPartnershipsTab ranking={ranking} peladas={peladas} />
        </TabsContent>

        <TabsContent value="disciplina">
          <ReportsDisciplineTab ranking={ranking} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
