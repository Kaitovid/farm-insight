import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AviculturaMovimiento } from '@/types/database';

export type Sector = 'avicola' | 'gandero' | 'fructifero';

export function useAviculturaMovimientos(sector?: Sector) {
    const url = sector
        ? `/api/avicultura-movimientos?sector=${sector}`
        : '/api/avicultura-movimientos';
    return useQuery({
        queryKey: ['avicultura-movimientos', sector ?? 'all'],
        queryFn: async () => {
            const response = await fetch(url);
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch movimientos');
            }
            return response.json() as Promise<AviculturaMovimiento[]>;
        },
    });
}

export function useCreateMovimiento(sector: Sector) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movimiento: Omit<AviculturaMovimiento, 'id' | 'created_at' | 'usuario_id'>) => {
            const response = await fetch('/api/avicultura-movimientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...movimiento, sector }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create movimiento');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos', sector] });
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos', 'all'] });
        },
    });
}

export function useDeleteMovimiento(sector: Sector) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/avicultura-movimientos/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete movimiento');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos', sector] });
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos', 'all'] });
        },
    });
}
