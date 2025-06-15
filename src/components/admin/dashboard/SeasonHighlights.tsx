
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';
import { RankingJogador } from '@/types';

interface SeasonHighlightsProps {
  artilheiro?: RankingJogador;
  assistidor?: RankingJogador;
  liderRanking?: RankingJogador;
  maisPresente?: RankingJogador;
  totalGols: number;
  totalAssistencias: number;
}

const SeasonHighlights: React.FC<SeasonHighlightsProps> = ({
  artilheiro,
  assistidor,
  liderRanking,
  maisPresente,
  totalGols,
  totalAssistencias
}) => {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <span>Destaques da Temporada</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {artilheiro && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-700">🎯 Artilheiro</span>
              <Badge variant="outline" className="text-red-700 border-red-300">{artilheiro.gols} gols</Badge>
            </div>
            <p className="font-bold text-red-900">{artilheiro.jogador.nome}</p>
            <Progress value={(artilheiro.gols / Math.max(totalGols, 1)) * 100} className="mt-2 h-2" />
          </div>
        )}

        {assistidor && (
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-purple-700">⚡ Maior Assistidor</span>
              <Badge variant="outline" className="text-purple-700 border-purple-300">{assistidor.assistencias} assist.</Badge>
            </div>
            <p className="font-bold text-purple-900">{assistidor.jogador.nome}</p>
            <Progress value={(assistidor.assistencias / Math.max(totalAssistencias, 1)) * 100} className="mt-2 h-2" />
          </div>
        )}

        {liderRanking && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-700">👑 Líder Geral</span>
              <Badge variant="outline" className="text-yellow-700 border-yellow-300">{liderRanking.pontuacaoTotal} pts</Badge>
            </div>
            <p className="font-bold text-yellow-900">{liderRanking.jogador.nome}</p>
            <div className="text-xs text-yellow-700 mt-1">
              {liderRanking.vitorias}V • {liderRanking.gols}G • {liderRanking.assistencias}A
            </div>
          </div>
        )}

        {maisPresente && (
          <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700">📅 Mais Assíduo</span>
              <Badge variant="outline" className="text-green-700 border-green-300">{maisPresente.presencas} presenças</Badge>
            </div>
            <p className="font-bold text-green-900">{maisPresente.jogador.nome}</p>
            <Progress value={maisPresente.mediaPresenca} className="mt-2 h-2" />
            <p className="text-xs text-green-700 mt-1">{maisPresente.mediaPresenca.toFixed(1)}% de presença</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeasonHighlights;
