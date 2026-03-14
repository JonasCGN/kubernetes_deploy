import 'package:app_cliente/class/produtos/insumos.dart';

class Produto {
  final int id;
  final String nome;
  final double preco;
  final String categoria;
  final String urlImage;
  final bool disponibilidade;
  List<Insumos> insumos;

  Produto({
    required this.id,
    required this.nome,
    required this.preco,
    required this.categoria,
    required this.urlImage,
    this.disponibilidade = true,
    this.insumos = const [],
  });

  /// Factory constructor para criar Produto a partir de dados do banco
  factory Produto.fromMap(Map<String, dynamic> map) {
    return Produto(
      id: map['id'] ?? map['id_produto'] ?? 0,
      nome: map['nome'] ?? '',
      preco: (map['preco'] ?? 0).toDouble(),
      categoria: map['categoria'] ?? '',
      urlImage: map['urlImage'] ?? map['path_image'] ?? '',
      disponibilidade: map['disponibilidade'] ?? true,
      insumos: map['insumos'] ?? [],
    );
  }

  /// Adiciona insumos ao produto (para quando carregar da relação N:N)
  void setInsumos(List<Insumos> novosInsumos) {
    insumos = novosInsumos;
  }

  String get valorFormat => preco.toStringAsFixed(2).replaceAll('.', ',');

  get descricao {
    if (insumos.isEmpty) return 'Sem ingredientes informados';
    return insumos.map((insumo) => insumo.nome).join(', ');
  }
}
