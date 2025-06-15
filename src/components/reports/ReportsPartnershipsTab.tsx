
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, Target } from 'lucide-react';
import { RankingJogador, Pelada } from '@/types';

interface ReportsPartnershipsTabProps {
  ranking: RankingJogador[];
  peladas: Pelada[];
}

const ReportsPartnershipsTab: React.FC<ReportsPartnershipsTabProps> = ({ ranking, peladas }) => {
  // Calcular parcerias baseado em assistências específicas entre jogadores
  const calcularParceriasAssistencias = () => {
    const parcerias: { [key: string]: { 
      assistencias: number; 
      jogosJuntos: number;
      assistente: string;
      goleador: string;
    } } = {};
    
    peladas.forEach(pelada => {
      // Primeiro, identificar quais jogadores jogaram juntos em cada pelada
      const jogadoresPorTime: { [timeId: string]: string[] } = {};
      
      if (pelada.times) {
        pelada.times.forEach(time => {
          jogadoresPorTime[time.id] = time.jogadores;
        });
      }
      
      // Processar eventos de gol com assistências
      if (pelada.partidas) {
        pelada.partidas.forEach(partida => {
          if (partida.eventos) {
            partida.eventos.forEach(evento => {
              if (evento.tipo === 'gol' && evento.assistidoPor) {
                const goleadorInfo = ranking.find(r => r.jogador.id === evento.jogadorId);
                const assistenteInfo = ranking.find(r => r.jogador.id === evento.assistidoPor);
                
                if (goleadorInfo && assistenteInfo) {
                  // Verificar se jogaram no mesmo time
                  let jogavamJuntos = false;
                  Object.values(jogadoresPorTime).forEach(jogadoresTime => {
                    if (jogadoresTime.includes(evento.jogadorId) && jogadoresTime.includes(evento.assistidoPor)) {
                      jogavamJuntos = true;
                    }
                  });
                  
                  if (jogavamJuntos) {
                    const chave = `${assistenteInfo.jogador.nome} → ${goleadorInfo.jogador.nome}`;
                    
                    if (!parcerias[chave]) {
                      parcerias[chave] = { 
                        assistencias: 0, 
                        jogosJuntos: 0,
                        assistente: assistenteInfo.jogador.nome,
                        goleador: goleadorInfo.jogador.nome
                      };
                    }
                    
                    parcerias[chave].assistencias++;
                  }
                }
              }
            });
          }
        });
      }
    });

    // Calcular jogos juntos para cada parceria
    Object.keys(parcerias).forEach(chave => {
      const parceria = parcerias[chave];
      let jogosJuntos = 0;
      
      peladas.forEach(pelada => {
        if (pelada.times) {
          const jogouJunto = pelada.times.some(time => {
            const assistentePresente = time.jogadores.some(jogadorId => {
              const jogador = ranking.find(r => r.jogador.id === jogadorId);
              return jogador?.jogador.nome === parceria.assistente;
            });
            const goleadorPresente = time.jogadores.some(jogadorId => {
              const jogador = ranking.find(r => r.jogador.id === jogadorId);
              return jogador?.jogador.nome === parceria.goleador;
            });
            return assistentePresente && goleadorPresente;
          });
          
          if (jogouJunto) {
            jogosJuntos++;
          }
        }
      });
      
      parcerias[chave].jogosJuntos = jogosJuntos;
    });

    return Object.entries(parcerias)
      .map(([chave, stats]) => ({ 
        parceria: chave, 
        ...stats 
      }))
      .sort((a, b) => b.assistencias - a.assistencias)
      .slice(0, 10);
  };

  const topParceriasAssistencias = calcularParceriasAssistencias();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Melhores Parcerias - Assistências para Gols</span>
          </CardTitle>
          <CardDescription>
            Duplas que mais se conectam: assistências específicas entre jogadores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parceria</TableHead>
                <TableHead className="text-center">Assistências</TableHead>
                <TableHead className="text-center">Jogos Juntos</TableHead>
                <TableHead className="text-center">Eficiência</TableHead>
                <TableHead className="text-center">Química</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topParceriasAssistencias.map((parceria, index) => {
                const eficiencia = parceria.jogosJuntos > 0 ? (parceria.assistencias / parceria.jogosJuntos).toFixed(2) : '0.00';
                const quimica = parseFloat(eficiencia) >= 0.5 ? 'Alta' : parseFloat(eficiencia) >= 0.25 ? 'Média' : 'Baixa';
                
                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{parceria.parceria}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {parceria.assistencias}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">
                        {parceria.jogosJuntos}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">
                        {eficiencia}/jogo
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={quimica === 'Alta' ? 'default' : quimica === 'Média' ? 'secondary' : 'outline'}
                        className={
                          quimica === 'Alta' ? 'bg-green-100 text-green-800' :
                          quimica === 'Média' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {quimica}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          {topParceriasAssistencias.length === 0 && (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma assistência registrada entre jogadores</p>
              <p className="text-sm text-muted-foreground mt-2">
                Assistências específicas aparecerão aqui quando houver dados registrados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPartnershipsTab;
