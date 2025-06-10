
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

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
}

const FinalizarPelada: React.FC<FinalizarPeladaProps> = ({
  jogadoresPresentes,
  times,
  partidas,
  eventos,
  salvarPelada
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Finalizar Pelada</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Revise os dados e salve a pelada no sistema.
          </p>
          
          {partidas.length > 0 ? (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Resumo:</h4>
                <ul className="text-sm text-muted-foreground mt-2">
                  <li>• {jogadoresPresentes.filter(j => j.presente).length} jogadores presentes</li>
                  <li>• {times.length} times formados</li>
                  <li>• {partidas.length} partida(s) realizada(s)</li>
                  <li>• {eventos.length} evento(s) registrado(s)</li>
                </ul>
              </div>
              
              <Button
                onClick={salvarPelada}
                className="w-full"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Salvar Pelada
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              Adicione pelo menos uma partida antes de finalizar.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinalizarPelada;
