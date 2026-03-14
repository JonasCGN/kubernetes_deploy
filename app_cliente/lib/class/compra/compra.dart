import 'package:app_cliente/class/compra/item_compra.dart';
import 'package:app_cliente/class/endereco/endereco.dart';

enum TipoPagamento { dinheiro, cartao, pix }

enum TipoStatus { pendente, emPreparo, enviado, entregue, cancelado }

enum TipoEntrega {
  retirada,
  delivery;

  // Para compatibilidade com código antigo
  static TipoEntrega get entrega => delivery;

  String get displayName {
    switch (this) {
      case TipoEntrega.retirada:
        return 'Retirada';
      case TipoEntrega.delivery:
        return 'Delivery';
    }
  }

  static TipoEntrega fromString(String entrega) {
    switch (entrega.toLowerCase()) {
      case 'retirada':
        return TipoEntrega.retirada;
      case 'delivery':
        return TipoEntrega.delivery;
      default:
        return TipoEntrega.retirada;
    }
  }
}

class Compra {
  final int? id;
  final String nomePessoa;
  final String telefone;
  final TipoPagamento tipoPagamento;
  final TipoStatus status;
  final TipoEntrega tipoEntrega;
  final Endereco? endereco;
  final DateTime dataPedido;
  final List<ItemCompra> itens;
  double? frete;

  Compra({
    this.id,
    required this.nomePessoa,
    required this.telefone,
    required this.tipoPagamento,
    this.status = TipoStatus.pendente,
    required this.tipoEntrega,
    this.endereco,
    this.frete,
    DateTime? dataPedido,
    this.itens = const [],
  }) : dataPedido = dataPedido ?? DateTime.now();

  /// Valor total da compra
  double get valorTotal {
    return itens.fold(0.0, (total, item) => total + item.precoTotal);
  }

  /// Quantidade total de itens
  int get quantidadeTotal {
    return itens.fold(0, (total, item) => total + item.quantidade);
  }

  /// Verifica se a compra está vazia
  bool get isEmpty => itens.isEmpty;

  /// Verifica se a compra não está vazia
  bool get isNotEmpty => itens.isNotEmpty;

  /// Adiciona um item à compra
  Compra adicionarItem(ItemCompra novoItem) {
    final List<ItemCompra> novosItens = List.from(itens);

    // Verifica se já existe um item igual
    final int index = novosItens.indexWhere((item) => item == novoItem);

    if (index != -1) {
      // Se existe, incrementa a quantidade
      novosItens[index].quantidade += novoItem.quantidade;
    } else {
      // Se não existe, adiciona o novo item
      novosItens.add(novoItem);
    }

    return copyWith(itens: novosItens);
  }

  /// Remove um item da compra
  Compra removerItem(ItemCompra itemParaRemover) {
    final List<ItemCompra> novosItens = List.from(itens);
    novosItens.remove(itemParaRemover);
    return copyWith(itens: novosItens);
  }

  /// Atualiza a quantidade de um item
  Compra atualizarQuantidadeItem(ItemCompra item, int novaQuantidade) {
    final List<ItemCompra> novosItens = List.from(itens);
    final int index = novosItens.indexOf(item);

    if (index != -1) {
      if (novaQuantidade <= 0) {
        novosItens.removeAt(index);
      } else {
        novosItens[index].setQuantidade(novaQuantidade);
      }
    }

    return copyWith(itens: novosItens);
  }

  /// Limpa todos os itens da compra
  Compra limparItens() {
    return copyWith(itens: []);
  }

  /// Cria uma cópia da compra com novos valores
  Compra copyWith({
    int? id,
    String? nomePessoa,
    String? telefone,
    TipoPagamento? tipoPagamento,
    TipoStatus? status,
    TipoEntrega? tipoEntrega,
    Endereco? endereco,
    DateTime? dataPedido,
    List<ItemCompra>? itens,
  }) {
    return Compra(
      id: id ?? this.id,
      nomePessoa: nomePessoa ?? this.nomePessoa,
      telefone: telefone ?? this.telefone,
      tipoPagamento: tipoPagamento ?? this.tipoPagamento,
      status: status ?? this.status,
      tipoEntrega: tipoEntrega ?? this.tipoEntrega,
      endereco: endereco ?? this.endereco,
      dataPedido: dataPedido ?? this.dataPedido,
      itens: itens ?? this.itens,
    );
  }

  /// Converte para Map para salvar no banco
  Future<Map<String, dynamic>> toMap() async {
    final Map<String, dynamic> map = {
      if (id != null) 'id_pedido': id,
      'nomePessoa': nomePessoa,
      'telefone': telefone,
      'tipoPagamento': tipoPagamento.name,
      'status': status.name,
      'tipoEntrega': tipoEntrega.name,
      'data_pedido': dataPedido.toIso8601String(),
      'itens': itens.map((item) => item.toMap()).toList(),
    };

    // Adicionar endereço baseado no tipo de entrega
    if (tipoEntrega == TipoEntrega.delivery) {
      if (endereco != null) {
        map['endereco'] = endereco!.toJson();
      } else {
        map['endereco'] = null;
      }
    } else {
      // Para retirada, endereço sempre null
      map['endereco'] = null;
    }

    return map;
  }

  @override
  String toString() {
    final buffer = StringBuffer();
    buffer.writeln('🛒 *Resumo do Pedido*');
    buffer.writeln('👤 Cliente: $nomePessoa');
    buffer.writeln('📞 Telefone: $telefone');
    buffer.writeln('💳 Pagamento: ${tipoPagamento.name.toUpperCase()}');
    buffer.writeln('🚚 Entrega: ${tipoEntrega.displayName}');
    if (tipoEntrega == TipoEntrega.delivery && endereco != null) {
      buffer.writeln('🏠 Endereço: $endereco');
    }
    buffer.writeln('\n*Itens do pedido:*');
    for (final item in itens) {
      buffer.writeln(
        '• ${item.quantidade}x ${item.produto.nome} - R\$${item.precoTotal.toStringAsFixed(2)}',
      );
    }
    buffer.writeln('\n🔢 Total de itens: $quantidadeTotal');
    buffer.writeln(
      '💰 *Valor total dos itens: R\$${valorTotal.toStringAsFixed(2)}*',
    );
    if (tipoEntrega == TipoEntrega.delivery && frete != null && frete! > 0) {
      buffer.writeln('🚚 Frete: R\$${frete!.toStringAsFixed(2)}');
      buffer.writeln(
        '💰 *Valor total com frete: R\$${(valorTotal + frete!).toStringAsFixed(2)}*',
      );
    } else {
      buffer.writeln('💰 *Valor total: R\$${valorTotal.toStringAsFixed(2)}*');
    }
    buffer.writeln('\nObrigado pelo seu pedido! 😊');
    return buffer.toString();
  }
}
