
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Users } from 'lucide-react';
import { RankingJogador } from '@/types';

const Rankings: React.FC = () => {
  const [selectedTemporada, setSelectedTemporada] = useState<string>('all');

  // Dados de exemplo - serão substituídos por dados reais da API
  const mockRankingData: RankingJogador[] = [
    {
      jogador: { id: '1', nome: 'João Silva', tipo: 'Mensalista', ativo: true, criadoEm: new Date() },
      pontuacaoTotal: 450,
      vitorias: 15,
      presencas: 20,
      gols: 8,
      assistencias: 5,
      cartoesAmarelos: 2,
      cartoesAzuis: 0,
      cartoesVermelhos: 0,
      mediaPresenca: 0.85,
      posicao: 1,
    },
    {
      jogador: { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', ativo: true, criadoEm: new Date() },
      pontuacaoTotal: 430,
      vitorias: 14,
      presencas: 18,
      gols: 12,
      assistencias: 3,
      cartoesAmarelos: 1,
      cartoesAzuis: 1,
      cartoesVermelhos: 0,
      mediaPresenca: 0.82,
      posicao: 2,
    },
    {
      jogador: { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', ativo: true, criadoEm: new Date() },
      pontuacaoTotal: 410,
      vitorias: 13,
      presencas: 16,
      gols: 6,
      assistencias: 8,
      cartoesAmarelos: 0,
      cartoesAzuis: 0,
      cartoesVermelhos: 0,
      mediaPresenca: 0.80,
      posicao: 3,
    },
  ];

  const artilheiroData = [...mockRankingData].sort((a, b) => b.gols - a.gols);
  const assistenciaData = [...mockRankingData].sort((a, b) => b.assistencias - a.assistencias);

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
                  <td className="py-3 px-4">{(item.gols / item.presencas).toFixed(2)}</td>
                </>
              )}
              {type === 'assistencia' && (
                <>
                  <td className="py-3 px-4 font-semibold">{item.assistencias}</td>
                  <td className="py-3 px-4">{(item.assistencias / item.presencas).toFixed(2)}</td>
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
            <SelectItem value="2024.2">2024.2</SelectItem>
            <SelectItem value="2024.1">2024.1</SelectItem>
          </SelectContent>
        </Select>
      </div>

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
              <RankingTable data={mockRankingData} type="geral" />
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
