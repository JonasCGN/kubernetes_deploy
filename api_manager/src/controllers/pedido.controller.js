"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atualizarStatusPedidoController = atualizarStatusPedidoController;
exports.listarPedidosHojeController = listarPedidosHojeController;
exports.listarPedidos = listarPedidos;
exports.buscarPedidoPorId = buscarPedidoPorId;
exports.criarPedido = criarPedido;
exports.atualizarPedidoController = atualizarPedidoController;
const pedido_service_1 = require("../services/pedido.service");
const pedidoWrite_service_1 = require("../services/pedidoWrite.service");
const supabaseClient_1 = require("../utils/supabaseClient");
const criptografia_service_1 = require("../services/criptografia.service");
const compra_1 = require("../types/compra");
function atualizarStatusPedidoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idPedido = parseInt(idParam, 10);
        const { status } = req.body;
        const ok = yield (0, pedidoWrite_service_1.atualizarStatusPedidoService)(idPedido, status);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao atualizar status do pedido' });
    });
}
function listarPedidosHojeController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const pedidos = yield (0, pedido_service_1.getPedidosComItens)({ hoje: true });
            res.json(pedidos);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar pedidos de hoje', details: e.message });
        }
    });
}
function listarPedidos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit } = req.query;
            const pedidos = yield (0, pedido_service_1.getPedidosComItens)({ limit: limit ? Number(limit) : undefined });
            return res.json(pedidos);
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar pedidos', details: e.message });
        }
    });
}
function buscarPedidoPorId(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id_pedido = Number(req.params.id_pedido);
            if (!id_pedido)
                return res.status(400).json({ error: 'id_pedido inválido' });
            const pedidos = yield (0, pedido_service_1.getPedidosComItens)({ id_pedido: id_pedido });
            if (!pedidos.length)
                return res.status(404).json({ error: 'Pedido não encontrado' });
            return res.json(pedidos[0]);
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao buscar pedido', details: e.message });
        }
    });
}
function criarPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        let { nomePessoa, telefone, tipoPagamento, status, tipoEntrega, endereco, dataPedido, idMesa } = req.body;
        if (!nomePessoa || typeof nomePessoa !== 'string' || !nomePessoa.trim()) {
            return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
        }
        // Preenche valores padrão se não enviados
        if (!tipoPagamento)
            tipoPagamento = compra_1.TipoPagamento.dinheiro;
        if (!status)
            status = compra_1.TipoStatus.pendente;
        if (!tipoEntrega)
            tipoEntrega = compra_1.TipoEntregaHelper.fromString('retirada');
        try {
            const telefoneCripto = telefone ? yield criptografia_service_1.Criptografia.encryptStringToJsonBlob(telefone) : null;
            const enderecoCripto = endereco ? yield criptografia_service_1.Criptografia.encryptObjectToJsonBlob(endereco) : null;
            const pedidoInsert = {
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
            const { data: pedidoData, error: pedidoError } = yield supabaseClient_1.supabase
                .from('pedidos')
                .insert([pedidoInsert])
                .select('id_pedido');
            if (pedidoError || !pedidoData || !((_a = pedidoData[0]) === null || _a === void 0 ? void 0 : _a.id_pedido)) {
                return res.status(500).json({ error: 'Erro ao inserir pedido', details: pedidoError });
            }
            const idPedido = pedidoData[0].id_pedido;
            // Aqui você pode disparar notificações, etc, se quiser
            return res.status(201).json({ status: 'success', idPedido });
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao criar pedido', details: e.message });
        }
    });
}
function atualizarPedidoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const id_pedido = Number(req.params.id);
        if (!id_pedido)
            return res.status(400).json({ error: 'id_pedido inválido' });
        // Só atualiza campos enviados
        const { nomePessoa, telefone, tipoPagamento, status, tipoEntrega, endereco, dataPedido, idMesa } = req.body;
        const updateObj = {};
        if (nomePessoa !== undefined)
            updateObj.nome_pessoa = nomePessoa;
        if (tipoPagamento !== undefined)
            updateObj.pagamento = tipoPagamento;
        if (status !== undefined)
            updateObj.status = status;
        if (tipoEntrega !== undefined)
            updateObj.entrega = tipoEntrega;
        if (dataPedido !== undefined)
            updateObj.data_pedido = dataPedido;
        if (idMesa !== undefined)
            updateObj.id_mesa = idMesa;
        try {
            if (telefone !== undefined) {
                updateObj.telefone = telefone ? yield criptografia_service_1.Criptografia.encryptStringToJsonBlob(telefone) : null;
            }
            if (endereco !== undefined) {
                updateObj.endereco = endereco ? yield criptografia_service_1.Criptografia.encryptObjectToJsonBlob(endereco) : null;
            }
            if (Object.keys(updateObj).length === 0) {
                return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
            }
            const { error, data } = yield supabaseClient_1.supabase
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
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao atualizar pedido', details: e.message });
        }
    });
}
