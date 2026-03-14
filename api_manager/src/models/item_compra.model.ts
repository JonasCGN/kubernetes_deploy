import { Insumo } from "./insumo.model";
import { Produto } from "./produto.model";

export class ItemCompra {
  produto: Produto;
  quantidade: number;
  insumosPersonalizados: Insumo[];
  observacoes?: string;

  constructor(params: {
    produto: Produto;
    quantidade?: number;
    insumosPersonalizados?: Insumo[];
    observacoes?: string;
  }) {
    this.produto = params.produto;
    this.quantidade = params.quantidade ?? 1;
    this.insumosPersonalizados = params.insumosPersonalizados ?? [];
    this.observacoes = params.observacoes;
  }

  get precoTotal(): number {
    return this.produto.preco * this.quantidade;
  }

  incrementarQuantidade(): void {
    this.quantidade++;
  }

  decrementarQuantidade(): void {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  setQuantidade(novaQuantidade: number): void {
    if (novaQuantidade > 0) {
      this.quantidade = novaQuantidade;
    }
  }

  toMap(): Record<string, any> {
    return {
      id_produto: this.produto.id,
      quantidade: this.quantidade,
      insumos_personalizados: this.insumosPersonalizados.map(i => i.id),
      observacoes: this.observacoes,
    };
  }

  static fromMap(map: Record<string, any>, produto: Produto): ItemCompra {
    return new ItemCompra({
      produto: produto,
      quantidade: map['quantidade'] ?? 1,
      insumosPersonalizados: [], // Carregar separadamente se necessário
      observacoes: map['observacoes'],
    });
  }

  equals(other: ItemCompra): boolean {
    return (
      other.produto.id === this.produto.id &&
      other.observacoes === this.observacoes
      // Não compara insumos personalizados para simplificar
    );
  }

  toString(): string {
    return `ItemCompra(produto: ${this.produto.nome}, quantidade: ${this.quantidade}, precoTotal: R$${this.precoTotal})`;
  }
}
