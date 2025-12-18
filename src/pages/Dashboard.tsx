import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Beef, Wallet, Bird } from 'lucide-react';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { SalesExpensesChart } from '@/components/dashboard/SalesExpensesChart';
import { IncomeEvolutionChart } from '@/components/dashboard/IncomeEvolutionChart';
import { ExpenseDistributionChart } from '@/components/dashboard/ExpenseDistributionChart';
import { useAviculturaMovimientos } from '@/hooks/useAvicultura';
import { useGanado } from '@/hooks/useGanado';

export default function Dashboard() {
  const { data: movimientos = [] } = useAviculturaMovimientos();
  const { data: ganado = [] } = useGanado();
  const [filtroFecha, setFiltroFecha] = useState('mes');
  const [filtroSector, setFiltroSector] = useState('todos');

  const metricas = useMemo(() => {
    const ventasTotales = movimientos.filter(m => m.tipo === 'venta').reduce((acc, m) => acc + m.monto, 0);
    const gastosTotales = movimientos.filter(m => m.tipo === 'gasto').reduce((acc, m) => acc + m.monto, 0);
    const utilidad = ventasTotales - gastosTotales;
    const ganadoRegistrado = ganado.length;

    
   
        //sumar toda la tabla de movimientos donde el tipo es gasto y sumar la columna numero_pollos   
    const totalPollos = movimientos.reduce(
  (acc, m) => acc + (m.numero_pollos || 0),
  0
);


    const pollosActivos = totalPollos;
    

    
    return {
      ventasTotales,
      gastosTotales,
      utilidad,
      ganadoRegistrado,
      pollosActivos,
    };
  }, [movimientos, ganado]);

  // Procesar datos para gráficos
  const chartData = useMemo(() => {
    // Agrupar movimientos por mes
    const movimientosPorMes = movimientos.reduce((acc, m) => {
      const fecha = new Date(m.fecha);
      const mes = fecha.toLocaleDateString('es-ES', { month: 'short' });
      const mesKey = `${fecha.getFullYear()}-${fecha.getMonth()}`;

      if (!acc[mesKey]) {
        acc[mesKey] = {
          mes: mes.charAt(0).toUpperCase() + mes.slice(1),
          ventas: 0,
          gastos: 0,
          fecha: fecha,
        };
      }

      if (m.tipo === 'venta') {
        acc[mesKey].ventas += m.monto;
      } else if (m.tipo === 'gasto') {
        acc[mesKey].gastos += m.monto;
      }

      return acc;
    }, {} as Record<string, { mes: string; ventas: number; gastos: number; fecha: Date }>);

    // Convertir a array y ordenar por fecha
    const ventasGastosPorMes = Object.values(movimientosPorMes)
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime())
      .slice(-6) // Últimos 6 meses
      .map(({ mes, ventas, gastos }) => ({ mes, ventas, gastos }));

    // Calcular evolución de ingresos (utilidad = ventas - gastos)
    const evolucionIngresos = ventasGastosPorMes.map(({ mes, ventas, gastos }) => ({
      mes,
      ingresos: ventas - gastos,
    }));

    // Calcular distribución de gastos por categoría
    const gastosPorCategoria = movimientos
      .filter(m => m.tipo === 'gasto')
      .reduce((acc, m) => {
        const categoria = m.categoria || 'Otros';
        acc[categoria] = (acc[categoria] || 0) + m.monto;
        return acc;
      }, {} as Record<string, number>);

    const totalGastos = Object.values(gastosPorCategoria).reduce((sum, val) => sum + val, 0);

    const distribucionGastos = Object.entries(gastosPorCategoria)
      .map(([categoria, valor]) => ({
        categoria,
        valor,
        porcentaje: totalGastos > 0 ? (valor / totalGastos) * 100 : 0,
      }))
      .sort((a, b) => b.valor - a.valor);

    return {
      ventasGastosPorMes,
      evolucionIngresos,
      distribucionGastos,
    };
  }, [movimientos]);

  // Procesar próximas vacunaciones
  const proximasVacunaciones = useMemo(() => {
    const hoy = new Date();

    const vacunaciones = ganado.flatMap(animal =>
      (animal.vacunaciones || [])
        .filter(vac => vac.proxima_fecha)
        .map(vac => {
          const proximaFecha = new Date(vac.proxima_fecha!);
          const diasRestantes = Math.ceil((proximaFecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));

          let estado: 'vencida' | 'proxima' | 'programada';
          if (diasRestantes < 0) {
            estado = 'vencida';
          } else if (diasRestantes <= 7) {
            estado = 'proxima';
          } else {
            estado = 'programada';
          }

          return {
            animal: `${animal.nombre} (${animal.numero_identificacion})`,
            vacuna: vac.vacuna?.nombre || 'Vacuna',
            fecha: proximaFecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
            fechaOriginal: proximaFecha,
            estado,
            diasRestantes,
          };
        })
    );

    // Ordenar por fecha (más próximas primero)
    return vacunaciones
      .sort((a, b) => a.fechaOriginal.getTime() - b.fechaOriginal.getTime())
      .slice(0, 5); // Mostrar solo las 5 más próximas
  }, [ganado]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };


  return (
    <div className="space-y-4 md:space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
            Panel de Control
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Resumen general de tu operación agropecuaria
          </p>
        </div>
        <div className="w-full sm:w-auto">
          <FilterBar
            filtroFecha={filtroFecha}
            filtroSector={filtroSector}
            onFechaChange={setFiltroFecha}
            onSectorChange={setFiltroSector}
          />
        </div>
      </div>

      {/* Metrics Grid - Optimizado para móviles */}
      <div className="grid gap-3 grid-cols-2 sm:gap-4 lg:grid-cols-5">
        <MetricCard
          title="Ventas Totales"
          value={formatCurrency(metricas.ventasTotales)}
          icon={DollarSign}
          variant="primary"
          delay={100}
        />
        <MetricCard
          title="Gastos Totales"
          value={formatCurrency(metricas.gastosTotales)}
          icon={Wallet}
          variant="accent"
          delay={200}
        />
        <MetricCard
          title="Utilidad Neta"
          value={formatCurrency(metricas.utilidad)}
          icon={TrendingUp}
          variant="earth"
          delay={300}
        />
        <MetricCard
          title='Pollos Activos'
          value={metricas.pollosActivos.toString()}
          subtitle='Pico de pollos'
          icon={Bird}
          delay={400}
        />
        <MetricCard
          title="Ganado Registrado"
          value={metricas.ganadoRegistrado.toString()}
          subtitle="Cabezas de ganado"
          icon={Beef}
          delay={500}
        />
      </div>

      {/* Charts Grid - Optimizado para móviles */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
        <ChartCard
          title="Ventas vs Gastos"
          subtitle="Comparativa mensual del sector avícola"
          delay={600}
        >
          <SalesExpensesChart data={chartData.ventasGastosPorMes} />
        </ChartCard>

        <ChartCard
          title="Evolución de Utilidades"
          subtitle="Tendencia de ingresos netos"
          delay={700}
        >
          <IncomeEvolutionChart data={chartData.evolucionIngresos} />
        </ChartCard>
      </div>

      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        <ChartCard
          title="Distribución de Gastos"
          subtitle="Por categoría"
          className="lg:col-span-1"
          delay={800}
        >
          <ExpenseDistributionChart data={chartData.distribucionGastos} />
        </ChartCard>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '900ms', animationFillMode: 'forwards' }}>
          <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
            Próximas Vacunaciones
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {proximasVacunaciones.length > 0 ? (
              proximasVacunaciones.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 rounded-lg border border-border bg-background p-3 sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm sm:text-base text-foreground truncate">{item.animal}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{item.vacuna}</p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="text-xs sm:text-sm font-medium text-foreground whitespace-nowrap">{item.fecha}</p>
                    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap ${item.estado === 'vencida'
                      ? 'bg-destructive/10 text-destructive'
                      : item.estado === 'proxima'
                        ? 'bg-farm-orange/10 text-farm-orange'
                        : 'bg-farm-green/10 text-farm-green'
                      }`}>
                      {item.estado === 'vencida' ? 'Vencida' : item.estado === 'proxima' ? 'Próxima' : 'Programada'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm sm:text-base">No hay vacunaciones programadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}