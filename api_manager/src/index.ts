import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { ConfigApp } from './config/config_app';

import { jsonErrorHandler } from './middlewares/jsonErrorHandler';
import { basicAuth } from './middlewares/authDocsMiddleware';

import configuracaoRoutes from './routes/configuracoes.routes';
import notificationRoutes from './routes/notification.routes';
import produtosRoutes from './routes/produtos.routes';
import insumoRoutes from './routes/insumo.routes';
import mesaRoutes from './routes/mesa.routes';
import pedidoRoutes from './routes/pedido.routes';
import produtoInsumoRoutes from './routes/produtoInsumo.routes';
import userRoutes from './routes/user.routes';

import pedidoProdutoRoutes from './routes/pedidoProduto.routes';
import { swaggerSpec, swaggerUi } from './swagger/swagger';
import pagamentoRoutes from './routes/pagamento.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ConfigApp.allowedDomain
  ? ConfigApp.allowedDomain.split(',').map((origin) => origin.trim()).filter(Boolean)
  : [];
const allowAllOrigins = allowedOrigins.includes('*');

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite ferramentas sem origin (curl/postman/health checks).
      if (!origin) return callback(null, true);

      if (allowAllOrigins) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} não permitida pelo CORS`));
    },
    credentials: true,
  }),
);

console.log('CORS allowed origins:', allowAllOrigins ? '*' : allowedOrigins);

if (!allowAllOrigins && allowedOrigins.length === 0) {
  console.warn('ALLOWED_DOMAIN vazio: requisições de navegador serão bloqueadas por CORS.');
}

app.use(express.json());
app.use(jsonErrorHandler);

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Rotas principais
app.use('/notifications', notificationRoutes);

app.use('/configuracoes', configuracaoRoutes);
app.use('/insumo', insumoRoutes);
app.use('/mesa', mesaRoutes);

app.use('/pedido', pedidoRoutes);
app.use('/pedido', pedidoProdutoRoutes);

app.use('/produtos', produtosRoutes);
app.use('/produtos', produtoInsumoRoutes);

app.use('/users', userRoutes);

app.use('/pagamento', pagamentoRoutes);

app.use('/api-docs', basicAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
