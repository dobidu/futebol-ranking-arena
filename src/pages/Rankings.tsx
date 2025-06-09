
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, calcularRanking } from '@/services/dataService';
import { RankingJogador } from '@/types';

const Rankings: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('');

  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  // Definir temporada padrão (ativa) se não tiver selecionada
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

  const RankingTable: React.FC<{ data: RankingJogador[]; type: 'geral' | 'artilharia' | 'assistencia' }> = ({ data, type }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">#</th>
            <th className="text-left py-3 px-4 font-semibold">Jogador</th>
            <th className="text-left py-3 px-4 font-semibold">Tipo</th>
            {type === 'geral' && (
              <>
                <th className="text-left py-3 px-4 font-semibold">Pontos</th>
                <th className="text-left py-3 px-4 font-semibold">Vitórias</th>
                <th className="text-left py-3 px-4 font-semibold">Presenças</th>
              </>
            )}
            {type === 'artilharia' && (
              <>
                <th className="text-left py-3 px-4 font-semibold">Gols</th>
                <th className="text-left py-3 px-4 font-semibold">Média/Jogo</th>
              </>
            )}
            {type === 'assistencia' && (
              <>
                <th className="text-left py-3 px-4 font-semibold">Assistências</th>
                <th className="text-left py-3 px-4 font-semibold">Média/Jogo</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.jogador.id} className="border-b border-border hover:bg-accent/50 transition-colors">
              <td className="py-3 px-4 font-medium">{index + 1}</td>
              <td className="py-3 px-4">{item.jogador.nome}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  item.jogador.tipo === 'Mensalista' 
                    ? 'bg-primary/10 text-primary' 
                    : 'bg-secondary/10 text-secondary-foreground'
                }`}>
                  {item.jogador.tipo}
                </span>
              </td>
              {type === 'geral' && (
                <>
                  <td className="py-3 px-4 font-semibold">{item.pontuacaoTotal}</td>
                  <td className="py-3 px-4">{item.vitorias}</td>
                  <td className="py-3 px-4">{item.presencas}</td>
                </>
              )}
              {type === 'artilharia' && (
                <>
                  <td className="py-3 px-4 font-semibold">{item.gols}</td>
                  <td className="py-3 px-4">{item.presencas > 0 ? (item.gols / item.presencas).toFixed(2) : '0.00'}</td>
                </>
              )}
              {type === 'assistencia' && (
                <>
                  <td className="py-3 px-4 font-semibold">{item.assistencias}</td>
                  <td className="py-3 px-4">{item.presencas > 0 ? (item.assistencias / item.presencas).toFixed(2) : '0.00'}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rankings</h1>
          <p className="text-muted-foreground">Acompanhe as classificações e estatísticas</p>
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

      {/* Indicador de dados carregados */}
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
