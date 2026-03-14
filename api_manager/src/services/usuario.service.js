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
exports.getUserByUid = getUserByUid;
const supabaseClient_1 = require("../utils/supabaseClient");
const usuario_model_1 = require("../models/usuario.model");
const criptografia_service_1 = require("./criptografia.service");
function getUserByUid(uid) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('usuarios')
            .select('*')
            .eq('uid', uid)
            .single();
        let cpf = data["cpf"];
        try {
            if (cpf) {
                // Se for string JSON, parse antes de descriptografar
                if (typeof cpf === 'string' && cpf.trim().startsWith('{')) {
                    cpf = yield criptografia_service_1.Criptografia.decryptJsonBlobToString(cpf);
                    data["cpf"] = cpf;
                }
            }
        }
        catch (e) {
            // Se falhar, retorna o valor original
        }
        if (error || !data)
            return null;
        return usuario_model_1.Usuario.fromJson(data);
    });
}
