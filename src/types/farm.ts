export interface Animal {
  id: string;
  nombre: string;
  codigo: string;
  fechaEntrada: Date;
  edadEntradaMeses: number;
  pesoInicial: number;
  vacunaciones: Vacunacion[];
  notas?: string;
}

export interface Vacunacion {
  id: string;
  fecha: Date;
  tipo: string;
  proximaFecha?: Date;
  notas?: string;
}

export interface MovimientoAvicola {
  id: string;
  tipo: 'venta' | 'gasto';
  fecha: Date;
  descripcion: string;
  categoria: string;
  monto: number;
}

export interface MetricaResumen {
  ventasTotales: number;
  gastosTotales: number;
  utilidad: number;
  avesActivas: number;
  ganadoRegistrado: number;
}

export type FiltroFecha = 'dia' | 'mes' | 'año';
export type FiltroSector = 'avicola' | 'ganadero' | 'todos';
