
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, User, Trophy, Target, Users as UsersIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jogadorService, calcularRanking } from '@/services/dataService';
import { Jogador } from '@/types';
import { Link } from 'react-router-dom';

const Players: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('all');

  const { data: jogadores = [] } = useQuery({
    queryKey: ['jogadores'],
    queryFn: jogadorService.getAll,
  });

  const { data: ranking = [] } = useQuery({
    queryKey: ['ranking-players'],
    queryFn: () => calcularRanking(),
  });

  const filteredPlayers = jogadores.filter(player => {
    const matchesSearch = player.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || player.tipo === tipoFilter;
    return matchesSearch && matchesType;
  });

  const getPlayerStats = (playerId: string) => {
    return ranking.find(r => r.jogador.id === playerId);
  };

  const PlayerCard: React.FC<{ player: Jogador }> = ({ player }) => {
    const stats = getPlayerStats(player.id);
    
    return (
      <Link to={`/jogador/${player.id}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>{player.nome}</span>
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant={player.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                  {player.tipo}
                </Badge>
                <Badge variant={player.ativo ? 'default' : 'destructive'}>
                  {player.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <CardDescription>
              Membro desde {new Date(player.criadoEm).toLocaleDateString('pt-BR')}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {stats ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                      <Trophy className="h-4 w-4" />
                      <span>Pontos</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">{stats.pontuacaoTotal}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                      <Target className="h-4 w-4" />
                      <span>Gols</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">{stats.gols}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                      <UsersIcon className="h-4 w-4" />
                      <span>Assists</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">{stats.assistencias}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                      <User className="h-4 w-4" />
                      <span>Presenças</span>
                    </div>
                    <div className="text-lg font-bold text-foreground">{stats.presencas}</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Média de Gols:</span>
                      <span className="ml-2 font-medium">
                        {stats.presencas > 0 ? (stats.gols / stats.presencas).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Média Assist:</span>
                      <span className="ml-2 font-medium">
                        {stats.presencas > 0 ? (stats.assistencias / stats.presencas).toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">Sem estatísticas disponíveis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Jogadores</h1>
        <p className="text-muted-foreground">Perfis e estatísticas dos jogadores</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jogador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Mensalista">Mensalistas</SelectItem>
            <SelectItem value="Convidado">Convidados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Jogadores</p>
                <p className="text-2xl font-bold">{jogadores.length}</p>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensalistas</p>
                <p className="text-2xl font-bold">
                  {jogadores.filter(p => p.tipo === 'Mensalista').length}
                </p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Convidados</p>
                <p className="text-2xl font-bold">
                  {jogadores.filter(p => p.tipo === 'Convidado').length}
                </p>
              </div>
              <UsersIcon className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de jogadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Nenhum jogador encontrado</p>
            <p className="text-sm text-muted-foreground">Tente ajustar os filtros de busca</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Players;
