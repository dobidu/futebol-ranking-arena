
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';

interface SeasonStats {
  temporada: string;
  temporadaId: string;
  posicao: number;
  pontos: number;
  presencas: number;
  gols: number;
  assistencias: number;
  vitorias: number;
}

interface PlayerSeasonHistoryProps {
  historicoTemporadas: SeasonStats[];
}

const PlayerSeasonHistory: React.FC<PlayerSeasonHistoryProps> = ({ historicoTemporadas }) => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-primary" />
          <span>Histórico por Temporada</span>
        </CardTitle>
        <CardDescription>Performance detalhada em cada temporada</CardDescription>
      </CardHeader>
      <CardContent>
        {historicoTemporadas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Temporada</TableHead>
                <TableHead className="text-center">Pos.</TableHead>
                <TableHead className="text-center">Pts</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Vit.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historicoTemporadas.map((temporada, index) => (
                <TableRow key={index} className="hover:bg-muted/50">
                  <TableCell>
                    <Link 
                      to={`/temporada/${temporada.temporadaId}`} 
                      className="hover:underline font-medium text-primary"
                    >
                      {temporada.temporada}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={temporada.posicao <= 3 ? 'default' : 'secondary'}
                      className={temporada.posicao <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : ''}
                    >
                      {temporada.posicao}º
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-bold">
                    {temporada.pontos}
                  </TableCell>
                  <TableCell className="text-center text-green-600 font-medium">
                    {temporada.gols}
                  </TableCell>
                  <TableCell className="text-center text-blue-600 font-medium">
                    {temporada.vitorias}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma participação registrada</p>
            <p className="text-sm text-muted-foreground">As temporadas aparecerão aqui quando o jogador participar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerSeasonHistory;
