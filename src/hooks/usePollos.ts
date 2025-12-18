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
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching pollos:', error);
                throw error;
            }
            return data as Pollos[];
        },
    });
}

export function useCreatePollos() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pollos: Omit<Pollos, 'id' | 'created_at'>) => {
            const { data, error } = await supabase
                .from('Pollos')
                .insert([pollos])
                .select()
                .single();

            if (error) throw error;
            return data;
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
            const { data, error } = await supabase
                .from('Pollos')
                .update({ Numero_pollos })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pollos'] });
        },
    });
}
