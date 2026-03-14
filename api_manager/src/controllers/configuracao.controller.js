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
exports.horarioController = horarioController;
exports.horarioDiaController = horarioDiaController;
exports.valorFreteController = valorFreteController;
exports.salvarValorFreteController = salvarValorFreteController;
exports.salvarHorariosFuncionamentoController = salvarHorariosFuncionamentoController;
const configuracao_service_1 = require("../services/configuracao.service");
function horarioController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const horario = yield (0, configuracao_service_1.getHorario)();
            res.json(horario !== null && horario !== void 0 ? horario : {});
        }
        catch (_a) {
            res.status(500).json({ error: 'Erro ao buscar horário de funcionamento' });
        }
    });
}
function horarioDiaController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const diaParam = req.params.dia;
            if (!diaParam || Array.isArray(diaParam)) {
                return res.status(400).json({ error: 'dia deve ser uma string' });
            }
            const horario = yield (0, configuracao_service_1.getHorarioFuncionamento)(diaParam);
            res.json(horario !== null && horario !== void 0 ? horario : {});
        }
        catch (_a) {
            res.status(500).json({ error: 'Erro ao buscar horário de funcionamento' });
        }
    });
}
function valorFreteController(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const valor = yield (0, configuracao_service_1.getValorFrete)();
            res.json({ valor });
        }
        catch (_a) {
            res.status(500).json({ error: 'Erro ao buscar valor do frete' });
        }
    });
}
function salvarValorFreteController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { valor } = req.body;
            if (typeof valor !== 'number') {
                return res.status(400).json({ error: 'valor Frete deve ser um número' });
            }
            const ok = yield (0, configuracao_service_1.salvarValorFrete)(valor);
            if (ok) {
                res.json({ success: true });
            }
            else {
                res.status(500).json({ error: 'Erro ao salvar valor do frete' });
            }
        }
        catch (_a) {
            res.status(500).json({ error: 'Erro ao salvar valor do frete' });
        }
    });
}
function salvarHorariosFuncionamentoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            let { horarios } = req.body;
            if (!horarios || typeof horarios !== 'object' || Array.isArray(horarios)) {
                return res.status(400).json({ error: 'horarios deve ser um objeto com os dias como chaves' });
            }
            let horariosObj = {};
            function formatTime(val) {
                if (val === null || val === undefined || val === '')
                    return null;
                if (typeof val === 'string' && /^\d{2}:\d{2}$/.test(val))
                    return val;
                if (typeof val === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(val))
                    return val.slice(0, 5);
                if (val instanceof Date) {
                    return val.toTimeString().slice(0, 5);
                }
                return null;
            }
            for (const [dia, value] of Object.entries(horarios)) {
                if (value && typeof value === 'object') {
                    const v = value;
                    let diaKey = dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                    if (diaKey === 'sabado' || diaKey === 'sábado')
                        diaKey = 'sabado';
                    horariosObj[diaKey] = {
                        abertura: formatTime(v.abertura),
                        fechamento: formatTime((_a = v.fechamento) !== null && _a !== void 0 ? _a : v.fechamentos)
                    };
                }
            }
            const ok = yield (0, configuracao_service_1.salvarHorariosFuncionamento)(horariosObj);
            if (ok) {
                res.json({ success: true });
            }
            else {
                res.status(500).json({ error: 'Erro ao salvar horários de funcionamento' });
            }
        }
        catch (e) {
            res.status(500).json({ error: 'Erro ao salvar horários de funcionamento' });
        }
    });
}
