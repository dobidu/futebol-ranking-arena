
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Users, ArrowRight, UserCheck } from 'lucide-react';
import { Temporada, Jogador } from '@/types';

interface JogadorPresente {
  id: string;
  nome: string;
  tipo: string;
  presente: boolean;
}

interface PeladaCreationFormProps {
  temporadas: Temporada[];
  jogadores: Jogador[];
  selectedTemporada: string;
  setSelectedTemporada: (value: string) => void;
  dataPelada: string;
  setDataPelada: (value: string) => void;
  jogadoresPresentes: JogadorPresente[];
  criarPelada: () => void;
  togglePresenca: (jogadorId: string) => void;
  isEditMode?: boolean;
  peladaParaEdicao?: any;
  onNextStep?: () => void;
}

const PeladaCreationForm: React.FC<PeladaCreationFormProps> = ({
  temporadas,
  jogadores,
  selectedTemporada,
  setSelectedTemporada,
  dataPelada,
  setDataPelada,
  jogadoresPresentes,
  criarPelada,
  togglePresenca,
  isEditMode = false,
  peladaParaEdicao,
  onNextStep
}) => {
  // Carregar dados da pelada em modo de edição
  useEffect(() => {
    if (isEditMode && peladaParaEdicao) {
      setSelectedTemporada(peladaParaEdicao.temporadaId);
      setDataPelada(peladaParaEdicao.data.split('T')[0]);
    }
  }, [isEditMode, peladaParaEdicao, setSelectedTemporada, setDataPelada]);

  const handleCriarPelada = () => {
    criarPelada();
  };

  const marcarTodosPresentes = () => {
    jogadoresPresentes.forEach(jogador => {
      if (!jogador.presente) {
        togglePresenca(jogador.id);
      }
    });
  };

  const canProceed = jogadoresPresentes.some(j => j.presente);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>{isEditMode ? 'Dados da Pelada' : 'Criar Nova Pelada'}</span>
          </CardTitle>
          <CardDescription>
            {isEditMode ? 'Edite os dados básicos da pelada' : 'Configure os dados básicos para registrar uma nova pelada'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="temporada">Temporada</Label>
              <Select value={selectedTemporada} onValueChange={setSelectedTemporada} disabled={isEditMode}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a temporada" />
                </SelectTrigger>
                <SelectContent>
                  {temporadas.filter(t => t.ativa).map((temporada) => (
                    <SelectItem key={temporada.id} value={temporada.id}>
                      {temporada.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data da Pelada</Label>
              <Input
                id="data"
                type="date"
                value={dataPelada}
                onChange={(e) => setDataPelada(e.target.value)}
                disabled={isEditMode}
              />
            </div>
          </div>

          {!isEditMode && (
            <Button 
              onClick={handleCriarPelada}
              disabled={!selectedTemporada || !dataPelada}
              className="w-full"
            >
              Criar Pelada
            </Button>
          )}
        </CardContent>
      </Card>

      {(jogadoresPresentes.length > 0 || isEditMode) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Presença dos Jogadores</span>
            </CardTitle>
            <CardDescription>
              Marque os jogadores que estão presentes na pelada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Button 
                onClick={marcarTodosPresentes}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <UserCheck className="h-4 w-4" />
                <span>Todos Presentes</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jogadoresPresentes.map((jogador) => (
                <div key={jogador.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{jogador.nome}</p>
                    <p className="text-sm text-muted-foreground">{jogador.tipo}</p>
                  </div>
                  <Switch
                    checked={jogador.presente}
                    onCheckedChange={() => togglePresenca(jogador.id)}
                  />
                </div>
              ))}
            </div>

            {canProceed && onNextStep && (
              <div className="mt-6 flex justify-end">
                <Button onClick={onNextStep}>
                  Próximo: Formar Times
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PeladaCreationForm;
