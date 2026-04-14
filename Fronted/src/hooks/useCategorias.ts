import { useQuery } from '@tanstack/react-query';
import { Categoria } from '@/types/database';

export function useCategorias() {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: async () => {
            const response = await fetch('/api/categorias');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch categorias');
            }
            return response.json() as Promise<Categoria[]>;
        },
    });
}

export function useCategoriasBySector(sector: string) {
    return useQuery({
        queryKey: ['categorias', sector],
        queryFn: async () => {
            const response = await fetch(`/api/categorias?sector=${sector}`);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch categorias by sector');
            }
            return response.json() as Promise<Categoria[]>;
        },
        enabled: !!sector,
    });
}
