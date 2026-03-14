import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/pages/adicionar_endereco/content/adicionar_endereco_content.dart';
import 'package:app_cliente/web/title_page.dart';
import 'package:flutter/material.dart';

class InformacaoPessoal extends StatelessWidget {
  final TipoEntrega entrega = TipoEntrega.retirada;
  const InformacaoPessoal({super.key});

  @override
  Widget build(BuildContext context) {
    return AdicionarEnderecoPage(
      entrega: entrega,
    );
  }
}

class AdicionarEnderecoPage extends StatefulWidget {
  final TipoEntrega entrega;
  const AdicionarEnderecoPage({
    super.key,
    this.entrega  = TipoEntrega.delivery
  });

  @override
  State<AdicionarEnderecoPage> createState() => _AdicionarEnderecoPageState();
}

class _AdicionarEnderecoPageState extends State<AdicionarEnderecoPage> {
  @override
  void initState() {
    super.initState();
    setPageTitle("Adicionar Informacao");
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AdicionarEnderecoContent(
        delivery: widget.entrega,
      ),
    );
  }
}