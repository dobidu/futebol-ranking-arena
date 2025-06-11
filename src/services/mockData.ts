
import { Jogador, Temporada, Pelada } from '@/types';

export const mockJogadores: Jogador[] = [
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
  { id: '11', nome: 'Ricardo Silva', tipo: 'Mensalista', ativo: true, criadoEm: new Date('2024-03-01') },
  { id: '12', nome: 'Eduardo Costa', tipo: 'Convidado', ativo: true, criadoEm: new Date('2024-03-12') },
];

export const mockTemporadas: Temporada[] = [
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

export const mockPeladas: Pelada[] = [
  {
    id: '1',
    data: new Date('2024-03-22'),
    temporadaId: '1',
    partidas: [
      {
        id: '1',
        peladaId: '1',
        numeroPartida: 1,
        timeA: ['1', '3', '6', '9'],
        timeB: ['2', '4', '7', '10'],
        golsTimeA: 4,
        golsTimeB: 2,
        placarA: 4,
        placarB: 2,
        eventos: [
          { id: '1', partidaId: '1', jogadorId: '1', tipo: 'gol', minuto: 5, assistidoPor: '3' },
          { id: '2', partidaId: '1', jogadorId: '2', tipo: 'gol', minuto: 10 },
          { id: '3', partidaId: '1', jogadorId: '6', tipo: 'gol', minuto: 15, assistidoPor: '9' },
          { id: '4', partidaId: '1', jogadorId: '4', tipo: 'gol', minuto: 20, assistidoPor: '7' },
          { id: '5', partidaId: '1', jogadorId: '3', tipo: 'gol', minuto: 25, assistidoPor: '1' },
          { id: '6', partidaId: '1', jogadorId: '1', tipo: 'gol', minuto: 30 },
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
    ],
    times: [
      { id: 't1', peladaId: '1', identificadorLetra: 'A', jogadores: ['1', '3', '6', '9'] },
      { id: 't2', peladaId: '1', identificadorLetra: 'B', jogadores: ['2', '4', '7', '10'] },
    ],
    jogadoresPresentes: [
      { id: '1', nome: 'João Silva', tipo: 'Mensalista', presente: true },
      { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', presente: true },
      { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', presente: true },
      { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', presente: true },
      { id: '9', nome: 'Gabriel Torres', tipo: 'Mensalista', presente: true },
      { id: '10', nome: 'Thiago Alves', tipo: 'Mensalista', presente: true },
    ]
  },
  {
    id: '2',
    data: new Date('2024-03-15'),
    temporadaId: '1',
    partidas: [
      {
        id: '2',
        peladaId: '2',
        numeroPartida: 1,
        timeA: ['1', '2', '8', '11'],
        timeB: ['3', '4', '6', '7'],
        golsTimeA: 2,
        golsTimeB: 3,
        placarA: 2,
        placarB: 3,
        eventos: [
          { id: '6', partidaId: '2', jogadorId: '2', tipo: 'gol', minuto: 12, assistidoPor: '1' },
          { id: '7', partidaId: '2', jogadorId: '6', tipo: 'gol', minuto: 18 },
          { id: '8', partidaId: '2', jogadorId: '11', tipo: 'gol', minuto: 25, assistidoPor: '8' },
          { id: '9', partidaId: '2', jogadorId: '3', tipo: 'gol', minuto: 30, assistidoPor: '4' },
          { id: '10', partidaId: '2', jogadorId: '7', tipo: 'gol', minuto: 35 },
        ]
      }
    ],
    presencas: [
      { id: '11', peladaId: '2', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '12', peladaId: '2', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '13', peladaId: '2', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '14', peladaId: '2', jogadorId: '4', presente: true, atraso: 'nenhum' },
      { id: '16', peladaId: '2', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '17', peladaId: '2', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '18', peladaId: '2', jogadorId: '8', presente: true, atraso: 'nenhum' },
      { id: '19', peladaId: '2', jogadorId: '11', presente: true, atraso: 'nenhum' },
    ],
    times: [
      { id: 't3', peladaId: '2', identificadorLetra: 'A', jogadores: ['1', '2', '8', '11'] },
      { id: 't4', peladaId: '2', identificadorLetra: 'B', jogadores: ['3', '4', '6', '7'] },
    ],
    jogadoresPresentes: [
      { id: '1', nome: 'João Silva', tipo: 'Mensalista', presente: true },
      { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', presente: true },
      { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', presente: true },
      { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', presente: true },
      { id: '8', nome: 'Felipe Rocha', tipo: 'Convidado', presente: true },
      { id: '11', nome: 'Ricardo Silva', tipo: 'Mensalista', presente: true },
    ]
  },
  {
    id: '3',
    data: new Date('2024-03-08'),
    temporadaId: '1',
    partidas: [
      {
        id: '3',
        peladaId: '3',
        numeroPartida: 1,
        timeA: ['1', '4', '7', '9'],
        timeB: ['2', '3', '6', '10'],
        golsTimeA: 3,
        golsTimeB: 4,
        placarA: 3,
        placarB: 4,
        eventos: [
          { id: '11', partidaId: '3', jogadorId: '1', tipo: 'gol', minuto: 8 },
          { id: '12', partidaId: '3', jogadorId: '2', tipo: 'gol', minuto: 14, assistidoPor: '3' },
          { id: '13', partidaId: '3', jogadorId: '7', tipo: 'gol', minuto: 22, assistidoPor: '9' },
          { id: '14', partidaId: '3', jogadorId: '6', tipo: 'gol', minuto: 28 },
          { id: '15', partidaId: '3', jogadorId: '10', tipo: 'gol', minuto: 35, assistidoPor: '2' },
          { id: '16', partidaId: '3', jogadorId: '4', tipo: 'gol', minuto: 40, assistidoPor: '7' },
          { id: '17', partidaId: '3', jogadorId: '3', tipo: 'gol', minuto: 42 },
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
    ],
    times: [
      { id: 't5', peladaId: '3', identificadorLetra: 'A', jogadores: ['1', '4', '7', '9'] },
      { id: 't6', peladaId: '3', identificadorLetra: 'B', jogadores: ['2', '3', '6', '10'] },
    ],
    jogadoresPresentes: [
      { id: '1', nome: 'João Silva', tipo: 'Mensalista', presente: true },
      { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', presente: true },
      { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', presente: true },
      { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', presente: true },
      { id: '9', nome: 'Gabriel Torres', tipo: 'Mensalista', presente: true },
      { id: '10', nome: 'Thiago Alves', tipo: 'Mensalista', presente: true },
    ]
  },
  {
    id: '4',
    data: new Date('2024-03-01'),
    temporadaId: '1',
    partidas: [
      {
        id: '4',
        peladaId: '4',
        numeroPartida: 1,
        timeA: ['5', '8', '11', '12'],
        timeB: ['1', '3', '6', '9'],
        golsTimeA: 1,
        golsTimeB: 2,
        placarA: 1,
        placarB: 2,
        eventos: [
          { id: '18', partidaId: '4', jogadorId: '8', tipo: 'gol', minuto: 15, assistidoPor: '11' },
          { id: '19', partidaId: '4', jogadorId: '1', tipo: 'gol', minuto: 22 },
          { id: '20', partidaId: '4', jogadorId: '6', tipo: 'gol', minuto: 38, assistidoPor: '9' },
        ]
      }
    ],
    presencas: [
      { id: '31', peladaId: '4', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '32', peladaId: '4', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '33', peladaId: '4', jogadorId: '5', presente: true, atraso: 'nenhum' },
      { id: '34', peladaId: '4', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '35', peladaId: '4', jogadorId: '8', presente: true, atraso: 'nenhum' },
      { id: '36', peladaId: '4', jogadorId: '9', presente: true, atraso: 'nenhum' },
      { id: '37', peladaId: '4', jogadorId: '11', presente: true, atraso: 'nenhum' },
      { id: '38', peladaId: '4', jogadorId: '12', presente: true, atraso: 'nenhum' },
    ],
    times: [
      { id: 't7', peladaId: '4', identificadorLetra: 'A', jogadores: ['5', '8', '11', '12'] },
      { id: 't8', peladaId: '4', identificadorLetra: 'B', jogadores: ['1', '3', '6', '9'] },
    ],
    jogadoresPresentes: [
      { id: '1', nome: 'João Silva', tipo: 'Mensalista', presente: true },
      { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', presente: true },
      { id: '5', nome: 'Bruno Lima', tipo: 'Convidado', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '8', nome: 'Felipe Rocha', tipo: 'Convidado', presente: true },
      { id: '9', nome: 'Gabriel Torres', tipo: 'Mensalista', presente: true },
      { id: '11', nome: 'Ricardo Silva', tipo: 'Mensalista', presente: true },
      { id: '12', nome: 'Eduardo Costa', tipo: 'Convidado', presente: true },
    ]
  },
  {
    id: '5',
    data: new Date('2024-02-24'),
    temporadaId: '1',
    partidas: [
      {
        id: '5',
        peladaId: '5',
        numeroPartida: 1,
        timeA: ['2', '4', '7', '10'],
        timeB: ['1', '6', '8', '11'],
        golsTimeA: 3,
        golsTimeB: 1,
        placarA: 3,
        placarB: 1,
        eventos: [
          { id: '21', partidaId: '5', jogadorId: '2', tipo: 'gol', minuto: 10, assistidoPor: '4' },
          { id: '22', partidaId: '5', jogadorId: '7', tipo: 'gol', minuto: 18 },
          { id: '23', partidaId: '5', jogadorId: '6', tipo: 'gol', minuto: 25, assistidoPor: '11' },
          { id: '24', partidaId: '5', jogadorId: '10', tipo: 'gol', minuto: 32, assistidoPor: '2' },
          { id: '25', partidaId: '5', jogadorId: '4', tipo: 'cartao_amarelo', minuto: 35 },
        ]
      }
    ],
    presencas: [
      { id: '41', peladaId: '5', jogadorId: '1', presente: true, atraso: 'nenhum' },
      { id: '42', peladaId: '5', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '43', peladaId: '5', jogadorId: '4', presente: true, atraso: 'tipo1' },
      { id: '44', peladaId: '5', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '45', peladaId: '5', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '46', peladaId: '5', jogadorId: '8', presente: true, atraso: 'nenhum' },
      { id: '47', peladaId: '5', jogadorId: '10', presente: true, atraso: 'nenhum' },
      { id: '48', peladaId: '5', jogadorId: '11', presente: true, atraso: 'nenhum' },
    ],
    times: [
      { id: 't9', peladaId: '5', identificadorLetra: 'A', jogadores: ['2', '4', '7', '10'] },
      { id: 't10', peladaId: '5', identificadorLetra: 'B', jogadores: ['1', '6', '8', '11'] },
    ],
    jogadoresPresentes: [
      { id: '1', nome: 'João Silva', tipo: 'Mensalista', presente: true },
      { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', presente: true },
      { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', presente: true },
      { id: '8', nome: 'Felipe Rocha', tipo: 'Convidado', presente: true },
      { id: '10', nome: 'Thiago Alves', tipo: 'Mensalista', presente: true },
      { id: '11', nome: 'Ricardo Silva', tipo: 'Mensalista', presente: true },
    ]
  },
  {
    id: '6',
    data: new Date('2024-02-17'),
    temporadaId: '1',
    partidas: [
      {
        id: '6',
        peladaId: '6',
        numeroPartida: 1,
        timeA: ['3', '5', '9', '12'],
        timeB: ['2', '4', '6', '7'],
        golsTimeA: 2,
        golsTimeB: 2,
        placarA: 2,
        placarB: 2,
        eventos: [
          { id: '26', partidaId: '6', jogadorId: '3', tipo: 'gol', minuto: 12 },
          { id: '27', partidaId: '6', jogadorId: '2', tipo: 'gol', minuto: 20, assistidoPor: '4' },
          { id: '28', partidaId: '6', jogadorId: '9', tipo: 'gol', minuto: 28, assistidoPor: '5' },
          { id: '29', partidaId: '6', jogadorId: '6', tipo: 'gol', minuto: 35 },
        ]
      }
    ],
    presencas: [
      { id: '51', peladaId: '6', jogadorId: '2', presente: true, atraso: 'nenhum' },
      { id: '52', peladaId: '6', jogadorId: '3', presente: true, atraso: 'nenhum' },
      { id: '53', peladaId: '6', jogadorId: '4', presente: true, atraso: 'nenhum' },
      { id: '54', peladaId: '6', jogadorId: '5', presente: true, atraso: 'nenhum' },
      { id: '55', peladaId: '6', jogadorId: '6', presente: true, atraso: 'nenhum' },
      { id: '56', peladaId: '6', jogadorId: '7', presente: true, atraso: 'nenhum' },
      { id: '57', peladaId: '6', jogadorId: '9', presente: true, atraso: 'nenhum' },
      { id: '58', peladaId: '6', jogadorId: '12', presente: true, atraso: 'nenhum' },
    ],
    times: [
      { id: 't11', peladaId: '6', identificadorLetra: 'A', jogadores: ['3', '5', '9', '12'] },
      { id: 't12', peladaId: '6', identificadorLetra: 'B', jogadores: ['2', '4', '6', '7'] },
    ],
    jogadoresPresentes: [
      { id: '2', nome: 'Pedro Santos', tipo: 'Mensalista', presente: true },
      { id: '3', nome: 'Carlos Oliveira', tipo: 'Convidado', presente: true },
      { id: '4', nome: 'Ana Costa', tipo: 'Mensalista', presente: true },
      { id: '5', nome: 'Bruno Lima', tipo: 'Convidado', presente: true },
      { id: '6', nome: 'Rafael Mendes', tipo: 'Mensalista', presente: true },
      { id: '7', nome: 'Lucas Ferreira', tipo: 'Mensalista', presente: true },
      { id: '9', nome: 'Gabriel Torres', tipo: 'Mensalista', presente: true },
      { id: '12', nome: 'Eduardo Costa', tipo: 'Convidado', presente: true },
    ]
  }
];
