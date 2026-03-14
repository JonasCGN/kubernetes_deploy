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
exports.Compra = void 0;
const compra_1 = require("../types/compra");
class Compra {
    constructor(params) {
        var _a, _b, _c;
        this.id = params.id;
        this.nomePessoa = params.nomePessoa;
        this.telefone = params.telefone;
        this.tipoPagamento = params.tipoPagamento;
        this.status = (_a = params.status) !== null && _a !== void 0 ? _a : compra_1.TipoStatus.pendente;
        this.tipoEntrega = params.tipoEntrega;
        this.endereco = params.endereco;
        this.frete = params.frete;
        this.dataPedido = (_b = params.dataPedido) !== null && _b !== void 0 ? _b : new Date();
        this.itens = (_c = params.itens) !== null && _c !== void 0 ? _c : [];
    }
    get valorTotal() {
        return this.itens.reduce((total, item) => total + item.precoTotal, 0);
    }
    get quantidadeTotal() {
        return this.itens.reduce((total, item) => total + item.quantidade, 0);
    }
    get isEmpty() {
        return this.itens.length === 0;
    }
    get isNotEmpty() {
        return this.itens.length > 0;
    }
    adicionarItem(novoItem) {
        const novosItens = [...this.itens];
        const index = novosItens.findIndex(item => item.equals(novoItem));
        if (index !== -1) {
            novosItens[index].quantidade += novoItem.quantidade;
        }
        else {
            novosItens.push(novoItem);
        }
        return this.copyWith({ itens: novosItens });
    }
    removerItem(itemParaRemover) {
        const novosItens = this.itens.filter(item => !item.equals(itemParaRemover));
        return this.copyWith({ itens: novosItens });
    }
    atualizarQuantidadeItem(item, novaQuantidade) {
        const novosItens = this.itens.map(i => {
            if (i.equals(item)) {
                if (novaQuantidade <= 0)
                    return null;
                i.setQuantidade(novaQuantidade);
            }
            return i;
        }).filter(Boolean);
        return this.copyWith({ itens: novosItens });
    }
    limparItens() {
        return this.copyWith({ itens: [] });
    }
    copyWith(params) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        return new Compra({
            id: (_a = params.id) !== null && _a !== void 0 ? _a : this.id,
            nomePessoa: (_b = params.nomePessoa) !== null && _b !== void 0 ? _b : this.nomePessoa,
            telefone: (_c = params.telefone) !== null && _c !== void 0 ? _c : this.telefone,
            tipoPagamento: (_d = params.tipoPagamento) !== null && _d !== void 0 ? _d : this.tipoPagamento,
            status: (_e = params.status) !== null && _e !== void 0 ? _e : this.status,
            tipoEntrega: (_f = params.tipoEntrega) !== null && _f !== void 0 ? _f : this.tipoEntrega,
            endereco: (_g = params.endereco) !== null && _g !== void 0 ? _g : this.endereco,
            frete: (_h = params.frete) !== null && _h !== void 0 ? _h : this.frete,
            dataPedido: (_j = params.dataPedido) !== null && _j !== void 0 ? _j : this.dataPedido,
            itens: (_k = params.itens) !== null && _k !== void 0 ? _k : this.itens,
        });
    }
    // O método toMap depende de criptografia, ajuste conforme sua implementação
    toMap(Criptografia) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = {};
            if (this.id != null)
                map['id_pedido'] = this.id;
            map['nome_pessoa'] = this.nomePessoa;
            map['telefone'] = yield Criptografia.encryptStringToJsonBlob(this.telefone);
            map['pagamento'] = this.tipoPagamento;
            map['status'] = this.status;
            map['entrega'] = this.tipoEntrega;
            map['data_pedido'] = this.dataPedido.toISOString();
            if (this.tipoEntrega === 'delivery') {
                if (this.endereco) {
                    map['endereco'] = yield Criptografia.encryptObjectToJsonBlob(this.endereco.toJson());
                }
                else {
                    map['endereco'] = null;
                }
            }
            else {
                map['endereco'] = null;
            }
            return map;
        });
    }
    toString() {
        let resumo = '🛒 *Resumo do Pedido*\n';
        resumo += `👤 Cliente: ${this.nomePessoa}\n`;
        resumo += `📞 Telefone: ${this.telefone}\n`;
        resumo += `💳 Pagamento: ${this.tipoPagamento.toUpperCase()}\n`;
        resumo += `🚚 Entrega: ${compra_1.TipoEntregaHelper.displayName(this.tipoEntrega)}\n`;
        if (this.tipoEntrega === 'delivery' && this.endereco) {
            resumo += `🏠 Endereço: ${this.endereco.toString()}\n`;
        }
        resumo += '\n*Itens do pedido:*\n';
        for (const item of this.itens) {
            resumo += `• ${item.quantidade}x ${item.produto.nome} - R$${item.precoTotal.toFixed(2)}\n`;
        }
        resumo += `\n🔢 Total de itens: ${this.quantidadeTotal}\n`;
        resumo += `💰 *Valor total dos itens: R$${this.valorTotal.toFixed(2)}*\n`;
        if (this.tipoEntrega === 'delivery' && this.frete != null && this.frete > 0) {
            resumo += `🚚 Frete: R$${this.frete.toFixed(2)}\n`;
            resumo += `💰 *Valor total com frete: R$${(this.valorTotal + this.frete).toFixed(2)}*\n`;
        }
        else {
            resumo += `💰 *Valor total: R$${this.valorTotal.toFixed(2)}*\n`;
        }
        resumo += '\nObrigado pelo seu pedido! 😊';
        return resumo;
    }
}
exports.Compra = Compra;
