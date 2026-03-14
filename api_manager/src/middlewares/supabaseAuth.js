"use strict";
/// <reference path="../types/express.d.ts" />
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
exports.publicWithOptionalAuth = exports.requireAuthStaff = exports.requireAuthFuncionario = exports.requireAuthProprietario = exports.ENABLE_AUTH_MIDDLEWARE = void 0;
exports.extractUser = extractUser;
exports.requireAuth = requireAuth;
exports.requireProprietario = requireProprietario;
exports.requireFuncionario = requireFuncionario;
exports.requireProprietarioOrFuncionario = requireProprietarioOrFuncionario;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usuario_service_1 = require("../services/usuario.service");
const usuario_model_1 = require("../models/usuario.model");
const config_app_1 = require("../config/config_app");
// Variável global para ativar/desativar autenticação e autorização
exports.ENABLE_AUTH_MIDDLEWARE = config_app_1.ConfigApp.enableAuthMiddleware === 'true' || false;
console.log(exports.ENABLE_AUTH_MIDDLEWARE);
/**
 * Middleware para extrair informações do usuário do token JWT do Supabase
 * Decodifica o token e armazena as informações em req.user e req.supabaseToken
 */
function extractUser(req, res, next) {
    if (!exports.ENABLE_AUTH_MIDDLEWARE)
        return next();
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        req.supabaseToken = authHeader.replace('Bearer ', '');
        try {
            const decoded = jsonwebtoken_1.default.decode(req.supabaseToken);
            req.user = decoded;
        }
        catch (e) {
            req.user = undefined;
        }
    }
    next();
}
/**
 * Middleware básico que verifica se o usuário está autenticado
 * Verifica se existe um token válido decodificado
 */
function requireAuth(req, res, next) {
    if (!exports.ENABLE_AUTH_MIDDLEWARE)
        return next();
    if (!req.user || !req.user.sub) {
        return res.status(401).json({ error: 'Token de autenticação necessário' });
    }
    next();
}
/**
 * Middleware que verifica se o usuário é proprietário
 * Consulta o banco de dados baseado no UID do token JWT
 */
function requireProprietario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.ENABLE_AUTH_MIDDLEWARE)
            return next();
        try {
            if (!req.user || !req.user.sub) {
                return res.status(401).json({ error: 'Token de autenticação necessário' });
            }
            const uid = req.user.sub;
            const usuario = yield (0, usuario_service_1.getUserByUid)(uid);
            if (!usuario || usuario.tipoUsuario !== usuario_model_1.TipoUsuario.proprietario) {
                return res.status(403).json({ error: 'Acesso negado: apenas proprietários podem acessar este recurso' });
            }
            // Adiciona informações do usuário ao request para uso posterior
            req.userInfo = usuario;
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissões de proprietário:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}
/**
 * Middleware que verifica se o usuário é funcionário
 * Consulta o banco de dados baseado no UID do token JWT
 */
function requireFuncionario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.ENABLE_AUTH_MIDDLEWARE)
            return next();
        try {
            if (!req.user || !req.user.sub) {
                return res.status(401).json({ error: 'Token de autenticação necessário' });
            }
            const uid = req.user.sub;
            const usuario = yield (0, usuario_service_1.getUserByUid)(uid);
            if (!usuario || usuario.tipoUsuario !== usuario_model_1.TipoUsuario.funcionario) {
                return res.status(403).json({ error: 'Acesso negado: apenas funcionários podem acessar este recurso' });
            }
            req.userInfo = usuario;
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissões de funcionário:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}
/**
 * Middleware que verifica se o usuário é proprietário OU funcionário
 * Flexível para recursos que podem ser acessados por ambos os tipos
 */
function requireProprietarioOrFuncionario(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.ENABLE_AUTH_MIDDLEWARE)
            return next();
        try {
            if (!req.user || !req.user.sub) {
                return res.status(401).json({ error: 'Token de autenticação necessário' });
            }
            const uid = req.user.sub;
            const usuario = yield (0, usuario_service_1.getUserByUid)(uid);
            if (!usuario || (usuario.tipoUsuario !== usuario_model_1.TipoUsuario.proprietario && usuario.tipoUsuario !== usuario_model_1.TipoUsuario.funcionario)) {
                return res.status(403).json({ error: 'Acesso negado: apenas proprietários ou funcionários podem acessar este recurso' });
            }
            req.userInfo = usuario;
            next();
        }
        catch (error) {
            console.error('Erro ao verificar permissões:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
}
/**
 * Middleware opcional que extrai informações do usuário se autenticado
 * Não bloqueia a requisição se não houver token, útil para rotas públicas
 * que podem ter comportamento diferente se o usuário estiver logado
 */
function optionalAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.ENABLE_AUTH_MIDDLEWARE)
            return next();
        try {
            if (req.user && req.user.sub) {
                const uid = req.user.sub;
                const usuario = yield (0, usuario_service_1.getUserByUid)(uid);
                if (usuario) {
                    req.userInfo = usuario;
                }
            }
            next();
        }
        catch (error) {
            // Falha silenciosa - continua mesmo se não conseguir buscar o usuário
            console.warn('Erro ao buscar informações opcionais do usuário:', error);
            next();
        }
    });
}
// =============================================
// MIDDLEWARE COMPOSTO - Para facilitar o uso
// =============================================
/**
 * Middleware composto que extrai o usuário e verifica se é proprietário
 * Uso: app.get('/rota', requireAuthProprietario, controller)
 */
exports.requireAuthProprietario = [extractUser, requireProprietario];
/**
 * Middleware composto que extrai o usuário e verifica se é funcionário
 * Uso: app.get('/rota', requireAuthFuncionario, controller)
 */
exports.requireAuthFuncionario = [extractUser, requireFuncionario];
/**
 * Middleware composto que extrai o usuário e verifica se é proprietário OU funcionário
 * Uso: app.get('/rota', requireAuthStaff, controller)
 */
exports.requireAuthStaff = [extractUser, requireProprietarioOrFuncionario];
/**
 * Middleware composto para rotas públicas com autenticação opcional
 * Uso: app.get('/rota', publicWithOptionalAuth, controller)
 */
exports.publicWithOptionalAuth = [extractUser, optionalAuth];
