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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProdutos = getProdutos;
exports.getInsumosByProduto = getInsumosByProduto;
exports.getProdutosComInsumos = getProdutosComInsumos;
exports.atualizarCamposProdutoService = atualizarCamposProdutoService;
exports.atualizarDisponibilidadeProdutoService = atualizarDisponibilidadeProdutoService;
exports.adicionarProdutoService = adicionarProdutoService;
exports.deletarProdutoService = deletarProdutoService;
const insumo_model_1 = require("../models/insumo.model");
const produto_model_1 = require("../models/produto.model");
const supabaseClient_1 = require("../utils/supabaseClient");
function getProdutos() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('produtos')
            .select('id_produto, nome, preco, categoria, path_image, disponibilidade')
            .order('categoria', { ascending: true })
            .order('nome', { ascending: true });
        if (error)
            throw error;
        return data.map(p => new produto_model_1.Produto({
            id: p.id_produto,
            nome: p.nome,
            preco: p.preco,
            categoria: p.categoria,
            disponibilidade: p.disponibilidade,
            urlImage: p.path_image,
            insumos: [],
        }));
    });
}
function getInsumosByProduto(id_produto) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('produto_insumos')
            .select('insumos(id_insumo, nome)')
            .eq('id_produto', id_produto);
        if (error)
            throw error;
        return (data !== null && data !== void 0 ? data : []).map(d => {
            const insumo = Array.isArray(d.insumos) ? d.insumos[0] : d.insumos;
            return new insumo_model_1.Insumo({
                id: insumo.id_insumo,
                nome: insumo.nome,
            });
        });
    });
}
function getProdutosComInsumos() {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield supabaseClient_1.supabase
            .from('produtos')
            .select(`
      id_produto,
      nome,
      preco,
      categoria,
      path_image,
      disponibilidade,
      produto_insumos(
        quantidade_insumos,
        insumos:insumos(
          id_insumo,
          nome
        )
      )
    `)
            .order('categoria', { ascending: true })
            .order('nome', { ascending: true });
        if (error)
            throw error;
        return (data !== null && data !== void 0 ? data : []).map(p => {
            var _a;
            const insumosArr = ((_a = p.produto_insumos) !== null && _a !== void 0 ? _a : []).map((pi) => {
                const insumo = pi.insumos;
                return {
                    insumo: new insumo_model_1.Insumo({
                        id: insumo === null || insumo === void 0 ? void 0 : insumo.id_insumo,
                        nome: insumo === null || insumo === void 0 ? void 0 : insumo.nome,
                    }),
                    quantidade: pi.quantidade_insumos
                };
            });
            const produto = new produto_model_1.Produto({
                id: p.id_produto,
                nome: p.nome,
                preco: p.preco,
                categoria: p.categoria,
                disponibilidade: p.disponibilidade,
                urlImage: p.path_image,
                insumos: insumosArr
            });
            return produto;
        });
    });
}
function atualizarCamposProdutoService(idProduto, campos) {
    return __awaiter(this, void 0, void 0, function* () {
        // Mapeia campos do objeto Produto para os campos da tabela
        const camposTabela = {};
        if (campos.nome !== undefined)
            camposTabela['nome'] = campos.nome;
        if (campos.preco !== undefined)
            camposTabela['preco'] = campos.preco;
        if (campos.categoria !== undefined)
            camposTabela['categoria'] = campos.categoria;
        if (campos.urlImage !== undefined)
            camposTabela['path_image'] = campos.urlImage;
        if (campos.disponibilidade !== undefined)
            camposTabela['disponibilidade'] = campos.disponibilidade;
        if (Object.keys(camposTabela).length === 0)
            return false;
        const { error } = yield supabaseClient_1.supabase
            .from('produtos')
            .update(camposTabela)
            .eq('id_produto', idProduto);
        if (error)
            return false;
        return true;
    });
}
function atualizarDisponibilidadeProdutoService(idProduto, disponibilidade) {
    return __awaiter(this, void 0, void 0, function* () {
        const { error } = yield supabaseClient_1.supabase
            .from('produtos')
            .update({ disponibilidade })
            .eq('id_produto', idProduto);
        if (error)
            return false;
        return true;
    });
}
function adicionarProdutoService(produto) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { data, error } = yield supabaseClient_1.supabase
            .from('produtos')
            .insert({
            nome: produto.nome,
            preco: produto.preco,
            categoria: produto.categoria,
            path_image: produto.urlImage,
            disponibilidade: produto.disponibilidade,
        })
            .select('id_produto');
        if (error || !data || !((_a = data[0]) === null || _a === void 0 ? void 0 : _a.id_produto))
            return null;
        return data[0].id_produto;
    });
}
function deletarProdutoService(idProduto) {
    return __awaiter(this, void 0, void 0, function* () {
        // Remove todas as relações produto-insumo primeiro
        yield supabaseClient_1.supabase.from('produto_insumos').delete().eq('id_produto', idProduto);
        // Depois remove o produto
        const { data, error } = yield supabaseClient_1.supabase
            .from('produtos')
            .delete()
            .eq('id_produto', idProduto)
            .select('id_produto');
        if (error)
            return false;
        return !!(data && data.length > 0);
    });
}
