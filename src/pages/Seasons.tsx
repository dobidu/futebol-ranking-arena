
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, Users, PlayCircle, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService } from '@/services/dataService';

const Seasons: React.FC = () => {
  const { data: temporadas = [] } = useQuery({
    queryKey: ['temporadas'],
    queryFn: temporadaService.getAll,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas'],
    queryFn: peladaService.getAll,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Temporadas</h1>
        <p className="text-muted-foreground">Histórico de temporadas e suas peladas</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {temporadas.map(temporada => {
          const peladasTemporada = peladas.filter(p => p.temporadaId === temporada.id);
          
          return (
            <Link key={temporada.id} to={`/temporada/${temporada.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span>{temporada.nome}</span>
                    </CardTitle>
                    {temporada.ativa && (
                      <Badge variant="default">Ativa</Badge>
                    )}
                  </div>
                  <CardDescription>
                    Criada em {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                        <PlayCircle className="h-4 w-4" />
                        <span>Peladas</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">{peladasTemporada.length}</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                        <Users className="h-4 w-4" />
                        <span>Descartes</span>
                      </div>
                      <div className="text-lg font-bold text-foreground">{temporada.numeroDescartes}</div>
                    </div>
                  </div>
                  
                  {/* Pontuação por Resultado */}
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Pontuação por Resultado</h4>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <span className="text-green-600 font-medium">V: {temporada.pontosVitoria}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-yellow-600 font-medium">E: {temporada.pontosEmpate}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-red-600 font-medium">D: {temporada.pontosDerrota}</span>
                      </div>
                    </div>
                  </div>

                  {/* Penalidades */}
                  <div className="border-t border-border pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center space-x-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Penalidades</span>
                    </h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Atraso Tipo 1:</span>
                        <span className="font-medium">{temporada.penalidadeAtraso1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Atraso Tipo 2:</span>
                        <span className="font-medium">{temporada.penalidadeAtraso2}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cartão Amarelo:</span>
                        <span className="font-medium">{temporada.penalidadeCartaoAmarelo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cartão Azul:</span>
                        <span className="font-medium">{temporada.penalidadeCartaoAzul}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cartão Vermelho:</span>
                        <span className="font-medium">{temporada.penalidadeCartaoVermelho}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {temporadas.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhuma temporada encontrada</p>
            <p className="text-sm text-muted-foreground">As temporadas aparecerão aqui quando forem criadas</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Seasons;
