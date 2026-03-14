export enum TipoPagamento {
  dinheiro = 'dinheiro',
  cartao = 'cartao',
  pix = 'pix',
}

export enum TipoStatus {
  pendente = 'pendente',
  emPreparo = 'emPreparo',
  enviado = 'enviado',
  entregue = 'entregue',
  cancelado = 'cancelado',
}

export type TipoEntregaType = 'retirada' | 'delivery' | 'mesa';

export class TipoEntregaHelper {
  static displayName(tipo: TipoEntregaType): string {
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

  static fromString(entrega: string): TipoEntregaType {
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
