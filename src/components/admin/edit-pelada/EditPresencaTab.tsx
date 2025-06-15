
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Users, Clock } from 'lucide-react';
import { Pelada, Jogador, Temporada, JogadorPresente } from '@/types';

interface EditPresencaTabProps {
  pelada: Pelada;
  jogadores: Jogador[];
  temporada?: Temporada;
  onSave: (dadosAtualizados: any) => void;
}

const EditPresencaTab: React.FC<EditPresencaTabProps> = ({
  pelada,
  jogadores,
  temporada,
  onSave
}) => {
  const [jogadoresPresentes, setJogadoresPresentes] = useState<JogadorPresente[]>([]);

  useEffect(() => {
    // Inicializar lista de jogadores com dados da pelada
    const jogadoresComPresenca: JogadorPresente[] = jogadores.map(jogador => {
      const presencaExistente = pelada.presencas?.find(p => p.jogadorId === jogador.id);
      const jogadorPresenteExistente = pelada.jogadoresPresentes?.find(jp => jp.id === jogador.id);
      
      return {
        id: jogador.id,
        nome: jogador.nome,
        tipo: jogador.tipo,
        presente: presencaExistente?.presente || jogadorPresenteExistente?.presente || false,
        atraso: presencaExistente?.atraso || jogadorPresenteExistente?.atraso || 'nenhum'
      };
    });

    setJogadoresPresentes(jogadoresComPresenca);
  }, [pelada, jogadores]);

  const togglePresenca = (jogadorId: string) => {
    setJogadoresPresentes(prev => 
      prev.map(jogador => 
        jogador.id === jogadorId 
          ? { ...jogador, presente: !jogador.presente, atraso: !jogador.presente ? 'nenhum' : jogador.atraso }
          : jogador
      )
    );
  };

  const setAtrasoJogador = (jogadorId: string, atraso: 'nenhum' | 'tipo1' | 'tipo2') => {
    setJogadoresPresentes(prev => 
      prev.map(jogador => 
        jogador.id === jogadorId 
          ? { ...jogador, atraso }
          : jogador
      )
    );
  };

  const getAtrasoTexto = (atraso: string) => {
    switch (atraso) {
      case 'tipo1':
        return `Atraso Leve (${temporada?.penalidadeAtraso1 || 0} pts)`;
      case 'tipo2':
        return `Atraso Grave (${temporada?.penalidadeAtraso2 || 0} pts)`;
      default:
        return 'Sem atraso';
    }
  };

  const handleSave = () => {
    const presencasAtualizadas = jogadoresPresentes
      .filter(j => j.presente)
      .map(j => ({
        id: crypto.randomUUID(),
        peladaId: pelada.id,
        jogadorId: j.id,
        presente: true,
        atraso: j.atraso || 'nenhum' as const
      }));

    const jogadoresPresentesAtualizados = jogadoresPresentes.filter(j => j.presente);

    const peladaAtualizada = {
      ...pelada,
      presencas: presencasAtualizadas,
      jogadoresPresentes: jogadoresPresentesAtualizados
    };

    onSave(peladaAtualizada);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Editar Presença dos Jogadores</span>
        </CardTitle>
        <CardDescription>
          Marque os jogadores presentes e registre possíveis atrasos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          {jogadoresPresentes.map((jogador) => (
            <div key={jogador.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
              <div className="flex items-center space-x-4 flex-1">
                <Switch
                  checked={jogador.presente}
                  onCheckedChange={() => togglePresenca(jogador.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{jogador.nome}</p>
                  <p className="text-sm text-muted-foreground">{jogador.tipo}</p>
                </div>
                
                {jogador.presente && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={jogador.atraso || 'nenhum'} 
                      onValueChange={(value: 'nenhum' | 'tipo1' | 'tipo2') => setAtrasoJogador(jogador.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nenhum">Sem atraso</SelectItem>
                        <SelectItem value="tipo1">
                          {getAtrasoTexto('tipo1')}
                        </SelectItem>
                        <SelectItem value="tipo2">
                          {getAtrasoTexto('tipo2')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Presença
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditPresencaTab;
