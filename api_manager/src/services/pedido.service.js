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
exports.getPedidosComItens = getPedidosComItens;
const supabaseClient_1 = require("../utils/supabaseClient");
const criptografia_service_1 = require("./criptografia.service");
const endereco_model_1 = require("../models/endereco.model");
// Busca todos os pedidos com seus itens e produtos
function getPedidosComItens(params) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id_pedido, limit, hoje } = params || {};
        let query = supabaseClient_1.supabase
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
        }
        else if (hoje) {
            const inicioHoje = new Date();
            inicioHoje.setHours(0, 0, 0, 0);
            const fimHoje = new Date(inicioHoje);
            fimHoje.setDate(fimHoje.getDate() + 1);
            query = query.gte('data_pedido', inicioHoje.toISOString())
                .lt('data_pedido', fimHoje.toISOString());
        }
        else {
            query = query.limit(limit || 50);
        }
        const { data: pedidos, error } = yield query;
        if (error)
            throw error;
        if (!pedidos)
            return [];
        // Descriptografar telefone e endereco
        const pedidosComDescriptografia = yield Promise.all(pedidos.map((pedido) => __awaiter(this, void 0, void 0, function* () {
            // TELEFONE
            let telefone = pedido.telefone;
            try {
                if (telefone) {
                    // Se for string JSON, parse antes de descriptografar
                    if (typeof telefone === 'string' && telefone.trim().startsWith('{')) {
                        telefone = yield criptografia_service_1.Criptografia.decryptJsonBlobToString(telefone);
                    }
                }
            }
            catch (e) {
                // Se falhar, retorna o valor original
            }
            pedido.telefone = telefone;
            // ENDERECO
            let endereco = pedido.endereco;
            try {
                if (endereco) {
                    // Se for string JSON, parse antes de descriptografar
                    if (typeof endereco === 'string' && endereco.trim().startsWith('{')) {
                        const enderecoObj = yield criptografia_service_1.Criptografia.decryptJsonBlobToString(endereco);
                        if (typeof enderecoObj === 'string') {
                            // Se ainda for string, tente parsear
                            try {
                                pedido.endereco = endereco_model_1.Endereco.fromJson(JSON.parse(enderecoObj));
                            }
                            catch (_a) {
                                pedido.endereco = enderecoObj;
                            }
                        }
                        else {
                            pedido.endereco = endereco_model_1.Endereco.fromJson(enderecoObj);
                        }
                    }
                    else if (typeof endereco === 'object') {
                        // Já é objeto, tenta instanciar
                        pedido.endereco = endereco_model_1.Endereco.fromJson(endereco);
                    }
                    else {
                        pedido.endereco = endereco;
                    }
                }
                else {
                    pedido.endereco = null;
                }
            }
            catch (e) {
                // Se falhar, retorna o valor original
            }
            return pedido;
        })));
        return pedidosComDescriptografia;
    });
}
