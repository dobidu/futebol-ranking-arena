
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Trophy, Users, ArrowLeft, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PeladaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Dados mockados para demonstração
  const peladaMock = {
    id: '1',
    data: new Date('2024-03-15'),
    temporada: { id: '1', nome: '2024.1' }
  };

  const timesMock = [
    {
      id: '1',
      letra: 'A',
      jogadores: ['João Silva', 'Pedro Santos', 'Ana Costa']
    },
    {
      id: '2',
      letra: 'B',
      jogadores: ['Carlos Oliveira', 'Bruno Lima', 'Maria Santos']
    }
  ];

  const partidasMock = [
    {
      id: '1',
      timeA: 'A',
      timeB: 'B',
      placarA: 3,
      placarB: 1,
      eventos: [
        { tipo: 'Gol', jogador: 'João Silva', minuto: 15 },
        { tipo: 'Gol', jogador: 'Pedro Santos', minuto: 23 },
        { tipo: 'Gol', jogador: 'Carlos Oliveira', minuto: 30 },
        { tipo: 'Gol', jogador: 'Ana Costa', minuto: 45 },
        { tipo: 'Cartão Amarelo', jogador: 'Bruno Lima', minuto: 38 }
      ]
    }
  ];

  const pontuacaoMock = [
    { jogador: 'João Silva', pontos: 4.5, status: 'Presente' },
    { jogador: 'Pedro Santos', pontos: 4.5, status: 'Presente' },
    { jogador: 'Ana Costa', pontos: 4.5, status: 'Presente' },
    { jogador: 'Carlos Oliveira', pontos: 1.0, status: 'Presente' },
    { jogador: 'Bruno Lima', pontos: 0.5, status: 'Atraso Tipo 1' },
    { jogador: 'Maria Santos', pontos: 1.0, status: 'Presente' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={`/temporada/${peladaMock.temporada.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-primary" />
            <span>Pelada - {peladaMock.data.toLocaleDateString('pt-BR')}</span>
          </h1>
          <p className="text-muted-foreground">
            Temporada {peladaMock.temporada.nome}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Times */}
        <Card>
          <CardHeader>
            <CardTitle>Times da Pelada</CardTitle>
            <CardDescription>Composição dos times</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timesMock.map(time => (
                <div key={time.id} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2 flex items-center space-x-2">
                    <Badge variant="outline">Time {time.letra}</Badge>
                  </h3>
                  <div className="space-y-1">
                    {time.jogadores.map((jogador, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {jogador}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Partidas e Resultados */}
        <Card>
          <CardHeader>
            <CardTitle>Partidas e Resultados</CardTitle>
            <CardDescription>Jogos realizados na pelada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partidasMock.map(partida => (
                <div key={partida.id} className="border rounded-lg p-4">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold">
                      Time {partida.timeA} {partida.placarA} x {partida.placarB} Time {partida.timeB}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Eventos:</h4>
                    {partida.eventos.map((evento, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          {evento.tipo === 'Gol' && <Target className="h-4 w-4 text-green-500" />}
                          {evento.tipo === 'Cartão Amarelo' && <div className="w-4 h-4 bg-yellow-500 rounded-sm" />}
                          <span>{evento.jogador}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{evento.minuto}'</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pontuação dos Jogadores */}
      <Card>
        <CardHeader>
          <CardTitle>Pontuação da Pelada</CardTitle>
          <CardDescription>Pontos obtidos por cada jogador nesta pelada</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jogador</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Pontos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pontuacaoMock.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Link to={`/jogador/${index + 1}`} className="hover:underline">
                      {item.jogador}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={
                        item.status === 'Presente' ? 'default' : 
                        item.status.includes('Atraso') ? 'secondary' : 'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {item.pontos}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resumo Estatístico */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jogadores Presentes</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cartões Aplicados</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <div className="w-8 h-8 bg-yellow-500 rounded-sm" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PeladaDetail;
