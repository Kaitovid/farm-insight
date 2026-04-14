import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AviculturaMovimiento } from '@/types/database';

export function useAviculturaMovimientos() {
    return useQuery({
        queryKey: ['avicultura-movimientos'],
        queryFn: async () => {
            const response = await fetch('/api/avicultura-movimientos');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch movimientos');
            }
            return response.json() as Promise<AviculturaMovimiento[]>;
        },
    });
}

export function useCreateMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movimiento: Omit<AviculturaMovimiento, 'id' | 'created_at' | 'usuario_id'>) => {
            const response = await fetch('/api/avicultura-movimientos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movimiento),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create movimiento');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos'] });
        },
    });
}

export function useDeleteMovimiento() {
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
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos'] });
        },
    });
}
