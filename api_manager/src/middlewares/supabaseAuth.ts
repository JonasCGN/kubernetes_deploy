/// <reference path="../types/express.d.ts" />

import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getUserByUid } from '../services/usuario.service';
import { TipoUsuario } from '../models/usuario.model';
import { ConfigApp } from '../config/config_app';

// Variável global para ativar/desativar autenticação e autorização
export const ENABLE_AUTH_MIDDLEWARE = ConfigApp.enableAuthMiddleware === 'true' || false;
console.log(ENABLE_AUTH_MIDDLEWARE)
// Interface para o payload do JWT do Supabase
interface SupabaseJWTPayload {
  sub: string; // UID do usuário
  email?: string;
  role?: string;
  aud?: string;
  exp?: number;
  iat?: number;
}

/**
 * Middleware para extrair informações do usuário do token JWT do Supabase
 * Decodifica o token e armazena as informações em req.user e req.supabaseToken
 */
export function extractUser(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.supabaseToken = authHeader.replace('Bearer ', '');
    try {
      const decoded = jwt.decode(req.supabaseToken) as SupabaseJWTPayload;
      req.user = decoded;
    } catch (e) {
      req.user = undefined;
    }
  }
  next();
}

/**
 * Middleware básico que verifica se o usuário está autenticado
 * Verifica se existe um token válido decodificado
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  if (!req.user || !req.user.sub) {
    return res.status(401).json({ error: 'Token de autenticação necessário' });
  }
  next();
}

/**
 * Middleware que verifica se o usuário é proprietário
 * Consulta o banco de dados baseado no UID do token JWT
 */
export async function requireProprietario(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    const uid = req.user.sub;
    const usuario = await getUserByUid(uid);

    if (!usuario || usuario.tipoUsuario !== TipoUsuario.proprietario) {
      return res.status(403).json({ error: 'Acesso negado: apenas proprietários podem acessar este recurso' });
    }

    // Adiciona informações do usuário ao request para uso posterior
    req.userInfo = usuario;
    next();
  } catch (error) {
    console.error('Erro ao verificar permissões de proprietário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

/**
 * Middleware que verifica se o usuário é funcionário
 * Consulta o banco de dados baseado no UID do token JWT
 */
export async function requireFuncionario(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    const uid = req.user.sub;
    const usuario = await getUserByUid(uid);

    if (!usuario || usuario.tipoUsuario !== TipoUsuario.funcionario) {
      return res.status(403).json({ error: 'Acesso negado: apenas funcionários podem acessar este recurso' });
    }

    req.userInfo = usuario;
    next();
  } catch (error) {
    console.error('Erro ao verificar permissões de funcionário:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

/**
 * Middleware que verifica se o usuário é proprietário OU funcionário
 * Flexível para recursos que podem ser acessados por ambos os tipos
 */
export async function requireProprietarioOrFuncionario(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  try {
    if (!req.user || !req.user.sub) {
      return res.status(401).json({ error: 'Token de autenticação necessário' });
    }

    const uid = req.user.sub;
    const usuario = await getUserByUid(uid);

    if (!usuario || (usuario.tipoUsuario !== TipoUsuario.proprietario && usuario.tipoUsuario !== TipoUsuario.funcionario)) {
      return res.status(403).json({ error: 'Acesso negado: apenas proprietários ou funcionários podem acessar este recurso' });
    }

    req.userInfo = usuario;
    next();
  } catch (error) {
    console.error('Erro ao verificar permissões:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}

/**
 * Middleware opcional que extrai informações do usuário se autenticado
 * Não bloqueia a requisição se não houver token, útil para rotas públicas
 * que podem ter comportamento diferente se o usuário estiver logado
 */
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  if (!ENABLE_AUTH_MIDDLEWARE) return next();
  try {
    if (req.user && req.user.sub) {
      const uid = req.user.sub;
      const usuario = await getUserByUid(uid);
      if (usuario) {
        req.userInfo = usuario;
      }
    }
    next();
  } catch (error) {
    // Falha silenciosa - continua mesmo se não conseguir buscar o usuário
    console.warn('Erro ao buscar informações opcionais do usuário:', error);
    next();
  }
}

// =============================================
// MIDDLEWARE COMPOSTO - Para facilitar o uso
// =============================================

/**
 * Middleware composto que extrai o usuário e verifica se é proprietário
 * Uso: app.get('/rota', requireAuthProprietario, controller)
 */
export const requireAuthProprietario = [extractUser, requireProprietario];

/**
 * Middleware composto que extrai o usuário e verifica se é funcionário
 * Uso: app.get('/rota', requireAuthFuncionario, controller)
 */
export const requireAuthFuncionario = [extractUser, requireFuncionario];

/**
 * Middleware composto que extrai o usuário e verifica se é proprietário OU funcionário
 * Uso: app.get('/rota', requireAuthStaff, controller)
 */
export const requireAuthStaff = [extractUser, requireProprietarioOrFuncionario];

/**
 * Middleware composto para rotas públicas com autenticação opcional
 * Uso: app.get('/rota', publicWithOptionalAuth, controller)
 */
export const publicWithOptionalAuth = [extractUser, optionalAuth];
