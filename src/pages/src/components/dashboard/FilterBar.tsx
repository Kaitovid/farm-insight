import { Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterBarProps {
  filtroFecha: string;
  filtroSector: string;
  onFechaChange: (value: string) => void;
  onSectorChange: (value: string) => void;
}

export function FilterBar({ filtroFecha, filtroSector, onFechaChange, onSectorChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Select value={filtroFecha} onValueChange={onFechaChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dia">Hoy</SelectItem>
            <SelectItem value="mes">Este mes</SelectItem>
            <SelectItem value="año">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select value={filtroSector} onValueChange={onSectorChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Sector" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="avicola">Avícola</SelectItem>
            <SelectItem value="ganadero">Ganadero</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
