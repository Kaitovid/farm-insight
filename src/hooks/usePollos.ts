import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Pollos } from '@/types/database';

export function usePollos() {
    return useQuery({
        queryKey: ['pollos'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('Pollos')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error;
            return data as Pollos | null;
        },
    });
}

export function useUpdatePollos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (numero_pollos: number) => {
            // Primero intentamos obtener el registro existente
            const { data: existing } = await supabase
                .from('Pollos')
                .select('*')
                .limit(1)
                .single();

            if (existing) {
                // Si existe, actualizamos
                const { data, error } = await supabase
                    .from('Pollos')
                    .update({ numero_pollos })
                    .eq('id', existing.id)
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } else {
                // Si no existe, creamos uno nuevo
                const { data, error } = await supabase
                    .from('Pollos')
                    .insert([{ numero_pollos }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pollos'] });
        },
    });
}
