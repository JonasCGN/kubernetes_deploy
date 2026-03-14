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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiEvolution = void 0;
const axios_1 = __importDefault(require("axios"));
const config_app_1 = require("../config/config_app");
class ApiEvolution {
    static sendMessage(numero, message) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const url = `${this.urlEvolution}/message/sendText/${encodeURIComponent(this.nomeInstancia)}`;
            try {
                const response = yield axios_1.default.post(url, {
                    number: `55${numero}`,
                    text: message,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': this.apiKey,
                    }
                });
                return response.status;
            }
            catch (error) {
                console.error('Erro ao enviar mensagem:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                return 0;
            }
        });
    }
}
exports.ApiEvolution = ApiEvolution;
ApiEvolution.urlEvolution = "https://evolution.kuatech.com.br";
ApiEvolution.nomeInstancia = config_app_1.ConfigApp.nameInstance || '';
ApiEvolution.apiKey = config_app_1.ConfigApp.apiKey || '';
