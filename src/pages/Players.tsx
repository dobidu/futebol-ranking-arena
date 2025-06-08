
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, User, Trophy, Target, Users as UsersIcon } from 'lucide-react';
import { Jogador } from '@/types';

const Players: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('all');

  // Dados de exemplo - serão substituídos por dados reais da API
  const mockPlayers: Jogador[] = [
    { id: '1', nome: 'João Silva', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-15') },
    { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-02-20') },
    { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', ativo: true, criadoEm: new Date('2024-03-10') },
    { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-25') },
    { id: '5', nome: 'Bruno Lima', tipo: 'Convidado', ativo: false, criadoEm: new Date('2024-02-05') },
  ];

  const mockPlayerStats = {
    '1': { gols: 8, assistencias: 5, presencas: 20, pontos: 450 },
    '2': { gols: 12, assistencias: 3, presencas: 18, pontos: 430 },
    '3': { gols: 6, assistencias: 8, presencas: 16, pontos: 410 },
    '4': { gols: 4, assistencias: 6, presencas: 19, pontos: 380 },
    '5': { gols: 2, assistencias: 1, presencas: 8, pontos: 120 },
  };

  const filteredPlayers = mockPlayers.filter(player => {
    const matchesSearch = player.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = tipoFilter === 'all' || player.tipo === tipoFilter;
    return matchesSearch && matchesType;
  });

  const PlayerCard: React.FC<{ player: Jogador }> = ({ player }) => {
    const stats = mockPlayerStats[player.id as keyof typeof mockPlayerStats];
    
    return (
      <Card className="hover:shadow-lg transition-shadow">
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
            Membro desde {player.criadoEm.toLocaleDateString('pt-BR')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground mb-1">
                  <Trophy className="h-4 w-4" />
                  <span>Pontos</span>
                </div>
                <div className="text-lg font-bold text-foreground">{stats.pontos}</div>
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
          )}
          
          {stats && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Média de Gols:</span>
                  <span className="ml-2 font-medium">{(stats.gols / stats.presencas).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Média Assist:</span>
                  <span className="ml-2 font-medium">{(stats.assistencias / stats.presencas).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
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
                <p className="text-2xl font-bold">{mockPlayers.length}</p>
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
                  {mockPlayers.filter(p => p.tipo === 'Mensalista').length}
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
                  {mockPlayers.filter(p => p.tipo === 'Convidado').length}
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
