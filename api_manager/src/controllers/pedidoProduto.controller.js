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
exports.adicionarProdutoAoPedido = adicionarProdutoAoPedido;
exports.atualizarProdutoDoPedido = atualizarProdutoDoPedido;
exports.removerProdutoDoPedido = removerProdutoDoPedido;
const supabaseClient_1 = require("../utils/supabaseClient");
// Adiciona um produto ao pedido
function adicionarProdutoAoPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pedidoId = req.params.id;
        const { id_produto, quantidade, observacoes } = req.body;
        if (!id_produto || !quantidade) {
            return res.status(400).json({ error: 'id_produto e quantidade são obrigatórios.' });
        }
        const { error } = yield supabaseClient_1.supabase.from('pedido_produtos').insert({
            id_pedido: pedidoId,
            id_produto,
            quantidade,
            observacoes,
        });
        if (error)
            return res.status(500).json({ error: 'Erro ao adicionar produto ao pedido', details: error });
        res.status(201).json({ message: 'Produto adicionado ao pedido' });
    });
}
// Atualiza um produto do pedido
function atualizarProdutoDoPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pedidoId = req.params.id;
        const produtoId = req.params.produtoId;
        const { quantidade, observacoes } = req.body;
        if (!quantidade) {
            return res.status(400).json({ error: 'Quantidade é obrigatória.' });
        }
        const { error } = yield supabaseClient_1.supabase.from('pedido_produtos')
            .update({ quantidade, observacoes })
            .match({ id_pedido: pedidoId, id_produto: produtoId });
        if (error)
            return res.status(500).json({ error: 'Erro ao atualizar produto do pedido', details: error });
        res.json({ message: 'Produto do pedido atualizado' });
    });
}
// Remove um produto do pedido
function removerProdutoDoPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const pedidoId = req.params.id;
        const produtoId = req.params.produtoId;
        const { error } = yield supabaseClient_1.supabase.from('pedido_produtos')
            .delete()
            .match({ id_pedido: pedidoId, id_produto: produtoId });
        if (error)
            return res.status(500).json({ error: 'Erro ao remover produto do pedido', details: error });
        res.json({ message: 'Produto removido do pedido' });
    });
}
