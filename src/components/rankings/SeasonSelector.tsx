
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Temporada } from '@/types';

interface SeasonSelectorProps {
  temporadas: Temporada[];
  selectedTemporada: string;
  onSelectionChange: (value: string) => void;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  temporadas,
  selectedTemporada,
  onSelectionChange
}) => (
  <Select value={selectedTemporada} onValueChange={onSelectionChange}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Selecione a temporada" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">Todas as Temporadas</SelectItem>
      {temporadas.filter(t => t.id && t.nome).map((temporada) => (
        <SelectItem key={temporada.id} value={temporada.id}>
          {temporada.nome} {temporada.ativa && '(Ativa)'}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export default SeasonSelector;
