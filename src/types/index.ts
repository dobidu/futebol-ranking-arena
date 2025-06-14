// Tipos principais da aplicação
export interface Temporada {
  id: string;
  nome: string;
  pontosVitoria: number;
  pontosEmpate: number;
  pontosDerrota: number;
  penalidadeAtraso1: number;
  penalidadeAtraso2: number;
  penalidadeCartaoAmarelo: number;
  penalidadeCartaoAzul: number;
  penalidadeCartaoVermelho: number;
  numeroDescartes: number;
  ativa: boolean;
  criadaEm: Date;
}

export interface Jogador {
  id: string;
  nome: string;
  tipo: 'Mensalista' | 'Convidado';
  ativo: boolean;
  criadoEm: Date;
}

export interface Pelada {
  id: string;
  data: Date;
  temporadaId: string;
  temporada?: Temporada;
  partidas?: PartidaPelada[];
  presencas?: PresencaPelada[];
  times?: TimeNaPelada[];
  jogadoresPresentes?: JogadorPresente[];
}

export interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
  atraso?: 'nenhum' | 'tipo1' | 'tipo2';
}

export interface PartidaPelada {
  id: string;
  peladaId: string;
  numeroPartida: number;
  timeA: string[];
  timeB: string[];
  golsTimeA: number;
  golsTimeB: number;
  placarA: number;
  placarB: number;
  eventos: EventoPelada[];
}

export interface EventoPelada {
  id: string;
  partidaId: string;
  jogadorId: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  minuto: number;
  assistidoPor?: string;
}

export interface PresencaPelada {
  id: string;
  peladaId: string;
  jogadorId: string;
  presente: boolean;
  atraso: 'nenhum' | 'tipo1' | 'tipo2';
}

export interface TimeNaPelada {
  id: string;
  peladaId: string;
  identificadorLetra: string;
  jogadores: string[]; // Array de IDs de jogadores
}

export interface Partida {
  id: string;
  peladaId: string;
  timeAId: string;
  timeBId: string;
  placarA: number;
  placarB: number;
  timeA?: TimeNaPelada;
  timeB?: TimeNaPelada;
  eventos?: EventoPartida[];
}

export interface EventoPartida {
  id: string;
  tipo: 'gol' | 'cartao_amarelo' | 'cartao_azul' | 'cartao_vermelho';
  jogadorId: string;
  assistidoPor?: string;
}

export interface RegistroPeladaJogador {
  id: string;
  peladaId: string;
  jogadorId: string;
  statusPresenca: 'Presente' | 'Ausente' | 'Atraso Tipo 1' | 'Atraso Tipo 2';
  pontuacaoBruta: number;
  jogador?: Jogador;
  pelada?: Pelada;
}

export interface Evento {
  id: string;
  partidaId: string;
  tipo: 'Gol' | 'Assistência' | 'Cartão Amarelo' | 'Cartão Azul' | 'Cartão Vermelho';
  jogadorId: string;
  jogadorAssistenciaId?: string;
  jogador?: Jogador;
  jogadorAssistencia?: Jogador;
}

export interface RankingJogador {
  jogador: Jogador;
  pontuacaoTotal: number;
  vitorias: number;
  presencas: number;
  gols: number;
  assistencias: number;
  cartoesAmarelos: number;
  cartoesAzuis: number;
  cartoesVermelhos: number;
  mediaPresenca: number;
  posicao: number;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}
