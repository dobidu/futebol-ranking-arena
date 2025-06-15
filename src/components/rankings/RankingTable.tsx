
import React from 'react';
import { RankingJogador, Temporada } from '@/types';

interface RankingTableProps {
  data: RankingJogador[];
  type: 'geral' | 'artilharia' | 'assistencia';
  temporada?: Temporada;
}

const RankingTable: React.FC<RankingTableProps> = ({ data, type, temporada }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">#</th>
          <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Jogador</th>
          <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Tipo</th>
          {type === 'geral' && (
            <>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">
                Pontos Totais
                {temporada && (
                  <div className="text-xs text-muted-foreground font-normal mt-1">
                    (V:{temporada.pontosVitoria} | E:{temporada.pontosEmpate} | D:{temporada.pontosDerrota} | P:+1)
                  </div>
                )}
              </th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Vitórias</th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Presenças</th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">
                Cartões
                {temporada && (
                  <div className="text-xs text-muted-foreground font-normal mt-1">
                    (🟡:{temporada.penalidadeCartaoAmarelo} | 🔵:{temporada.penalidadeCartaoAzul} | 🔴:{temporada.penalidadeCartaoVermelho})
                  </div>
                )}
              </th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">
                Atrasos
                {temporada && (
                  <div className="text-xs text-muted-foreground font-normal mt-1">
                    (T1:{temporada.penalidadeAtraso1} | T2:{temporada.penalidadeAtraso2})
                  </div>
                )}
              </th>
            </>
          )}
          {type === 'artilharia' && (
            <>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Gols</th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Média/Jogo</th>
            </>
          )}
          {type === 'assistencia' && (
            <>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Assistências</th>
              <th className="text-left py-3 px-2 font-semibold text-xs sm:text-sm">Média/Jogo</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.jogador.id} className="border-b border-border hover:bg-accent/50 transition-colors">
            <td className="py-3 px-2 font-medium text-xs sm:text-sm">{index + 1}</td>
            <td className="py-3 px-2 text-xs sm:text-sm">{item.jogador.nome}</td>
            <td className="py-3 px-2">
              <span className={`px-2 py-1 rounded-full text-xs ${
                item.jogador.tipo === 'Mensalista' 
                  ? 'bg-primary/10 text-primary' 
                  : 'bg-secondary/10 text-secondary-foreground'
              }`}>
                {item.jogador.tipo}
              </span>
            </td>
            {type === 'geral' && (
              <>
                <td className="py-3 px-2 font-semibold text-xs sm:text-sm">{item.pontuacaoTotal}</td>
                <td className="py-3 px-2 text-xs sm:text-sm">{item.vitorias}</td>
                <td className="py-3 px-2 text-xs sm:text-sm">{item.presencas}</td>
                <td className="py-3 px-2 text-xs sm:text-sm">
                  <div className="space-x-1">
                    {item.cartoesAmarelos > 0 && (
                      <span className="inline-flex items-center">
                        🟡{item.cartoesAmarelos}
                      </span>
                    )}
                    {item.cartoesAzuis > 0 && (
                      <span className="inline-flex items-center">
                        🔵{item.cartoesAzuis}
                      </span>
                    )}
                    {item.cartoesVermelhos > 0 && (
                      <span className="inline-flex items-center">
                        🔴{item.cartoesVermelhos}
                      </span>
                    )}
                    {(item.cartoesAmarelos + item.cartoesAzuis + item.cartoesVermelhos) === 0 && '-'}
                  </div>
                </td>
                <td className="py-3 px-2 text-xs sm:text-sm">
                  <div className="space-x-1">
                    {item.atrasosTipo1 > 0 && (
                      <span className="inline-flex items-center text-orange-600">
                        T1:{item.atrasosTipo1}
                      </span>
                    )}
                    {item.atrasosTipo2 > 0 && (
                      <span className="inline-flex items-center text-red-600">
                        T2:{item.atrasosTipo2}
                      </span>
                    )}
                    {(item.atrasosTipo1 + item.atrasosTipo2) === 0 && '-'}
                  </div>
                </td>
              </>
            )}
            {type === 'artilharia' && (
              <>
                <td className="py-3 px-2 font-semibold text-xs sm:text-sm">{item.gols}</td>
                <td className="py-3 px-2 text-xs sm:text-sm">{item.presencas > 0 ? (item.gols / item.presencas).toFixed(2) : '0.00'}</td>
              </>
            )}
            {type === 'assistencia' && (
              <>
                <td className="py-3 px-2 font-semibold text-xs sm:text-sm">{item.assistencias}</td>
                <td className="py-3 px-2 text-xs sm:text-sm">{item.presencas > 0 ? (item.assistencias / item.presencas).toFixed(2) : '0.00'}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
