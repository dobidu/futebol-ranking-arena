
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
  // Calcular parcerias baseado em gols e assistências reais das peladas
  const calcularParcerias = () => {
    const parcerias: { [key: string]: { 
      jogos: number; 
      golsCombo: number; 
      assistenciasCombo: number;
      jogador1: string;
      jogador2: string;
    } } = {};
    
    peladas.forEach(pelada => {
      if (pelada.times) {
        pelada.times.forEach(time => {
          if (time.jogadores.length >= 2) {
            // Para cada combinação de jogadores no mesmo time
            for (let i = 0; i < time.jogadores.length; i++) {
              for (let j = i + 1; j < time.jogadores.length; j++) {
                const jogador1Info = ranking.find(r => r.jogador.id === time.jogadores[i]);
                const jogador2Info = ranking.find(r => r.jogador.id === time.jogadores[j]);
                
                if (jogador1Info && jogador2Info) {
                  const chave = [jogador1Info.jogador.nome, jogador2Info.jogador.nome].sort().join(' & ');
                  
                  if (!parcerias[chave]) {
                    parcerias[chave] = { 
                      jogos: 0, 
                      golsCombo: 0, 
                      assistenciasCombo: 0,
                      jogador1: jogador1Info.jogador.nome,
                      jogador2: jogador2Info.jogador.nome
                    };
                  }
                  
                  parcerias[chave].jogos++;
                  
                  // Contar gols e assistências da partida específica
                  if (pelada.partidas) {
                    pelada.partidas.forEach(partida => {
                      if (partida.eventos) {
                        partida.eventos.forEach(evento => {
                          if (evento.jogadorId === time.jogadores[i] || evento.jogadorId === time.jogadores[j]) {
                            if (evento.tipo === 'gol') {
                              parcerias[chave].golsCombo++;
                            }
                            if (evento.assistidoPor === time.jogadores[i] || evento.assistidoPor === time.jogadores[j]) {
                              parcerias[chave].assistenciasCombo++;
                            }
                          }
                        });
                      }
                    });
                  }
                }
              }
            }
          }
        });
      }
    });

    return Object.entries(parcerias)
      .map(([nomes, stats]) => ({ nomes, ...stats }))
      .sort((a, b) => (b.golsCombo + b.assistenciasCombo) - (a.golsCombo + a.assistenciasCombo))
      .slice(0, 8);
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
          <CardDescription>Duplas com melhor performance em gols e assistências</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceria</TableHead>
                <TableHead className="text-center">Jogos Juntos</TableHead>
                <TableHead className="text-center">Gols Combinados</TableHead>
                <TableHead className="text-center">Assistências</TableHead>
                <TableHead className="text-center">Total Contribuições</TableHead>
                <TableHead className="text-center">Efetividade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topParcerias.map((parceria, index) => {
                const totalContribuicoes = parceria.golsCombo + parceria.assistenciasCombo;
                const efetividade = parceria.jogos > 0 ? (totalContribuicoes / parceria.jogos).toFixed(1) : '0.0';
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{parceria.nomes}</TableCell>
                    <TableCell className="text-center">{parceria.jogos}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {parceria.golsCombo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {parceria.assistenciasCombo}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {totalContribuicoes}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={parseFloat(efetividade) >= 1.0 ? "default" : "secondary"}>
                        {efetividade}/jogo
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
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
