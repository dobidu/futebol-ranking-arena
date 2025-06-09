
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2 } from 'lucide-react';
import { TimeNaPelada, Jogador } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface TeamFormationProps {
  times: TimeNaPelada[];
  proximaLetra: string;
  jogadoresPresentes: JogadorPresente[];
  jogadores: Jogador[];
  peladaAtual: string;
  criarTime: () => void;
  adicionarJogadorAoTime: (jogadorId: string, timeId: string) => void;
  removerJogadorDoTime: (jogadorId: string, timeId: string) => void;
}

const TeamFormation: React.FC<TeamFormationProps> = ({
  times,
  proximaLetra,
  jogadoresPresentes,
  jogadores,
  peladaAtual,
  criarTime,
  adicionarJogadorAoTime,
  removerJogadorDoTime
}) => {
  const getJogadorNome = (id: string) => {
    return jogadores.find(j => j.id === id)?.nome || 'Jogador não encontrado';
  };

  const jogadoresDisponiveis = jogadoresPresentes.filter(j => j.presente);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Formar Times</span>
          </CardTitle>
          <CardDescription>
            Crie times e adicione jogadores (5-6 jogadores por time)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={criarTime} disabled={!peladaAtual}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Time {proximaLetra}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Jogadores Disponíveis</CardTitle>
            <CardDescription>
              Jogadores presentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jogadoresDisponiveis.map(jogador => (
                <div key={jogador.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{jogador.nome}</span>
                  <div className="flex flex-wrap gap-1">
                    {times.map(time => (
                      <Button 
                        key={time.id}
                        size="sm" 
                        variant="outline"
                        onClick={() => adicionarJogadorAoTime(jogador.id, time.id)}
                        disabled={time.jogadores.length >= 6}
                      >
                        {time.identificadorLetra}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {times.map(time => (
              <Card key={time.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <Badge variant="outline">Time {time.identificadorLetra}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {time.jogadores.length}/6
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {time.jogadores.map(jogadorId => (
                      <div key={jogadorId} className="flex items-center justify-between p-2 bg-accent rounded">
                        <span className="text-sm">{getJogadorNome(jogadorId)}</span>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removerJogadorDoTime(jogadorId, time.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {time.jogadores.length === 0 && (
                      <p className="text-muted-foreground text-center py-4 text-sm">
                        Nenhum jogador no time
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamFormation;
