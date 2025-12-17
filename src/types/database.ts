// Database types matching Supabase schema

export interface Categoria {
    id: string;
    nombre: string;
    sector: string;
    created_at: string;
}

export interface Perfil {
    id: string;
    nombre: string;
    created_at: string;
}

export interface AviculturaMovimiento {
    id: string;
    tipo: 'venta' | 'gasto';
    fecha: string;
    descripcion: string;
    categoria: string;
    monto: number;
    usuario_id: string;
    created_at: string;
}

export interface Ganado {
    id: string;
    nombre: string;
    numero_identificacion: string;
    fecha_entrada: string;
    edad_entrada_meses: number;
    peso_inicial: number;
    estado: string;
    created_at: string;
}

export interface GanadoPeso {
    id: string;
    ganado_id: string;
    peso: number;
    fecha: string;
    created_at: string;
}

export interface Vacuna {
    id: string;
    nombre: string;
    descripcion: string;
    frecuencia_dias: number;
    created_at: string;
}

export interface GanadoVacuna {
    id: string;
    ganado_id: string;
    vacuna_id: string;
    fecha_aplicacion: string;
    proxima_fecha: string | null;
    observaciones: string | null;
    created_at: string;
}

// Extended types with relations
export interface GanadoWithVacunas extends Ganado {
    vacunaciones: (GanadoVacuna & { vacuna: Vacuna })[];
    pesos: GanadoPeso[];
}

export interface Pollos {
    id: string;
    numero_pollos: number;
    created_at: string;
}
