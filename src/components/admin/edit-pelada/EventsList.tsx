
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Target } from 'lucide-react';
import { EventoPelada } from '@/types';

interface EventsListProps {
  eventos: EventoPelada[];
  getJogadorNome: (jogadorId: string) => string;
  onRemoveEvent: (eventoId: string) => void;
}

const EventsList: React.FC<EventsListProps> = ({
  eventos,
  getJogadorNome,
  onRemoveEvent
}) => {
  const getEventoIcon = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return <Target className="h-4 w-4 text-green-600" />;
      case 'cartao_amarelo':
        return <div className="w-3 h-4 bg-yellow-400 rounded-sm" />;
      case 'cartao_azul':
        return <div className="w-3 h-4 bg-blue-400 rounded-sm" />;
      case 'cartao_vermelho':
        return <div className="w-3 h-4 bg-red-500 rounded-sm" />;
      default:
        return null;
    }
  };

  const getEventoTexto = (tipo: string) => {
    switch (tipo) {
      case 'gol':
        return 'Gol';
      case 'cartao_amarelo':
        return 'Cartão Amarelo';
      case 'cartao_azul':
        return 'Cartão Azul';
      case 'cartao_vermelho':
        return 'Cartão Vermelho';
      default:
        return tipo;
    }
  };

  if (!eventos || eventos.length === 0) {
    return null;
  }

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-4">Eventos da Partida</h4>
      <div className="space-y-2">
        {eventos.map((evento) => (
          <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              {getEventoIcon(evento.tipo)}
              <div>
                <span className="font-medium">{getEventoTexto(evento.tipo)}</span>
                <p className="text-sm text-muted-foreground">
                  {getJogadorNome(evento.jogadorId)}
                  {evento.assistidoPor && ` (assist: ${getJogadorNome(evento.assistidoPor)})`}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRemoveEvent(evento.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;
