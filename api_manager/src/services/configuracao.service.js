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
exports.getHorario = getHorario;
exports.getHorarioFuncionamento = getHorarioFuncionamento;
exports.getValorFrete = getValorFrete;
exports.salvarValorFrete = salvarValorFrete;
exports.salvarHorariosFuncionamento = salvarHorariosFuncionamento;
const supabaseClient_1 = require("../utils/supabaseClient");
function getHorario() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('tabela_funcionamento')
            .select('dia_semana, hora_abertura, hora_fechamento');
        if (error)
            return null;
        return data;
    });
}
function getHorarioFuncionamento(diaSemana) {
    return __awaiter(this, void 0, void 0, function* () {
        // Deixa a primeira letra maiúscula
        const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
        const { data, error } = yield supabaseClient_1.supabase
            .from('tabela_funcionamento')
            .select('hora_abertura, hora_fechamento')
            .eq('dia_semana', diaSemanaFormatado)
            .limit(1)
            .single();
        if (error)
            return null;
        return data;
    });
}
function getValorFrete() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('tabela_frete')
            .select('valor_frete')
            .limit(1)
            .single();
        if (error || !data.valor_frete)
            return null;
        return parseFloat(data.valor_frete.toString());
    });
}
// Insere ou atualiza o valor do frete na tabela_frete
function salvarValorFrete(valorFrete) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: result, error: selectError } = yield supabaseClient_1.supabase
                .from('tabela_frete')
                .select('id, valor_frete');
            if (selectError)
                throw selectError;
            if (result && result.length > 0) {
                // Atualiza o primeiro registro
                const id = result[0].id;
                const { error: updateError } = yield supabaseClient_1.supabase
                    .from('tabela_frete')
                    .update({ valor_frete: valorFrete })
                    .eq('id', id);
                if (updateError)
                    throw updateError;
            }
            else {
                // Insere novo registro
                const { error: insertError } = yield supabaseClient_1.supabase
                    .from('tabela_frete')
                    .insert({ valor_frete: valorFrete });
                if (insertError)
                    throw insertError;
            }
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
// Insere ou atualiza horários de funcionamento na tabela_funcionamento
function salvarHorariosFuncionamento(horarios) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (const [dia, horario] of Object.entries(horarios)) {
                const { abertura, fechamento } = horario;
                // Verifica se já existe registro para o dia
                const { data: result, error: selectError } = yield supabaseClient_1.supabase
                    .from('tabela_funcionamento')
                    .select('id')
                    .eq('dia_semana', dia);
                if (selectError)
                    throw selectError;
                if (result && result.length > 0) {
                    // Atualiza registro existente
                    const id = result[0].id;
                    const { error: updateError } = yield supabaseClient_1.supabase
                        .from('tabela_funcionamento')
                        .update({
                        hora_abertura: abertura,
                        hora_fechamento: fechamento,
                    })
                        .eq('id', id);
                    if (updateError)
                        throw updateError;
                }
                else {
                    // Insere novo registro
                    const { error: insertError } = yield supabaseClient_1.supabase
                        .from('tabela_funcionamento')
                        .insert({
                        dia_semana: dia,
                        hora_abertura: abertura,
                        hora_fechamento: fechamento,
                    });
                    if (insertError)
                        throw insertError;
                }
            }
            return true;
        }
        catch (_a) {
            return false;
        }
    });
}
