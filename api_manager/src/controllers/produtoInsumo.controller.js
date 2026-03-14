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
exports.listarInsumosPorProdutoController = listarInsumosPorProdutoController;
exports.adicionarProdutoInsumosController = adicionarProdutoInsumosController;
exports.removerProdutoInsumoController = removerProdutoInsumoController;
exports.atualizarQuantidadeProdutoInsumoController = atualizarQuantidadeProdutoInsumoController;
exports.removerTodosInsumosDoProdutoController = removerTodosInsumosDoProdutoController;
const produtoInsumo_service_1 = require("../services/produtoInsumo.service");
const produtos_service_1 = require("../services/produtos.service");
function listarInsumosPorProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idParam = req.params.id;
            if (!idParam || Array.isArray(idParam)) {
                return res.status(400).json({ error: 'id deve ser uma string' });
            }
            const id = parseInt(idParam, 10);
            const insumos = yield (0, produtos_service_1.getInsumosByProduto)(id);
            res.json(insumos);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar insumos do produto' });
        }
    });
}
function adicionarProdutoInsumosController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idProduto = parseInt(idParam, 10);
        const insumosQuantidades = req.body; // { id_insumo: quantidade, ... }
        const ok = yield (0, produtoInsumo_service_1.adicionarProdutoInsumosService)(idProduto, insumosQuantidades);
        if (ok)
            return res.status(201).json({ success: true });
        return res.status(400).json({ error: 'Erro ao adicionar relações produto-insumo' });
    });
}
function removerProdutoInsumoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const ok = yield (0, produtoInsumo_service_1.removerProdutoInsumoService)(idProduto, idInsumo);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao remover relação produto-insumo' });
    });
}
function atualizarQuantidadeProdutoInsumoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
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
        const ok = yield (0, produtoInsumo_service_1.atualizarQuantidadeProdutoInsumoService)(idProduto, idInsumo, quantidade);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao atualizar quantidade' });
    });
}
function removerTodosInsumosDoProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idProduto = parseInt(idParam, 10);
        const ok = yield (0, produtoInsumo_service_1.removerTodosInsumosDoProdutoService)(idProduto);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao remover todos os insumos do produto' });
    });
}
