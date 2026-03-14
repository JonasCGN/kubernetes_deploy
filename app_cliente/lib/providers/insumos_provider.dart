import 'package:app_cliente/class/produtos/insumos.dart';
import 'package:flutter/foundation.dart';

class InsumosProvider with ChangeNotifier {
  List<Insumos> _insumos = [];
  bool _isLoading = false;
  String? _error;
  String _termoBusca = ''; // Termo atual de busca
  List<Insumos> _insumosFiltrados = []; // Lista filtrada para exibição

  List<Insumos> get insumos => _insumos;
  bool get isLoading => _isLoading;
  String? get error => _error;
  List<Insumos> get insumosFiltrados => _insumosFiltrados.isEmpty && _termoBusca.isEmpty 
      ? _insumos.toList() 
      : _insumosFiltrados;

  // Future<void> fetchInsumos() async {
  //   _setLoading(true);
  //   try {
  //     final insumosList = await PgSupabase.instance.select(
  //       table: 'insumos',
  //       select: 'id_insumo, nome',
  //       orderBy: 'nome',
  //     );
      
  //     _insumos = insumosList
  //         .map((insumoData) => Insumos.fromJson(insumoData))
  //         .toList();
      
  //     _error = null;
  //     // ...debugPrint removido...
  //   } catch (e) {
  //     _error = 'Erro ao carregar insumos: ${e.toString()}';
  //     _insumos = [];
  //     // ...debugPrint removido...
  //   } finally {
  //     _setLoading(false);
  //   }
  // }
  
  // Busca insumos por nome (pesquisa por prefixo)
  void buscarInsumos(String query) {
    _termoBusca = query;
    
    if (query.isEmpty) {
      _insumosFiltrados = [];
    } else {
      final queryLower = query.toLowerCase();
      _insumosFiltrados = _insumos
          .where((insumo) => 
            insumo.nome.toLowerCase().startsWith(queryLower)
          )
          .toList();
      
      // ...debugPrint removido...
    }
    
    notifyListeners();
  }

  Insumos? getInsumoById(int id) {
    try {
      return _insumos.firstWhere((insumo) => insumo.id == id);
    } catch (e) {
      return null;
    }
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }

  // Método para limpar a busca e mostrar todos os insumos
  void clearSearch({bool notify = true}) {
    _termoBusca = '';
    _insumosFiltrados = [];
    if (notify) {
      notifyListeners();
      // ...debugPrint removido...
    }
  }
}
