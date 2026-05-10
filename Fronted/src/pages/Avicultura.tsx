import { useNavigate } from 'react-router-dom';
import { Bird, Beef, Leaf, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { useAviculturaMovimientos } from '@/hooks/useAvicultura';

const sectores = [
  {
    key: 'avicola',
    label: 'Avícola',
    description: 'Control de ventas, gastos y movimientos del sector avícola',
    icon: Bird,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    gradient: 'from-amber-500/5 to-amber-600/10',
    hover: 'hover:border-amber-500/50 hover:from-amber-500/10 hover:to-amber-600/15',
    path: '/avicultura/avicola',
  },
  {
    key: 'gandero',
    label: 'Gandero',
    description: 'Registro de ingresos y gastos del sector ganadero',
    icon: Beef,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    gradient: 'from-emerald-500/5 to-emerald-600/10',
    hover: 'hover:border-emerald-500/50 hover:from-emerald-500/10 hover:to-emerald-600/15',
    path: '/avicultura/gandero',
  },
  {
    key: 'fructifero',
    label: 'Fructífero',
    description: 'Gestión financiera de cultivos y producción fructífera',
    icon: Leaf,
    color: 'text-lime-500',
    bg: 'bg-lime-500/10',
    border: 'border-lime-500/20',
    gradient: 'from-lime-500/5 to-lime-600/10',
    hover: 'hover:border-lime-500/50 hover:from-lime-500/10 hover:to-lime-600/15',
    path: '/avicultura/fructifero',
  },
] as const;

function SectorSummary({ sector }: { sector: 'avicola' | 'gandero' | 'fructifero' }) {
  const { data: movimientos = [] } = useAviculturaMovimientos(sector);
  const ventas = movimientos.filter(m => m.tipo === 'venta').reduce((acc, m) => acc + Number(m.monto || 0), 0);
  const gastos = movimientos.filter(m => m.tipo === 'gasto').reduce((acc, m) => acc + Number(m.monto || 0), 0);
  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', notation: 'compact', maximumFractionDigits: 1 }).format(v);

  return (
    <div className="flex flex-col gap-1 mt-4">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <TrendingUp className="h-3.5 w-3.5 text-farm-green" /> Ventas
        </span>
        <span className="font-semibold text-farm-green">{formatCurrency(ventas)}</span>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1 text-muted-foreground">
          <TrendingDown className="h-3.5 w-3.5 text-farm-orange" /> Gastos
        </span>
        <span className="font-semibold text-farm-orange">{formatCurrency(gastos)}</span>
      </div>
      <div className="mt-1 pt-1 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Utilidad</span>
        <span className={`font-bold ${ventas - gastos >= 0 ? 'text-farm-green' : 'text-destructive'}`}>
          {formatCurrency(ventas - gastos)}
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{movimientos.length} movimiento(s)</div>
    </div>
  );
}

export default function Avicultura() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Agrocontaduría</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Selecciona un sector para gestionar sus movimientos económicos
        </p>
      </div>

      {/* Sector Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sectores.map((sector, i) => {
          const Icon = sector.icon;
          return (
            <button
              key={sector.key}
              onClick={() => navigate(sector.path)}
              className={`group relative text-left rounded-2xl border ${sector.border} bg-gradient-to-br ${sector.gradient} ${sector.hover} p-5 sm:p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 animate-fade-up opacity-0`}
              style={{ animationDelay: `${(i + 1) * 100}ms`, animationFillMode: 'forwards' }}
            >
              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${sector.bg} mb-4`}>
                <Icon className={`h-6 w-6 ${sector.color}`} />
              </div>

              {/* Title */}
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-lg font-bold text-foreground">{sector.label}</h2>
                <ArrowRight className={`h-4 w-4 ${sector.color} opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-0.5`} />
              </div>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{sector.description}</p>

              {/* Mini summary */}
              <SectorSummary sector={sector.key} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
