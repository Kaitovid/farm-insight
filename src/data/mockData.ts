import { Animal, MovimientoAvicola, MetricaResumen } from '@/types/farm';

export const mockAnimales: Animal[] = [
  {
    id: '1',
    nombre: 'Estrella',
    codigo: 'GAN-001',
    fechaEntrada: new Date('2024-01-15'),
    edadEntradaMeses: 18,
    pesoInicial: 320,
    vacunaciones: [
      { id: 'v1', fecha: new Date('2024-01-20'), tipo: 'Fiebre Aftosa', proximaFecha: new Date('2025-01-20') },
      { id: 'v2', fecha: new Date('2024-03-15'), tipo: 'Brucelosis' },
    ],
  },
  {
    id: '2',
    nombre: 'Tormenta',
    codigo: 'GAN-002',
    fechaEntrada: new Date('2023-08-10'),
    edadEntradaMeses: 12,
    pesoInicial: 280,
    vacunaciones: [
      { id: 'v3', fecha: new Date('2023-08-15'), tipo: 'Fiebre Aftosa', proximaFecha: new Date('2024-08-15') },
    ],
  },
  {
    id: '3',
    nombre: 'Luna',
    codigo: 'GAN-003',
    fechaEntrada: new Date('2024-06-01'),
    edadEntradaMeses: 8,
    pesoInicial: 180,
    vacunaciones: [
      { id: 'v4', fecha: new Date('2024-06-05'), tipo: 'Carbunco', proximaFecha: new Date('2025-06-05') },
    ],
  },
  {
    id: '4',
    nombre: 'Relámpago',
    codigo: 'GAN-004',
    fechaEntrada: new Date('2024-09-20'),
    edadEntradaMeses: 6,
    pesoInicial: 150,
    vacunaciones: [],
  },
  {
    id: '5',
    nombre: 'Canela',
    codigo: 'GAN-005',
    fechaEntrada: new Date('2024-02-28'),
    edadEntradaMeses: 24,
    pesoInicial: 450,
    vacunaciones: [
      { id: 'v5', fecha: new Date('2024-03-01'), tipo: 'Fiebre Aftosa', proximaFecha: new Date('2025-03-01') },
      { id: 'v6', fecha: new Date('2024-05-15'), tipo: 'Leptospirosis' },
    ],
  },
];

export const mockMovimientos: MovimientoAvicola[] = [
  { id: 'm1', tipo: 'venta', fecha: new Date('2024-12-01'), descripcion: 'Venta de pollos - Lote 45', categoria: 'Venta de pollos', monto: 2500000 },
  { id: 'm2', tipo: 'gasto', fecha: new Date('2024-12-02'), descripcion: 'Compra de alimento concentrado', categoria: 'Alimento', monto: 800000 },
  { id: 'm3', tipo: 'gasto', fecha: new Date('2024-12-05'), descripcion: 'Vacunas Newcastle', categoria: 'Medicamentos', monto: 150000 },
  { id: 'm4', tipo: 'venta', fecha: new Date('2024-12-08'), descripcion: 'Venta de huevos - Semana 49', categoria: 'Venta de huevos', monto: 450000 },
  { id: 'm5', tipo: 'gasto', fecha: new Date('2024-12-10'), descripcion: 'Mantenimiento galpón', categoria: 'Mantenimiento', monto: 200000 },
  { id: 'm6', tipo: 'venta', fecha: new Date('2024-12-12'), descripcion: 'Venta de pollos - Lote 46', categoria: 'Venta de pollos', monto: 2800000 },
  { id: 'm7', tipo: 'gasto', fecha: new Date('2024-12-14'), descripcion: 'Electricidad galpones', categoria: 'Servicios', monto: 350000 },
];

export const mockMetricas: MetricaResumen = {
  ventasTotales: 15750000,
  gastosTotales: 4500000,
  utilidad: 11250000,
  avesActivas: 2500,
  ganadoRegistrado: 5,
};

export const mockVentasPorMes = [
  { mes: 'Jul', ventas: 12000000, gastos: 4200000 },
  { mes: 'Ago', ventas: 13500000, gastos: 4800000 },
  { mes: 'Sep', ventas: 11800000, gastos: 3900000 },
  { mes: 'Oct', ventas: 14200000, gastos: 4100000 },
  { mes: 'Nov', ventas: 15100000, gastos: 4300000 },
  { mes: 'Dic', ventas: 15750000, gastos: 4500000 },
];

export const mockDistribucionGastos = [
  { categoria: 'Alimento', valor: 2100000, porcentaje: 46.7 },
  { categoria: 'Medicamentos', valor: 850000, porcentaje: 18.9 },
  { categoria: 'Mantenimiento', valor: 650000, porcentaje: 14.4 },
  { categoria: 'Servicios', valor: 550000, porcentaje: 12.2 },
  { categoria: 'Otros', valor: 350000, porcentaje: 7.8 },
];

export const mockEvolucionIngresos = [
  { mes: 'Jul', ingresos: 7800000 },
  { mes: 'Ago', ingresos: 8700000 },
  { mes: 'Sep', ingresos: 7900000 },
  { mes: 'Oct', ingresos: 10100000 },
  { mes: 'Nov', ingresos: 10800000 },
  { mes: 'Dic', ingresos: 11250000 },
];

export const categoriasGasto = [
  'Alimento',
  'Medicamentos',
  'Mantenimiento',
  'Servicios',
  'Mano de obra',
  'Transporte',
  'Otros',
];

export const categoriasVenta = [
  'Venta de pollos',
  'Venta de huevos',
  'Venta de gallinas',
  'Otros',
];

export const tiposVacuna = [
  'Fiebre Aftosa',
  'Brucelosis',
  'Carbunco',
  'Leptospirosis',
  'IBR',
  'DVB',
  'Clostridiosis',
  'Rabia',
];
