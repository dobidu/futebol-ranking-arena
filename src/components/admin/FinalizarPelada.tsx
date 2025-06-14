
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Check, Users, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

interface TimeNaPelada {
  id: string;
  peladaId: string;
  identificadorLetra: string;
  jogadores: string[];
}

interface Partida {
  id: string;
  peladaId: string;
  timeAId: string;
  timeBId: string;
  placarA: number;
  placarB: number;
  timeA?: TimeNaPelada;
  timeB?: TimeNaPelada;
}

interface FinalizarPeladaProps {
  jogadoresPresentes: JogadorPresente[];
  times: TimeNaPelada[];
  partidas: Partida[];
  eventos: EventoPartida[];
  salvarPelada: () => void;
  isEditMode?: boolean;
  peladaId?: string;
}

const FinalizarPelada: React.FC<FinalizarPeladaProps> = ({
  jogadoresPresentes,
  times,
  partidas,
  eventos,
  salvarPelada,
  isEditMode = false,
  peladaId
}) => {
  const jogadoresCount = jogadoresPresentes.filter(j => j.presente).length;
  
  // Calcular gols corretamente dos placares das partidas
  const golsTotal = partidas.reduce((total, partida) => {
    const golsA = Number(partida.placarA) || 0;
    const golsB = Number(partida.placarB) || 0;
    console.log('FinalizarPelada - Partida gols:', { 
      partidaId: partida.id, 
      placarA: partida.placarA, 
      placarB: partida.placarB, 
      golsA, 
      golsB 
    });
    return total + golsA + golsB;
  }, 0);
  
  console.log('FinalizarPelada - Total de gols calculado:', golsTotal);
  console.log('FinalizarPelada - Dados recebidos:', { 
    partidas: partidas.length,
    eventos: eventos.length,
    jogadores: jogadoresCount 
  });

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <span>{isEditMode ? 'Atualizar Pelada' : 'Finalizar Pelada'}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {isEditMode 
              ? 'Revise e atualize os dados da pelada.' 
              : 'Revise os dados e salve a pelada no sistema.'
            }
          </p>
          
          {/* Estatísticas visuais */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-blue-600">{jogadoresCount}</p>
                  <p className="text-xs text-muted-foreground">Jogadores</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{times.length}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{times.length}</p>
                  <p className="text-xs text-muted-foreground">Times</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{partidas.length}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{partidas.length}</p>
                  <p className="text-xs text-muted-foreground">Partidas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold text-orange-600">{golsTotal}</p>
                  <p className="text-xs text-muted-foreground">Gols</p>
                </div>
              </div>
            </div>
          </div>

          {/* Times formados */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Times Formados
            </h4>
            <div className="flex flex-wrap gap-2">
              {times.map((time) => (
                <Badge key={time.id} variant="outline" className="px-3 py-1">
                  Time {time.identificadorLetra} ({time.jogadores.length} jogadores)
                </Badge>
              ))}
            </div>
          </div>

          {/* Resultados das partidas */}
          {partidas.length > 0 && (
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Resultados
              </h4>
              <div className="space-y-2">
                {partidas.map((partida, index) => (
                  <div key={partida.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">
                      Partida {index + 1}: Time {partida.timeA?.identificadorLetra} vs Time {partida.timeB?.identificadorLetra}
                    </span>
                    <Badge variant="secondary">
                      {partida.placarA} x {partida.placarB}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {partidas.length > 0 ? (
            <Button
              onClick={salvarPelada}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
              size="lg"
            >
              <Check className="h-5 w-5 mr-2" />
              {isEditMode ? 'Atualizar Pelada' : 'Salvar Pelada'}
            </Button>
          ) : (
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-yellow-800 font-medium">
                Adicione pelo menos uma partida antes de finalizar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizarPelada;
