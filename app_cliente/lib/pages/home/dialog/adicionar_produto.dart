import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/components/style/input_form_field.dart';
import 'package:app_cliente/components/style/product_image_component.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/providers/insumos_provider.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class AdicionarProdutoListaCompra extends StatelessWidget {
  final Produto produto;
  final TextEditingController observacoes;
  const AdicionarProdutoListaCompra({
    super.key, required this.produto,
    required this.observacoes
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<CompraProvider>(
      builder: (context, compraProvider, child) {
        int quantidade = 1;
        return Container(
          height: 100,
          padding: EdgeInsets.only(left: 10, right: 10),
          decoration: BoxDecoration(color: ColorsApp.branco),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Expanded(
                child: StatefulBuilder(
                  builder:
                      (
                        BuildContext context,
                        void Function(void Function()) setState,
                      ) {
                        return Row(
                          children: [
                            Container(
                              width: 50,
                              height: 50,
                              color: ColorsApp.cinza,
                              child: Center(child: Text(quantidade.toString())),
                            ),
                            Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                IconButton(
                                  onPressed: () {
                                    setState(() {
                                      quantidade++;
                                    });
                                  },
                                  icon: Icon(Icons.add, size: 20),
                                ),
                                IconButton(
                                  onPressed: () {
                                    if (quantidade > 1) {
                                      setState(() {
                                        quantidade--;
                                      });
                                    }
                                  },
                                  icon: Icon(Icons.remove, size: 20),
                                ),
                              ],
                            ),
                          ],
                        );
                      },
                ),
              ),
              Expanded(
                child: ElevatedButtonFormField(
                  texto:
                      "Adicionar R\$${(produto.preco * quantidade).toStringAsFixed(2).replaceAll('.', ',')}",
                  onPressed: () {
                    compraProvider.adicionarProduto(
                      produto,
                      quantidade: quantidade,
                      observacoes: observacoes.text.trim()
                    );
                    Navigator.of(context).pop();
                
                    // Mostrar feedback
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('${produto.nome} adicionado ao carrinho!'),
                        duration: Duration(seconds: 2),
                        backgroundColor: ColorsApp.vermelhoEscuro,
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class AdicionarProduto extends StatefulWidget {
  final Produto produto;
  const AdicionarProduto({super.key, required this.produto});

  @override
  State<AdicionarProduto> createState() => _AdicionarProdutoState();
}

class _AdicionarProdutoState extends State<AdicionarProduto> {
  InsumosProvider? _insumosProvider;
  final TextEditingController _observacoes = TextEditingController();

  @override
  void initState() {
    super.initState();
    // Usar addPostFrameCallback para garantir que o widget foi construído
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _insumosProvider = Provider.of<InsumosProvider>(context, listen: false);
      // Limpar busca anterior e buscar insumos
      _insumosProvider!.clearSearch();
      // _insumosProvider!.fetchInsumos();
    });
  }

  @override
  void dispose() {
    super.dispose();
  }

  Widget _buildMobile(InsumosProvider insumosProvider, BuildContext context) {
    return Expanded(
      child: Column(
        spacing: 16,
        children: [
          ProductImageComponent(
            urlImage: widget.produto.urlImage,
            height: 150,
            width: 150,
          ),
          Text(
            widget.produto.nome,
            style: TextStyle(color: ColorsApp.preto, fontSize: 20),
            textAlign: TextAlign.center,
          ),
          Text(
            widget.produto.descricao,
            style: TextStyle(color: ColorsApp.preto, fontSize: 12),
            textAlign: TextAlign.center,
          ),
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                spacing: 10,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Expanded(
                  //   child: SingleChildScrollView(
                  //     child: Column(
                  //       // crossAxisAlignment: CrossAxisAlignment.stretch,
                  //       spacing: 16,
                  //       children: [
                  //         InputFormField(
                  //           labelText: "Observação do Produto",
                  //           expandedInput: true,
                  //         ),
                  //         // ShowBarComponent(text: "Componentes"),
                  //         // SearchBarComponent(
                  //         //   onChanged: (value) {
                  //         //     insumosProvider.buscarInsumos(value);
                  //         //   },
                  //         //   onClear: () {
                  //         //     insumosProvider.clearSearch();
                  //         //   },
                  //         // ),
                  //         // ShowInfosInsumosComponent(
                  //         //   insumos: insumosProvider.insumosFiltrados,
                  //         // ),
                  //       ],
                  //     ),
                  //   ),
                  // ),
                  InputFormField(
                    labelText: "Observação do Produto",
                    controller: _observacoes,
                    // expandedInput: true,
                  ),
                ],
              ),
            ),
          ),
          AdicionarProdutoListaCompra(
            produto: widget.produto,
            observacoes: _observacoes,

          ),
        ],
      ),
    );
  }

  Widget _buildDesktop(InsumosProvider insumosProvider, BuildContext context) {
    return Row(
      spacing: 16,
      children: [
        Expanded(
          child: Column(
            spacing: 10,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ProductImageComponent(
                urlImage: widget.produto.urlImage,
                height: 300,
                width: 300,
              ),
              Text(
                widget.produto.nome,
                style: TextStyle(color: ColorsApp.preto, fontSize: 20),
                textAlign: TextAlign.center,
              ),
              Text(
                widget.produto.descricao,
                style: TextStyle(color: ColorsApp.preto, fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        Expanded(
          child: SizedBox(
            width: 400,
            child: Column(
              spacing: 10,
              children: [
                // Expanded(
                //   child: SingleChildScrollView(
                //     child: Column(
                //       // crossAxisAlignment: CrossAxisAlignment.stretch,
                //       spacing: 16,
                //       children: [
                //         InputFormField(
                //           labelText: "Observação do Produto",
                //           expandedInput: true,
                //         ),
                //         // ShowBarComponent(text: "Componentes"),
                //         // SearchBarComponent(
                //         //   onChanged: (value) {
                //         //     insumosProvider.buscarInsumos(value);
                //         //   },
                //         //   onClear: () {
                //         //     insumosProvider.clearSearch();
                //         //   },
                //         // ),
                //         // ShowInfosInsumosComponent(
                //         //   insumos: insumosProvider.insumosFiltrados,
                //         // ),
                //       ],
                //     ),
                //   ),
                // ),
                InputFormField(
                  labelText: "Observação do Produto",
                  controller: _observacoes,
                  expandedInput: true,
                ),
                AdicionarProdutoListaCompra(
                  produto: widget.produto,
                  observacoes: _observacoes,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<InsumosProvider>(
      builder: (context, insumosProvider, child) {
        return Dialog(
          backgroundColor: ColorsApp.branco,
          child: Container(
            padding: EdgeInsets.all(16),
            height: 500,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (Responsividade.isMobile(context)) ...[
                  _buildMobile(insumosProvider, context),
                ] else ...[
                  _buildDesktop(insumosProvider, context),
                ],
              ],
            ),
          ),
        );
      },
    );
  }
}
