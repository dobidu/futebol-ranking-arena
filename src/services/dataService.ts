
import { Jogador, Pelada, Partida, Evento, Temporada } from '@/types';
import { storage, createService } from './storageService';
import { mockJogadores, mockTemporadas, mockPeladas } from './mockData';

// Initialize data in localStorage if it doesn't exist
if (!storage.get('jogadores')) {
  storage.set('jogadores', mockJogadores);
}
if (!storage.get('temporadas')) {
  storage.set('temporadas', mockTemporadas);
}
if (!storage.get('peladas')) {
  storage.set('peladas', mockPeladas);
}

export const jogadorService = createService<Jogador>('jogadores');
export const temporadaService = createService<Temporada>('temporadas');
export const peladaService = createService<Pelada>('peladas');
export const partidaService = createService<Partida>('partidas');
export const eventoService = createService<Evento>('eventos');

// Re-export ranking calculation
export { calcularRanking } from './rankingService';
