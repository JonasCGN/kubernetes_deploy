import { Request, Response } from 'express';
import {
    adicionarProdutoInsumoService,
    adicionarProdutoInsumosService,
    removerProdutoInsumoService,
    atualizarQuantidadeProdutoInsumoService,
    removerTodosInsumosDoProdutoService
} from '../services/produtoInsumo.service';
import { getInsumosByProduto } from '../services/produtos.service';

export async function listarInsumosPorProdutoController(req: Request, res: Response) {
    try {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const id = parseInt(idParam, 10);
        const insumos = await getInsumosByProduto(id);
        res.json(insumos);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar insumos do produto' });
    }
}

export async function adicionarProdutoInsumosController(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'id deve ser uma string' });
    }
    const idProduto = parseInt(idParam, 10);

    const insumosQuantidades = req.body; // { id_insumo: quantidade, ... }

    const ok = await adicionarProdutoInsumosService(idProduto, insumosQuantidades);

    if (ok) return res.status(201).json({ success: true });

    return res.status(400).json({ error: 'Erro ao adicionar relações produto-insumo' });
}

export async function removerProdutoInsumoController(req: Request, res: Response) {
    const idProdutoParam = req.params.id;
    const idInsumoParam = req.params.insumoId;
    if (!idProdutoParam || Array.isArray(idProdutoParam)) {
        return res.status(400).json({ error: 'id deve ser uma string' });
    }
    if (!idInsumoParam || Array.isArray(idInsumoParam)) {
        return res.status(400).json({ error: 'insumoId deve ser uma string' });
    }
    const idProduto = parseInt(idProdutoParam, 10);
    const idInsumo = parseInt(idInsumoParam, 10);
    const ok = await removerProdutoInsumoService(idProduto, idInsumo);
    if (ok) return res.json({ success: true });
    return res.status(400).json({ error: 'Erro ao remover relação produto-insumo' });
}

export async function atualizarQuantidadeProdutoInsumoController(req: Request, res: Response) {
    const idProdutoParam = req.params.id;
    const idInsumoParam = req.params.insumoId;
    if (!idProdutoParam || Array.isArray(idProdutoParam)) {
        return res.status(400).json({ error: 'id deve ser uma string' });
    }
    if (!idInsumoParam || Array.isArray(idInsumoParam)) {
        return res.status(400).json({ error: 'insumoId deve ser uma string' });
    }
    const idProduto = parseInt(idProdutoParam, 10);
    const idInsumo = parseInt(idInsumoParam, 10);
    const { quantidade } = req.body;
    const ok = await atualizarQuantidadeProdutoInsumoService(idProduto, idInsumo, quantidade);
    if (ok) return res.json({ success: true });
    return res.status(400).json({ error: 'Erro ao atualizar quantidade' });
}

export async function removerTodosInsumosDoProdutoController(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'id deve ser uma string' });
    }
    const idProduto = parseInt(idParam, 10);
    const ok = await removerTodosInsumosDoProdutoService(idProduto);
    if (ok) return res.json({ success: true });
    return res.status(400).json({ error: 'Erro ao remover todos os insumos do produto' });
}
