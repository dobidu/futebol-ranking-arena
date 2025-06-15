
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { EventoPelada, PartidaPelada } from '@/types';
import EventIcon from './EventIcon';

interface MatchEventsProps {
  eventos: EventoPelada[];
  partida: PartidaPelada;
  getJogadorNome: (jogadorId: string) => string;
}

const MatchEvents: React.FC<MatchEventsProps> = ({
  eventos,
  partida,
  getJogadorNome
}) => {
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

  // Garantir que estamos mostrando apenas eventos desta partida específica
  const eventosCorretos = eventos.filter(evento => evento.partidaId === partida.id);

  console.log(`MatchEvents - Partida ${partida.id}: ${eventosCorretos.length} eventos corretos para exibição`);
  console.log(`MatchEvents - Eventos corretos:`, eventosCorretos);

  if (eventosCorretos.length === 0) {
    return (
      <div className="bg-white rounded-lg p-4 border text-center text-sm text-muted-foreground">
        Nenhum evento registrado nesta partida
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border">
      <h4 className="font-medium text-lg mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-primary" />
        Eventos da Partida ({eventosCorretos.length})
      </h4>
      
      <div className="space-y-2">
        {eventosCorretos.map((evento, eventIndex) => {
          // Chave única específica para esta partida
          const eventoKey = `partida-${partida.id}-evento-${evento.id}-${eventIndex}`;
          const isGol = evento.tipo === 'gol';
          const isCartao = ['cartao_amarelo', 'cartao_azul', 'cartao_vermelho'].includes(evento.tipo);
          
          let bgColor = 'bg-gray-50';
          let textColor = 'text-gray-700';
          let badgeColor = 'bg-gray-100 text-gray-800';
          
          if (isGol) {
            bgColor = 'bg-green-50';
            textColor = 'text-green-700';
            badgeColor = 'bg-green-100 text-green-800';
          } else if (isCartao) {
            bgColor = 'bg-orange-50';
            textColor = 'text-orange-700';
            if (evento.tipo === 'cartao_amarelo') {
              badgeColor = 'bg-yellow-100 text-yellow-800';
            } else if (evento.tipo === 'cartao_azul') {
              badgeColor = 'bg-blue-100 text-blue-800';
            } else {
              badgeColor = 'bg-red-100 text-red-800';
            }
          }
          
          return (
            <div key={eventoKey} className={`flex items-center justify-between p-3 ${bgColor} rounded border`}>
              <div className="flex items-center space-x-3">
                <EventIcon tipo={evento.tipo} />
                <div>
                  <span className={`font-medium ${textColor}`}>
                    <Link to={`/jogador/${evento.jogadorId}`} className="hover:underline">
                      {getJogadorNome(evento.jogadorId)}
                    </Link>
                  </span>
                  {evento.assistidoPor && (
                    <div className="text-sm text-muted-foreground">
                      Assistência: <Link to={`/jogador/${evento.assistidoPor}`} className="hover:underline text-green-600">
                        {getJogadorNome(evento.assistidoPor)}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              <Badge variant="secondary" className={badgeColor}>
                {getEventoTexto(evento.tipo)}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MatchEvents;
