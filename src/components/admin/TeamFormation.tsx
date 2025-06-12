
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Minus, ArrowRight, UserPlus } from 'lucide-react';
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
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardContent className="text-center py-8">
          <Users className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <p className="text-muted-foreground font-medium">Crie uma pelada primeiro para formar os times</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Users className="h-6 w-6 text-green-600" />
            <span>Formação de Times</span>
          </CardTitle>
          <CardDescription>
            Organize os jogadores presentes em times para as partidas. Jogadores podem estar em múltiplos times.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={criarTime} 
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 py-3"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Criar Time {proximaLetra}
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {times.map((time) => (
              <Card key={time.id} className="border-2 hover:shadow-lg transition-shadow bg-white">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <Badge variant="outline" className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      Time {time.identificadorLetra}
                    </Badge>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {time.jogadores.length}/6
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Jogadores no time */}
                  <div className="space-y-2 min-h-[120px]">
                    {time.jogadores.map((jogadorId) => (
                      <div key={jogadorId} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border">
                        <span className="text-sm font-medium">{getJogadorNome(jogadorId)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removerJogadorDoTime(jogadorId, time.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    
                    {time.jogadores.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-muted-foreground">
                        <UserPlus className="h-8 w-8 mb-2" />
                      </div>
                    )}
                  </div>

                  {/* Adicionar jogador */}
                  {time.jogadores.length < 6 && (
                    <Select onValueChange={(jogadorId) => adicionarJogadorAoTime(jogadorId, time.id)}>
                      <SelectTrigger className="border-blue-200 focus:border-blue-400">
                        <SelectValue placeholder="+ Adicionar jogador" />
                      </SelectTrigger>
                      <SelectContent>
                        {jogadoresPresentesDisponiveis.map((jogador) => (
                          <SelectItem key={jogador.id} value={jogador.id}>
                            {jogador.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {time.jogadores.length === 6 && (
                    <div className="text-center py-2">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Time Completo! ✓
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {jogadoresPresentesDisponiveis.length > 0 && times.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Jogadores Disponíveis ({jogadoresPresentesDisponiveis.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {jogadoresPresentesDisponiveis.map((jogador) => (
                    <Badge key={jogador.id} variant="outline" className="text-sm px-3 py-1">
                      {jogador.nome}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {canProceed && onNextStep && (
            <div className="mt-6 flex justify-end">
              <Button 
                onClick={onNextStep}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 px-6"
              >
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
