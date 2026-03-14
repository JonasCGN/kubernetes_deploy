class Insumos {
  final int id;
  String nome;
  int preco;
  int qtd;

  Insumos({
    required this.id,
    required this.nome,
    this.qtd = 0,
    this.preco = 2,
  });

  /// Factory constructor para criar Insumo a partir de dados do banco
  factory Insumos.fromMap(Map<String, dynamic> map) {
    return Insumos(
      id: map['id_insumo'] ?? map['id'] ?? 0,
      nome: map['nome'] ?? '',
      qtd: map['qtd'] ?? 0,
      preco: map['preco'] ?? 2,
    );
  }

  /// Factory constructor para compatibilidade com JSON
  factory Insumos.fromJson(Map<String, dynamic> json) {
    return Insumos.fromMap(json);
  }

  /// Converte para Map (para salvar no banco)
  Map<String, dynamic> toMap() {
    return {
      'id_insumo': id,
      'nome': nome,
      'qtd': qtd,
      'preco':preco
    };
  }

  @override
  String toString(){
    return "Nome:$nome";
  }
}