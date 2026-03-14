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
exports.getInsumosMap = getInsumosMap;
exports.adicionarInsumoService = adicionarInsumoService;
exports.editarCamposInsumoService = editarCamposInsumoService;
exports.deletarInsumoService = deletarInsumoService;
const supabaseClient_1 = require("../utils/supabaseClient");
const insumo_model_1 = require("../models/insumo.model");
function getInsumosMap() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('insumos')
            .select('*')
            .order('nome');
        if (error)
            throw error;
        const map = new Map();
        data === null || data === void 0 ? void 0 : data.forEach((item) => {
            map.set(item.id_insumo, new insumo_model_1.Insumo({
                id: item.id_insumo,
                nome: item.nome,
                categoria: item.categoria,
                preco: item.preco,
            }));
        });
        return map;
    });
}
function adicionarInsumoService(nome_1) {
    return __awaiter(this, arguments, void 0, function* (nome, preco = 0.0, categoria = '') {
        var _a;
        const { data, error } = yield supabaseClient_1.supabase
            .from('insumos')
            .insert({ nome, preco, categoria })
            .select('id_insumo');
        if (error || !data || !((_a = data[0]) === null || _a === void 0 ? void 0 : _a.id_insumo))
            return null;
        return data[0].id_insumo;
    });
}
function editarCamposInsumoService(idInsumo, campos) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!campos || Object.keys(campos).length === 0)
            return false;
        const { error } = yield supabaseClient_1.supabase
            .from('insumos')
            .update(campos)
            .eq('id_insumo', idInsumo);
        return !error;
    });
}
function deletarInsumoService(idInsumo) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove relações produto-insumo primeiro
        yield supabaseClient_1.supabase.from('produto_insumos').delete().eq('id_insumo', idInsumo);
        const { data, error } = yield supabaseClient_1.supabase
            .from('insumos')
            .delete()
            .eq('id_insumo', idInsumo)
            .select('id_insumo');
        if (error)
            return false;
        return !!(data && data.length > 0);
    });
}
