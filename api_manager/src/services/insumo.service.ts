import { supabase } from '../utils/supabaseClient';
import { Insumo } from '../models/insumo.model';

export async function getInsumosMap(): Promise<Map<number, Insumo>> {
    const { data, error } = await supabase
        .from('insumos')
        .select('*')
        .order('nome');

    if (error) throw error;

    const map = new Map<number, Insumo>();
    data?.forEach((item) => {
        map.set(item.id_insumo, new Insumo({
            id: item.id_insumo,
            nome: item.nome,
            categoria: item.categoria,
            preco: item.preco,
        }));
    });

    return map;
}

export async function adicionarInsumoService(nome: string, preco = 0.0, categoria = ''): Promise<number | null> {
    const { data, error } = await supabase
        .from('insumos')
        .insert({ nome, preco, categoria })
        .select('id_insumo');
    if (error || !data || !data[0]?.id_insumo) return null;
    return data[0].id_insumo;
}

export async function editarCamposInsumoService(idInsumo: number, campos: any): Promise<boolean> {
    if (!campos || Object.keys(campos).length === 0) return false;
    const { error } = await supabase
        .from('insumos')
        .update(campos)
        .eq('id_insumo', idInsumo);
    return !error;
}

export async function deletarInsumoService(idInsumo: number): Promise<boolean> {
    // Remove relações produto-insumo primeiro
    await supabase.from('produto_insumos').delete().eq('id_insumo', idInsumo);
    const { data, error } = await supabase
        .from('insumos')
        .delete()
        .eq('id_insumo', idInsumo)
        .select('id_insumo');
    if (error) return false;
    return !!(data && data.length > 0);
}
