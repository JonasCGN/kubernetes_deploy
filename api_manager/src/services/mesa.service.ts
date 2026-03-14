import { supabase } from '../utils/supabaseClient';

export async function listarMesasService() {
    const { data, error } = await supabase
        .from('mesas')
        .select('id_mesa, disponibilidade')
        .order('id_mesa');
    if (error) throw error;
    return data || [];
}

export async function adicionarMesaService() {
    const { data, error } = await supabase
        .from('mesas')
        .insert({})
        .select('id_mesa');
    if (error) throw error;
    if (data && data.length > 0) {
        return data[0].id_mesa;
    } else {
        throw new Error('Falha ao criar mesa');
    }
}

export async function atualizarDisponibilidadeMesaService(idMesa: number, disponibilidade: boolean) {
    const { error } = await supabase
        .from('mesas')
        .update({ disponibilidade })
        .eq('id_mesa', idMesa);
    if (error) throw error;
    return true;
}

export async function getUltimoPedidoMesaService(idMesa: number) {
    const { data: pedidos, error } = await supabase
        .from('pedidos')
        .select(`
            *,
            pedido_produtos (
                *,
                produto:produtos (
                    id_produto,
                    nome,
                    preco
                )
            )
        `)
        .eq('id_mesa', idMesa)
        .order('data_pedido', { ascending: false })
        .limit(1);
    if (error) throw error;
    if (pedidos && pedidos.length > 0) {
        const pedido = pedidos[0];
        if (pedido.status === 'entregue') {
            return null;
        }
        return pedido;
    } else {
        return null;
    }
}
