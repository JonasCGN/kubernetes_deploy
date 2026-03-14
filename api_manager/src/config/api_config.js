"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfig = void 0;
class ApiConfig {
}
exports.ApiConfig = ApiConfig;
/**
 * ATIVAR/DESATIVAR CRIPTOGRAFIA
 * true = usa criptografia via API
 * false = retorna dados sem criptografia (apenas para desenvolvimento)
 */
ApiConfig.enableEncryption = true;
/**
 * URL base da API de criptografia
 * Mude para o endereço do seu servidor em produção
 */
ApiConfig.cryptographyApiUrl = 'https://apicriptografia.kuatech.com.br/';
/**
 * Timeout para requisições da API (em segundos)
 */
ApiConfig.requestTimeout = 30;
/**
 * Timeout para verificação de status da API (em segundos)
 */
ApiConfig.statusCheckTimeout = 5;
