
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Trophy, ArrowLeft, Calendar } from 'lucide-react';
import { Jogador } from '@/types';

interface PlayerHeaderProps {
  jogador: Jogador;
  posicaoAtual: number;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ jogador, posicaoAtual }) => {
  return (
    <div className="flex items-center space-x-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border">
      <Link to="/jogadores">
        <Button variant="outline" size="sm" className="shadow-sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
      </Link>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <User className="h-8 w-8 text-primary" />
          </div>
          <span>{jogador.nome}</span>
          {posicaoAtual > 0 && posicaoAtual <= 3 && (
            <Badge variant="default" className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500">
              <Trophy className="h-3 w-3 mr-1" />
              {posicaoAtual}º lugar
            </Badge>
          )}
        </h1>
        <div className="flex items-center space-x-3 mt-2">
          <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'} className="font-medium">
            {jogador.tipo}
          </Badge>
          <Badge variant={jogador.ativo ? 'default' : 'destructive'}>
            {jogador.ativo ? 'Ativo' : 'Inativo'}
          </Badge>
          <span className="text-muted-foreground flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Membro desde {new Date(jogador.criadoEm).toLocaleDateString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlayerHeader;
