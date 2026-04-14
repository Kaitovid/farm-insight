import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Vacuna, GanadoVacuna } from '@/types/database';

export function useVacunas() {
    return useQuery({
        queryKey: ['vacunas'],
        queryFn: async () => {
            const response = await fetch('/api/vacunas');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch vacunas');
            }
            return response.json() as Promise<Vacuna[]>;
        },
    });
}

export function useCreateVacunacion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vacunacion: Omit<GanadoVacuna, 'id' | 'created_at'>) => {
            const response = await fetch('/api/ganado-vacunas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vacunacion),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create vacunacion');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
            queryClient.invalidateQueries({ queryKey: ['ganado-vacunas'] });
        },
    });
}

export function useGanadoVacunas() {
    return useQuery({
        queryKey: ['ganado-vacunas'],
        queryFn: async () => {
            const response = await fetch('/api/ganado-vacunas');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch ganado vacunas');
            }
            return response.json();
        },
    });
}

export function useCreateVacuna() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vacuna: Omit<Vacuna, 'id' | 'created_at'>) => {
            const response = await fetch('/api/vacunas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vacuna),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create vacuna');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['vacunas'] });
        },
    });
}

export function useDeleteVacunacion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/ganado-vacunas/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to delete vacunacion');
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
            queryClient.invalidateQueries({ queryKey: ['ganado-vacunas'] });
        },
    });
}
