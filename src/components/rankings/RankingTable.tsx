
import React from 'react';
import { Link } from 'react-router-dom';
import { RankingJogador, Temporada } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Users, Calendar, Award, Clock, AlertTriangle, User } from 'lucide-react';

interface RankingTableProps {
  data: RankingJogador[];
  type: 'geral' | 'artilharia' | 'assistencia';
  temporada?: Temporada;
}

const RankingTable: React.FC<RankingTableProps> = ({ data, type, temporada }) => {
  const getPosicaoIcon = (posicao: number) => {
    if (posicao === 1) return '🥇';
    if (posicao === 2) return '🥈';
    if (posicao === 3) return '🥉';
    return null;
  };

  const getPosicaoColor = (posicao: number) => {
    if (posicao === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
    if (posicao === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
    if (posicao === 3) return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    return 'bg-muted text-muted-foreground';
  };

  const renderTooltipInfo = () => {
    if (type === 'geral' && temporada) {
      return (
        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Award className="h-4 w-4" />
            Sistema de Pontuação
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div>✅ Vitória: +{temporada.pontosVitoria}</div>
            <div>🤝 Empate: +{temporada.pontosEmpate}</div>
            <div>❌ Derrota: +{temporada.pontosDerrota}</div>
            <div>📅 Presença: +1</div>
            <div>🟡 C. Amarelo: {temporada.penalidadeCartaoAmarelo}</div>
            <div>🔵 C. Azul: {temporada.penalidadeCartaoAzul}</div>
            <div>🔴 C. Vermelho: {temporada.penalidadeCartaoVermelho}</div>
            <div>⏰ Atraso T1: {temporada.penalidadeAtraso1}</div>
            <div>⏰ Atraso T2: {temporada.penalidadeAtraso2}</div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {renderTooltipInfo()}
      
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-16 text-center font-bold">
                <div className="flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4" />
                  #
                </div>
              </TableHead>
              <TableHead className="font-bold">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Jogador
                </div>
              </TableHead>
              <TableHead className="text-center font-bold">Tipo</TableHead>
              
              {type === 'geral' && (
                <>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Award className="h-4 w-4" />
                      Pontos
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Trophy className="h-4 w-4 text-green-600" />
                      Vitórias
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      Presenças
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-4 w-4 text-orange-600" />
                      Gols
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      Assist.
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      Cartões
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4 text-orange-600" />
                      Atrasos
                    </div>
                  </TableHead>
                </>
              )}
              
              {type === 'artilharia' && (
                <>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Target className="h-4 w-4 text-green-600" />
                      Gols
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Presenças
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Média/Jogo</TableHead>
                </>
              )}
              
              {type === 'assistencia' && (
                <>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      Assistências
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Presenças
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-bold">Média/Jogo</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow 
                key={item.jogador.id} 
                className={`hover:bg-muted/50 transition-colors ${
                  index < 3 ? 'bg-gradient-to-r from-muted/30 to-transparent border-l-4 border-l-primary' : ''
                }`}
              >
                <TableCell className="text-center font-bold">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${getPosicaoColor(index + 1)}`}>
                    {getPosicaoIcon(index + 1) || (index + 1)}
                  </div>
                </TableCell>
                
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/jogador/${item.jogador.id}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                      <User className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <div className="font-semibold text-foreground group-hover:text-primary underline-offset-4 group-hover:underline">
                        {item.jogador.nome}
                      </div>
                    </Link>
                  </div>
                </TableCell>
                
                <TableCell className="text-center">
                  <Badge 
                    variant={item.jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {item.jogador.tipo}
                  </Badge>
                </TableCell>
                
                {type === 'geral' && (
                  <>
                    <TableCell className="text-center">
                      <div className="font-bold text-lg text-primary">{item.pontuacaoTotal}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Trophy className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{item.vitorias}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-blue-600">{item.presencas}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-4 w-4 text-orange-600" />
                        <span className="font-semibold">{item.gols}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="font-semibold">{item.assistencias}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {item.cartoesAmarelos > 0 && (
                          <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
                            🟡 {item.cartoesAmarelos}
                          </Badge>
                        )}
                        {item.cartoesAzuis > 0 && (
                          <Badge variant="outline" className="text-blue-600 border-blue-600 bg-blue-50">
                            🔵 {item.cartoesAzuis}
                          </Badge>
                        )}
                        {item.cartoesVermelhos > 0 && (
                          <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                            🔴 {item.cartoesVermelhos}
                          </Badge>
                        )}
                        {(item.cartoesAmarelos + item.cartoesAzuis + item.cartoesVermelhos) === 0 && (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        {item.atrasosTipo1 > 0 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-600 bg-orange-50">
                            T1: {item.atrasosTipo1}
                          </Badge>
                        )}
                        {item.atrasosTipo2 > 0 && (
                          <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                            T2: {item.atrasosTipo2}
                          </Badge>
                        )}
                        {(item.atrasosTipo1 + item.atrasosTipo2) === 0 && (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                  </>
                )}
                
                {type === 'artilharia' && (
                  <>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Target className="h-5 w-5 text-green-600" />
                        <span className="font-bold text-lg text-green-600">{item.gols}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-blue-600">{item.presencas}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-semibold">
                        {item.presencas > 0 ? (item.gols / item.presencas).toFixed(2) : '0.00'}
                      </Badge>
                    </TableCell>
                  </>
                )}
                
                {type === 'assistencia' && (
                  <>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="font-bold text-lg text-purple-600">{item.assistencias}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-semibold text-blue-600">{item.presencas}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-semibold">
                        {item.presencas > 0 ? (item.assistencias / item.presencas).toFixed(2) : '0.00'}
                      </Badge>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {data.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum dado disponível para esta temporada</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingTable;
