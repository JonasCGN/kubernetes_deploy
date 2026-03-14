"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Produto = void 0;
class Produto {
    constructor({ id, nome, preco, categoria, urlImage, disponibilidade = true, insumos = [], }) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.urlImage = urlImage;
        this.disponibilidade = disponibilidade !== null && disponibilidade !== void 0 ? disponibilidade : true;
        this.insumos = insumos !== null && insumos !== void 0 ? insumos : [];
    }
    // Factory method para criar Produto a partir de um objeto (map)
    static fromMap(map) {
        var _a, _b, _c, _d, _e;
        return new Produto({
            id: (_a = map.id_produto) !== null && _a !== void 0 ? _a : 0,
            nome: (_b = map.nome) !== null && _b !== void 0 ? _b : '',
            preco: typeof map.preco === 'number' ? map.preco : 0,
            categoria: (_c = map.categoria) !== null && _c !== void 0 ? _c : '',
            urlImage: (_d = map.path_image) !== null && _d !== void 0 ? _d : '',
            disponibilidade: (_e = map.disponibilidade) !== null && _e !== void 0 ? _e : true,
            insumos: [], // Insumos serão carregados separadamente
        });
    }
    // Adiciona insumos ao produto (para quando carregar da relação N:N)
    setInsumos(novosInsumos) {
        this.insumos = novosInsumos;
    }
}
exports.Produto = Produto;
