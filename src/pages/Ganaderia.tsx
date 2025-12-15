import { useState } from 'react';
import { Plus, Search, Eye, Edit2, Trash2, Beef, Calendar, Scale, Syringe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { mockAnimales } from '@/data/mockData';
import { Animal } from '@/types/farm';
import { differenceInDays, differenceInMonths, addMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Ganaderia() {
  const [animales, setAnimales] = useState<Animal[]>(mockAnimales);
  const [busqueda, setBusqueda] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [nuevoAnimal, setNuevoAnimal] = useState({
    nombre: '',
    codigo: '',
    fechaEntrada: new Date().toISOString().split('T')[0],
    edadEntradaMeses: '',
    pesoInicial: '',
  });

  const animalesFiltrados = animales.filter((a) =>
    a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    a.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const calcularEdadActual = (fechaEntrada: Date, edadEntradaMeses: number): number => {
    const mesesTranscurridos = differenceInMonths(new Date(), fechaEntrada);
    return edadEntradaMeses + mesesTranscurridos;
  };

  const calcularDiasEnFinca = (fechaEntrada: Date): number => {
    return differenceInDays(new Date(), fechaEntrada);
  };

  const getUltimaVacuna = (animal: Animal): string => {
    if (animal.vacunaciones.length === 0) return 'Sin vacunas';
    const ultima = animal.vacunaciones.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    )[0];
    return `${ultima.tipo} - ${format(ultima.fecha, 'dd MMM yyyy', { locale: es })}`;
  };

  const handleSubmit = () => {
    if (!nuevoAnimal.nombre || !nuevoAnimal.codigo || !nuevoAnimal.edadEntradaMeses || !nuevoAnimal.pesoInicial) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    const nuevo: Animal = {
      id: `a${Date.now()}`,
      nombre: nuevoAnimal.nombre,
      codigo: nuevoAnimal.codigo,
      fechaEntrada: new Date(nuevoAnimal.fechaEntrada),
      edadEntradaMeses: parseInt(nuevoAnimal.edadEntradaMeses),
      pesoInicial: parseFloat(nuevoAnimal.pesoInicial),
      vacunaciones: [],
    };

    setAnimales([...animales, nuevo]);
    setDialogOpen(false);
    setNuevoAnimal({
      nombre: '',
      codigo: '',
      fechaEntrada: new Date().toISOString().split('T')[0],
      edadEntradaMeses: '',
      pesoInicial: '',
    });
    toast.success('Animal registrado exitosamente');
  };

  const handleDelete = (id: string) => {
    setAnimales(animales.filter(a => a.id !== id));
    toast.success('Animal eliminado del registro');
  };

  const openDetail = (animal: Animal) => {
    setSelectedAnimal(animal);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Ganadería</h1>
          <p className="text-muted-foreground">Gestión individual del ganado con ficha técnica</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="farm" className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Ganado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Registrar Nuevo Animal</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo animal para agregarlo al registro.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre del animal</Label>
                <Input
                  placeholder="Ej: Estrella"
                  value={nuevoAnimal.nombre}
                  onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, nombre: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Código identificador</Label>
                <Input
                  placeholder="Ej: GAN-006"
                  value={nuevoAnimal.codigo}
                  onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, codigo: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de entrada</Label>
                <Input
                  type="date"
                  value={nuevoAnimal.fechaEntrada}
                  onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, fechaEntrada: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Edad de entrada (meses)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={nuevoAnimal.edadEntradaMeses}
                    onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, edadEntradaMeses: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Peso inicial (kg)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={nuevoAnimal.pesoInicial}
                    onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, pesoInicial: e.target.value })}
                  />
                </div>
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Beef className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Animales</p>
              <p className="text-2xl font-bold text-foreground">{animales.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-accent">
              <Scale className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Peso Promedio</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(animales.reduce((acc, a) => acc + a.pesoInicial, 0) / animales.length)} kg
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm animate-fade-up opacity-0" style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-earth">
              <Syringe className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Vacunas Pendientes</p>
              <p className="text-2xl font-bold text-foreground">
                {animales.filter(a => a.vacunaciones.some(v => 
                  v.proximaFecha && new Date(v.proximaFecha) <= new Date()
                )).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Animal Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animalesFiltrados.map((animal, index) => (
          <div
            key={animal.id}
            className="rounded-xl border border-border bg-card p-5 shadow-sm hover-lift animate-fade-up opacity-0"
            style={{ animationDelay: `${400 + index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-farm-green/10">
                  <Beef className="h-6 w-6 text-farm-green" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground">{animal.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{animal.codigo}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(animal)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(animal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Edad actual</span>
                <span className="font-medium text-foreground">
                  {calcularEdadActual(animal.fechaEntrada, animal.edadEntradaMeses)} meses
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días en finca</span>
                <span className="font-medium text-foreground">
                  {calcularDiasEnFinca(animal.fechaEntrada)} días
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso inicial</span>
                <span className="font-medium text-foreground">{animal.pesoInicial} kg</span>
              </div>
              <div className="pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-farm-orange" />
                  <span className="text-xs text-muted-foreground truncate">
                    {getUltimaVacuna(animal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedAnimal && (
            <>
              <DialogHeader>
                <DialogTitle className="font-serif flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                    <Beef className="h-5 w-5 text-primary-foreground" />
                  </div>
                  {selectedAnimal.nombre}
                </DialogTitle>
                <DialogDescription>{selectedAnimal.codigo}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Edad Actual</p>
                    <p className="font-bold text-foreground">
                      {calcularEdadActual(selectedAnimal.fechaEntrada, selectedAnimal.edadEntradaMeses)} meses
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Días en Finca</p>
                    <p className="font-bold text-foreground">
                      {calcularDiasEnFinca(selectedAnimal.fechaEntrada)} días
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Peso Inicial</p>
                    <p className="font-bold text-foreground">{selectedAnimal.pesoInicial} kg</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Fecha de Entrada</p>
                    <p className="font-bold text-foreground">
                      {format(selectedAnimal.fechaEntrada, 'dd MMM yyyy', { locale: es })}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <Syringe className="h-4 w-4" />
                    Historial de Vacunaciones
                  </h4>
                  {selectedAnimal.vacunaciones.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Sin vacunas registradas</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedAnimal.vacunaciones.map((v) => (
                        <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                          <div>
                            <p className="font-medium text-foreground">{v.tipo}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(v.fecha, 'dd MMM yyyy', { locale: es })}
                            </p>
                          </div>
                          {v.proximaFecha && (
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              new Date(v.proximaFecha) <= new Date()
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-farm-green/10 text-farm-green'
                            }`}>
                              Próx: {format(v.proximaFecha, 'dd MMM yy', { locale: es })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
