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
exports.listarProdutosController = listarProdutosController;
exports.listarProdutosComInsumosController = listarProdutosComInsumosController;
exports.atualizarCamposProdutoController = atualizarCamposProdutoController;
exports.atualizarDisponibilidadeProdutoController = atualizarDisponibilidadeProdutoController;
exports.adicionarProdutoController = adicionarProdutoController;
exports.deletarProdutoController = deletarProdutoController;
const produto_model_1 = require("../models/produto.model");
const produtos_service_1 = require("../services/produtos.service");
function listarProdutosController(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const produtos = yield (0, produtos_service_1.getProdutos)();
            res.json(produtos);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    });
}
function listarProdutosComInsumosController(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const produtos = yield (0, produtos_service_1.getProdutosComInsumos)();
            res.json(produtos);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar produtos com insumos' });
        }
    });
}
function atualizarCamposProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idProduto = parseInt(idParam, 10);
        const campos = req.body;
        const ok = yield (0, produtos_service_1.atualizarCamposProdutoService)(idProduto, campos);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Nenhum campo válido para atualizar ou erro ao atualizar' });
    });
}
function atualizarDisponibilidadeProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idProduto = parseInt(idParam, 10);
        const { disponibilidade } = req.body;
        if (typeof disponibilidade !== 'boolean') {
            return res.status(400).json({ error: 'Disponibilidade deve ser boolean' });
        }
        const ok = yield (0, produtos_service_1.atualizarDisponibilidadeProdutoService)(idProduto, disponibilidade);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao atualizar disponibilidade' });
    });
}
function adicionarProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const produto = new produto_model_1.Produto(req.body);
            const id = yield (0, produtos_service_1.adicionarProdutoService)(produto);
            if (id)
                return res.status(201).json({ id });
            return res.status(400).json({ error: 'Erro ao adicionar produto' });
        }
        catch (e) {
            return res.status(400).json({ error: 'Erro ao adicionar produto', details: e.message });
        }
    });
}
function deletarProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idProduto = parseInt(idParam, 10);
        const ok = yield (0, produtos_service_1.deletarProdutoService)(idProduto);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao deletar produto' });
    });
}
