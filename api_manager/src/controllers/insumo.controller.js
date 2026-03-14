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
exports.listarInsumosController = listarInsumosController;
exports.adicionarInsumoController = adicionarInsumoController;
exports.editarCamposInsumoController = editarCamposInsumoController;
exports.deletarInsumoController = deletarInsumoController;
const insumo_service_1 = require("../services/insumo.service");
function listarInsumosController(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const insumos = yield (0, insumo_service_1.getInsumosMap)();
            const array = Array.from(insumos.values());
            res.json(array);
        }
        catch (_a) {
            res.status(500).json({ error: 'Erro ao buscar insumos' });
        }
    });
}
function adicionarInsumoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { nome, preco = 0, categoria = '' } = req.body;
        const id = yield (0, insumo_service_1.adicionarInsumoService)(nome, preco, categoria);
        if (id)
            return res.status(201).json({ id });
        return res.status(400).json({ error: 'Erro ao adicionar insumo' });
    });
}
function editarCamposInsumoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idInsumo = parseInt(idParam, 10);
        const ok = yield (0, insumo_service_1.editarCamposInsumoService)(idInsumo, req.body);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Nenhum campo válido para atualizar ou erro ao atualizar' });
    });
}
function deletarInsumoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idParam = req.params.id;
        if (!idParam || Array.isArray(idParam)) {
            return res.status(400).json({ error: 'id deve ser uma string' });
        }
        const idInsumo = parseInt(idParam, 10);
        const ok = yield (0, insumo_service_1.deletarInsumoService)(idInsumo);
        if (ok)
            return res.json({ success: true });
        return res.status(400).json({ error: 'Erro ao deletar insumo' });
    });
}
