
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User, Trophy, Target, Users, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Dados mockados para demonstração
  const jogadorMock = {
    id: '1',
    nome: 'João Silva',
    tipo: 'Mensalista',
    ativo: true,
    criadoEm: new Date('2024-01-15')
  };

  const estatisticasGerais = {
    totalPontos: 450,
    totalPresencas: 20,
    totalGols: 28,
    totalAssistencias: 15,
    mediaPresenca: 90,
    temporadasParticipadas: 3
  };

  const historicoTemporadas = [
    {
      temporada: '2024.1',
      posicao: 1,
      pontos: 180,
      presencas: 8,
      gols: 12,
      assistencias: 6
    },
    {
      temporada: '2023.2',
      posicao: 3,
      pontos: 145,
      presencas: 7,
      gols: 9,
      assistencias: 5
    },
    {
      temporada: '2023.1',
      posicao: 2,
      pontos: 125,
      presencas: 5,
      gols: 7,
      assistencias: 4
    }
  ];

  const ultimasPeladas = [
    {
      id: '1',
      data: new Date('2024-03-15'),
      temporada: '2024.1',
      pontos: 4.5,
      status: 'Presente',
      gols: 2,
      assistencias: 1
    },
    {
      id: '2',
      data: new Date('2024-03-08'),
      temporada: '2024.1',
      pontos: 3.0,
      status: 'Presente',
      gols: 1,
      assistencias: 0
    },
    {
      id: '3',
      data: new Date('2024-03-01'),
      temporada: '2024.1',
      pontos: 1.0,
      status: 'Presente',
      gols: 0,
      assistencias: 1
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to="/jogadores">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <User className="h-8 w-8 text-primary" />
            <span>{jogadorMock.nome}</span>
          </h1>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant={jogadorMock.tipo === 'Mensalista' ? 'default' : 'secondary'}>
              {jogadorMock.tipo}
            </Badge>
            <Badge variant={jogadorMock.ativo ? 'default' : 'destructive'}>
              {jogadorMock.ativo ? 'Ativo' : 'Inativo'}
            </Badge>
            <span className="text-muted-foreground">
              • Membro desde {jogadorMock.criadoEm.toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Pontos</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalPontos}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalGols}</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assistências</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalAssistencias}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Presenças</p>
                <p className="text-2xl font-bold">{estatisticasGerais.totalPresencas}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Histórico por Temporada */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico por Temporada</CardTitle>
            <CardDescription>Performance em cada temporada participada</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Temporada</TableHead>
                  <TableHead className="text-center">Pos.</TableHead>
                  <TableHead className="text-center">Pontos</TableHead>
                  <TableHead className="text-center">Gols</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicoTemporadas.map((temporada, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Link to={`/temporada/${index + 1}`} className="hover:underline">
                        {temporada.temporada}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={temporada.posicao <= 3 ? 'default' : 'secondary'}>
                        {temporada.posicao}º
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {temporada.pontos}
                    </TableCell>
                    <TableCell className="text-center">
                      {temporada.gols}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Médias e Estatísticas Avançadas */}
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas Avançadas</CardTitle>
            <CardDescription>Médias e indicadores de performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Pontos por Pelada:</span>
              <span className="text-sm font-medium">
                {(estatisticasGerais.totalPontos / estatisticasGerais.totalPresencas).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Gols por Pelada:</span>
              <span className="text-sm font-medium">
                {(estatisticasGerais.totalGols / estatisticasGerais.totalPresencas).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Média de Assistências:</span>
              <span className="text-sm font-medium">
                {(estatisticasGerais.totalAssistencias / estatisticasGerais.totalPresencas).toFixed(1)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Taxa de Presença:</span>
              <span className="text-sm font-medium">{estatisticasGerais.mediaPresenca}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Temporadas Participadas:</span>
              <span className="text-sm font-medium">{estatisticasGerais.temporadasParticipadas}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimas Peladas */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Peladas</CardTitle>
          <CardDescription>Performance nas peladas mais recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Temporada</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
                <TableHead className="text-center">Gols</TableHead>
                <TableHead className="text-center">Assistências</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimasPeladas.map((pelada) => (
                <TableRow key={pelada.id}>
                  <TableCell>
                    {pelada.data.toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Link to={`/temporada/1`} className="hover:underline">
                      {pelada.temporada}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default">
                      {pelada.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {pelada.pontos}
                  </TableCell>
                  <TableCell className="text-center">
                    {pelada.gols}
                  </TableCell>
                  <TableCell className="text-center">
                    {pelada.assistencias}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link to={`/pelada/${pelada.id}`}>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProfile;
