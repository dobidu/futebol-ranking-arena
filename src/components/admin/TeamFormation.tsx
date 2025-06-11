
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Minus, ArrowRight } from 'lucide-react';
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
  onNextStep?: () => void;
}

const TeamFormation: React.FC<TeamFormationProps> = ({
  times,
  proximaLetra,
  jogadoresPresentes,
  jogadores,
  peladaAtual,
  criarTime,
  adicionarJogadorAoTime,
  removerJogadorDoTime,
  onNextStep
}) => {
  const getJogadorNome = (jogadorId: string) => {
    const jogador = jogadores.find(j => j.id === jogadorId);
    return jogador?.nome || 'Jogador não encontrado';
  };

  const jogadoresPresentesDisponiveis = jogadoresPresentes.filter(j => j.presente);
  const canProceed = times.length >= 2;

  if (!peladaAtual) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Crie uma pelada primeiro para formar os times</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Formação de Times</span>
          </CardTitle>
          <CardDescription>
            Organize os jogadores presentes em times para as partidas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={criarTime} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Time {proximaLetra}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {times.map((time) => (
              <Card key={time.id} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      Time {time.identificadorLetra}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {time.jogadores.length}/6
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Jogadores no time */}
                  <div className="space-y-2">
                    {time.jogadores.map((jogadorId) => (
                      <div key={jogadorId} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{getJogadorNome(jogadorId)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerJogadorDoTime(jogadorId, time.id)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Adicionar jogador */}
                  {time.jogadores.length < 6 && (
                    <Select onValueChange={(jogadorId) => adicionarJogadorAoTime(jogadorId, time.id)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Adicionar jogador" />
                      </SelectTrigger>
                      <SelectContent>
                        {jogadoresPresentesDisponiveis
                          .filter(j => !times.some(t => t.jogadores.includes(j.id)))
                          .map((jogador) => (
                            <SelectItem key={jogador.id} value={jogador.id}>
                              {jogador.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {canProceed && onNextStep && (
            <div className="mt-6 flex justify-end">
              <Button onClick={onNextStep}>
                Próximo: Registrar Partidas
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamFormation;
