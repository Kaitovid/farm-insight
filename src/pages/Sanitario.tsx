import { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Clock, Syringe, Plus, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { mockAnimales, tiposVacuna } from '@/data/mockData';
import { Animal, Vacunacion } from '@/types/farm';
import { format, differenceInDays, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface AlertaVacuna {
  animal: Animal;
  vacuna: Vacunacion;
  diasRestantes: number;
  estado: 'vencida' | 'urgente' | 'proxima' | 'programada';
}

export default function Sanitario() {
  const [animales, setAnimales] = useState<Animal[]>(mockAnimales);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [nuevaVacuna, setNuevaVacuna] = useState({
    animalId: '',
    tipo: '',
    fecha: new Date().toISOString().split('T')[0],
    proximaFecha: '',
    notas: '',
  });

  // Generar alertas de vacunación
  const alertas: AlertaVacuna[] = animales.flatMap((animal) =>
    animal.vacunaciones
      .filter((v) => v.proximaFecha)
      .map((v) => {
        const diasRestantes = differenceInDays(new Date(v.proximaFecha!), new Date());
        let estado: AlertaVacuna['estado'];
        if (diasRestantes < 0) estado = 'vencida';
        else if (diasRestantes <= 7) estado = 'urgente';
        else if (diasRestantes <= 30) estado = 'proxima';
        else estado = 'programada';
        return { animal, vacuna: v, diasRestantes, estado };
      })
  ).sort((a, b) => a.diasRestantes - b.diasRestantes);

  const alertasVencidas = alertas.filter((a) => a.estado === 'vencida');
  const alertasUrgentes = alertas.filter((a) => a.estado === 'urgente');
  const alertasProximas = alertas.filter((a) => a.estado === 'proxima');

  const handleSubmit = () => {
    if (!nuevaVacuna.animalId || !nuevaVacuna.tipo || !nuevaVacuna.fecha) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    const nuevaVacunacion: Vacunacion = {
      id: `v${Date.now()}`,
      tipo: nuevaVacuna.tipo,
      fecha: new Date(nuevaVacuna.fecha),
      proximaFecha: nuevaVacuna.proximaFecha ? new Date(nuevaVacuna.proximaFecha) : undefined,
      notas: nuevaVacuna.notas,
    };

    setAnimales(animales.map((a) => {
      if (a.id === nuevaVacuna.animalId) {
        return { ...a, vacunaciones: [...a.vacunaciones, nuevaVacunacion] };
      }
      return a;
    }));

    setDialogOpen(false);
    setNuevaVacuna({
      animalId: '',
      tipo: '',
      fecha: new Date().toISOString().split('T')[0],
      proximaFecha: '',
      notas: '',
    });
    toast.success('Vacunación registrada exitosamente');
  };

  const getEstadoStyles = (estado: AlertaVacuna['estado']) => {
    switch (estado) {
      case 'vencida':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'urgente':
        return 'bg-farm-orange/10 border-farm-orange/30 text-farm-orange';
      case 'proxima':
        return 'bg-chart-gold/10 border-chart-gold/30 text-chart-gold';
      case 'programada':
        return 'bg-farm-green/10 border-farm-green/30 text-farm-green';
    }
  };

  const getEstadoIcon = (estado: AlertaVacuna['estado']) => {
    switch (estado) {
      case 'vencida':
        return <AlertTriangle className="h-5 w-5" />;
      case 'urgente':
        return <Clock className="h-5 w-5" />;
      case 'proxima':
        return <Calendar className="h-5 w-5" />;
      case 'programada':
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getEstadoLabel = (estado: AlertaVacuna['estado'], dias: number) => {
    switch (estado) {
      case 'vencida':
        return `Vencida hace ${Math.abs(dias)} días`;
      case 'urgente':
        return `Faltan ${dias} días`;
      case 'proxima':
        return `Faltan ${dias} días`;
      case 'programada':
        return `Programada en ${dias} días`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Control Sanitario</h1>
          <p className="text-muted-foreground">Calendario de vacunas y alertas sanitarias</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="farm" className="gap-2">
              <Plus className="h-4 w-4" />
              Registrar Vacuna
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Registrar Vacunación</DialogTitle>
              <DialogDescription>
                Agrega una nueva vacunación al historial sanitario.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Animal</Label>
                <Select
                  value={nuevaVacuna.animalId}
                  onValueChange={(value) => setNuevaVacuna({ ...nuevaVacuna, animalId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un animal" />
                  </SelectTrigger>
                  <SelectContent>
                    {animales.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.nombre} ({a.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Tipo de vacuna</Label>
                <Select
                  value={nuevaVacuna.tipo}
                  onValueChange={(value) => setNuevaVacuna({ ...nuevaVacuna, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposVacuna.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Fecha de aplicación</Label>
                <Input
                  type="date"
                  value={nuevaVacuna.fecha}
                  onChange={(e) => setNuevaVacuna({ ...nuevaVacuna, fecha: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Próxima fecha (opcional)</Label>
                <Input
                  type="date"
                  value={nuevaVacuna.proximaFecha}
                  onChange={(e) => setNuevaVacuna({ ...nuevaVacuna, proximaFecha: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Notas (opcional)</Label>
                <Input
                  placeholder="Observaciones adicionales"
                  value={nuevaVacuna.notas}
                  onChange={(e) => setNuevaVacuna({ ...nuevaVacuna, notas: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="farm" onClick={handleSubmit}>
                Guardar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-destructive">Vacunas Vencidas</p>
              <p className="text-2xl font-bold text-destructive">{alertasVencidas.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-farm-orange/30 bg-farm-orange/5 p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-farm-orange/10">
              <Clock className="h-5 w-5 text-farm-orange" />
            </div>
            <div>
              <p className="text-sm text-farm-orange">Próximos 7 días</p>
              <p className="text-2xl font-bold text-farm-orange">{alertasUrgentes.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-chart-gold/30 bg-chart-gold/5 p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-gold/10">
              <Calendar className="h-5 w-5 text-chart-gold" />
            </div>
            <div>
              <p className="text-sm text-chart-gold">Próximos 30 días</p>
              <p className="text-2xl font-bold text-chart-gold">{alertasProximas.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
        <div className="border-b border-border p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground flex items-center gap-2">
            <Syringe className="h-5 w-5 text-primary" />
            Calendario de Vacunaciones
          </h3>
        </div>
        <div className="divide-y divide-border">
          {alertas.length === 0 ? (
            <div className="p-8 text-center">
              <Syringe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No hay vacunaciones programadas</p>
            </div>
          ) : (
            alertas.map((alerta, index) => (
              <div
                key={`${alerta.animal.id}-${alerta.vacuna.id}`}
                className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${getEstadoStyles(alerta.estado)}`}>
                  {getEstadoIcon(alerta.estado)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Beef className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium text-foreground truncate">
                      {alerta.animal.nombre} ({alerta.animal.codigo})
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{alerta.vacuna.tipo}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">
                    {format(alerta.vacuna.proximaFecha!, 'dd MMM yyyy', { locale: es })}
                  </p>
                  <p className={`text-xs ${
                    alerta.estado === 'vencida' ? 'text-destructive' :
                    alerta.estado === 'urgente' ? 'text-farm-orange' :
                    alerta.estado === 'proxima' ? 'text-chart-gold' :
                    'text-farm-green'
                  }`}>
                    {getEstadoLabel(alerta.estado, alerta.diasRestantes)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Historial por Animal */}
      <div className="rounded-xl border border-border bg-card shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}>
        <div className="border-b border-border p-4">
          <h3 className="font-serif text-lg font-semibold text-foreground">
            Historial Sanitario por Animal
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {animales.map((animal) => (
            <div key={animal.id} className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-farm-green/10">
                  <Beef className="h-5 w-5 text-farm-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{animal.nombre}</p>
                  <p className="text-xs text-muted-foreground">{animal.codigo}</p>
                </div>
                <span className="ml-auto text-sm text-muted-foreground">
                  {animal.vacunaciones.length} vacunas
                </span>
              </div>
              {animal.vacunaciones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {animal.vacunaciones.map((v) => (
                    <span
                      key={v.id}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground"
                    >
                      <Syringe className="h-3 w-3" />
                      {v.tipo} • {format(v.fecha, 'dd/MM/yy')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
