import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pollos } from '@/types/database';

export function usePollos() {
    return useQuery({
        queryKey: ['pollos'],
        queryFn: async () => {
            const response = await fetch('/api/pollos');
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to fetch pollos');
            }
            return response.json() as Promise<Pollos[]>;
        },
    });
}

export function useCreatePollos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pollos: Omit<Pollos, 'id' | 'created_at'>) => {
            const response = await fetch('/api/pollos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pollos),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create pollos');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pollos'] });
        },
    });
}

export function useUpdatePollos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, Numero_pollos }: { id: string; Numero_pollos: number }) => {
            const response = await fetch(`/api/pollos/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Numero_pollos }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to update pollos');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pollos'] });
        },
    });
}
