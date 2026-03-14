"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigApp = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
class ConfigApp {
    static get supabaseUrl() {
        return process.env.SUPABASE_URL || '';
    }
    static get supabaseAnonKey() {
        return process.env.SUPABASE_ANON_KEY || '';
    }
    static get tokenApi() {
        return process.env.TOKEN_API || '';
    }
    static get urlEvolutionApi() {
        return process.env.URL_EVOLUTION_API || '';
    }
    static get apiKey() {
        return process.env.API_KEY || '';
    }
    static get serviceAccount() {
        return process.env.SERVICE_ACCOUNT || '';
    }
    static get nameInstance() {
        return process.env.NAME_INSTANCE || '';
    }
    static get allowedDomain() {
        return process.env.ALLOWED_DOMAIN || '';
    }
    static get swaggerUser() {
        return process.env.SWAGGER_USER || '';
    }
    static get swaggerPass() {
        return process.env.SWAGGER_PASS || '';
    }
    static get enableAuthMiddleware() {
        return process.env.ENABLE_AUTH_MIDDLEWARE || '';
    }
}
exports.ConfigApp = ConfigApp;
