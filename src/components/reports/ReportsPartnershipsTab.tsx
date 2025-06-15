
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { RankingJogador, Pelada } from '@/types';

interface ReportsPartnershipsTabProps {
  ranking: RankingJogador[];
  peladas: Pelada[];
}

const ReportsPartnershipsTab: React.FC<ReportsPartnershipsTabProps> = ({ ranking, peladas }) => {
  // Calcular parcerias (simplificado - jogadores que mais jogaram juntos)
  const calcularParcerias = () => {
    const parcerias: { [key: string]: { jogos: number; vitorias: number; gols: number } } = {};
    
    peladas.forEach(pelada => {
      if (pelada.times) {
        pelada.times.forEach(time => {
          if (time.jogadores.length >= 2) {
            for (let i = 0; i < time.jogadores.length; i++) {
              for (let j = i + 1; j < time.jogadores.length; j++) {
                const jogador1 = ranking.find(r => r.jogador.id === time.jogadores[i])?.jogador;
                const jogador2 = ranking.find(r => r.jogador.id === time.jogadores[j])?.jogador;
                
                if (jogador1 && jogador2) {
                  const chave = [jogador1.nome, jogador2.nome].sort().join(' & ');
                  if (!parcerias[chave]) {
                    parcerias[chave] = { jogos: 0, vitorias: 0, gols: 0 };
                  }
                  parcerias[chave].jogos++;
                  
                  // Calcular gols combinados da dupla
                  const golsJogador1 = ranking.find(r => r.jogador.id === jogador1.id)?.gols || 0;
                  const golsJogador2 = ranking.find(r => r.jogador.id === jogador2.id)?.gols || 0;
                  parcerias[chave].gols = Math.floor((golsJogador1 + golsJogador2) / parcerias[chave].jogos);
                }
              }
            }
          }
        });
      }
    });

    return Object.entries(parcerias)
      .map(([nomes, stats]) => ({ nomes, ...stats }))
      .sort((a, b) => b.jogos - a.jogos)
      .slice(0, 5);
  };

  const topParcerias = calcularParcerias();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Análise de Parcerias</span>
          </CardTitle>
          <CardDescription>Duplas que mais jogaram juntas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceria</TableHead>
                <TableHead className="text-center">Jogos Juntos</TableHead>
                <TableHead className="text-center">Gols Médios</TableHead>
                <TableHead className="text-center">Efetividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topParcerias.map((parceria, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{parceria.nomes}</TableCell>
                  <TableCell className="text-center">{parceria.jogos}</TableCell>
                  <TableCell className="text-center">{parceria.gols}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={parceria.jogos >= 3 ? "default" : "secondary"}>
                      {parceria.jogos >= 3 ? "Alta" : "Média"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {topParcerias.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Dados insuficientes para análise de parcerias</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPartnershipsTab;
