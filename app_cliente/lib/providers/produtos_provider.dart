import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:app_cliente/database/api_server_supabase.dart';

/// Provider para gerenciar os produtos da lanchonete
///
/// Este provider:
/// - Mantém um Map<int, Produto> de todos os produtos
/// - Carrega produtos do Supabase
/// - Filtra produtos por categoria
/// - Gerencia estado de loading e erro
/// - Notifica mudanças reativas
class ProdutosProvider extends ChangeNotifier {
  Map<int, Produto> _produtos = {};
  bool _isLoading = false;
  String? _errorMessage;
  List<String> _categorias = [];
  double? frete;
  // Novos campos para filtros
  String? _categoriaFiltrada;
  String _textoBusca = '';

  // Prioridades das categorias (menor número = maior prioridade)
  static const Map<String, int> _prioridadesCategorias = {
    'lanches': 1,
    'pratos': 2,
    'petiscos': 3,
    'sobremesas': 4,
    'acompanhamentos': 5,
    'bebidas': 6,
  };

  // Getters
  Map<int, Produto> get produtos => _getProdutosFiltrados();
  Map<int, Produto> get todosProdutos => _produtos;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  List<String> get categorias => _getCategoriasOrdenadas();
  bool get hasProducts => _produtos.isNotEmpty;
  String? get categoriaFiltrada => _categoriaFiltrada;
  String get textoBusca => _textoBusca;

  /// Carrega todos os produtos do banco de dados
  Future<void> carregarProdutos() async {
    _setLoading(true);
    _clearError();

    try {
      _produtos = await ApiServerSupabase.produtosComInsumos();
      // _produtos = await ApiServerSupabase.produtosComInsumos();
      if (frete == null) frete = await ApiServerSupabase.getValorFrete();

      _atualizarCategorias();
    } catch (e) {
      _setError('Erro ao carregar produtos: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Carrega insumos para um produto específico
  // Future<void> carregarInsumosProduto(int idProduto) async {
  //   try {
  //     final produto = _produtos[idProduto];
  //     if (produto != null) {
  //       final insumos = await ApiServerSupabase.getInsumosByProduto(idProduto);
  //       produto.setInsumos(insumos);
  //       notifyListeners();
  //       // ...debugPrint removido...
  //     }
  //   } catch (e) {
  //     // ...debugPrint removido...
  //   }
  // }

  /// Busca um produto específico por ID
  Produto? getProdutoById(int id) {
    return _produtos[id];
  }

  /// Filtra produtos por categoria
  List<Produto> getProdutosByCategoria(String categoria) {
    return _produtos.values
        .where(
          (produto) =>
              produto.categoria.toLowerCase() == categoria.toLowerCase(),
        )
        .toList();
  }

  /// Filtra produtos disponíveis
  List<Produto> getProdutosDisponiveis() {
    return _produtos.values
        .where((produto) => produto.disponibilidade)
        .toList();
  }

  /// Busca produtos por nome (pesquisa)
  List<Produto> buscarProdutos(String query) {
    if (query.isEmpty) return _produtos.values.toList();

    final queryLower = query.toLowerCase();
    return _produtos.values
        .where(
          (produto) =>
              produto.nome.toLowerCase().contains(queryLower) ||
              produto.categoria.toLowerCase().contains(queryLower) ||
              produto.descricao.toLowerCase().contains(queryLower),
        )
        .toList();
  }

  /// Obtém produtos ordenados por preço
  List<Produto> getProdutosOrdenadosPorPreco({bool crescente = true}) {
    final lista = _produtos.values.toList();
    lista.sort(
      (a, b) =>
          crescente ? a.preco.compareTo(b.preco) : b.preco.compareTo(a.preco),
    );
    return lista;
  }

  /// Obtém produtos ordenados por nome
  List<Produto> getProdutosOrdenadosPorNome() {
    final lista = _produtos.values.toList();
    lista.sort((a, b) => a.nome.compareTo(b.nome));
    return lista;
  }

  /// Atualiza a lista de categorias únicas e ordenadas por prioridade
  void _atualizarCategorias() {
    final categoriasSet = <String>{};
    for (final produto in _produtos.values) {
      categoriasSet.add(produto.categoria);
    }
    _categorias = categoriasSet.toList();
  }

  /// Retorna categorias ordenadas por prioridade
  List<String> _getCategoriasOrdenadas() {
    final lista = List<String>.from(_categorias);
    lista.sort((a, b) {
      final prioridadeA = _prioridadesCategorias[a.toLowerCase()] ?? 999;
      final prioridadeB = _prioridadesCategorias[b.toLowerCase()] ?? 999;
      final comparacao = prioridadeA.compareTo(prioridadeB);
      if (comparacao != 0) return comparacao;
      return a.compareTo(b); // Se prioridades iguais, ordena alfabeticamente
    });
    return lista;
  }

  /// Retorna produtos filtrados por categoria e busca
  Map<int, Produto> _getProdutosFiltrados() {
    var produtosFiltrados = _produtos.values.toList();

    // Filtrar por categoria se selecionada
    if (_categoriaFiltrada != null) {
      produtosFiltrados = produtosFiltrados
          .where(
            (produto) =>
                produto.categoria.toLowerCase() ==
                _categoriaFiltrada!.toLowerCase(),
          )
          .toList();
    }

    // Filtrar por texto de busca (produtos que começam com o texto)
    if (_textoBusca.isNotEmpty) {
      final buscaLower = _textoBusca.toLowerCase();
      produtosFiltrados = produtosFiltrados
          .where((produto) => produto.nome.toLowerCase().startsWith(buscaLower))
          .toList();
    }

    // Ordenar por prioridade da categoria
    produtosFiltrados.sort((a, b) {
      final prioridadeA =
          _prioridadesCategorias[a.categoria.toLowerCase()] ?? 999;
      final prioridadeB =
          _prioridadesCategorias[b.categoria.toLowerCase()] ?? 999;
      final comparacao = prioridadeA.compareTo(prioridadeB);
      if (comparacao != 0) return comparacao;
      return a.nome.compareTo(b.nome); // Se prioridades iguais, ordena por nome
    });

    // Converter de volta para Map mantendo os IDs originais
    final Map<int, Produto> resultado = {};
    for (final produto in produtosFiltrados) {
      resultado[produto.id] = produto;
    }
    return resultado;
  }

  /// Define o filtro de categoria
  void setFiltroCategoria(String? categoria) {
    _categoriaFiltrada = categoria;
    notifyListeners();
  }

  /// Define o texto de busca
  void setBusca(String texto) {
    _textoBusca = texto;
    notifyListeners();
  }

  /// Limpa todos os filtros
  void limparFiltros() {
    _categoriaFiltrada = null;
    _textoBusca = '';
    notifyListeners();
  }

  /// Recarrega os produtos (útil para refresh)
  Future<void> recarregarProdutos({bool comInsumos = false}) async {
    await carregarProdutos();
  }

  /// Limpa todos os produtos
  void limparProdutos() {
    _produtos.clear();
    _categorias.clear();
    _clearError();
    notifyListeners();
  }

  /// Métodos privados para gerenciar estado
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  /// Reinicia o provider
  void reset() {
    _produtos.clear();
    _categorias.clear();
    _isLoading = false;
    _errorMessage = null;
    notifyListeners();
  }

  @override
  void dispose() {
    _produtos.clear();
    super.dispose();
  }
}
