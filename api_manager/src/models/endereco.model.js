"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Endereco = void 0;
class Endereco {
    constructor(rua, numero, bairro, complemento, informacaoAdicional) {
        this.rua = rua;
        this.numero = numero;
        this.bairro = bairro;
        this.complemento = complemento;
        this.informacaoAdicional = informacaoAdicional;
    }
    static fromJson(json) {
        var _a, _b, _c;
        return new Endereco((_a = json.rua) !== null && _a !== void 0 ? _a : '', (_b = json.numero) !== null && _b !== void 0 ? _b : '', (_c = json.bairro) !== null && _c !== void 0 ? _c : '', json.complemento, json.ponto_referencia);
    }
    toJson() {
        const json = {
            rua: this.rua,
            numero: this.numero,
            bairro: this.bairro,
        };
        if (this.complemento)
            json.complemento = this.complemento;
        if (this.informacaoAdicional)
            json.ponto_referencia = this.informacaoAdicional;
        return json;
    }
    get enderecoCompleto() {
        let texto = `${this.rua}, ${this.numero} - ${this.bairro}`;
        if (this.complemento && this.complemento.trim()) {
            texto += ` (${this.complemento})`;
        }
        return texto;
    }
    get enderecoResumo() {
        return `${this.rua}, ${this.numero} - ${this.bairro}`;
    }
    toString() {
        return this.enderecoCompleto;
    }
    isEqual(outro) {
        return (this.rua === outro.rua &&
            this.numero === outro.numero &&
            this.bairro === outro.bairro &&
            this.complemento === outro.complemento &&
            this.informacaoAdicional === outro.informacaoAdicional);
    }
}
exports.Endereco = Endereco;
