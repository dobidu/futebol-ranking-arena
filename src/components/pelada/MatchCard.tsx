
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { PartidaPelada, TimeNaPelada, Jogador } from '@/types';
import MatchEvents from './MatchEvents';

interface MatchCardProps {
  partida: PartidaPelada;
  index: number;
  times: TimeNaPelada[];
  jogadores: Jogador[];
  getJogadorNome: (jogadorId: string) => string;
}

const MatchCard: React.FC<MatchCardProps> = ({
  partida,
  index,
  times,
  jogadores,
  getJogadorNome
}) => {
  const timeA = times.find(t => 
    t.jogadores.length === partida.timeA.length && 
    t.jogadores.every(j => partida.timeA.includes(j))
  );
  const timeB = times.find(t => 
    t.jogadores.length === partida.timeB.length && 
    t.jogadores.every(j => partida.timeB.includes(j))
  );
  
  const timeALetra = timeA?.identificadorLetra || 'A';
  const timeBLetra = timeB?.identificadorLetra || 'B';
  
  // Usar os valores corretos do placar
  const placarA = partida.placarA ?? partida.golsTimeA ?? 0;
  const placarB = partida.placarB ?? partida.golsTimeB ?? 0;
  
  // Filtrar eventos APENAS desta partida específica usando o partidaId correto
  const eventosDestaPartida = (partida.eventos || []).filter(evento => {
    // Garantir correspondência exata entre evento.partidaId e partida.id
    const eventoPerteceAEstaPartida = evento.partidaId === partida.id;
    
    console.log(`MatchCard - Verificando evento ${evento.id}:`);
    console.log(`  - evento.partidaId: ${evento.partidaId}`);
    console.log(`  - partida.id: ${partida.id}`);
    console.log(`  - pertence: ${eventoPerteceAEstaPartida}`);
    
    return eventoPerteceAEstaPartida;
  });

  console.log(`MatchCard - Partida ${partida.id} (${index + 1}): ${eventosDestaPartida.length} eventos corretos`);
  console.log(`MatchCard - Eventos corretos da partida:`, eventosDestaPartida);

  return (
    <div className="border rounded-lg p-6 bg-gradient-to-r from-green-50 to-blue-50">
      <div className="text-center mb-6">
        <Badge variant="outline" className="mb-3 text-lg font-semibold">
          Partida {index + 1}
        </Badge>
        <div className="text-3xl font-bold flex items-center justify-center space-x-4 mb-4">
          <span className="bg-blue-100 px-4 py-2 rounded-lg">Time {timeALetra}</span>
          <span className="text-4xl text-blue-600">{placarA}</span>
          <span className="text-muted-foreground text-2xl">×</span>
          <span className="text-4xl text-purple-600">{placarB}</span>
          <span className="bg-purple-100 px-4 py-2 rounded-lg">Time {timeBLetra}</span>
        </div>
        
        {/* Times da partida */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Time {timeALetra}</h4>
            <div className="space-y-1">
              {partida.timeA.map((jogadorId, idx) => (
                <div key={idx} className="text-sm">
                  <Link to={`/jogador/${jogadorId}`} className="hover:underline text-blue-600">
                    {getJogadorNome(jogadorId)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Time {timeBLetra}</h4>
            <div className="space-y-1">
              {partida.timeB.map((jogadorId, idx) => (
                <div key={idx} className="text-sm">
                  <Link to={`/jogador/${jogadorId}`} className="hover:underline text-purple-600">
                    {getJogadorNome(jogadorId)}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <MatchEvents 
        eventos={eventosDestaPartida}
        partida={partida}
        getJogadorNome={getJogadorNome}
      />
    </div>
  );
};

export default MatchCard;
