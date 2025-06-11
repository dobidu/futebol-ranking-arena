
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Temporada, Pelada, RankingJogador } from '@/types';

interface SeasonStatsProps {
  temporada: Temporada;
  peladasTemporada: Pelada[];
  ranking: RankingJogador[];
}

const SeasonStats: React.FC<SeasonStatsProps> = ({ temporada, peladasTemporada, ranking }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
        <CardDescription>Regras de pontuação da temporada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Vitória:</span>
          <span className="text-sm font-medium">{temporada.pontosVitoria} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Empate:</span>
          <span className="text-sm font-medium">{temporada.pontosEmpate} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Derrota:</span>
          <span className="text-sm font-medium">{temporada.pontosDerrota} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Atraso Tipo 1:</span>
          <span className="text-sm font-medium">{temporada.penalidadeAtraso1} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Cartão Amarelo:</span>
          <span className="text-sm font-medium">{temporada.penalidadeCartaoAmarelo} pts</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Descartes:</span>
          <span className="text-sm font-medium">{temporada.numeroDescartes}</span>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Estatísticas</CardTitle>
        <CardDescription>Resumo da temporada</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total de Peladas:</span>
          <span className="text-sm font-medium">{peladasTemporada.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Jogadores Ativos:</span>
          <span className="text-sm font-medium">{ranking.length}</span>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default SeasonStats;
