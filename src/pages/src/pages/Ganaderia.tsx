import { useState, useMemo } from 'react';
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
import { useGanado, useCreateGanado, useDeleteGanado, useUpdateGanado } from '@/hooks/useGanado';
import { GanadoWithVacunas } from '@/types/database';
import { differenceInDays, differenceInMonths, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

export default function Ganaderia() {
  const { data: animales = [], isLoading } = useGanado();
  const createGanado = useCreateGanado();
  const updateGanado = useUpdateGanado();
  const deleteGanado = useDeleteGanado();
  const [busqueda, setBusqueda] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<GanadoWithVacunas | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [nuevoAnimal, setNuevoAnimal] = useState({
    nombre: '',
    numero_identificacion: '',
    fecha_entrada: new Date().toISOString().split('T')[0],
    edad_entrada_meses: '',
    peso_inicial: '',
    estado: 'activo',
  });

  const [editAnimal, setEditAnimal] = useState({
    id: '',
    nombre: '',
    numero_identificacion: '',
    fecha_entrada: '',
    edad_entrada_meses: '',
    peso_inicial: '',
    estado: 'activo',
  });

  const animalesFiltrados = useMemo(() => {
    return animales.filter((a) =>
      a.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.numero_identificacion.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [animales, busqueda]);

  const calcularEdadActual = (fechaEntrada: string, edadEntradaMeses: number): number => {
    const mesesTranscurridos = differenceInMonths(new Date(), new Date(fechaEntrada));
    return edadEntradaMeses + mesesTranscurridos;
  };

  const calcularDiasEnFinca = (fechaEntrada: string): number => {
    return differenceInDays(new Date(), new Date(fechaEntrada));
  };

  const getUltimaVacuna = (animal: GanadoWithVacunas): string => {
    if (!animal.vacunaciones || animal.vacunaciones.length === 0) return 'Sin vacunas';
    const ultima = animal.vacunaciones.sort((a, b) =>
      new Date(b.fecha_aplicacion).getTime() - new Date(a.fecha_aplicacion).getTime()
    )[0];
    return `${ultima.vacuna.nombre} - ${format(new Date(ultima.fecha_aplicacion), 'dd MMM yyyy', { locale: es })}`;
  };

  const handleSubmit = async () => {
    if (!nuevoAnimal.nombre || !nuevoAnimal.numero_identificacion || !nuevoAnimal.edad_entrada_meses || !nuevoAnimal.peso_inicial) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await createGanado.mutateAsync({
        nombre: nuevoAnimal.nombre,
        numero_identificacion: nuevoAnimal.numero_identificacion,
        fecha_entrada: nuevoAnimal.fecha_entrada,
        edad_entrada_meses: parseInt(nuevoAnimal.edad_entrada_meses),
        peso_inicial: parseFloat(nuevoAnimal.peso_inicial),
        estado: nuevoAnimal.estado,
      });

      setDialogOpen(false);
      setNuevoAnimal({
        nombre: '',
        numero_identificacion: '',
        fecha_entrada: new Date().toISOString().split('T')[0],
        edad_entrada_meses: '',
        peso_inicial: '',
        estado: 'activo',
      });
      toast.success('Animal registrado exitosamente');
    } catch (error: any) {
      console.error('Error completo:', error);
      const errorMessage = error?.message || 'Error desconocido';
      toast.error(`Error al registrar el animal: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteGanado.mutateAsync(id);
      toast.success('Animal eliminado del registro');
    } catch (error) {
      toast.error('Error al eliminar el animal');
      console.error(error);
    }
  };

  const openDetail = (animal: GanadoWithVacunas) => {
    setSelectedAnimal(animal);
    setDetailDialogOpen(true);
  };

  const openEdit = (animal: GanadoWithVacunas) => {
    setEditAnimal({
      id: animal.id,
      nombre: animal.nombre,
      numero_identificacion: animal.numero_identificacion,
      fecha_entrada: animal.fecha_entrada,
      edad_entrada_meses: animal.edad_entrada_meses.toString(),
      peso_inicial: animal.peso_inicial.toString(),
      estado: animal.estado,
    });
    setEditDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!editAnimal.nombre || !editAnimal.numero_identificacion || !editAnimal.edad_entrada_meses || !editAnimal.peso_inicial) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await updateGanado.mutateAsync({
        id: editAnimal.id,
        nombre: editAnimal.nombre,
        numero_identificacion: editAnimal.numero_identificacion,
        fecha_entrada: editAnimal.fecha_entrada,
        edad_entrada_meses: parseInt(editAnimal.edad_entrada_meses),
        peso_inicial: parseFloat(editAnimal.peso_inicial),
        estado: editAnimal.estado,
      });

      setEditDialogOpen(false);
      toast.success('Animal actualizado exitosamente');
    } catch (error: any) {
      console.error('Error completo:', error);
      const errorMessage = error?.message || 'Error desconocido';
      toast.error(`Error al actualizar el animal: ${errorMessage}`);
    }
  };


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Cargando ganado...</p>
      </div>
    );
  }

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
                  value={nuevoAnimal.numero_identificacion}
                  onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, numero_identificacion: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de entrada</Label>
                <Input
                  type="date"
                  value={nuevoAnimal.fecha_entrada}
                  onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, fecha_entrada: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Edad de entrada (meses)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={nuevoAnimal.edad_entrada_meses}
                    onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, edad_entrada_meses: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Peso inicial (kg)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={nuevoAnimal.peso_inicial}
                    onChange={(e) => setNuevoAnimal({ ...nuevoAnimal, peso_inicial: e.target.value })}
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

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-serif">Editar Animal</DialogTitle>
              <DialogDescription>
                Actualiza la información del animal.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nombre del animal</Label>
                <Input
                  placeholder="Ej: Vaca Manchada"
                  value={editAnimal.nombre}
                  onChange={(e) => setEditAnimal({ ...editAnimal, nombre: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Código identificador</Label>
                <Input
                  placeholder="Ej: GAN-006"
                  value={editAnimal.numero_identificacion}
                  onChange={(e) => setEditAnimal({ ...editAnimal, numero_identificacion: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Fecha de entrada</Label>
                <Input
                  type="date"
                  value={editAnimal.fecha_entrada}
                  onChange={(e) => setEditAnimal({ ...editAnimal, fecha_entrada: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Edad al entrar (meses)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={editAnimal.edad_entrada_meses}
                    onChange={(e) => setEditAnimal({ ...editAnimal, edad_entrada_meses: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Peso inicial (kg)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={editAnimal.peso_inicial}
                    onChange={(e) => setEditAnimal({ ...editAnimal, peso_inicial: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="farm" onClick={handleEdit}>
                Actualizar
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
                {Math.round(animales.reduce((acc, a) => acc + a.peso_inicial, 0) / animales.length)} kg
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
                  v.proxima_fecha && new Date(v.proxima_fecha) <= new Date()
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
                  <p className="text-sm text-muted-foreground">{animal.numero_identificacion}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openDetail(animal)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(animal)}>
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
                  {calcularEdadActual(animal.fecha_entrada, animal.edad_entrada_meses)} meses
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Días en finca</span>
                <span className="font-medium text-foreground">
                  {calcularDiasEnFinca(animal.fecha_entrada)} días
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peso inicial</span>
                <span className="font-medium text-foreground">{animal.peso_inicial} kg</span>
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
                <DialogDescription>{selectedAnimal.numero_identificacion}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Edad Actual</p>
                    <p className="font-bold text-foreground">
                      {calcularEdadActual(selectedAnimal.fecha_entrada, selectedAnimal.edad_entrada_meses)} meses
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Días en Finca</p>
                    <p className="font-bold text-foreground">
                      {calcularDiasEnFinca(selectedAnimal.fecha_entrada)} días
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Peso Inicial</p>
                    <p className="font-bold text-foreground">{selectedAnimal.peso_inicial} kg</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Fecha de Entrada</p>
                    <p className="font-bold text-foreground">
                      {format(new Date(selectedAnimal.fecha_entrada), 'dd MMM yyyy', { locale: es })}
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
                            <p className="font-medium text-foreground">{v.vacuna.nombre}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(v.fecha_aplicacion), 'dd MMM yyyy', { locale: es })}
                            </p>
                          </div>
                          {v.proxima_fecha && (
                            <span className={`text-xs px-2 py-1 rounded-full ${new Date(v.proxima_fecha) <= new Date()
                              ? 'bg-destructive/10 text-destructive'
                              : 'bg-farm-green/10 text-farm-green'
                              }`}>
                              Próx: {format(new Date(v.proxima_fecha), 'dd MMM yy', { locale: es })}
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
