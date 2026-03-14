
import { supabase } from '../utils/supabaseClient';
import { Criptografia } from './criptografia.service';
import { Endereco } from '../models/endereco.model';

// Busca todos os pedidos com seus itens e produtos

export async function getPedidosComItens(params?: { id_pedido?: number, limit?: number, hoje?: boolean }) {
  const { id_pedido, limit, hoje } = params || {};
  let query = supabase
    .from('pedidos')
    .select(`
      *,
      pedido_produtos:pedido_produtos (
        id_produto,
        quantidade,
        observacoes,
        produto:produtos (
          id_produto,
          nome,
          preco
        )
      )
    `)
    .order('data_pedido', { ascending: false });

  if (id_pedido) {
    query = query.eq('id_pedido', id_pedido);
    query = query.limit(1);
  } else if (hoje) {
    const inicioHoje = new Date();
    inicioHoje.setHours(0, 0, 0, 0);
    const fimHoje = new Date(inicioHoje);
    fimHoje.setDate(fimHoje.getDate() + 1);
    query = query.gte('data_pedido', inicioHoje.toISOString())
      .lt('data_pedido', fimHoje.toISOString());
  } else {
    query = query.limit(limit || 50);
  }

  const { data: pedidos, error } = await query;
  if (error) throw error;
  if (!pedidos) return [];

  // Descriptografar telefone e endereco
  const pedidosComDescriptografia = await Promise.all(pedidos.map(async (pedido: any) => {
    // TELEFONE
    let telefone = pedido.telefone;
    try {
      if (telefone) {
        // Se for string JSON, parse antes de descriptografar
        if (typeof telefone === 'string' && telefone.trim().startsWith('{')) {
          telefone = await Criptografia.decryptJsonBlobToString(telefone);
        }
      }
    } catch (e) {
      // Se falhar, retorna o valor original
    }
    pedido.telefone = telefone;

    // ENDERECO
    let endereco = pedido.endereco;
    try {
      if (endereco) {
        // Se for string JSON, parse antes de descriptografar
        if (typeof endereco === 'string' && endereco.trim().startsWith('{')) {
          const enderecoObj = await Criptografia.decryptJsonBlobToString(endereco);
          if (typeof enderecoObj === 'string') {
            // Se ainda for string, tente parsear
            try {
              pedido.endereco = Endereco.fromJson(JSON.parse(enderecoObj));
            } catch {
              pedido.endereco = enderecoObj;
            }
          } else {
            pedido.endereco = Endereco.fromJson(enderecoObj);
          }
        } else if (typeof endereco === 'object') {
          // Já é objeto, tenta instanciar
          pedido.endereco = Endereco.fromJson(endereco);
        } else {
          pedido.endereco = endereco;
        }
      } else {
        pedido.endereco = null;
      }
    } catch (e) {
      // Se falhar, retorna o valor original
    }
    return pedido;
  }));
  return pedidosComDescriptografia;
}
