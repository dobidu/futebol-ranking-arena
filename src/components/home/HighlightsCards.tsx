
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Medal, Star, Target, Users } from 'lucide-react';
import { RankingJogador } from '@/types';

interface HighlightsCardsProps {
  liderRanking: RankingJogador | null;
  artilheiro: RankingJogador | null;
  assistente: RankingJogador | null;
}

const HighlightsCards: React.FC<HighlightsCardsProps> = ({
  liderRanking,
  artilheiro,
  assistente
}) => {
  const highlights = [
    {
      title: '🏆 Líder do Ranking',
      description: 'Primeiro colocado na classificação geral',
      icon: Crown,
      gradient: 'from-yellow-400 to-orange-500',
      player: liderRanking,
      value: liderRanking?.pontuacaoTotal,
      valueLabel: 'pontos',
      valueIcon: Star,
      message: liderRanking ? 'Dominando a competição!' : 'Sem dados disponíveis'
    },
    {
      title: '⚽ Artilheiro',
      description: 'Maior goleador da temporada',
      icon: Zap,
      gradient: 'from-red-400 to-red-600',
      player: artilheiro,
      value: artilheiro?.gols,
      valueLabel: 'gols',
      valueIcon: Target,
      message: artilheiro ? 'Máquina de fazer gols!' : 'Sem dados disponíveis'
    },
    {
      title: '🎯 Rei das Assistências',
      description: 'Quem mais deu assistências',
      icon: Medal,
      gradient: 'from-blue-400 to-blue-600',
      player: assistente,
      value: assistente?.assistencias,
      valueLabel: 'assistências',
      valueIcon: Users,
      message: assistente ? 'Especialista em passes!' : 'Sem dados disponíveis'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {highlights.map((highlight) => {
        const Icon = highlight.icon;
        const ValueIcon = highlight.valueIcon;
        
        return (
          <Card key={highlight.title} className="gradient-card hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="text-center pb-3">
              <div className="flex justify-center mb-3">
                <div className={`p-4 bg-gradient-to-br ${highlight.gradient} rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-xl">{highlight.title}</CardTitle>
              <CardDescription>{highlight.description}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-foreground">
                  {highlight.player ? highlight.player.jogador.nome : 'Aguardando dados'}
                </p>
                {highlight.player && (
                  <div className="flex items-center justify-center space-x-2">
                    <Badge className={`bg-gradient-to-r ${highlight.gradient} text-white`}>
                      <ValueIcon className="h-3 w-3 mr-1" />
                      {highlight.value} {highlight.valueLabel}
                    </Badge>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  {highlight.message}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HighlightsCards;
