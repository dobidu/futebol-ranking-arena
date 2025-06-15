
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, Trophy } from 'lucide-react';
import { RankingJogador, Temporada } from '@/types';

interface RankingSectionProps {
  ranking: RankingJogador[];
  temporadaAtiva?: Temporada;
}

const RankingSection: React.FC<RankingSectionProps> = ({ ranking, temporadaAtiva }) => {
  return (
    <Card className="xl:col-span-2 border-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span>Top 10 Ranking Geral</span>
        </CardTitle>
        <CardDescription>
          Classificação atual da temporada {temporadaAtiva?.nome || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {ranking.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Jogador</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Assist.</TableHead>
                <TableHead className="text-right">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.slice(0, 10).map((item, index) => (
                <TableRow key={item.jogador.id} className="hover:bg-muted/50">
                  <TableCell className="font-bold">
                    <span className={`${index < 3 ? 'text-yellow-600' : ''}`}>
                      {index + 1}
                      {index === 0 && ' 🥇'}
                      {index === 1 && ' 🥈'}
                      {index === 2 && ' 🥉'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{item.jogador.nome}</TableCell>
                  <TableCell>
                    <Badge variant={item.jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                      {item.jogador.tipo}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.gols}</TableCell>
                  <TableCell className="text-center font-medium">{item.assistencias}</TableCell>
                  <TableCell className="text-right font-bold text-lg">{item.pontuacaoTotal}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhum dado de ranking disponível</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingSection;
