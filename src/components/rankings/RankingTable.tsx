
import React from 'react';
import { RankingJogador } from '@/types';

interface RankingTableProps {
  data: RankingJogador[];
  type: 'geral' | 'artilharia' | 'assistencia';
}

const RankingTable: React.FC<RankingTableProps> = ({ data, type }) => (
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4 font-semibold">#</th>
          <th className="text-left py-3 px-4 font-semibold">Jogador</th>
          <th className="text-left py-3 px-4 font-semibold">Tipo</th>
          {type === 'geral' && (
            <>
              <th className="text-left py-3 px-4 font-semibold">Pontos</th>
              <th className="text-left py-3 px-4 font-semibold">Vitórias</th>
              <th className="text-left py-3 px-4 font-semibold">Presenças</th>
            </>
          )}
          {type === 'artilharia' && (
            <>
              <th className="text-left py-3 px-4 font-semibold">Gols</th>
              <th className="text-left py-3 px-4 font-semibold">Média/Jogo</th>
            </>
          )}
          {type === 'assistencia' && (
            <>
              <th className="text-left py-3 px-4 font-semibold">Assistências</th>
              <th className="text-left py-3 px-4 font-semibold">Média/Jogo</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={item.jogador.id} className="border-b border-border hover:bg-accent/50 transition-colors">
            <td className="py-3 px-4 font-medium">{index + 1}</td>
            <td className="py-3 px-4">{item.jogador.nome}</td>
            <td className="py-3 px-4">
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
                <td className="py-3 px-4 font-semibold">{item.pontuacaoTotal}</td>
                <td className="py-3 px-4">{item.vitorias}</td>
                <td className="py-3 px-4">{item.presencas}</td>
              </>
            )}
            {type === 'artilharia' && (
              <>
                <td className="py-3 px-4 font-semibold">{item.gols}</td>
                <td className="py-3 px-4">{item.presencas > 0 ? (item.gols / item.presencas).toFixed(2) : '0.00'}</td>
              </>
            )}
            {type === 'assistencia' && (
              <>
                <td className="py-3 px-4 font-semibold">{item.assistencias}</td>
                <td className="py-3 px-4">{item.presencas > 0 ? (item.assistencias / item.presencas).toFixed(2) : '0.00'}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default RankingTable;
