import { useState } from 'react';
import { DollarSign, TrendingUp, Bird, Beef, Wallet } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { SalesExpensesChart } from '@/components/dashboard/SalesExpensesChart';
import { IncomeEvolutionChart } from '@/components/dashboard/IncomeEvolutionChart';
import { ExpenseDistributionChart } from '@/components/dashboard/ExpenseDistributionChart';
import { mockMetricas } from '@/data/mockData';

export default function Dashboard() {
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [filtroSector, setFiltroSector] = useState('todos');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Panel de Control
          </h1>
          <p className="text-muted-foreground">
            Resumen general de tu operación agropecuaria
          </p>
        </div>
        <FilterBar
          filtroFecha={filtroFecha}
          filtroSector={filtroSector}
          onFechaChange={setFiltroFecha}
          onSectorChange={setFiltroSector}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Ventas Totales"
          value={formatCurrency(mockMetricas.ventasTotales)}
          icon={DollarSign}
          variant="primary"
          trend={{ value: 8.2, isPositive: true }}
          delay={100}
        />
        <MetricCard
          title="Gastos Totales"
          value={formatCurrency(mockMetricas.gastosTotales)}
          icon={Wallet}
          variant="accent"
          trend={{ value: 3.1, isPositive: false }}
          delay={200}
        />
        <MetricCard
          title="Utilidad Neta"
          value={formatCurrency(mockMetricas.utilidad)}
          icon={TrendingUp}
          variant="earth"
          trend={{ value: 12.5, isPositive: true }}
          delay={300}
        />
        <MetricCard
          title="Aves Activas"
          value={mockMetricas.avesActivas.toLocaleString()}
          subtitle="En producción"
          icon={Bird}
          delay={400}
        />
        <MetricCard
          title="Ganado Registrado"
          value={mockMetricas.ganadoRegistrado.toString()}
          subtitle="Cabezas de ganado"
          icon={Beef}
          delay={500}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Ventas vs Gastos"
          subtitle="Comparativa mensual del sector avícola"
          delay={600}
        >
          <SalesExpensesChart />
        </ChartCard>

        <ChartCard
          title="Evolución de Utilidades"
          subtitle="Tendencia de ingresos netos"
          delay={700}
        >
          <IncomeEvolutionChart />
        </ChartCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Distribución de Gastos"
          subtitle="Por categoría"
          className="lg:col-span-1"
          delay={800}
        >
          <ExpenseDistributionChart />
        </ChartCard>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-4">
            Próximas Vacunaciones
          </h3>
          <div className="space-y-3">
            {[
              { animal: 'Tormenta (GAN-002)', vacuna: 'Fiebre Aftosa', fecha: '15 Ago 2024', estado: 'vencida' },
              { animal: 'Estrella (GAN-001)', vacuna: 'Fiebre Aftosa', fecha: '20 Ene 2025', estado: 'proxima' },
              { animal: 'Canela (GAN-005)', vacuna: 'Fiebre Aftosa', fecha: '01 Mar 2025', estado: 'programada' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{item.animal}</p>
                  <p className="text-sm text-muted-foreground">{item.vacuna}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{item.fecha}</p>
                  <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
                    item.estado === 'vencida' 
                      ? 'bg-destructive/10 text-destructive'
                      : item.estado === 'proxima'
                      ? 'bg-farm-orange/10 text-farm-orange'
                      : 'bg-farm-green/10 text-farm-green'
                  }`}>
                    {item.estado === 'vencida' ? 'Vencida' : item.estado === 'proxima' ? 'Próxima' : 'Programada'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
