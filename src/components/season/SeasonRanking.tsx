
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users } from 'lucide-react';
import { RankingJogador } from '@/types';

interface SeasonRankingProps {
  ranking: RankingJogador[];
}

const SeasonRanking: React.FC<SeasonRankingProps> = ({ ranking }) => (
  <Card>
    <CardHeader>
      <CardTitle>Ranking da Temporada</CardTitle>
      <CardDescription>Classificação atual dos jogadores</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Pos.</TableHead>
            <TableHead>Jogador</TableHead>
            <TableHead className="text-center">Pontos</TableHead>
            <TableHead className="text-center">Presenças</TableHead>
            <TableHead className="text-center">Gols</TableHead>
            <TableHead className="text-center">Assistências</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranking.map((item) => (
            <TableRow key={item.jogador.id}>
              <TableCell className="font-medium">
                {item.posicao}º
              </TableCell>
              <TableCell>
                <Link to={`/jogador/${item.jogador.id}`} className="hover:underline">
                  {item.jogador.nome}
                </Link>
              </TableCell>
              <TableCell className="text-center font-medium">
                {item.pontuacaoTotal}
              </TableCell>
              <TableCell className="text-center">
                {item.presencas}
              </TableCell>
              <TableCell className="text-center">
                {item.gols}
              </TableCell>
              <TableCell className="text-center">
                {item.assistencias}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {ranking.length === 0 && (
        <div className="text-center py-8">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">Nenhum dado de ranking</p>
          <p className="text-sm text-muted-foreground">Os dados aparecerão após as primeiras peladas</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default SeasonRanking;
