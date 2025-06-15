
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Jogador } from '@/types';

interface AddEventFormProps {
  partidaIndex: number;
  timeA: string[];
  timeB: string[];
  getJogadorNome: (jogadorId: string) => string;
  onAddEvent: (partidaIndex: number, tipo: string, jogadorId: string, assistidoPor?: string) => void;
}

const AddEventForm: React.FC<AddEventFormProps> = ({
  partidaIndex,
  timeA,
  timeB,
  getJogadorNome,
  onAddEvent
}) => {
  const handleAddEvent = (tipo: string) => {
    const jogadorSelect = document.getElementById(`jogador-${partidaIndex}`) as HTMLSelectElement;
    const assistSelect = document.getElementById(`assist-${partidaIndex}`) as HTMLSelectElement;
    if (jogadorSelect?.value) {
      onAddEvent(partidaIndex, tipo, jogadorSelect.value, assistSelect?.value);
      jogadorSelect.value = '';
      if (assistSelect) assistSelect.value = '';
    }
  };

  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-4">Adicionar Evento</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select onValueChange={handleAddEvent}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gol">Gol</SelectItem>
            <SelectItem value="cartao_amarelo">Cartão Amarelo</SelectItem>
            <SelectItem value="cartao_azul">Cartão Azul</SelectItem>
            <SelectItem value="cartao_vermelho">Cartão Vermelho</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger id={`jogador-${partidaIndex}`}>
            <SelectValue placeholder="Jogador" />
          </SelectTrigger>
          <SelectContent>
            {[...timeA, ...timeB].map(jogadorId => (
              <SelectItem key={jogadorId} value={jogadorId}>
                {getJogadorNome(jogadorId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger id={`assist-${partidaIndex}`}>
            <SelectValue placeholder="Assistência (opcional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nenhuma">Nenhuma</SelectItem>
            {[...timeA, ...timeB].map(jogadorId => (
              <SelectItem key={jogadorId} value={jogadorId}>
                {getJogadorNome(jogadorId)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddEventForm;
