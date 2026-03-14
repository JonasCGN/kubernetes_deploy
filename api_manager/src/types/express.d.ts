import { Usuario } from '../models/usuario.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string; // UID do Supabase
        email?: string;
        role?: string;
        aud?: string;
        exp?: number;
        iat?: number;
      };
      supabaseToken?: string;
      userInfo?: Usuario;
    }
  }
}

export {};