import { Request, Response } from 'express';
import { listarMesasService, adicionarMesaService, atualizarDisponibilidadeMesaService, getUltimoPedidoMesaService } from '../services/mesa.service';

export async function listarMesas(req: Request, res: Response) {
    try {
        const mesas = await listarMesasService();
        res.json(mesas);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar mesas', details: (e as Error).message });
    }
}

export async function adicionarMesa(req: Request, res: Response) {
    try {
        const id = await adicionarMesaService();
        res.status(201).json({ id });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao adicionar mesa', details: (e as Error).message });
    }
}

export async function atualizarDisponibilidadeMesa(req: Request, res: Response) {
    const idMesa = Number(req.params.id);
    const { disponibilidade } = req.body;
    if (typeof disponibilidade !== 'boolean') {
        return res.status(400).json({ error: 'Disponibilidade deve ser boolean' });
    }
    try {
        await atualizarDisponibilidadeMesaService(idMesa, disponibilidade);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: 'Erro ao atualizar disponibilidade', details: (e as Error).message });
    }
}

export async function getUltimoPedidoMesa(req: Request, res: Response) {
    const idMesa = Number(req.params.id);
    try {
        const pedido = await getUltimoPedidoMesaService(idMesa);
        if (pedido) {
            res.json(pedido);
        } else {
            res.status(404).json({ error: 'Nenhum pedido encontrado para esta mesa' });
        }
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar último pedido', details: (e as Error).message });
    }
}
