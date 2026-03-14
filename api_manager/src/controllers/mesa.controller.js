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
exports.listarMesas = listarMesas;
exports.adicionarMesa = adicionarMesa;
exports.atualizarDisponibilidadeMesa = atualizarDisponibilidadeMesa;
exports.getUltimoPedidoMesa = getUltimoPedidoMesa;
const mesa_service_1 = require("../services/mesa.service");
function listarMesas(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const mesas = yield (0, mesa_service_1.listarMesasService)();
            res.json(mesas);
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar mesas', details: e.message });
        }
    });
}
function adicionarMesa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = yield (0, mesa_service_1.adicionarMesaService)();
            res.status(201).json({ id });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao adicionar mesa', details: e.message });
        }
    });
}
function atualizarDisponibilidadeMesa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idMesa = Number(req.params.id);
        const { disponibilidade } = req.body;
        if (typeof disponibilidade !== 'boolean') {
            return res.status(400).json({ error: 'Disponibilidade deve ser boolean' });
        }
        try {
            yield (0, mesa_service_1.atualizarDisponibilidadeMesaService)(idMesa, disponibilidade);
            res.json({ success: true });
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao atualizar disponibilidade', details: e.message });
        }
    });
}
function getUltimoPedidoMesa(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const idMesa = Number(req.params.id);
        try {
            const pedido = yield (0, mesa_service_1.getUltimoPedidoMesaService)(idMesa);
            if (pedido) {
                res.json(pedido);
            }
            else {
                res.status(404).json({ error: 'Nenhum pedido encontrado para esta mesa' });
            }
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao buscar último pedido', details: e.message });
        }
    });
}
