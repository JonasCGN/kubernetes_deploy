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
exports.finalizarPedido = finalizarPedido;
const supabaseClient_1 = require("../utils/supabaseClient");
const whatsapp_service_1 = require("../services/whatsapp.service");
// import { firebaseSendNotification } from '../services/firebase.service';
const compra_model_1 = require("../models/compra.model");
const criptografia_service_1 = require("../services/criptografia.service");
const endereco_model_1 = require("../models/endereco.model");
// Função para criar pedido + itens + notificações (finalização completa)
function finalizarPedido(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        // Aceita tanto itens: [{produto: {id}, ...}] quanto itens: [{id_produto, ...}]
        const compra = Object.assign({}, req.body);
        compra.itens = (req.body.itens || []).map((item) => {
            if (item.produto && item.produto.id) {
                // já está no formato antigo
                return item;
            }
            // novo formato: {id_produto, quantidade, observacoes}
            console.log(item);
            return {
                produto: { id: item.id_produto },
                quantidade: item.quantidade,
                observacoes: item.observacoes,
            };
        });
        // Validações básicas
        if (!compra || !compra.itens || !Array.isArray(compra.itens) || compra.itens.length === 0) {
            return res.status(400).json({ error: 'Carrinho vazio. Adicione produtos antes de finalizar.' });
        }
        if (!compra.nomePessoa || typeof compra.nomePessoa !== 'string' || !compra.nomePessoa.trim()) {
            return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
        }
        if (!compra.telefone || typeof compra.telefone !== 'string' || !compra.telefone.trim()) {
            return res.status(400).json({ error: 'Telefone do cliente é obrigatório.' });
        }
        if (compra.tipoEntrega === 'delivery' && !compra.endereco) {
            return res.status(400).json({ error: 'Endereço é obrigatório para delivery.' });
        }
        try {
            // Criptografar telefone e endereco
            const telefoneCripto = yield criptografia_service_1.Criptografia.encryptStringToJsonBlob(compra.telefone);
            const enderecoCripto = compra.endereco
                ? yield criptografia_service_1.Criptografia.encryptObjectToJsonBlob(compra.endereco)
                : null;
            const pedidoInsert = {
                nome_pessoa: compra.nomePessoa,
                telefone: telefoneCripto,
                pagamento: compra.tipoPagamento,
                status: compra.status,
                entrega: compra.tipoEntrega,
                endereco: enderecoCripto,
                data_pedido: compra.dataPedido
                    ? new Date(compra.dataPedido)
                    : new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
                // não inclua 'itens' aqui!
            };
            // 1. Inserir pedido
            const { data: pedidoData, error: pedidoError } = yield supabaseClient_1.supabase
                .from('pedidos')
                .insert([pedidoInsert])
                .select('id_pedido');
            if (pedidoError || !pedidoData || !((_a = pedidoData[0]) === null || _a === void 0 ? void 0 : _a.id_pedido)) {
                return res.status(500).json({ error: 'Erro ao inserir pedido', details: pedidoError });
            }
            const idPedido = pedidoData[0].id_pedido;
            // 2. Inserir itens do pedido
            for (const item of compra.itens) {
                // console.log(idPedido)
                // console.log(item)
                const { error: itemError } = yield supabaseClient_1.supabase.from('pedido_produtos').insert({
                    id_pedido: idPedido,
                    id_produto: item.produto.id,
                    quantidade: item.quantidade,
                    observacoes: item.observacoes || '',
                });
                if (itemError) {
                    return res.status(500).json({ error: 'Erro ao inserir item do pedido', details: itemError });
                }
            }
            try {
                // Buscar os produtos do banco para garantir nome e preco atualizados
                const idsProdutos = compra.itens.map((item) => item.produto.id);
                const { data: produtosDb, error: produtosError } = yield supabaseClient_1.supabase
                    .from('produtos')
                    .select('id_produto, nome, preco')
                    .in('id_produto', idsProdutos);
                if (produtosError) {
                    throw produtosError;
                }
                // Montar itens com nome e preco do banco
                const itensCompletos = compra.itens.map((item) => {
                    const produtoDb = produtosDb === null || produtosDb === void 0 ? void 0 : produtosDb.find((p) => p.id_produto === item.produto.id);
                    return Object.assign(Object.assign({}, item), { produto: Object.assign(Object.assign({}, item.produto), { nome: (produtoDb === null || produtoDb === void 0 ? void 0 : produtoDb.nome) || item.produto.nome }), precoTotal: produtoDb ? produtoDb.preco * item.quantidade : 0 });
                });
                let enderecoInstance = compra.endereco;
                if (compra.tipoEntrega === 'delivery' && compra.endereco && compra.endereco !== null) {
                    enderecoInstance = endereco_model_1.Endereco.fromJson(compra.endereco);
                }
                const compraObj = new compra_model_1.Compra(Object.assign(Object.assign({}, compra), { itens: itensCompletos, endereco: enderecoInstance }));
                yield whatsapp_service_1.ApiEvolution.sendMessage(compra.telefone, compraObj.toString());
            }
            catch (e) {
                console.error('Erro ao enviar WhatsApp:', e);
            }
            try {
                // await firebaseSendNotification({
                //     topic: 'funcionario',
                //     title: 'Novo pedido',
                //     message: `O ${compra.nomePessoa} fez um pedido!`,
                // });
                // await firebaseSendNotification({
                //     topic: 'proprietario',
                //     title: 'Novo pedido',
                //     message: `O ${compra.nomePessoa} fez um pedido!, avise para os funcionarios`,
                // });
            }
            catch (e) {
                console.error('Erro ao enviar notificação Firebase:', e);
            }
            return res.status(200).json({ status: 'success', idPedido });
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao finalizar pedido', details: e.message });
        }
    });
}
