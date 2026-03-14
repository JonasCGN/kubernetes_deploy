import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/components/dialogs/dialog_processamento_pedido.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/main.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:app_cliente/routes/routes.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class DialogFinalizarPedido extends StatefulWidget {
  const DialogFinalizarPedido({super.key});

  @override
  State<DialogFinalizarPedido> createState() => _DialogFinalizarPedidoState();
}

class _DialogFinalizarPedidoState extends State<DialogFinalizarPedido> {
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    final providerCompra = Provider.of<CompraProvider>(context);
    final produtoProvider = Provider.of<ProdutosProvider>(context);
    final frete = produtoProvider.frete;
    final pedidos = providerCompra.itens;
    double total = providerCompra.valorTotal;
    total =
        (total +
        (providerCompra.compraAtual.tipoEntrega == TipoEntrega.delivery
            ? frete ?? 0
            : 0));

    return Dialog(
      child: Container(
        width: 400,
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: ColorsApp.branco,
          borderRadius: BorderRadius.circular(5),
        ),
        child: _loading
            ? Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(height: 30),
                  CircularProgressIndicator(color: ColorsApp.amarelo),
                  SizedBox(height: 30),
                  Text(
                    "Estamos processando seu pedido...",
                    style: TextStyle(
                      color: ColorsApp.pretoOpacidade56,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 30),
                ],
              )
            : Column(
                spacing: 10,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    "assets/images/hamburguer_feliz.png",
                    width: 200,
                    height: 200,
                  ),
                  Text(
                    "Posso finalizar seu pedido?",
                    style: TextStyle(
                      color: ColorsApp.pretoOpacidade56,
                      fontSize: 20,
                    ),
                  ),
                  Container(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Text(
                          "Resumo do Pedido",
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: ColorsApp.pretoOpacidade56,
                          ),
                          textAlign: TextAlign.left,
                        ),
                        const SizedBox(height: 10),
                        ListView.separated(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          itemCount: pedidos.length,
                          itemBuilder: (context, index) {
                            final pedido = pedidos[index];
                            return Container(
                              padding: EdgeInsets.symmetric(
                                vertical: 6,
                                horizontal: 10,
                              ),
                              decoration: BoxDecoration(
                                color: ColorsApp.cinza,
                                borderRadius: BorderRadius.circular(5),
                              ),
                              child: Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Expanded(
                                    child: Text(
                                      pedido.produto.nome,
                                      style: TextStyle(fontSize: 15),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Text(
                                    "${pedido.quantidade}x ${pedido.produto.valorFormat}",
                                    style: TextStyle(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                          separatorBuilder: (context, index) =>
                              SizedBox(height: 6),
                        ),
                        const SizedBox(height: 12),
                        Divider(thickness: 1, color: ColorsApp.cinzaEscuro),
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 6.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              if (providerCompra.compraAtual.tipoEntrega ==
                                  TipoEntrega.delivery) ...[
                                Row(
                                  mainAxisAlignment:
                                      MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      "Frete:",
                                      style: TextStyle(fontSize: 15),
                                    ),
                                    Text(
                                      "R\$ ${frete?.toStringAsFixed(2).replaceAll('.', ',') ?? '0,00'}",
                                      style: TextStyle(fontSize: 15),
                                    ),
                                  ],
                                ),
                              ],
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Total:",
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                    ),
                                  ),
                                  Text(
                                    "R\$ ${total.toStringAsFixed(2).replaceAll('.', ',')}",
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 16,
                                      color: ColorsApp.vermelho,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButtonFormField(
                    texto: "Comprar Mais",
                    corFundo: ColorsApp.vermelho,
                    corFundoHover: ColorsApp.amarelo,
                    width: 200,
                    onPressed: () {
                      if (context.mounted)
                        Navigator.pushReplacementNamed(context, Routes.home);
                    },
                  ),
                  ElevatedButtonFormField(
                    texto: "Finalizar Pedido",
                    width: 200,
                    onPressed: () async {
                      setState(() {
                        _loading = true;
                      });
                      final compraProvider = Provider.of<CompraProvider>(
                        context,
                        listen: false,
                      );
                      bool retorno = await compraProvider.finalizarPedido(
                        frete,
                      );

                      if (retorno && context.mounted) {
                        Navigator.pushReplacementNamed(context, Routes.home);
                        Future.delayed(const Duration(milliseconds: 100), () {
                          WidgetsBinding.instance.addPostFrameCallback((_) {
                            final ctx = navigatorKey.currentContext;
                            if (ctx != null) {
                              showDialog(
                                context: ctx,
                                builder: (context) =>
                                    DialogProcessamentoPedido(),
                              );
                            }
                          });
                        });
                      } else if (!retorno && context.mounted) {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: Text('Erro ao finalizar pedido'),
                            content: Text(
                              compraProvider.error ??
                                  'Não foi possível finalizar o pedido.',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.of(context).pop(),
                                child: Text('OK'),
                              ),
                            ],
                          ),
                        );
                        setState(() {
                          _loading = false;
                        });
                      }
                    },
                  ),
                ],
              ),
      ),
    );
  }
}
