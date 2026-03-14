"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Insumo = void 0;
class Insumo {
    constructor({ id, nome, categoria = '', preco = 2 }) {
        this.id = id;
        this.nome = nome;
        this.categoria = categoria !== null && categoria !== void 0 ? categoria : '';
        this.preco = preco !== null && preco !== void 0 ? preco : 2;
    }
    // Factory method para criar Insumo a partir de um objeto (map)
    static fromMap(map) {
        var _a, _b, _c, _d;
        return new Insumo({
            id: (_a = map.id_insumo) !== null && _a !== void 0 ? _a : 0,
            nome: (_b = map.nome) !== null && _b !== void 0 ? _b : '',
            categoria: (_c = map.categoria) !== null && _c !== void 0 ? _c : '',
            preco: (_d = map.preco) !== null && _d !== void 0 ? _d : 2,
        });
    }
    // Factory method para compatibilidade com JSON
    static fromJson(json) {
        return Insumo.fromMap(json);
    }
    // Converte para objeto (para salvar no banco)
    toMap() {
        return {
            id_insumo: this.id,
            nome: this.nome,
            categoria: this.categoria,
            preco: this.preco,
        };
    }
}
exports.Insumo = Insumo;
