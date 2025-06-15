
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Trophy, Users, Calendar, Activity, TrendingUp } from 'lucide-react';
import { Temporada, Jogador, RankingJogador } from '@/types';

interface SystemStatusProps {
  temporadaAtiva?: Temporada;
  jogadoresAtivos: Jogador[];
  peladasTemporadaAtiva: any[];
  ranking: RankingJogador[];
}

const SystemStatus: React.FC<SystemStatusProps> = ({
  temporadaAtiva,
  jogadoresAtivos,
  peladasTemporadaAtiva,
  ranking
}) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <span>Status do Sistema</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!temporadaAtiva ? (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Atenção necessária</p>
                <p className="text-sm text-yellow-700">Nenhuma temporada está ativa</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Trophy className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Temporada ativa</p>
                <p className="text-sm text-green-700">{temporadaAtiva.nome} em andamento</p>
              </div>
            </div>
          )}
          
          {jogadoresAtivos.length === 0 ? (
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Problema crítico</p>
                <p className="text-sm text-red-700">Nenhum jogador ativo cadastrado</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800">Jogadores ativos</p>
                <p className="text-sm text-blue-700">{jogadoresAtivos.length} jogadores cadastrados</p>
              </div>
            </div>
          )}

          {temporadaAtiva && peladasTemporadaAtiva.length === 0 ? (
            <div className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Informação</p>
                <p className="text-sm text-orange-700">Temporada sem peladas cadastradas</p>
              </div>
            </div>
          ) : temporadaAtiva && peladasTemporadaAtiva.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <Activity className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Sistema operacional</p>
                <p className="text-sm text-green-700">{peladasTemporadaAtiva.length} peladas na temporada</p>
              </div>
            </div>
          )}

          {ranking.length > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800">Dados atualizados</p>
                <p className="text-sm text-purple-700">Ranking com {ranking.length} jogadores</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemStatus;
