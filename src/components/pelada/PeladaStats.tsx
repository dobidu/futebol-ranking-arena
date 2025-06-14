
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Trophy, Target, Award } from 'lucide-react';

interface PeladaStatsProps {
  jogadoresPresentes: number;
  totalPartidas: number;
  totalGols: number;
  cartoes: number;
}

const PeladaStats: React.FC<PeladaStatsProps> = ({
  jogadoresPresentes,
  totalPartidas,
  totalGols,
  cartoes
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Jogadores</p>
              <p className="text-2xl font-bold">{jogadoresPresentes}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Partidas</p>
              <p className="text-2xl font-bold">{totalPartidas}</p>
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
              <p className="text-2xl font-bold">{totalGols}</p>
            </div>
            <Target className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cartões</p>
              <p className="text-2xl font-bold">{cartoes}</p>
            </div>
            <Award className="h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeladaStats;
