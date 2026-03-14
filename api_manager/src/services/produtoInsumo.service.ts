import { supabase } from '../utils/supabaseClient';

export async function adicionarProdutoInsumoService(idProduto: number, idInsumo: number, quantidade: number): Promise<boolean> {
    const { error } = await supabase
        .from('produto_insumos')
        .insert({ id_produto: idProduto, id_insumo: idInsumo, quantidade_insumos: quantidade });
    return !error;
}

export async function adicionarProdutoInsumosService(idProduto: number, insumosQuantidades: Record<number, number>): Promise<boolean> {
    if (!insumosQuantidades || Object.keys(insumosQuantidades).length === 0) return true;
    for (const [idInsumo, quantidade] of Object.entries(insumosQuantidades)) {
        const ok = await adicionarProdutoInsumoService(idProduto, Number(idInsumo), quantidade);
        if (!ok) return false;
    }
    return true;
}

export async function removerProdutoInsumoService(idProduto: number, idInsumo: number): Promise<boolean> {
    const { data, error } = await supabase
        .from('produto_insumos')
        .delete()
        .eq('id_produto', idProduto)
        .eq('id_insumo', idInsumo)
        .select('id_produto');
    if (error) return false;
    return !!(data && data.length > 0);
}

export async function atualizarQuantidadeProdutoInsumoService(idProduto: number, idInsumo: number, novaQuantidade: number): Promise<boolean> {
    const { data, error } = await supabase
        .from('produto_insumos')
        .update({ quantidade_insumos: novaQuantidade })
        .eq('id_produto', idProduto)
        .eq('id_insumo', idInsumo)
        .select('id_produto');
    if (error) return false;
    return !!(data && data.length > 0);
}

export async function removerTodosInsumosDoProdutoService(idProduto: number): Promise<boolean> {
    const { error } = await supabase
        .from('produto_insumos')
        .delete()
        .eq('id_produto', idProduto);
    return !error;
}
