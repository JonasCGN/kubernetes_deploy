import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

// Adiciona um produto ao pedido
export async function adicionarProdutoAoPedido(req: Request, res: Response) {
  const pedidoId = req.params.id;
  const { id_produto, quantidade, observacoes } = req.body;

  if (!id_produto || !quantidade) {
    return res.status(400).json({ error: 'id_produto e quantidade são obrigatórios.' });
  }

  const { error } = await supabase.from('pedido_produtos').insert({
    id_pedido: pedidoId,
    id_produto,
    quantidade,
    observacoes,
  });

  if (error) return res.status(500).json({ error: 'Erro ao adicionar produto ao pedido', details: error });
  res.status(201).json({ message: 'Produto adicionado ao pedido' });
}

// Atualiza um produto do pedido
export async function atualizarProdutoDoPedido(req: Request, res: Response) {
  const pedidoId = req.params.id;
  const produtoId = req.params.produtoId;
  const { quantidade, observacoes } = req.body;

  if (!quantidade) {
    return res.status(400).json({ error: 'Quantidade é obrigatória.' });
  }

  const { error } = await supabase.from('pedido_produtos')
    .update({ quantidade, observacoes })
    .match({ id_pedido: pedidoId, id_produto: produtoId });

  if (error) return res.status(500).json({ error: 'Erro ao atualizar produto do pedido', details: error });
  res.json({ message: 'Produto do pedido atualizado' });
}

// Remove um produto do pedido
export async function removerProdutoDoPedido(req: Request, res: Response) {
  const pedidoId = req.params.id;
  const produtoId = req.params.produtoId;

  const { error } = await supabase.from('pedido_produtos')
    .delete()
    .match({ id_pedido: pedidoId, id_produto: produtoId });

  if (error) return res.status(500).json({ error: 'Erro ao remover produto do pedido', details: error });
  res.json({ message: 'Produto removido do pedido' });
}
