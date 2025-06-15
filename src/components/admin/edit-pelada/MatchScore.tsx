
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface MatchScoreProps {
  placarA: number;
  placarB: number;
  onScoreChange: (timeA: number, timeB: number) => void;
}

const MatchScore: React.FC<MatchScoreProps> = ({
  placarA,
  placarB,
  onScoreChange
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 items-center">
      <div className="space-y-2">
        <Label>Time A</Label>
        <Input
          type="number"
          min="0"
          value={placarA}
          onChange={(e) => onScoreChange(parseInt(e.target.value) || 0, placarB)}
        />
      </div>
      <div className="text-center">
        <span className="text-2xl font-bold">{placarA} x {placarB}</span>
      </div>
      <div className="space-y-2">
        <Label>Time B</Label>
        <Input
          type="number"
          min="0"
          value={placarB}
          onChange={(e) => onScoreChange(placarA, parseInt(e.target.value) || 0)}
        />
      </div>
    </div>
  );
};

export default MatchScore;
