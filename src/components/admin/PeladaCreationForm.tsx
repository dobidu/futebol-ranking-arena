
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Plus } from 'lucide-react';
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
}

const PeladaCreationForm: React.FC<PeladaCreationFormProps> = ({
  temporadas,
  selectedTemporada,
  setSelectedTemporada,
  dataPelada,
  setDataPelada,
  jogadoresPresentes,
  criarPelada,
  togglePresenca
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Criar Nova Pelada</span>
        </CardTitle>
        <CardDescription>
          Inicie uma nova pelada selecionando a temporada e data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="temporada">Temporada</Label>
            <Select value={selectedTemporada} onValueChange={setSelectedTemporada}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma temporada" />
              </SelectTrigger>
              <SelectContent>
                {temporadas.map(temporada => (
                  <SelectItem key={temporada.id} value={temporada.id}>
                    {temporada.nome} {temporada.ativa && '(Ativa)'}
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
            />
          </div>
        </div>
        
        <Button onClick={criarPelada} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Criar Pelada
        </Button>

        {jogadoresPresentes.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">Marcar Presenças</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {jogadoresPresentes.map(jogador => (
                <div key={jogador.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-2">
                    <span>{jogador.nome}</span>
                    <Badge variant={jogador.tipo === 'Mensalista' ? 'default' : 'secondary'}>
                      {jogador.tipo}
                    </Badge>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={jogador.presente}
                    onChange={() => togglePresenca(jogador.id)}
                    className="w-4 h-4" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PeladaCreationForm;
