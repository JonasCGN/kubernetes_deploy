"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseConfig = void 0;
const config_app_1 = require("./config_app");
/**
 * Configurações do Supabase
 * IMPORTANTE: Nunca commite suas credenciais reais para o repositório público!
 * Para obter suas credenciais:
 * 1. Acesse https://supabase.com/dashboard
 * 2. Selecione seu projeto
 * 3. Vá em Settings > API
 * 4. Copie a URL e a chave anônima (anon key)
 */
class SupabaseConfig {
}
exports.SupabaseConfig = SupabaseConfig;
// SUBSTITUA PELOS SEUS VALORES REAIS NO .env
SupabaseConfig.url = config_app_1.ConfigApp.supabaseUrl;
SupabaseConfig.anonKey = config_app_1.ConfigApp.supabaseAnonKey;
// Configurações opcionais
SupabaseConfig.debugMode = true;
SupabaseConfig.timeout = 30; // segundos
// Exemplo de uso:
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(SupabaseConfig.url, SupabaseConfig.anonKey);
/// Exemplo de como usar a classe PgSupabase:
/// 
/// ```dart
/// // 1. Inicialize no main.dart ou antes de usar
/// await PgSupabase.initialize(
///   url: SupabaseConfig.url,
///   anonKey: SupabaseConfig.anonKey,
/// );
/// 
/// // 2. Use a instância singleton
/// final db = PgSupabase.instance;
/// 
/// // 3. Exemplos de uso:
/// 
/// // Buscar dados (produtos, categorias, etc.)
/// final produtos = await db.select(
///   table: 'produtos',
///   where: {'disponibilidade': true},
///   orderBy: 'nome',
///   limit: 10,
/// );
/// 
/// // Inserir pedido
/// await db.insert(
///   table: 'pedidos',
///   data: {
///     'cliente_nome': 'João Silva',
///     'itens': jsonEncode([
///       {'produto_id': 1, 'quantidade': 2, 'preco': 15.50},
///       {'produto_id': 3, 'quantidade': 1, 'preco': 8.00},
///     ]),
///     'total': 39.00,
///     'status': 'pendente',
///   },
/// );
/// 
/// // Executar função RPC
/// final resultado = await db.rpc(
///   functionName: 'calcular_total_pedido',
///   params: {'pedido_id': 123},
/// );
/// ```
