"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_app_1 = require("./config/config_app");
const jsonErrorHandler_1 = require("./middlewares/jsonErrorHandler");
const authDocsMiddleware_1 = require("./middlewares/authDocsMiddleware");
const configuracoes_routes_1 = __importDefault(require("./routes/configuracoes.routes"));
const notification_routes_1 = __importDefault(require("./routes/notification.routes"));
const produtos_routes_1 = __importDefault(require("./routes/produtos.routes"));
const insumo_routes_1 = __importDefault(require("./routes/insumo.routes"));
const mesa_routes_1 = __importDefault(require("./routes/mesa.routes"));
const pedido_routes_1 = __importDefault(require("./routes/pedido.routes"));
const produtoInsumo_routes_1 = __importDefault(require("./routes/produtoInsumo.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const pedidoProduto_routes_1 = __importDefault(require("./routes/pedidoProduto.routes"));
const swagger_1 = require("./swagger/swagger");
const pagamento_routes_1 = __importDefault(require("./routes/pagamento.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const allowedOrigins = config_app_1.ConfigApp.allowedDomain
    ? config_app_1.ConfigApp.allowedDomain.split(',').map((origin) => origin.trim()).filter(Boolean)
    : [];
const allowAllOrigins = allowedOrigins.includes('*');
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Permite ferramentas sem origin (curl/postman/health checks).
        if (!origin)
            return callback(null, true);
        if (allowAllOrigins) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} não permitida pelo CORS`));
    },
    credentials: true,
}));
console.log('CORS allowed origins:', allowAllOrigins ? '*' : allowedOrigins);
if (!allowAllOrigins && allowedOrigins.length === 0) {
    console.warn('ALLOWED_DOMAIN vazio: requisições de navegador serão bloqueadas por CORS.');
}
app.use(express_1.default.json());
app.use(jsonErrorHandler_1.jsonErrorHandler);
app.get('/healthz', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Rotas principais
app.use('/notifications', notification_routes_1.default);
app.use('/configuracoes', configuracoes_routes_1.default);
app.use('/insumo', insumo_routes_1.default);
app.use('/mesa', mesa_routes_1.default);
app.use('/pedido', pedido_routes_1.default);
app.use('/pedido', pedidoProduto_routes_1.default);
app.use('/produtos', produtos_routes_1.default);
app.use('/produtos', produtoInsumo_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/pagamento', pagamento_routes_1.default);
app.use('/api-docs', authDocsMiddleware_1.basicAuth, swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerSpec));
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
