
import * as dotenv from 'dotenv';
dotenv.config();

export class ConfigApp {
  static get supabaseUrl(): string {
    return process.env.SUPABASE_URL || '';
  }
  static get supabaseAnonKey(): string {
    return process.env.SUPABASE_ANON_KEY || '';
  }
  static get tokenApi(): string {
    return process.env.TOKEN_API || '';
  }
  static get urlEvolutionApi(): string {
    return process.env.URL_EVOLUTION_API || '';
  }
  static get apiKey(): string {
    return process.env.API_KEY || '';
  }
  static get serviceAccount(): string {
    return process.env.SERVICE_ACCOUNT || '';
  }

  static get nameInstance(): string {
    return process.env.NAME_INSTANCE || '';
  }

  static get allowedDomain(): string {
    return process.env.ALLOWED_DOMAIN || '';
  }
  
  static get swaggerUser(): string {
    return process.env.SWAGGER_USER ||   '';
  }

  static get swaggerPass(): string {
    return process.env.SWAGGER_PASS ||  '';
  }

  static get enableAuthMiddleware(): string{
    return process.env.ENABLE_AUTH_MIDDLEWARE || '';
  }
}
