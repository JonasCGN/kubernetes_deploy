import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:app_cliente/class/produtos/insumos.dart';

class ItemCompra {
  final Produto produto;
  int quantidade;
  final List<Insumos> insumosPersonalizados;
  final String? observacoes;

  ItemCompra({
    required this.produto,
    this.quantidade = 1,
    this.insumosPersonalizados = const [],
    this.observacoes,
  });

  /// Preço total do item (produto x quantidade)
  double get precoTotal => produto.preco * quantidade;

  /// Descrição do produto com insumos personalizados
  String get descricao {
    if (insumosPersonalizados.isEmpty) {
      return produto.descricao;
    }
    return insumosPersonalizados.map((insumo) => insumo.nome).join(', ');
  }

  /// Descrição completa incluindo observações
  String get descricaoCompleta {
    String desc = descricao;
    if (observacoes != null && observacoes!.isNotEmpty) {
      desc += '\nObs: $observacoes';
    }
    return desc;
  }

  /// Incrementa a quantidade
  void incrementarQuantidade() {
    quantidade++;
  }

  /// Decrementa a quantidade (mínimo 1)
  void decrementarQuantidade() {
    if (quantidade > 1) {
      quantidade--;
    }
  }

  /// Define uma nova quantidade
  void setQuantidade(int novaQuantidade) {
    if (novaQuantidade > 0) {
      quantidade = novaQuantidade;
    }
  }

  /// Factory para converter para Map (para salvar no banco)
  Map<String, dynamic> toMap() {
    return {
      'id_produto': produto.id,
      'quantidade': quantidade,
      // 'insumos_personalizados': insumosPersonalizados.map((i) => i.id).toList(),
      'observacoes': observacoes,
    };
  }

  /// Factory para criar a partir de Map
  factory ItemCompra.fromMap(Map<String, dynamic> map, Produto produto) {
    return ItemCompra(
      produto: produto,
      quantidade: map['quantidade'] ?? 1,
      insumosPersonalizados: [], // Será carregado separadamente se necessário
      observacoes: map['observacoes'],
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is ItemCompra &&
        other.produto.id == produto.id &&
        other.observacoes == observacoes;
    // Note: não comparamos insumos personalizados para simplificar
  }

  @override
  int get hashCode => Object.hash(produto.id, observacoes);

  @override
  String toString() {
    return 'ItemCompra(produto: ${produto.nome}, quantidade: $quantidade, precoTotal: R\$$precoTotal)';
  }
}
