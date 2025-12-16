import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Categoria } from '@/types/database';

export function useCategorias() {
    return useQuery({
        queryKey: ['categorias'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .order('nombre');

            if (error) throw error;
            return data as Categoria[];
        },
    });
}

export function useCategoriasBySector(sector: string) {
    return useQuery({
        queryKey: ['categorias', sector],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('categorias')
                .select('*')
                .eq('sector', sector)
                .order('nombre');

            if (error) throw error;
            return data as Categoria[];
        },
        enabled: !!sector,
    });
}
