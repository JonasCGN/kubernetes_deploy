"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicAuth = basicAuth;
const config_app_1 = require("../config/config_app");
// Middleware simples de autenticação básica
function basicAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Basic ')) {
        res.set('WWW-Authenticate', 'Basic realm="API Docs"');
        return res.status(401).send('Authentication required.');
    }
    const base64Credentials = auth.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    // Defina usuário e senha seguros via variáveis de ambiente
    const validUser = config_app_1.ConfigApp.swaggerUser;
    const validPass = config_app_1.ConfigApp.swaggerPass;
    if (username === validUser && password === validPass) {
        return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="API Docs"');
    return res.status(401).send('Authentication failed.');
}
