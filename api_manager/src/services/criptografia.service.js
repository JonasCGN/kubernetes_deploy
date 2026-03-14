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
exports.Criptografia = void 0;
const config_app_1 = require("../config/config_app");
const api_config_1 = require("../config/api_config");
class Criptografia {
    static get _apiBaseUrl() { return api_config_1.ApiConfig.cryptographyApiUrl; }
    static get _timeoutSeconds() { return api_config_1.ApiConfig.requestTimeout; }
    static get isEncryptionEnabled() { return api_config_1.ApiConfig.enableEncryption; }
    static encryptObjectToJsonBlob(json) {
        return __awaiter(this, void 0, void 0, function* () {
            const plainText = JSON.stringify(json);
            if (!api_config_1.ApiConfig.enableEncryption) {
                return plainText;
            }
            return yield this.encryptStringToJsonBlob(plainText);
        });
    }
    static encryptStringToJsonBlob(plainText) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!api_config_1.ApiConfig.enableEncryption) {
                return plainText;
            }
            try {
                const requestBody = JSON.stringify({ text: plainText });
                const tokenApi = config_app_1.ConfigApp.tokenApi;
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), this._timeoutSeconds * 1000);
                const response = yield fetch(`${this._apiBaseUrl}/encrypt`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenApi}`,
                        'Accept': 'application/json',
                    },
                    body: requestBody,
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                if (!response.ok) {
                    throw new Error(`API retornou erro ${response.status}: ${yield response.text()}`);
                }
                const responseData = yield response.json();
                if (responseData['success'] !== true) {
                    throw new Error(`Falha na criptografia: ${(_a = responseData['error']) !== null && _a !== void 0 ? _a : 'Erro desconhecido'}`);
                }
                const requiredFields = ['data', 'key', 'iv'];
                for (const field of requiredFields) {
                    if (!(field in responseData) || responseData[field] == null) {
                        throw new Error(`Resposta da API inválida: campo "${field}" ausente`);
                    }
                }
                const encryptedPayload = {
                    data: responseData['data'],
                    key: responseData['key'],
                    iv: responseData['iv'],
                };
                const result = JSON.stringify(encryptedPayload);
                return result;
            }
            catch (e) {
                const msg = e.toString();
                if (msg.includes('AbortError')) {
                    throw new Error('Timeout na API de criptografia. Verifique a conexão.');
                }
                else if (msg.includes('network') || msg.includes('NetworkError')) {
                    throw new Error('Erro de rede. Verifique se a API está rodando em ' + this._apiBaseUrl);
                }
                else if (msg.includes('SyntaxError')) {
                    throw new Error('Resposta inválida da API de criptografia');
                }
                else {
                    throw new Error('Erro na criptografia: ' + msg);
                }
            }
        });
    }
    static isApiAvailable() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!api_config_1.ApiConfig.enableEncryption) {
                return true;
            }
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), ((_a = api_config_1.ApiConfig.statusCheckTimeout) !== null && _a !== void 0 ? _a : 10) * 1000);
                const response = yield fetch(`${this._apiBaseUrl}/`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                return response.ok;
            }
            catch (e) {
                return false;
            }
        });
    }
    static decryptJsonBlobToString(blob) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!api_config_1.ApiConfig.enableEncryption) {
                // Se não está criptografado, pode ser string ou JSON
                try {
                    return JSON.parse(blob);
                }
                catch (_b) {
                    return blob;
                }
            }
            try {
                // blob pode ser string JSON ou objeto
                const { data, key, iv } = typeof blob === 'string' ? JSON.parse(blob) : blob;
                const requestBody = JSON.stringify({ data, key, iv });
                const tokenApi = config_app_1.ConfigApp.tokenApi;
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), this._timeoutSeconds * 1000);
                const response = yield fetch(`${this._apiBaseUrl}/decrypt`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${tokenApi}`,
                        'Accept': 'application/json',
                    },
                    body: requestBody,
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                if (!response.ok) {
                    throw new Error(`API retornou erro ${response.status}: ${yield response.text()}`);
                }
                const responseData = yield response.json();
                if (responseData['success'] !== true) {
                    throw new Error(`Falha na descriptografia: ${(_a = responseData['error']) !== null && _a !== void 0 ? _a : 'Erro desconhecido'}`);
                }
                if (!('data' in responseData)) {
                    throw new Error('Resposta da API inválida: campo "data" ausente');
                }
                // Pode ser string ou JSON
                try {
                    return JSON.parse(responseData['data']);
                }
                catch (_c) {
                    return responseData['data'];
                }
            }
            catch (e) {
                const msg = e.toString();
                if (msg.includes('AbortError')) {
                    throw new Error('Timeout na API de criptografia. Verifique a conexão.');
                }
                else if (msg.includes('network') || msg.includes('NetworkError')) {
                    throw new Error('Erro de rede. Verifique se a API está rodando em ' + this._apiBaseUrl);
                }
                else if (msg.includes('SyntaxError')) {
                    throw new Error('Resposta inválida da API de criptografia');
                }
                else {
                    throw new Error('Erro na descriptografia: ' + msg);
                }
            }
        });
    }
    static getApiInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!api_config_1.ApiConfig.enableEncryption) {
                return {
                    message: 'Modo desenvolvimento - Criptografia desabilitada',
                    version: 'local',
                    encryption_enabled: false,
                };
            }
            try {
                const response = yield fetch(`${this._apiBaseUrl}/`, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                });
                if (response.ok) {
                    const data = yield response.json();
                    data['encryption_enabled'] = true;
                    return data;
                }
                return null;
            }
            catch (e) {
                return null;
            }
        });
    }
}
exports.Criptografia = Criptografia;
