import { getPedidosComItens } from '../services/pedido.service';
import { atualizarStatusPedidoService } from '../services/pedidoWrite.service';
import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { Criptografia } from '../services/criptografia.service';
import { TipoPagamento, TipoStatus, TipoEntregaHelper, TipoEntregaType } from '../types/compra';

export async function atualizarStatusPedidoController(req: Request, res: Response) {
    const idParam = req.params.id;
    if (!idParam || Array.isArray(idParam)) {
        return res.status(400).json({ error: 'id deve ser uma string' });
    }
    const idPedido = parseInt(idParam, 10);
    const { status } = req.body;
    const ok = await atualizarStatusPedidoService(idPedido, status);
    if (ok) return res.json({ success: true });
    return res.status(400).json({ error: 'Erro ao atualizar status do pedido' });
}

export async function listarPedidosHojeController(req: Request, res: Response) {
    try {
        const pedidos = await getPedidosComItens({ hoje: true });
        res.json(pedidos);
    } catch (e) {
        res.status(500).json({ error: 'Erro ao buscar pedidos de hoje', details: (e as Error).message });
    }
}

export async function listarPedidos(req: Request, res: Response) {
    try {
        const { limit } = req.query;
        const pedidos = await getPedidosComItens({ limit: limit ? Number(limit) : undefined });
        return res.json(pedidos);
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao buscar pedidos', details: e.message });
    }
}

export async function buscarPedidoPorId(req: Request, res: Response) {
    try {
        const id_pedido = Number(req.params.id_pedido);
        if (!id_pedido) return res.status(400).json({ error: 'id_pedido inválido' });
        const pedidos = await getPedidosComItens({ id_pedido: id_pedido });
        if (!pedidos.length) return res.status(404).json({ error: 'Pedido não encontrado' });
        return res.json(pedidos[0]);
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao buscar pedido', details: e.message });
    }
}

export async function criarPedido(req: Request, res: Response) {

    let { nomePessoa, telefone, tipoPagamento, status, tipoEntrega, endereco, dataPedido, idMesa } = req.body;

    if (!nomePessoa || typeof nomePessoa !== 'string' || !nomePessoa.trim()) {
        return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
    }

    // Preenche valores padrão se não enviados
    if (!tipoPagamento) tipoPagamento = TipoPagamento.dinheiro;
    if (!status) status = TipoStatus.pendente;
    if (!tipoEntrega) tipoEntrega = TipoEntregaHelper.fromString('retirada');

    try {
        const telefoneCripto = telefone ? await Criptografia.encryptStringToJsonBlob(telefone) : null;
        const enderecoCripto = endereco ? await Criptografia.encryptObjectToJsonBlob(endereco) : null;

        const pedidoInsert: any = {
            nome_pessoa: nomePessoa,
            pagamento: tipoPagamento,
            status,
            entrega: tipoEntrega,
            telefone: telefoneCripto,
            endereco: enderecoCripto,
            data_pedido: dataPedido
                ? new Date(dataPedido)
                : new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
        };
        if (idMesa !== undefined && idMesa !== null) {
            pedidoInsert.id_mesa = idMesa;
        }

        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([pedidoInsert])
            .select('id_pedido');

        if (pedidoError || !pedidoData || !pedidoData[0]?.id_pedido) {
            return res.status(500).json({ error: 'Erro ao inserir pedido', details: pedidoError });
        }
        const idPedido = pedidoData[0].id_pedido;

        // Aqui você pode disparar notificações, etc, se quiser

        return res.status(201).json({ status: 'success', idPedido });
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao criar pedido', details: e.message });
    }
}

export async function atualizarPedidoController(req: Request, res: Response) {
    const id_pedido = Number(req.params.id);
    if (!id_pedido) return res.status(400).json({ error: 'id_pedido inválido' });

    // Só atualiza campos enviados
    const {
        nomePessoa,
        telefone,
        tipoPagamento,
        status,
        tipoEntrega,
        endereco,
        dataPedido,
        idMesa
    } = req.body;

    const updateObj: any = {};
    if (nomePessoa !== undefined) updateObj.nome_pessoa = nomePessoa;
    if (tipoPagamento !== undefined) updateObj.pagamento = tipoPagamento;
    if (status !== undefined) updateObj.status = status;
    if (tipoEntrega !== undefined) updateObj.entrega = tipoEntrega;
    if (dataPedido !== undefined) updateObj.data_pedido = dataPedido;
    if (idMesa !== undefined) updateObj.id_mesa = idMesa;

    try {
        if (telefone !== undefined) {
            updateObj.telefone = telefone ? await Criptografia.encryptStringToJsonBlob(telefone) : null;
        }
        if (endereco !== undefined) {
            updateObj.endereco = endereco ? await Criptografia.encryptObjectToJsonBlob(endereco) : null;
        }

        if (Object.keys(updateObj).length === 0) {
            return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
        }

        const { error, data } = await supabase
            .from('pedidos')
            .update(updateObj)
            .eq('id_pedido', id_pedido)
            .select('id_pedido');

        if (error) {
            return res.status(500).json({ error: 'Erro ao atualizar pedido', details: error });
        }
        if (!data || !data.length) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        return res.json({ success: true });
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao atualizar pedido', details: e.message });
    }
}