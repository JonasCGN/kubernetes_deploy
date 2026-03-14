import { Request, Response } from 'express';
import {
  adicionarInsumoService,
  editarCamposInsumoService,
  deletarInsumoService,
  getInsumosMap
} from '../services/insumo.service';

export async function listarInsumosController(_req: Request, res: Response) {
  try {
    const insumos = await getInsumosMap();
    const array = Array.from(insumos.values());
    res.json(array);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar insumos' });
  }
}

export async function adicionarInsumoController(req: Request, res: Response) {
  const { nome, preco = 0, categoria = '' } = req.body;
  const id = await adicionarInsumoService(nome, preco, categoria);
  if (id) return res.status(201).json({ id });
  return res.status(400).json({ error: 'Erro ao adicionar insumo' });
}

export async function editarCamposInsumoController(req: Request, res: Response) {
  const idParam = req.params.id;
  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'id deve ser uma string' });
  }
  const idInsumo = parseInt(idParam, 10);
  const ok = await editarCamposInsumoService(idInsumo, req.body);
  if (ok) return res.json({ success: true });
  return res.status(400).json({ error: 'Nenhum campo válido para atualizar ou erro ao atualizar' });
}

export async function deletarInsumoController(req: Request, res: Response) {
  const idParam = req.params.id;
  if (!idParam || Array.isArray(idParam)) {
    return res.status(400).json({ error: 'id deve ser uma string' });
  }
  const idInsumo = parseInt(idParam, 10);
  const ok = await deletarInsumoService(idInsumo);
  if (ok) return res.json({ success: true });
  return res.status(400).json({ error: 'Erro ao deletar insumo' });
}

