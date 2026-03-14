"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoEntregaHelper = exports.TipoStatus = exports.TipoPagamento = void 0;
var TipoPagamento;
(function (TipoPagamento) {
    TipoPagamento["dinheiro"] = "dinheiro";
    TipoPagamento["cartao"] = "cartao";
    TipoPagamento["pix"] = "pix";
})(TipoPagamento || (exports.TipoPagamento = TipoPagamento = {}));
var TipoStatus;
(function (TipoStatus) {
    TipoStatus["pendente"] = "pendente";
    TipoStatus["emPreparo"] = "emPreparo";
    TipoStatus["enviado"] = "enviado";
    TipoStatus["entregue"] = "entregue";
    TipoStatus["cancelado"] = "cancelado";
})(TipoStatus || (exports.TipoStatus = TipoStatus = {}));
class TipoEntregaHelper {
    static displayName(tipo) {
        switch (tipo) {
            case 'retirada':
                return 'Retirada';
            case 'delivery':
                return 'Delivery';
            case 'mesa':
                return 'Mesa';
            default:
                return tipo;
        }
    }
    static fromString(entrega) {
        switch (entrega.toLowerCase()) {
            case 'retirada':
                return 'retirada';
            case 'delivery':
                return 'delivery';
            case 'mesa':
                return 'mesa';
            default:
                return 'retirada';
        }
    }
}
exports.TipoEntregaHelper = TipoEntregaHelper;
