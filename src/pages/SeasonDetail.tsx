
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Trophy, ArrowLeft, PlayCircle, Edit, Plus, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { temporadaService, peladaService, calcularRanking } from '@/services/dataService';
import SeasonStats from '@/components/season/SeasonStats';
import SeasonRanking from '@/components/season/SeasonRanking';

const SeasonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isAdminRoute = location.pathname.includes('/admin/');

  const { data: temporada } = useQuery({
    queryKey: ['temporada', id],
    queryFn: () => temporadaService.getById(id!),
    enabled: !!id,
  });

  const { data: peladas = [] } = useQuery({
    queryKey: ['peladas-temporada', id],
    queryFn: peladaService.getAll,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-temporada', id],
    queryFn: () => calcularRanking(id),
    enabled: !!id,
  });

  if (!temporada) {
    return <div>Temporada não encontrada</div>;
  }

  const peladasTemporada = peladas.filter(p => p.temporadaId === id);

  const calcularEstatisticasTemporada = () => {
    let totalGols = 0;
    let totalPartidas = 0;
    
    peladasTemporada.forEach(pelada => {
      if (pelada.partidas) {
        totalPartidas += pelada.partidas.length;
        pelada.partidas.forEach(partida => {
          totalGols += partida.placarA + partida.placarB;
        });
      }
    });

    return { totalGols, totalPartidas };
  };

  const statsTemporada = calcularEstatisticasTemporada();

  const backUrl = isAdminRoute ? '/admin/temporadas' : '/temporadas';

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link to={backUrl}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span>Temporada {temporada.nome}</span>
            {temporada.ativa && <Badge variant="default">Ativa</Badge>}
          </h1>
          <p className="text-muted-foreground">
            Criada em {new Date(temporada.criadaEm).toLocaleDateString('pt-BR')} • 
            {peladasTemporada.length} pelada{peladasTemporada.length !== 1 ? 's' : ''} • 
            {statsTemporada.totalPartidas} partida{statsTemporada.totalPartidas !== 1 ? 's' : ''}
          </p>
        </div>
        {isAdminRoute && (
          <Link to={`/admin/peladas`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Pelada
            </Button>
          </Link>
        )}
      </div>

      <SeasonStats
        temporada={temporada}
        peladasTemporada={peladasTemporada}
        ranking={ranking}
      />

      <SeasonRanking ranking={ranking} />

      {/* Peladas da Temporada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Peladas da Temporada</span>
          </CardTitle>
          <CardDescription>
            {isAdminRoute ? 'Gerencie as peladas desta temporada' : 'Histórico completo de peladas da temporada'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {peladasTemporada.map(pelada => {
              const stats = {
                jogadores: pelada.jogadoresPresentes?.length || pelada.presencas?.filter(p => p.presente).length || 0,
                partidas: pelada.partidas?.length || 0,
                gols: pelada.partidas?.reduce((total, partida) => total + partida.placarA + partida.placarB, 0) || 0
              };

              const linkTo = isAdminRoute ? `/admin/pelada/${pelada.id}` : `/pelada/${pelada.id}`;

              return (
                <div key={pelada.id} className="group">
                  <Link to={linkTo}>
                    <Card className="hover:shadow-md transition-all duration-200 group-hover:scale-105 cursor-pointer bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {new Date(pelada.data).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {isAdminRoute && (
                            <div className="flex space-x-2">
                              <Link 
                                to={`/admin/pelada/${pelada.id}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <PlayCircle className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Link 
                                to={`/admin/peladas/editar/${pelada.id}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="bg-white rounded-lg p-2 border">
                            <div className="flex items-center justify-center space-x-1">
                              <Users className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-muted-foreground">Jogadores</span>
                            </div>
                            <div className="text-lg font-bold text-blue-600">{stats.jogadores}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-2 border">
                            <div className="flex items-center justify-center space-x-1">
                              <Trophy className="h-3 w-3 text-purple-600" />
                              <span className="text-xs text-muted-foreground">Partidas</span>
                            </div>
                            <div className="text-lg font-bold text-purple-600">{stats.partidas}</div>
                          </div>
                          
                          <div className="bg-white rounded-lg p-2 border">
                            <div className="flex items-center justify-center space-x-1">
                              <Target className="h-3 w-3 text-green-600" />
                              <span className="text-xs text-muted-foreground">Gols</span>
                            </div>
                            <div className="text-lg font-bold text-green-600">{stats.gols}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              );
            })}
          </div>
          
          {peladasTemporada.length === 0 && (
            <div className="text-center py-12">
              <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <p className="text-xl font-medium text-muted-foreground mb-2">Nenhuma pelada registrada</p>
              <p className="text-sm text-muted-foreground mb-6">
                {isAdminRoute 
                  ? 'Comece criando a primeira pelada desta temporada' 
                  : 'As peladas aparecerão aqui quando forem criadas'
                }
              </p>
              {isAdminRoute && (
                <Link to={`/admin/peladas`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Pelada
                  </Button>
                </Link>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SeasonDetail;
