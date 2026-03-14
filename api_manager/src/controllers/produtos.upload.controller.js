"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImagemProdutoController = uploadImagemProdutoController;
const supabaseClient_1 = require("../utils/supabaseClient");
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const produtos_service_1 = require("../services/produtos.service");
// Remove imagem antiga do storage
function deleteImageByUrl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!url)
            return;
        try {
            const uri = new URL(url);
            const pathIndex = uri.pathname.indexOf('/object/sign/produtos/');
            let storagePath = null;
            if (pathIndex !== -1) {
                storagePath = uri.pathname.substring(pathIndex + '/object/sign/produtos/'.length);
            }
            else {
                const publicIndex = uri.pathname.indexOf('/object/public/produtos/');
                if (publicIndex !== -1) {
                    storagePath = uri.pathname.substring(publicIndex + '/object/public/produtos/'.length);
                }
            }
            if (storagePath) {
                yield supabaseClient_1.supabase.storage.from('produtos').remove([storagePath]);
            }
        }
        catch (_a) { }
    });
}
function uploadImagemProdutoController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const idProduto = Number(req.params.id);
        if (!idProduto)
            return res.status(400).json({ error: 'ID inválido' });
        if (!req.file)
            return res.status(400).json({ error: 'Arquivo não enviado' });
        try {
            // Busca produto atual para deletar imagem antiga
            const { data: produtos, error: getError } = yield supabaseClient_1.supabase
                .from('produtos')
                .select('path_image')
                .eq('id_produto', idProduto)
                .limit(1);
            if (getError)
                return res.status(500).json({ error: 'Erro ao buscar produto', details: getError });
            const oldImage = produtos && ((_a = produtos[0]) === null || _a === void 0 ? void 0 : _a.path_image);
            // Redimensiona/comprime
            const buffer = yield (0, sharp_1.default)(req.file.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .jpeg({ quality: 90 })
                .toBuffer();
            let finalBuffer = buffer;
            let quality = 90;
            while (finalBuffer.length > 500 * 1024 && quality > 10) {
                quality -= 10;
                finalBuffer = yield (0, sharp_1.default)(req.file.buffer)
                    .resize({ width: 800, height: 800, fit: 'inside' })
                    .jpeg({ quality })
                    .toBuffer();
            }
            // Upload
            const ext = path_1.default.extname(req.file.originalname) || '.jpg';
            const fileName = `produto_${idProduto}${ext}`;
            const storagePath = `produtos/${fileName}`;
            const { data, error } = yield supabaseClient_1.supabase.storage
                .from('produtos')
                .upload(storagePath, finalBuffer, { upsert: true, contentType: req.file.mimetype });
            if (error)
                return res.status(500).json({ error: 'Erro ao fazer upload', details: error });
            // Atualiza campo no banco
            const { data: urlData } = supabaseClient_1.supabase.storage.from('produtos').getPublicUrl(storagePath);
            const publicUrl = urlData.publicUrl;
            yield (0, produtos_service_1.atualizarCamposProdutoService)(idProduto, { urlImage: publicUrl });
            // Remove imagem antiga
            if (oldImage && oldImage !== publicUrl)
                yield deleteImageByUrl(oldImage);
            return res.json({ success: true, url: publicUrl });
        }
        catch (e) {
            return res.status(500).json({ error: 'Erro ao processar imagem', details: e.message });
        }
    });
}
