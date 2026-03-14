# 🔐 Guia de Autenticação e Autorização - API Manager

## Visão Geral

Este sistema implementa autenticação baseada em JWT do Supabase com autorização granular usando middlewares que espelham as políticas RLS (Row Level Security) do banco de dados.

## 🏗️ Arquitetura

### Token Flow
1. **Frontend** obtém `accessToken` do Supabase: `supabase.auth.session?.access_token`
2. **Request** inclui token no header: `Authorization: Bearer <access_token>`
3. **Middleware** extrai e decodifica o token JWT
4. **Verificação** consulta tabela `usuarios` usando o UID do token
5. **Autorização** baseada no campo `usuario` (proprietario/funcionario)

## 🔧 Middlewares Disponíveis

### Middlewares Básicos

#### `extractUser`
```typescript
// Extrai informações do token JWT e adiciona ao req.user
app.use(extractUser);
```

#### `requireAuth` 
```typescript
// Verifica se há token válido
app.get('/protected', extractUser, requireAuth, controller);
```

### Middlewares de Autorização

#### `requireProprietario`
```typescript
// Apenas proprietários podem acessar
app.delete('/produtos/:id', extractUser, requireProprietario, deleteProduto);
```

#### `requireFuncionario`
```typescript
// Apenas funcionários podem acessar  
app.get('/relatorios', extractUser, requireFuncionario, getRelatorios);
```

#### `requireProprietarioOrFuncionario`
```typescript
// Proprietários OU funcionários podem acessar
app.post('/produtos', extractUser, requireProprietarioOrFuncionario, createProduto);
```

#### `optionalAuth`
```typescript
// Autenticação opcional - não bloqueia se não autenticado
app.get('/produtos', extractUser, optionalAuth, listProdutos);
```

### Middlewares Compostos (Recomendados)

#### `requireAuthProprietario`
```typescript
// Composição: extractUser + requireProprietario
app.delete('/insumos/:id', requireAuthProprietario, deleteInsumo);
```

#### `requireAuthFuncionario`
```typescript
// Composição: extractUser + requireFuncionario
app.get('/dashboard', requireAuthFuncionario, getDashboard);
```

#### `requireAuthStaff`
```typescript
// Composição: extractUser + requireProprietarioOrFuncionario
app.patch('/produtos/:id', requireAuthStaff, updateProduto);
```

#### `publicWithOptionalAuth`
```typescript
// Composição: extractUser + optionalAuth
app.get('/cardapio', publicWithOptionalAuth, getCardapio);
```

## 🎯 Padrões de Uso por Operação

### Operações Públicas
```typescript
// Listagem de produtos para clientes
router.get('/produtos', listarProdutos); // Sem middleware
```

### Operações de Staff (Funcionário + Proprietário)
```typescript
// Criação e edição geral
router.post('/produtos', requireAuthStaff, criarProduto);
router.patch('/produtos/:id', requireAuthStaff, editarProduto);
router.patch('/produtos/:id/disponibilidade', requireAuthStaff, toggleDisponibilidade);
```

### Operações Restritas (Apenas Proprietário)
```typescript
// Operações críticas/destrutivas
router.delete('/produtos/:id', requireAuthProprietario, deletarProduto);
router.delete('/insumos/:id', requireAuthProprietario, deletarInsumo);
router.post('/usuarios', requireAuthProprietario, criarUsuario);
```

### Operações com Auth Opcional
```typescript
// Comportamento diferente para usuários logados
router.get('/cardapio', publicWithOptionalAuth, (req, res) => {
  if (req.userInfo) {
    // Usuário logado - mostrar preços especiais
    return res.json(cardapioComDesconto);
  }
  // Usuário não logado - cardapio normal
  return res.json(cardapioPublico);
});
```

## 🔍 Propriedades Disponíveis no Request

Após aplicar os middlewares, o objeto `req` terá:

```typescript
interface Request {
  user?: {
    sub: string;      // UID do Supabase
    email?: string;   // Email do usuário
    role?: string;    // Role do JWT
    exp?: number;     // Expiração do token
    iat?: number;     // Issued at
  };
  supabaseToken?: string;  // Token JWT original
  userInfo?: Usuario;      // Objeto Usuario completo do banco
}
```

### Exemplo de uso no controller:
```typescript
export async function meuController(req: Request, res: Response) {
  const uid = req.user?.sub;           // UID do Supabase
  const usuario = req.userInfo;        // Dados completos do usuário
  const isProprietario = usuario?.tipoUsuario === TipoUsuario.proprietario;
  
  // Lógica do controller...
}
```

## 🚨 Tratamento de Erros

### Respostas de Erro Padrão

#### 401 - Token Necessário
```json
{
  "error": "Token de autenticação necessário"
}
```

#### 403 - Acesso Negado
```json
{
  "error": "Acesso negado: apenas proprietários podem acessar este recurso"
}
```

#### 500 - Erro Interno
```json
{
  "error": "Erro interno do servidor"
}
```

## 📱 Exemplo de Integração Frontend

### Flutter/Dart
```dart
final token = Supabase.instance.client.auth.currentSession?.accessToken;

final response = await http.post(
  Uri.parse('$apiUrl/produtos'),
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer $token',
  },
  body: jsonEncode(produtoData),
);
```

### JavaScript
```javascript
const token = supabase.auth.session?.access_token;

const response = await fetch('/api/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(produtoData)
});
```

## 🛡️ Segurança e Boas Práticas

### ✅ Fazer
- Sempre usar middlewares compostos quando possível
- Verificar `req.userInfo` nos controllers para lógica adicional
- Implementar rate limiting em rotas públicas
- Logs de auditoria para operações críticas

### ❌ Evitar
- Misturar diferentes tipos de autenticação na mesma rota
- Confiar apenas no token JWT sem verificar o banco
- Expor informações sensíveis em respostas de erro
- Usar autenticação obrigatória em rotas verdadeiramente públicas

## 🔄 Alinhamento com RLS

Os middlewares foram desenhados para espelhar exatamente as políticas RLS do Supabase:

```sql
-- Política espelhada no middleware requireAuthStaff
CREATE POLICY "consolidated_access_produtos" ON produtos
FOR ALL USING (
  (SELECT auth.role()) = 'anon' OR
  (SELECT public.is_funcionario()) OR
  (SELECT public.is_proprietario())
);
```

Isso garante dupla proteção: tanto no nível de aplicação quanto no banco de dados.
