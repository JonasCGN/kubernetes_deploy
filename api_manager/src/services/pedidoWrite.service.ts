import { supabase } from '../utils/supabaseClient';

export async function atualizarStatusPedidoService(idPedido: number, novoStatus: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('pedidos')
        .update({ status: novoStatus })
        .eq('id_pedido', idPedido)
        .select('id_pedido');
    if (error) return false;
    return !!(data && data.length > 0);
}


