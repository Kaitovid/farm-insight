import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ganado, GanadoWithVacunas } from '@/types/database';

export function useGanado() {
    return useQuery({
        queryKey: ['ganado'],
        queryFn: async () => {
            const response = await fetch('/api/ganado');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch ganado');
            }
            return response.json() as Promise<GanadoWithVacunas[]>;
        },
    });
}

export function useCreateGanado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ganado: Omit<Ganado, 'id' | 'created_at'>) => {
            const response = await fetch('/api/ganado', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ganado),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create ganado');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
        },
    });
}

export function useUpdateGanado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...ganado }: Partial<Ganado> & { id: string }) => {
            const response = await fetch(`/api/ganado/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ganado),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update ganado');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
        },
    });
}

export function useDeleteGanado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/ganado/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete ganado');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
        },
    });
}
