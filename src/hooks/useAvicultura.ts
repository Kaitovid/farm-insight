import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { AviculturaMovimiento } from '@/types/database';

export function useAviculturaMovimientos() {
    return useQuery({
        queryKey: ['avicultura-movimientos'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('avicultura_movimientos')
                .select('*')
                .order('fecha', { ascending: false });

            if (error) throw error;
            return data as AviculturaMovimiento[];
        },
    });
}

export function useCreateMovimiento() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movimiento: Omit<AviculturaMovimiento, 'id' | 'created_at' | 'usuario_id'>) => {
            const { data, error } = await supabase
                .from('avicultura_movimientos')
                .insert([movimiento])
                .select()
                .single();

            if (error) throw error;
            return data;
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
            const { error } = await supabase
                .from('avicultura_movimientos')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['avicultura-movimientos'] });
        },
    });
}
