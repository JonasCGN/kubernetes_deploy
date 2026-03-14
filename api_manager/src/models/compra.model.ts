
import { TipoEntregaHelper, TipoEntregaType, TipoPagamento, TipoStatus } from '../types/compra';
import { Endereco } from './endereco.model';
import { ItemCompra } from './item_compra.model';

export interface CompraParams {
  id?: number;
  nomePessoa: string;
  telefone: string;
  tipoPagamento: TipoPagamento;
  status?: TipoStatus;
  tipoEntrega: TipoEntregaType;
  endereco?: Endereco;
  frete?: number;
  dataPedido?: Date;
  itens?: ItemCompra[];
}

export class Compra {
  id?: number;
  nomePessoa: string;
  telefone: string;
  tipoPagamento: TipoPagamento;
  status: TipoStatus;
  tipoEntrega: TipoEntregaType;
  endereco?: Endereco;
  dataPedido: Date;
  itens: ItemCompra[];
  frete?: number;

  constructor(params: CompraParams) {
    this.id = params.id;
    this.nomePessoa = params.nomePessoa;
    this.telefone = params.telefone;
    this.tipoPagamento = params.tipoPagamento;
    this.status = params.status ?? TipoStatus.pendente;
    this.tipoEntrega = params.tipoEntrega;
    this.endereco = params.endereco;
    this.frete = params.frete;
    this.dataPedido = params.dataPedido ?? new Date();
    this.itens = params.itens ?? [];
  }

  get valorTotal(): number {
    return this.itens.reduce((total, item) => total + item.precoTotal, 0);
  }

  get quantidadeTotal(): number {
    return this.itens.reduce((total, item) => total + item.quantidade, 0);
  }

  get isEmpty(): boolean {
    return this.itens.length === 0;
  }

  get isNotEmpty(): boolean {
    return this.itens.length > 0;
  }

  adicionarItem(novoItem: ItemCompra): Compra {
    const novosItens = [...this.itens];
    const index = novosItens.findIndex(item => item.equals(novoItem));
    if (index !== -1) {
      novosItens[index].quantidade += novoItem.quantidade;
    } else {
      novosItens.push(novoItem);
    }
    return this.copyWith({ itens: novosItens });
  }

  removerItem(itemParaRemover: ItemCompra): Compra {
    const novosItens = this.itens.filter(item => !item.equals(itemParaRemover));
    return this.copyWith({ itens: novosItens });
  }

  atualizarQuantidadeItem(item: ItemCompra, novaQuantidade: number): Compra {
    const novosItens = this.itens.map(i => {
      if (i.equals(item)) {
        if (novaQuantidade <= 0) return null;
        i.setQuantidade(novaQuantidade);
      }
      return i;
    }).filter(Boolean) as ItemCompra[];
    return this.copyWith({ itens: novosItens });
  }

  limparItens(): Compra {
    return this.copyWith({ itens: [] });
  }

  copyWith(params: Partial<CompraParams>): Compra {
    return new Compra({
      id: params.id ?? this.id,
      nomePessoa: params.nomePessoa ?? this.nomePessoa,
      telefone: params.telefone ?? this.telefone,
      tipoPagamento: params.tipoPagamento ?? this.tipoPagamento,
      status: params.status ?? this.status,
      tipoEntrega: params.tipoEntrega ?? this.tipoEntrega,
      endereco: params.endereco ?? this.endereco,
      frete: params.frete ?? this.frete,
      dataPedido: params.dataPedido ?? this.dataPedido,
      itens: params.itens ?? this.itens,
    });
  }

  // O método toMap depende de criptografia, ajuste conforme sua implementação
  async toMap(Criptografia: any): Promise<Record<string, any>> {
    const map: Record<string, any> = {};
    if (this.id != null) map['id_pedido'] = this.id;
    map['nome_pessoa'] = this.nomePessoa;
    map['telefone'] = await Criptografia.encryptStringToJsonBlob(this.telefone);
    map['pagamento'] = this.tipoPagamento;
    map['status'] = this.status;
    map['entrega'] = this.tipoEntrega;
    map['data_pedido'] = this.dataPedido.toISOString();

    if (this.tipoEntrega === 'delivery') {
      if (this.endereco) {
        map['endereco'] = await Criptografia.encryptObjectToJsonBlob(this.endereco.toJson());
      } else {
        map['endereco'] = null;
      }
    } else {
      map['endereco'] = null;
    }
    return map;
  }

  toString(): string {
    let resumo = '🛒 *Resumo do Pedido*\n';
    resumo += `👤 Cliente: ${this.nomePessoa}\n`;
    resumo += `📞 Telefone: ${this.telefone}\n`;
    resumo += `💳 Pagamento: ${this.tipoPagamento.toUpperCase()}\n`;
    resumo += `🚚 Entrega: ${TipoEntregaHelper.displayName(this.tipoEntrega)}\n`;
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
    } else {
      resumo += `💰 *Valor total: R$${this.valorTotal.toFixed(2)}*\n`;
    }
    resumo += '\nObrigado pelo seu pedido! 😊';
    return resumo;
  }
}