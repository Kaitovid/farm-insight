import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Vacuna, GanadoVacuna } from '@/types/database';

export function useVacunas() {
    return useQuery({
        queryKey: ['vacunas'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('vacunas')
                .select('*')
                .order('nombre');

            if (error) {
                console.error('Error fetching vacunas:', error);
                throw error;
            }
            return data as Vacuna[];
        },
    });
}

export function useCreateVacunacion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vacunacion: Omit<GanadoVacuna, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('ganado_vacunas')
                .insert([vacunacion])
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

export function useGanadoVacunas() {
    return useQuery({
        queryKey: ['ganado-vacunas'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('ganado_vacunas')
                .select(`
          *,
          ganado:ganado(*),
          vacuna:vacunas(*)
        `)
                .order('proxima_fecha', { ascending: true });

            if (error) throw error;
            return data;
        },
    });
}

export function useCreateVacuna() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (vacuna: Omit<Vacuna, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('vacunas')
                .insert([vacuna])
                .select()
                .single();

            if (error) throw error;
            return data;
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
            const { error } = await supabase
                .from('ganado_vacunas')
                .delete()
                .eq('id', id);

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ganado'] });
            queryClient.invalidateQueries({ queryKey: ['ganado-vacunas'] });
        },
    });
}
