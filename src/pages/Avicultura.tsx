import { useState, useMemo } from 'react';
import { Plus, Search, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAviculturaMovimientos, useCreateMovimiento, useDeleteMovimiento } from '@/hooks/useAvicultura';
import { useCategorias } from '@/hooks/useCategorias';
import { toast } from 'sonner';

export default function Avicultura() {
  const { data: movimientos = [], isLoading } = useAviculturaMovimientos();
  const { data: categorias = [] } = useCategorias();
  const createMovimiento = useCreateMovimiento();
  const deleteMovimiento = useDeleteMovimiento();
  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevoMovimiento, setNuevoMovimiento] = useState({
    tipo: 'venta' as 'venta' | 'gasto',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    categoria: '',
    monto: '',
  });

  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((m) => {
      const coincideBusqueda = m.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        m.categoria.toLowerCase().includes(busqueda.toLowerCase());
      const coincideTipo = filtroTipo === 'todos' || m.tipo === filtroTipo;
      return coincideBusqueda && coincideTipo;
    });
  }, [movimientos, busqueda, filtroTipo]);


  const totalVentas = movimientos.filter(m => m.tipo === 'venta').reduce((acc, m) => acc + m.monto, 0);
  const totalGastos = movimientos.filter(m => m.tipo === 'gasto').reduce((acc, m) => acc + m.monto, 0);
  const utilidad = totalVentas - totalGastos;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const handleSubmit = async () => {
    if (!nuevoMovimiento.descripcion || !nuevoMovimiento.categoria || !nuevoMovimiento.monto) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await createMovimiento.mutateAsync({
        tipo: nuevoMovimiento.tipo,
        fecha: nuevoMovimiento.fecha,
        descripcion: nuevoMovimiento.descripcion,
        categoria: nuevoMovimiento.categoria,
        monto: parseFloat(nuevoMovimiento.monto),
      });

      setDialogOpen(false);
      setNuevoMovimiento({
        tipo: 'venta',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        categoria: 'Venta de pollos',
        monto: '',
      });
      toast.success('Movimiento registrado exitosamente');
    } catch (error) {
      toast.error('Error al registrar el movimiento');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMovimiento.mutateAsync(id);
      toast.success('Movimiento eliminado');
    } catch (error) {
      toast.error('Error al eliminar el movimiento');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando movimientos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">Avicultura</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Gestión económica del sector avícola</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="farm" className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Nuevo Movimiento</span>
                <span className="xs:hidden">Nuevo</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-[425px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif">Registrar Movimiento</DialogTitle>
                <DialogDescription className="text-sm">
                  Agrega una nueva venta o gasto al registro avícola.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label className="text-sm">Tipo de movimiento</Label>
                  <Select
                    value={nuevoMovimiento.tipo}
                    onValueChange={(value: 'venta' | 'gasto') =>
                      setNuevoMovimiento({ ...nuevoMovimiento, tipo: value, categoria: '' })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="venta">Venta</SelectItem>
                      <SelectItem value="gasto">Gasto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Fecha</Label>
                  <Input
                    type="date"
                    value={nuevoMovimiento.fecha}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, fecha: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Categoría</Label>
                  <Select
                    value={nuevoMovimiento.categoria}
                    onValueChange={(value) =>
                      setNuevoMovimiento({ ...nuevoMovimiento, categoria: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {nuevoMovimiento.tipo === "venta" 
                        ? categorias
                            .filter(c => c.sector === 'venta')
                            .map(c => (
                              <SelectItem key={c.id} value={c.nombre}>
                                {c.nombre}
                              </SelectItem>
                            ))
                        : categorias
                            .filter(c => c.sector === 'gasto')
                            .map(c => (
                              <SelectItem key={c.id} value={c.nombre}>
                                {c.nombre}
                              </SelectItem>
                            ))
                      }
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Descripción</Label>
                  <Input
                    placeholder="Descripción del movimiento"
                    value={nuevoMovimiento.descripcion}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, descripcion: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm">Monto (COP)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={nuevoMovimiento.monto}
                    onChange={(e) => setNuevoMovimiento({ ...nuevoMovimiento, monto: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full sm:w-auto">
                  Cancelar
                </Button>
                <Button variant="farm" onClick={handleSubmit} className="w-full sm:w-auto">
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards - Mobile optimized */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 md:gap-4">
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-farm-green/10 shrink-0">
              <TrendingUp className="h-5 w-5 text-farm-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Ventas</p>
              <p className="text-lg sm:text-xl font-bold text-foreground truncate">{formatCurrency(totalVentas)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-farm-orange/10 shrink-0">
              <TrendingDown className="h-5 w-5 text-farm-orange" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Gastos</p>
              <p className="text-lg sm:text-xl font-bold text-foreground truncate">{formatCurrency(totalGastos)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-farm-earth/10 shrink-0">
              <TrendingUp className="h-5 w-5 text-farm-earth" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground">Utilidad</p>
              <p className="text-lg sm:text-xl font-bold text-foreground truncate">{formatCurrency(utilidad)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Mobile optimized */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 rounded-xl border border-border bg-card p-3 sm:p-4 shadow-sm">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar movimientos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-full sm:w-[150px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="venta">Ventas</SelectItem>
            <SelectItem value="gasto">Gastos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table - Mobile optimized with horizontal scroll */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden animate-fade-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Fecha</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Tipo</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground">Categoría</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground hidden md:table-cell">Descripción</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right text-xs sm:text-sm font-medium text-muted-foreground">Monto</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground whitespace-nowrap">{formatDate(new Date(m.fecha))}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${m.tipo === 'venta'
                      ? 'bg-farm-green/10 text-farm-green'
                      : 'bg-farm-orange/10 text-farm-orange'
                      }`}>
                      {m.tipo === 'venta' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {m.tipo === 'venta' ? 'Venta' : 'Gasto'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground">{m.categoria}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-foreground hidden md:table-cell max-w-[200px] truncate">{m.descripcion}</td>
                  <td className={`px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-right font-medium whitespace-nowrap ${m.tipo === 'venta' ? 'text-farm-green' : 'text-farm-orange'
                    }`}>
                    {m.tipo === 'venta' ? '+' : '-'}{formatCurrency(m.monto)}
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(m.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {movimientosFiltrados.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No se encontraron movimientos</p>
          </div>
        )}
      </div>
    </div>
  );
}
