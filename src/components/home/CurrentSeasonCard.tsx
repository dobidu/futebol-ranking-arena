
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Calendar, Award } from 'lucide-react';
import { Temporada } from '@/types';

interface CurrentSeasonCardProps {
  temporadaAtiva: Temporada;
  peladasTemporadaAtiva: number;
}

const CurrentSeasonCard: React.FC<CurrentSeasonCardProps> = ({
  temporadaAtiva,
  peladasTemporadaAtiva
}) => {
  return (
    <Card className="gradient-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">🏆 Temporada Atual</CardTitle>
            <CardDescription>Informações da temporada ativa</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-xl mb-2 text-primary">{temporadaAtiva.nome}</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Peladas: {peladasTemporadaAtiva}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Descartes: {temporadaAtiva.numeroDescartes}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-semibold mb-3 text-primary">Sistema de Pontuação:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-600">🏆 Vitória:</span>
                <Badge variant="secondary">+{temporadaAtiva.pontosVitoria}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-yellow-600">🤝 Empate:</span>
                <Badge variant="secondary">+{temporadaAtiva.pontosEmpate}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">❌ Derrota:</span>
                <Badge variant="secondary">+{temporadaAtiva.pontosDerrota}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">📅 Presença:</span>
                <Badge variant="secondary">+1</Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrentSeasonCard;
