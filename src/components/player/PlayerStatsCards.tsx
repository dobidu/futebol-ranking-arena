
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target, Users, Award } from 'lucide-react';

interface PlayerStatsCardsProps {
  totalPontos: number;
  totalGols: number;
  totalAssistencias: number;
  totalPresencas: number;
  percentualVitorias: number;
  totalVitorias: number;
  mediaPontosPorPelada: number;
  mediaGolsPorPelada: number;
}

const PlayerStatsCards: React.FC<PlayerStatsCardsProps> = ({
  totalPontos,
  totalGols,
  totalAssistencias,
  totalPresencas,
  percentualVitorias,
  totalVitorias,
  mediaPontosPorPelada,
  mediaGolsPorPelada
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="gradient-card border-l-4 border-l-blue-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Pontos</p>
              <p className="text-3xl font-bold text-blue-600">{totalPontos}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {mediaPontosPorPelada.toFixed(1)}/pelada
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="gradient-card border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total de Gols</p>
              <p className="text-3xl font-bold text-green-600">{totalGols}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {mediaGolsPorPelada.toFixed(1)}/pelada
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="gradient-card border-l-4 border-l-purple-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Assistências</p>
              <p className="text-3xl font-bold text-purple-600">{totalAssistencias}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Em {totalPresencas} peladas
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="gradient-card border-l-4 border-l-orange-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Taxa de Vitória</p>
              <p className="text-3xl font-bold text-orange-600">{percentualVitorias.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {totalVitorias} vitórias
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerStatsCards;
