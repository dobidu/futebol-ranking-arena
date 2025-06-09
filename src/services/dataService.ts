
import { Jogador, Pelada, Partida, Evento, Temporada, RankingJogador } from '@/types';

// Funções para acessar o Local Storage
const storage = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

// Serviços para cada tipo de dado
const createService = <T extends { id: string }>(key: string) => ({
  getAll: (): T[] => storage.get(key) || [],
  getById: (id: string): T | undefined => {
    const items: T[] = storage.get(key) || [];
    return items.find((item: any) => item.id === id);
  },
  create: (item: Omit<T, 'id'> & { id?: string }): void => {
    const items: T[] = storage.get(key) || [];
    const newItem = { ...item, id: item.id || crypto.randomUUID() } as T;
    storage.set(key, [...items, newItem]);
  },
  update: (id: string, updatedItem: Partial<T>): void => {
    const items: T[] = storage.get(key) || [];
    const updatedItems = items.map((item: any) => (item.id === id ? { ...item, ...updatedItem } : item));
    storage.set(key, updatedItems);
  },
  delete: (id: string): void => {
    const items: T[] = storage.get(key) || [];
    const filteredItems = items.filter((item: any) => item.id !== id);
    storage.set(key, filteredItems);
  },
});

// Mock data inicial
const mockJogadores: Jogador[] = [
  { id: '1', nome: 'João Silva', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-15') },
  { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-02-20') },
  { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', ativo: true, criadoEm: new Date('2024-03-10') },
  { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-25') },
  { id: '5', nome: 'Bruno Lima', tipo: 'Convidado', ativo: false, criadoEm: new Date('2024-02-05') },
  { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-10') },
  { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-02-15') },
  { id: '8', nome: 'Felipe Rocha', tipo: 'Convidado', ativo: true, criadoEm: new Date('2024-03-05') },
  { id: '9', nome: 'Gabriel Torres', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-01-20') },
  { id: '10', nome: 'Thiago Alves', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-02-10') },
];

const mockTemporadas: Temporada[] = [
  {
    id: '1',
    nome: '2024.1',
    ativa: true,
    pontosVitoria: 3,
    pontosEmpate: 1,
    pontosDerrota: 0,
    numeroDescartes: 2,
    penalidadeAtraso1: -0.5,
    penalidadeAtraso2: -1.0,
    penalidadeCartaoAmarelo: -0.5,
    penalidadeCartaoAzul: -1.0,
    penalidadeCartaoVermelho: -2.0,
    criadaEm: new Date('2024-01-01'),
  },
  {
    id: '2',
    nome: '2023.2',
    ativa: false,
    pontosVitoria: 3,
    pontosEmpate: 1,
    pontosDerrota: 0,
    numeroDescartes: 2,
    penalidadeAtraso1: -0.5,
    penalidadeAtraso2: -1.0,
    penalidadeCartaoAmarelo: -0.5,
    penalidadeCartaoAzul: -1.0,
    penalidadeCartaoVermelho: -2.0,
    criadaEm: new Date('2023-08-01'),
  },
];

const mockPeladas: Pelada[] = [
  {
    id: '1',
    data: new Date('2024-03-15'),
    temporadaId: '1',
    partidas: [
      {
        id: '1',
        peladaId: '1',
        numeroPartida: 1,
        timeA: ['1', '3', '6', '9'],
        timeB: ['2', '4', '7', '10'],
        golsTimeA: 3,
        golsTimeB: 2,
        eventos: [
          { id: '1', partidaId: '1', jogadorId: '1', tipo: 'gol', minuto: 5, assistidoPor: '3' },
          { id: '2', partidaId: '1', jogadorId: '2', tipo: 'gol', minuto: 10 },
          { id: '3', partidaId: '1', jogadorId: '6', tipo: 'gol', minuto: 15, assistidoPor: '9' },
          { id: '4', partidaId: '1', jogadorId: '4', tipo: 'gol', minuto: 20, assistidoPor: '7' },
          { id: '5', partidaId: '1', jogadorId: '3', tipo: 'gol', minuto: 25, assistidoPor: '1' },
        ]
      }
    ],
    presencas: [
      { id: '1', peladaId: '1', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '2', peladaId: '1', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '3', peladaId: '1', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '4', peladaId: '1', jogadorId: '4', presente: true, atraso: 'nenhum' },
      { id: '6', peladaId: '1', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '7', peladaId: '1', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '9', peladaId: '1', jogadorId: '9', presente: true, atraso: 'nenhum' },
      { id: '10', peladaId: '1', jogadorId: '10', presente: true, atraso: 'nenhum' },
    ]
  },
  {
    id: '2',
    data: new Date('2024-03-08'),
    temporadaId: '1',
    partidas: [
      {
        id: '2',
        peladaId: '2',
        numeroPartida: 1,
        timeA: ['1', '2', '5', '8'],
        timeB: ['3', '4', '6', '7'],
        golsTimeA: 1,
        golsTimeB: 1,
        eventos: [
          { id: '6', partidaId: '2', jogadorId: '2', tipo: 'gol', minuto: 12, assistidoPor: '1' },
          { id: '7', partidaId: '2', jogadorId: '6', tipo: 'gol', minuto: 18 },
        ]
      }
    ],
    presencas: [
      { id: '11', peladaId: '2', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '12', peladaId: '2', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '13', peladaId: '2', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '14', peladaId: '2', jogadorId: '4', presente: true, atraso: 'nenhum' },
      { id: '15', peladaId: '2', jogadorId: '5', presente: true, atraso: 'nenhum' },
      { id: '16', peladaId: '2', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '17', peladaId: '2', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '18', peladaId: '2', jogadorId: '8', presente: true, atraso: 'nenhum' },
    ]
  },
  {
    id: '3',
    data: new Date('2024-03-01'),
    temporadaId: '1',
    partidas: [
      {
        id: '3',
        peladaId: '3',
        numeroPartida: 1,
        timeA: ['1', '4', '7', '9'],
        timeB: ['2', '3', '6', '10'],
        golsTimeA: 2,
        golsTimeB: 3,
        eventos: [
          { id: '8', partidaId: '3', jogadorId: '1', tipo: 'gol', minuto: 8 },
          { id: '9', partidaId: '3', jogadorId: '2', tipo: 'gol', minuto: 14, assistidoPor: '3' },
          { id: '10', partidaId: '3', jogadorId: '7', tipo: 'gol', minuto: 22, assistidoPor: '9' },
          { id: '11', partidaId: '3', jogadorId: '6', tipo: 'gol', minuto: 28 },
          { id: '12', partidaId: '3', jogadorId: '10', tipo: 'gol', minuto: 35, assistidoPor: '2' },
        ]
      }
    ],
    presencas: [
      { id: '21', peladaId: '3', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '22', peladaId: '3', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '23', peladaId: '3', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '24', peladaId: '3', jogadorId: '4', presente: true, atraso: 'nenhum' },
      { id: '25', peladaId: '3', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '26', peladaId: '3', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '27', peladaId: '3', jogadorId: '9', presente: true, atraso: 'nenhum' },
      { id: '28', peladaId: '3', jogadorId: '10', presente: true, atraso: 'nenhum' },
    ]
  }
];

// Inicializar dados no Local Storage se não existirem
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

export const calcularRanking = (temporadaId?: string): RankingJogador[] => {
  const peladas = peladaService.getAll();
  const temporadas = temporadaService.getAll();
  const jogadores = jogadorService.getAll();
  
  const peladasFiltradas = temporadaId 
    ? peladas.filter(p => p.temporadaId === temporadaId)
    : peladas;
  
  const temporadaSelecionada = temporadaId 
    ? temporadas.find(t => t.id === temporadaId)
    : temporadas.find(t => t.ativa) || temporadas[0];
  
  if (!temporadaSelecionada) return [];

  const ranking: RankingJogador[] = [];

  // Para cada jogador, calcular suas estatísticas
  jogadores.forEach(jogador => {
    let pontuacaoTotal = 0;
    let presencas = 0;
    let vitorias = 0;
    let gols = 0;
    let assistencias = 0;
    let cartoesAmarelos = 0;
    let cartoesAzuis = 0;
    let cartoesVermelhos = 0;

    peladasFiltradas.forEach(pelada => {
      const presenca = pelada.presencas.find(p => p.jogadorId === jogador.id);
      
      if (presenca && presenca.presente) {
        presencas++;
        
        // Pontuação por presença
        pontuacaoTotal += 1;
        
        // Penalidade por atraso
        if (presenca.atraso === 'tipo1') {
          pontuacaoTotal += temporadaSelecionada.penalidadeAtraso1;
        } else if (presenca.atraso === 'tipo2') {
          pontuacaoTotal += temporadaSelecionada.penalidadeAtraso2;
        }

        // Calcular resultados das partidas
        pelada.partidas.forEach(partida => {
          const jogadorNoTimeA = partida.timeA.includes(jogador.id);
          const jogadorNoTimeB = partida.timeB.includes(jogador.id);
          
          if (jogadorNoTimeA || jogadorNoTimeB) {
            let pontos = 0;
            
            if (partida.golsTimeA > partida.golsTimeB) {
              // Time A venceu
              if (jogadorNoTimeA) {
                pontos = temporadaSelecionada.pontosVitoria;
                vitorias++;
              } else {
                pontos = temporadaSelecionada.pontosDerrota;
              }
            } else if (partida.golsTimeB > partida.golsTimeA) {
              // Time B venceu
              if (jogadorNoTimeB) {
                pontos = temporadaSelecionada.pontosVitoria;
                vitorias++;
              } else {
                pontos = temporadaSelecionada.pontosDerrota;
              }
            } else {
              // Empate
              pontos = temporadaSelecionada.pontosEmpate;
            }
            
            pontuacaoTotal += pontos;
          }

          // Contar gols, assistências e cartões
          partida.eventos.forEach(evento => {
            if (evento.jogadorId === jogador.id) {
              switch (evento.tipo) {
                case 'gol':
                  gols++;
                  break;
                case 'cartao_amarelo':
                  cartoesAmarelos++;
                  pontuacaoTotal += temporadaSelecionada.penalidadeCartaoAmarelo;
                  break;
                case 'cartao_azul':
                  cartoesAzuis++;
                  pontuacaoTotal += temporadaSelecionada.penalidadeCartaoAzul;
                  break;
                case 'cartao_vermelho':
                  cartoesVermelhos++;
                  pontuacaoTotal += temporadaSelecionada.penalidadeCartaoVermelho;
                  break;
              }
            }
            
            // Contar assistências
            if (evento.assistidoPor === jogador.id) {
              assistencias++;
            }
          });
        });
      }
    });

    if (presencas > 0) {
      ranking.push({
        jogador,
        pontuacaoTotal: Number(pontuacaoTotal.toFixed(1)),
        vitorias,
        presencas,
        gols,
        assistencias,
        cartoesAmarelos,
        cartoesAzuis,
        cartoesVermelhos,
        mediaPresenca: presencas > 0 ? pontuacaoTotal / presencas : 0,
        posicao: 0 // será calculada depois
      });
    }
  });

  // Ordenar por pontuação total e definir posições
  ranking.sort((a, b) => b.pontuacaoTotal - a.pontuacaoTotal);
  ranking.forEach((item, index) => {
    item.posicao = index + 1;
  });

  return ranking;
};

export const partidaService = createService<Partida>('partidas');
export const eventoService = createService<Evento>('eventos');
