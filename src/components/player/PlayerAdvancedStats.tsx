
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PlayerAdvancedStatsProps {
  totalPresencas: number;
  totalPeladas: number;
  mediaPresenca: number;
  temporadasParticipadas: number;
  posicaoAtual: number;
}

const PlayerAdvancedStats: React.FC<PlayerAdvancedStatsProps> = ({
  totalPresencas,
  totalPeladas,
  mediaPresenca,
  temporadasParticipadas,
  posicaoAtual
}) => {
  return (
    <Card className="gradient-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>Estatísticas Avançadas</span>
        </CardTitle>
        <CardDescription>Indicadores detalhados de performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Presença Total</div>
            <div className="text-xl font-bold text-blue-600">{totalPresencas}</div>
            <div className="text-xs text-muted-foreground">de {totalPeladas} peladas</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Taxa de Presença</div>
            <div className="text-xl font-bold text-green-600">{mediaPresenca}%</div>
            <div className="text-xs text-muted-foreground">frequência</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Temporadas</div>
            <div className="text-xl font-bold text-purple-600">{temporadasParticipadas}</div>
            <div className="text-xs text-muted-foreground">participadas</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Posição Atual</div>
            <div className="text-xl font-bold text-orange-600">
              {posicaoAtual > 0 ? `${posicaoAtual}º` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">no ranking</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerAdvancedStats;
