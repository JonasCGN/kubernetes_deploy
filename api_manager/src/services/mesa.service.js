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
exports.listarMesasService = listarMesasService;
exports.adicionarMesaService = adicionarMesaService;
exports.atualizarDisponibilidadeMesaService = atualizarDisponibilidadeMesaService;
exports.getUltimoPedidoMesaService = getUltimoPedidoMesaService;
const supabaseClient_1 = require("../utils/supabaseClient");
function listarMesasService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('mesas')
            .select('id_mesa, disponibilidade')
            .order('id_mesa');
        if (error)
            throw error;
        return data || [];
    });
}
function adicionarMesaService() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('mesas')
            .insert({})
            .select('id_mesa');
        if (error)
            throw error;
        if (data && data.length > 0) {
            return data[0].id_mesa;
        }
        else {
            throw new Error('Falha ao criar mesa');
        }
    });
}
function atualizarDisponibilidadeMesaService(idMesa, disponibilidade) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabaseClient_1.supabase
            .from('mesas')
            .update({ disponibilidade })
            .eq('id_mesa', idMesa);
        if (error)
            throw error;
        return true;
    });
}
function getUltimoPedidoMesaService(idMesa) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data: pedidos, error } = yield supabaseClient_1.supabase
            .from('pedidos')
            .select(`
            *,
            pedido_produtos (
                *,
                produto:produtos (
                    id_produto,
                    nome,
                    preco
                )
            )
        `)
            .eq('id_mesa', idMesa)
            .order('data_pedido', { ascending: false })
            .limit(1);
        if (error)
            throw error;
        if (pedidos && pedidos.length > 0) {
            const pedido = pedidos[0];
            if (pedido.status === 'entregue') {
                return null;
            }
            return pedido;
        }
        else {
            return null;
        }
    });
}
