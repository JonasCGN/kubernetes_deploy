"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemCompra = void 0;
class ItemCompra {
    constructor(params) {
        var _a, _b;
        this.produto = params.produto;
        this.quantidade = (_a = params.quantidade) !== null && _a !== void 0 ? _a : 1;
        this.insumosPersonalizados = (_b = params.insumosPersonalizados) !== null && _b !== void 0 ? _b : [];
        this.observacoes = params.observacoes;
    }
    get precoTotal() {
        return this.produto.preco * this.quantidade;
    }
    incrementarQuantidade() {
        this.quantidade++;
    }
    decrementarQuantidade() {
        if (this.quantidade > 1) {
            this.quantidade--;
        }
    }
    setQuantidade(novaQuantidade) {
        if (novaQuantidade > 0) {
            this.quantidade = novaQuantidade;
        }
    }
    toMap() {
        return {
            id_produto: this.produto.id,
            quantidade: this.quantidade,
            insumos_personalizados: this.insumosPersonalizados.map(i => i.id),
            observacoes: this.observacoes,
        };
    }
    static fromMap(map, produto) {
        var _a;
        return new ItemCompra({
            produto: produto,
            quantidade: (_a = map['quantidade']) !== null && _a !== void 0 ? _a : 1,
            insumosPersonalizados: [], // Carregar separadamente se necessário
            observacoes: map['observacoes'],
        });
    }
    equals(other) {
        return (other.produto.id === this.produto.id &&
            other.observacoes === this.observacoes
        // Não compara insumos personalizados para simplificar
        );
    }
    toString() {
        return `ItemCompra(produto: ${this.produto.nome}, quantidade: ${this.quantidade}, precoTotal: R$${this.precoTotal})`;
    }
}
exports.ItemCompra = ItemCompra;
