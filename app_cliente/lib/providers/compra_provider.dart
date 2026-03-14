import 'dart:convert';
import 'package:app_cliente/config/config_app.dart';
import 'package:flutter/foundation.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/class/compra/item_compra.dart';
import 'package:app_cliente/class/endereco/endereco.dart';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:http/http.dart' as http;

class CompraProvider with ChangeNotifier {
  Compra _compraAtual = Compra(
    nomePessoa: '',
    telefone: '',
    tipoPagamento: TipoPagamento.dinheiro,
    tipoEntrega: TipoEntrega.retirada,
  );

  bool _isLoading = false;
  String? _error;
  bool showCar = true;

  // Getters
  Compra get compraAtual => _compraAtual;
  List<ItemCompra> get itens => _compraAtual.itens;
  double get valorTotal => _compraAtual.valorTotal;
  int get quantidadeTotal => _compraAtual.quantidadeTotal;
  bool get isEmpty => _compraAtual.isEmpty;
  bool get isNotEmpty => _compraAtual.isNotEmpty;
  bool get isLoading => _isLoading;
  String? get error => _error;

  /// Adiciona um produto ao carrinho
  void adicionarProduto(
    Produto produto, {
    int quantidade = 1,
    String? observacoes,
  }) {
    final itemCompra = ItemCompra(
      produto: produto,
      quantidade: quantidade,
      observacoes: observacoes,
    );

    _compraAtual = _compraAtual.adicionarItem(itemCompra);
    notifyListeners();
  }

  /// Remove um item do carrinho
  void removerItem(ItemCompra item) {
    _compraAtual = _compraAtual.removerItem(item);
    notifyListeners();
  }

  /// Atualiza a quantidade de um item
  void atualizarQuantidadeItem(ItemCompra item, int novaQuantidade) {
    _compraAtual = _compraAtual.atualizarQuantidadeItem(item, novaQuantidade);
    notifyListeners();
  }

  void setShowCar(bool value) {
    showCar = value;
    notifyListeners();
  }

  /// Incrementa a quantidade de um item
  void incrementarItem(ItemCompra item) {
    atualizarQuantidadeItem(item, item.quantidade + 1);
  }

  /// Decrementa a quantidade de um item
  void decrementarItem(ItemCompra item) {
    if (item.quantidade > 1) {
      atualizarQuantidadeItem(item, item.quantidade - 1);
    } else {
      removerItem(item);
    }
  }

  /// Limpa todo o carrinho
  void limparCarrinho() {
    _compraAtual = _compraAtual.limparItens();
    notifyListeners();
  }

  /// Define os dados do cliente
  void definirDadosCliente({required String nome, String? telefone}) {
    _compraAtual = _compraAtual.copyWith(nomePessoa: nome, telefone: telefone);
    notifyListeners();
  }

  /// Define o tipo de pagamento
  void definirTipoPagamento(TipoPagamento tipoPagamento) {
    _compraAtual = _compraAtual.copyWith(tipoPagamento: tipoPagamento);
    notifyListeners();
  }

  /// Define o tipo de entrega
  void definirTipoEntrega(TipoEntrega tipoEntrega) {
    _compraAtual = _compraAtual.copyWith(tipoEntrega: tipoEntrega);
    notifyListeners();
  }

  /// Define o nome da pessoa
  void definirNomePessoa(String nome) {
    _compraAtual = _compraAtual.copyWith(nomePessoa: nome);
    notifyListeners();
  }

  /// Define o telefone da pessoa
  void definirTelefone(String telefone) {
    _compraAtual = _compraAtual.copyWith(telefone: telefone);
    notifyListeners();
  }

  /// Define o endereço de entrega
  void definirEndereco(Endereco endereco) {
    _compraAtual = _compraAtual.copyWith(endereco: endereco);
    notifyListeners();
  }

  /// Finaliza o pedido salvando no banco de dados
  Future<bool> finalizarPedido(double? frete) async {
    if (_compraAtual.isEmpty) {
      _error = 'Carrinho vazio. Adicione produtos antes de finalizar.';
      notifyListeners();
      return false;
    }

    if (_compraAtual.nomePessoa.isEmpty) {
      _error = 'Nome do cliente é obrigatório.';
      notifyListeners();
      return false;
    }

    if (_compraAtual.telefone.isEmpty) {
      _error = 'Telefone do cliente é obrigatório.';
      notifyListeners();
      return false;
    }

    if (_compraAtual.tipoEntrega == TipoEntrega.delivery &&
        _compraAtual.endereco == null) {
      _error = 'Endereço é obrigatório para delivery.';
      notifyListeners();
      return false;
    }

    _setLoading(true);
    _error = null;

    try {
      // Monta o mapa do pedido para enviar à API
      final pedidoMap = await _compraAtual.toMap();
      pedidoMap['frete'] = frete;

      final url = Uri.parse('${ConfigApp.urlApi}/pedido/finalizar-completo');

      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(pedidoMap),
      );
      
      if (response.statusCode == 200) {
        // Limpar o carrinho após finalizar
        limparCarrinho();
        return true;
      } else {
        final resp = jsonDecode(response.body);
        _error = 'Erro ao finalizar pedido: ${resp['error'] ?? response.body}';
        return false;
      }
    } catch (e) {
      _error = 'Erro ao finalizar pedido: ${e.toString()}';
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Verifica se um produto já está no carrinho
  bool produtoNoCarrinho(int idProduto) {
    return _compraAtual.itens.any((item) => item.produto.id == idProduto);
  }

  /// Retorna a quantidade de um produto no carrinho
  int quantidadeProdutoNoCarrinho(int idProduto) {
    final item = _compraAtual.itens.firstWhere(
      (item) => item.produto.id == idProduto,
      orElse: () => ItemCompra(
        produto: Produto(
          id: -1,
          nome: '',
          preco: 0,
          categoria: '',
          urlImage: '',
        ),
        quantidade: 0,
      ),
    );
    return item.quantidade;
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  /// Inicializa uma nova compra
  void iniciarNovaCompra() {
    _compraAtual = Compra(
      nomePessoa: '',
      telefone: '',
      tipoPagamento: TipoPagamento.dinheiro,
      tipoEntrega: TipoEntrega.retirada,
    );
    _error = null;
    notifyListeners();
  }
}
