
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Trophy, Users, TrendingUp } from 'lucide-react';
import { Pelada, Temporada } from '@/types';

interface LastPeladaCardProps {
  ultimaPelada: Pelada;
  temporadas: Temporada[];
}

const LastPeladaCard: React.FC<LastPeladaCardProps> = ({ ultimaPelada, temporadas }) => {
  return (
    <Card className="gradient-card hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Última Pelada Realizada</CardTitle>
            <CardDescription>Pelada mais recente cadastrada no sistema</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-lg">{new Date(ultimaPelada.data).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Trophy className="h-3 w-3" />
                <span>{temporadas.find(t => t.id === ultimaPelada.temporadaId)?.nome || 'N/A'}</span>
              </Badge>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{ultimaPelada.partidas?.length || 0} partidas</span>
              </Badge>
            </div>
          </div>
          <Link to={`/pelada/${ultimaPelada.id}`}>
            <Button className="gradient-button hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LastPeladaCard;
