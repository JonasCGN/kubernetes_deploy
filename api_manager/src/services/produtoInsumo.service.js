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
exports.adicionarProdutoInsumoService = adicionarProdutoInsumoService;
exports.adicionarProdutoInsumosService = adicionarProdutoInsumosService;
exports.removerProdutoInsumoService = removerProdutoInsumoService;
exports.atualizarQuantidadeProdutoInsumoService = atualizarQuantidadeProdutoInsumoService;
exports.removerTodosInsumosDoProdutoService = removerTodosInsumosDoProdutoService;
const supabaseClient_1 = require("../utils/supabaseClient");
function adicionarProdutoInsumoService(idProduto, idInsumo, quantidade) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabaseClient_1.supabase
            .from('produto_insumos')
            .insert({ id_produto: idProduto, id_insumo: idInsumo, quantidade_insumos: quantidade });
        return !error;
    });
}
function adicionarProdutoInsumosService(idProduto, insumosQuantidades) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!insumosQuantidades || Object.keys(insumosQuantidades).length === 0)
            return true;
        for (const [idInsumo, quantidade] of Object.entries(insumosQuantidades)) {
            const ok = yield adicionarProdutoInsumoService(idProduto, Number(idInsumo), quantidade);
            if (!ok)
                return false;
        }
        return true;
    });
}
function removerProdutoInsumoService(idProduto, idInsumo) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('produto_insumos')
            .delete()
            .eq('id_produto', idProduto)
            .eq('id_insumo', idInsumo)
            .select('id_produto');
        if (error)
            return false;
        return !!(data && data.length > 0);
    });
}
function atualizarQuantidadeProdutoInsumoService(idProduto, idInsumo, novaQuantidade) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('produto_insumos')
            .update({ quantidade_insumos: novaQuantidade })
            .eq('id_produto', idProduto)
            .eq('id_insumo', idInsumo)
            .select('id_produto');
        if (error)
            return false;
        return !!(data && data.length > 0);
    });
}
function removerTodosInsumosDoProdutoService(idProduto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabaseClient_1.supabase
            .from('produto_insumos')
            .delete()
            .eq('id_produto', idProduto);
        return !error;
    });
}
