import 'dart:convert';
import 'package:app_cliente/class/produtos/insumos.dart';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:app_cliente/config/config_app.dart';
import 'package:http/http.dart' as http;

class ApiServerSupabase {
  static Future<Map<int, Produto>> produtosComInsumos() async {
    try {
      final url = Uri.parse('${ConfigApp.urlApi}/produtos/com-insumos');
      final response = await http.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);
        final Map<int, Produto> produtosMap = {};

        for (final item in data) {
          // print(item['insumos']);
          final insumosList =
              (item['insumos'] as List?)
                  ?.map((insumo) => Insumos.fromMap(insumo['insumo']))
                  .toList() ??
              [];
          print(insumosList);
          final produto = Produto.fromMap({...item, 'insumos': insumosList});
          produtosMap[produto.id] = produto;
        }
        return produtosMap;
      } else {
        print("Nao retornou");
        return {};
      }
    } catch (e) {
      print("Erro: ${e.toString()}");
      return {};
    }
  }

  static Future<Map<String, dynamic>?> getHorarioFuncionamento(
    String diaSemana,
  ) async {
    try {
      final url = Uri.parse(
        '${ConfigApp.urlApi}/configuracoes/horario/$diaSemana',
      );
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data != null && data is Map<String, dynamic> && data.isNotEmpty) {
          return data;
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static Future<double?> getValorFrete() async {
    try {
      final url = Uri.parse('${ConfigApp.urlApi}/configuracoes/frete');
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data != null && data['valor'] != null) {
          return double.tryParse(data['valor'].toString());
        }
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}
