import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Ganado, GanadoWithVacunas } from '@/types/database';

export function useGanado() {
    return useQuery({
        queryKey: ['ganado'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ganado')
                .select(`
          *,
          vacunaciones:ganado_vacunas(
            *,
            vacuna:vacunas(*)
          ),
          pesos:ganado_pesos(*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as GanadoWithVacunas[];
        },
    });
}

export function useCreateGanado() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ganado: Omit<Ganado, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('ganado')
                .insert([ganado])
                .select()
                .single();

            if (error) throw error;
            return data;
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
            const { data, error } = await supabase
                .from('ganado')
                .update(ganado)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
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
            const { error } = await supabase
                .from('ganado')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
        },
    });
}
