
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from 'lucide-react';

interface RecentGame {
  id: string;
  data: Date;
  temporada: string;
  pontos: number;
  status: string;
  gols: number;
  assistencias: number;
  vitorias: boolean;
}

interface PlayerRecentGamesProps {
  ultimasPeladas: RecentGame[];
}

const PlayerRecentGames: React.FC<PlayerRecentGamesProps> = ({ ultimasPeladas }) => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-primary" />
          <span>Últimas Peladas</span>
        </CardTitle>
        <CardDescription>Performance nas peladas mais recentes</CardDescription>
      </CardHeader>
      <CardContent>
        {ultimasPeladas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Temporada</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Assists</TableHead>
                <TableHead className="text-center">Resultado</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimasPeladas.map((pelada) => (
                <TableRow key={pelada.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    {pelada.data.toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {pelada.temporada}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-bold">
                      {pelada.pontos}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-600 font-medium">{pelada.gols}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-blue-600 font-medium">{pelada.assistencias}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={pelada.vitorias ? 'default' : 'secondary'}>
                      {pelada.vitorias ? 'Vitória' : 'Outros'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/pelada/${pelada.id}`}>
                      <Button variant="outline" size="sm" className="hover:bg-primary hover:text-primary-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma pelada registrada</p>
            <p className="text-sm text-muted-foreground">As peladas aparecerão aqui quando o jogador participar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerRecentGames;
