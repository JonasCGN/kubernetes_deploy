import { Produto } from '../models/produto.model';
import { Request, Response } from 'express';
import {
  atualizarCamposProdutoService,
  atualizarDisponibilidadeProdutoService,
  adicionarProdutoService,
  getProdutos,
  getProdutosComInsumos,
  getInsumosByProduto,
  deletarProdutoService,
} from '../services/produtos.service';

export async function listarProdutosController(_req: Request, res: Response) {
  try {
    const produtos = await getProdutos();
    res.json(produtos);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export async function listarProdutosComInsumosController(_req: Request, res: Response) {
  try {
    const produtos = await getProdutosComInsumos();
    res.json(produtos);
  } catch (e) {
    res.status(500).json({ error: 'Erro ao buscar produtos com insumos' });
  }
}

export async function atualizarCamposProdutoController(req: Request, res: Response) {
  const idParam = req.params.id;
  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'id deve ser uma string' });
  }
  const idProduto = parseInt(idParam, 10);
  const campos = req.body;
  const ok = await atualizarCamposProdutoService(idProduto, campos);
  if (ok) return res.json({ success: true });
  return res.status(400).json({ error: 'Nenhum campo válido para atualizar ou erro ao atualizar' });
}

export async function atualizarDisponibilidadeProdutoController(req: Request, res: Response) {
  const idParam = req.params.id;
  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'id deve ser uma string' });
  }
  const idProduto = parseInt(idParam, 10);
  const { disponibilidade } = req.body;
  if (typeof disponibilidade !== 'boolean') {
    return res.status(400).json({ error: 'Disponibilidade deve ser boolean' });
  }
  const ok = await atualizarDisponibilidadeProdutoService(idProduto, disponibilidade);
  if (ok) return res.json({ success: true });
  return res.status(400).json({ error: 'Erro ao atualizar disponibilidade' });
}

export async function adicionarProdutoController(req: Request, res: Response) {
  try {
    const produto = new Produto(req.body);
    const id = await adicionarProdutoService(produto);
    if (id) return res.status(201).json({ id });
    return res.status(400).json({ error: 'Erro ao adicionar produto' });
  } catch (e) {
    return res.status(400).json({ error: 'Erro ao adicionar produto', details: (e as Error).message });
  }
}

export async function deletarProdutoController(req: Request, res: Response) {
  const idParam = req.params.id;
  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'id deve ser uma string' });
  }
  const idProduto = parseInt(idParam, 10);
  const ok = await deletarProdutoService(idProduto);
  if (ok) return res.json({ success: true });
  return res.status(400).json({ error: 'Erro ao deletar produto' });
}
