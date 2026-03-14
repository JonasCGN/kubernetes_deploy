import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    supabaseToken?: string;
    user?: any; // Você pode tipar melhor se quiser
  }
}
