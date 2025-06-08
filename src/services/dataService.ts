import { Temporada, Jogador, Pelada, TimeNaPelada, Partida, RegistroPeladaJogador, Evento, RankingJogador } from '@/types';

// Simulação de dados armazenados em arquivos JSON
let temporadas: Temporada[] = [
  {
    id: '1',
    nome: '2024.1',
    pontosVitoria: 3,
    pontosEmpate: 1,
    pontosDerrota: 0,
    penalidadeAtraso1: -1,
    penalidadeAtraso2: -2,
    penalidadeCartaoAmarelo: -0.5,
    penalidadeCartaoAzul: -1,
    penalidadeCartaoVermelho: -2,
    numeroDescartes: 2,
    ativa: true,
    criadaEm: new Date('2024-01-01')
  }
];

let jogadores: Jogador[] = [
  {
    id: '1',
    nome: 'João Silva',
    tipo: 'Mensalista',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  },
  {
    id: '2',
    nome: 'Pedro Santos',
    tipo: 'Mensalista',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    tipo: 'Convidado',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  },
  {
    id: '4',
    nome: 'Ana Costa',
    tipo: 'Mensalista',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  },
  {
    id: '5',
    nome: 'Bruno Lima',
    tipo: 'Mensalista',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  },
  {
    id: '6',
    nome: 'Maria Santos',
    tipo: 'Convidado',
    ativo: true,
    criadoEm: new Date('2024-01-01')
  }
];

let peladas: Pelada[] = [
  {
    id: '1',
    data: new Date('2024-06-01'),
    temporadaId: '1'
  },
  {
    id: '2',
    data: new Date('2024-06-08'),
    temporadaId: '1'
  },
  {
    id: '3',
    data: new Date('2024-06-15'),
    temporadaId: '1'
  }
];

let timesNaPelada: TimeNaPelada[] = [
  {
    id: '1',
    peladaId: '1',
    identificadorLetra: 'A',
    jogadores: ['1', '2', '3']
  },
  {
    id: '2',
    peladaId: '1',
    identificadorLetra: 'B',
    jogadores: ['4', '5', '6']
  },
  {
    id: '3',
    peladaId: '2',
    identificadorLetra: 'A',
    jogadores: ['1', '3', '5']
  },
  {
    id: '4',
    peladaId: '2',
    identificadorLetra: 'B',
    jogadores: ['2', '4', '6']
  }
];

let partidas: Partida[] = [
  {
    id: '1',
    peladaId: '1',
    timeAId: '1',
    timeBId: '2',
    placarA: 3,
    placarB: 2
  },
  {
    id: '2',
    peladaId: '2',
    timeAId: '3',
    timeBId: '4',
    placarA: 1,
    placarB: 1
  }
];

let registrosPeladaJogador: RegistroPeladaJogador[] = [
  {
    id: '1',
    peladaId: '1',
    jogadorId: '1',
    statusPresenca: 'Presente',
    pontuacaoBruta: 3
  },
  {
    id: '2',
    peladaId: '1',
    jogadorId: '2',
    statusPresenca: 'Presente',
    pontuacaoBruta: 3
  },
  {
    id: '3',
    peladaId: '1',
    jogadorId: '3',
    statusPresenca: 'Presente',
    pontuacaoBruta: 3
  },
  {
    id: '4',
    peladaId: '1',
    jogadorId: '4',
    statusPresenca: 'Presente',
    pontuacaoBruta: 0
  },
  {
    id: '5',
    peladaId: '1',
    jogadorId: '5',
    statusPresenca: 'Presente',
    pontuacaoBruta: 0
  },
  {
    id: '6',
    peladaId: '1',
    jogadorId: '6',
    statusPresenca: 'Presente',
    pontuacaoBruta: 0
  }
];

let eventos: Evento[] = [
  {
    id: '1',
    partidaId: '1',
    tipo: 'Gol',
    jogadorId: '1',
    jogadorAssistenciaId: '2'
  },
  {
    id: '2',
    partidaId: '1',
    tipo: 'Gol',
    jogadorId: '2'
  },
  {
    id: '3',
    partidaId: '1',
    tipo: 'Assistência',
    jogadorId: '3'
  },
  {
    id: '4',
    partidaId: '1',
    tipo: 'Cartão Amarelo',
    jogadorId: '4'
  }
];

// Funções auxiliares para simular persistência
const saveToLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key: string, defaultValue: any) => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

// Inicializar dados do localStorage se existirem
const initializeData = () => {
  temporadas = loadFromLocalStorage('temporadas', temporadas);
  jogadores = loadFromLocalStorage('jogadores', jogadores);
  peladas = loadFromLocalStorage('peladas', peladas);
  timesNaPelada = loadFromLocalStorage('timesNaPelada', timesNaPelada);
  partidas = loadFromLocalStorage('partidas', partidas);
  registrosPeladaJogador = loadFromLocalStorage('registrosPeladaJogador', registrosPeladaJogador);
  eventos = loadFromLocalStorage('eventos', eventos);
};

// Serviços para Temporadas
export const temporadaService = {
  async getAll(): Promise<Temporada[]> {
    initializeData();
    return temporadas;
  },

  async getById(id: string): Promise<Temporada | null> {
    initializeData();
    return temporadas.find(t => t.id === id) || null;
  },

  async create(temporada: Omit<Temporada, 'id' | 'criadaEm'>): Promise<Temporada> {
    initializeData();
    const newTemporada: Temporada = {
      ...temporada,
      id: Date.now().toString(),
      criadaEm: new Date()
    };
    temporadas.push(newTemporada);
    saveToLocalStorage('temporadas', temporadas);
    return newTemporada;
  },

  async update(id: string, temporada: Partial<Temporada>): Promise<Temporada | null> {
    initializeData();
    const index = temporadas.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    temporadas[index] = { ...temporadas[index], ...temporada };
    saveToLocalStorage('temporadas', temporadas);
    return temporadas[index];
  },

  async delete(id: string): Promise<boolean> {
    initializeData();
    const index = temporadas.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    temporadas.splice(index, 1);
    saveToLocalStorage('temporadas', temporadas);
    return true;
  }
};

// Serviços para Jogadores
export const jogadorService = {
  async getAll(): Promise<Jogador[]> {
    initializeData();
    return jogadores;
  },

  async getById(id: string): Promise<Jogador | null> {
    initializeData();
    return jogadores.find(j => j.id === id) || null;
  },

  async create(jogador: Omit<Jogador, 'id' | 'criadoEm'>): Promise<Jogador> {
    initializeData();
    const newJogador: Jogador = {
      ...jogador,
      id: Date.now().toString(),
      criadoEm: new Date()
    };
    jogadores.push(newJogador);
    saveToLocalStorage('jogadores', jogadores);
    return newJogador;
  },

  async update(id: string, jogador: Partial<Jogador>): Promise<Jogador | null> {
    initializeData();
    const index = jogadores.findIndex(j => j.id === id);
    if (index === -1) return null;
    
    jogadores[index] = { ...jogadores[index], ...jogador };
    saveToLocalStorage('jogadores', jogadores);
    return jogadores[index];
  },

  async delete(id: string): Promise<boolean> {
    initializeData();
    const index = jogadores.findIndex(j => j.id === id);
    if (index === -1) return false;
    
    jogadores.splice(index, 1);
    saveToLocalStorage('jogadores', jogadores);
    return true;
  }
};

// Serviços para Peladas
export const peladaService = {
  async getAll(): Promise<Pelada[]> {
    initializeData();
    return peladas;
  },

  async create(pelada: Omit<Pelada, 'id'>): Promise<Pelada> {
    initializeData();
    const newPelada: Pelada = {
      ...pelada,
      id: Date.now().toString()
    };
    peladas.push(newPelada);
    saveToLocalStorage('peladas', peladas);
    return newPelada;
  }
};

// Função para calcular ranking
export const calcularRanking = async (temporadaId?: string): Promise<RankingJogador[]> => {
  initializeData();
  
  const jogadoresAtivos = jogadores.filter(j => j.ativo);
  const rankingData: RankingJogador[] = [];

  for (const jogador of jogadoresAtivos) {
    const registros = registrosPeladaJogador.filter(r => r.jogadorId === jogador.id);
    
    let pontuacaoTotal = 0;
    let presencas = 0;
    let vitorias = 0;

    // Calcular pontuação total e estatísticas
    for (const registro of registros) {
      if (registro.statusPresenca !== 'Ausente') {
        presencas++;
        pontuacaoTotal += registro.pontuacaoBruta;
      }
    }

    // Buscar eventos do jogador
    const eventosJogador = eventos.filter(e => e.jogadorId === jogador.id);
    const gols = eventosJogador.filter(e => e.tipo === 'Gol').length;
    const assistencias = eventosJogador.filter(e => e.tipo === 'Assistência').length;
    const cartoesAmarelos = eventosJogador.filter(e => e.tipo === 'Cartão Amarelo').length;
    const cartoesAzuis = eventosJogador.filter(e => e.tipo === 'Cartão Azul').length;
    const cartoesVermelhos = eventosJogador.filter(e => e.tipo === 'Cartão Vermelho').length;

    const mediaPresenca = presencas > 0 ? pontuacaoTotal / presencas : 0;

    rankingData.push({
      jogador,
      pontuacaoTotal,
      vitorias,
      presencas,
      gols,
      assistencias,
      cartoesAmarelos,
      cartoesAzuis,
      cartoesVermelhos,
      mediaPresenca,
      posicao: 0 // Será calculado após ordenação
    });
  }

  // Ordenar por pontuação total, depois por vitórias, depois por presenças
  rankingData.sort((a, b) => {
    if (b.pontuacaoTotal !== a.pontuacaoTotal) {
      return b.pontuacaoTotal - a.pontuacaoTotal;
    }
    if (b.vitorias !== a.vitorias) {
      return b.vitorias - a.vitorias;
    }
    return b.presencas - a.presencas;
  });

  // Atribuir posições
  rankingData.forEach((item, index) => {
    item.posicao = index + 1;
  });

  return rankingData;
};

export { initializeData };
