
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Pelada, Temporada } from '@/types';

interface RecentPeladasProps {
  peladas: Pelada[];
  temporadas: Temporada[];
}

const RecentPeladas: React.FC<RecentPeladasProps> = ({ peladas, temporadas }) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Últimas Peladas Realizadas</span>
        </CardTitle>
        <CardDescription>
          Histórico recente de peladas com detalhes das partidas
        </CardDescription>
      </CardHeader>
      <CardContent>
        {peladas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Temporada</TableHead>
                <TableHead className="text-center">Partidas</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Jogadores</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peladas.slice(-8).reverse().map((pelada) => {
                const golsDaPelada = pelada.partidas?.reduce((acc, p) => acc + p.placarA + p.placarB, 0) || 0;
                const jogadoresDaPelada = pelada.jogadoresPresentes?.length || 0;
                
                return (
                  <TableRow key={pelada.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {new Date(pelada.data).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {temporadas.find(t => t.id === pelada.temporadaId)?.nome || 'N/A'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">{pelada.partidas?.length || 0}</TableCell>
                    <TableCell className="text-center font-medium text-red-600">{golsDaPelada}</TableCell>
                    <TableCell className="text-center font-medium text-blue-600">{jogadoresDaPelada}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-600">Concluída</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">Nenhuma pelada cadastrada ainda</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPeladas;
