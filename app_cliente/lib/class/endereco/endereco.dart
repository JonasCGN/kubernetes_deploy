class Endereco {
  final String rua;
  final String numero;
  final String bairro;
  final String? complemento;
  final String? informacaoAdicional;

  Endereco({
    required this.rua,
    required this.numero,
    required this.bairro,
    this.complemento,
    this.informacaoAdicional,
  });

  /// Factory constructor para criar Endereco a partir de JSON
  factory Endereco.fromJson(Map<String, dynamic> json) {
    return Endereco(
      rua: json['rua'] ?? '',
      numero: json['numero'] ?? '',
      bairro: json['bairro'] ?? '',
      complemento: json['complemento'],
      informacaoAdicional: json['ponto_referencia'],
    );
  }

  /// Converte o endereço para JSON (para salvar no banco como JSONB)
  Map<String, dynamic> toJson() {
    return {
      'rua': rua,
      'numero': numero,
      'bairro': bairro,
      if (complemento != null) 'complemento': complemento,
      if (informacaoAdicional != null) 'ponto_referencia': informacaoAdicional,
    };
  }

  /// Retorna o endereço formatado para exibição
  String get enderecoCompleto {
    String endereco = '$rua, $numero - $bairro';
    if (complemento != null && complemento!.isNotEmpty) {
      endereco += ' ($complemento)';
    }
    return endereco;
  }

  /// Retorna uma versão resumida do endereço
  String get enderecoResumo {
    return '$rua, $numero - $bairro';
  }

  @override
  String toString() => enderecoCompleto;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Endereco &&
        other.rua == rua &&
        other.numero == numero &&
        other.bairro == bairro &&
        other.complemento == complemento &&
        other.informacaoAdicional == informacaoAdicional;
  }

  @override
  int get hashCode {
    return Object.hash(
      rua,
      numero,
      bairro,
      complemento,
      informacaoAdicional,
    );
  }
}
