import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/class/compra/item_compra.dart';
import 'package:app_cliente/components/dialogs/dialog_confirmar_dados.dart';
import 'package:app_cliente/components/dialogs/dialog_finalizar_pedido.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/routes/routes.dart';
import 'package:app_cliente/storage/local_storage.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ShowComprasContent extends StatelessWidget {
  const ShowComprasContent({super.key});

  Future<void> _verificarDadosSalvos( 
    BuildContext context, 
    TipoEntrega tipoEntrega,
    CompraProvider compraProvider,
  ) async {
    final nomeSalvo = await LocalStorageHelper.getName();
    final telefoneSalvo = await LocalStorageHelper.getPhone();
    final endereco = await LocalStorageHelper.getAddressAsObject();

    if (nomeSalvo != null && nomeSalvo.isNotEmpty && 
        telefoneSalvo != null && telefoneSalvo.isNotEmpty) {
      
      if (context.mounted) {
        await showDialog(
          context: context,
          builder: (context) => DialogConfirmarDados(
            nome: nomeSalvo,
            telefone: telefoneSalvo,
            endereco: endereco,
            tipoEntrega: tipoEntrega,
            onConfirmar: () {
              compraProvider.definirDadosCliente(
                nome: nomeSalvo,
                telefone: telefoneSalvo,
              );
              
              if (tipoEntrega == TipoEntrega.delivery && endereco != null) {
                compraProvider.definirEndereco(endereco);
              }
              
              _finalizarPedidoComDados(context, compraProvider);
            },
            onAlterar: () {
              _irParaTelaDeEdicao(context, tipoEntrega);
            },
          ),
        );
      }
    } else {
      // Não tem dados salvos, ir direto para cadastro
      if(context.mounted)_irParaTelaDeEdicao(context, tipoEntrega);
    }
  }

  /// Finaliza o pedido com os dados já preenchidos
  Future<void> _finalizarPedidoComDados(
    BuildContext context,
    CompraProvider compraProvider,
  ) async {
    showDialog(
      context: context, 
      builder:(context) {
        return DialogFinalizarPedido();
      },
    );
  }

  void _irParaTelaDeEdicao(BuildContext context, TipoEntrega tipoEntrega) {
    if (tipoEntrega == TipoEntrega.retirada) {
      Navigator.pushNamed(context, Routes.adicionarInfoPessoal);
    } else {
      Navigator.pushNamed(context, Routes.adicionarEndereco);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<CompraProvider>(
      builder: (context, compraProvider, child) {
        final itens = compraProvider.itens;

        return itens.isEmpty
            ? Center(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.shopping_cart_outlined,
                      color: ColorsApp.vermelhoEscuroOpacidade56,
                      size: 80,
                    ),
                    SizedBox(height: 16),
                    Text(
                      'CARRINHO VAZIO',
                      style: TextStyle(
                        color: ColorsApp.vermelhoEscuroOpacidade56,
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Adicione produtos para começar',
                      style: TextStyle(
                        color: ColorsApp.vermelhoEscuroOpacidade56,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              )
            : Column(
                spacing: 8,
                children: [
                  // Header com total de itens
                  Container(
                    padding: EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: ColorsApp.vermelhoEscuro,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          '${itens.length} ${itens.length == 1 ? 'item' : 'itens'}',
                          style: TextStyle(
                            color: ColorsApp.branco,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          'Total: R\$${compraProvider.valorTotal.toStringAsFixed(2).replaceAll('.', ',')}',
                          style: TextStyle(
                            color: ColorsApp.branco,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: ListView.separated(
                      itemBuilder: (context, index) {
                        final item = itens[index];
                        return _buildItemCard(context, item, compraProvider);
                      },
                      separatorBuilder: (context, index) => SizedBox(height: 8),
                      itemCount: itens.length,
                    ),
                  ),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButtonFormField(
                      texto: "Comprar",
                      onPressed: () async {
                        final TipoEntrega? tipoSelecionado =
                            await showDialog<TipoEntrega>(
                              context: context,
                              builder: (context) {
                                return DialogOptionEntrega();
                              },
                            );
                        
                        if (tipoSelecionado != null && context.mounted) {
                          // ...debugPrint removido...
                          compraProvider.definirTipoEntrega(tipoSelecionado);
                          
                          // Verificar dados salvos antes de prosseguir
                          await _verificarDadosSalvos(context, tipoSelecionado, compraProvider);
                        }
                      },
                    ),
                  ),
                ],
              );
      },
    );
  }

  Widget _buildItemCard(
    BuildContext context,
    ItemCompra item,
    CompraProvider compraProvider,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: ColorsApp.branco,
        border: Border.all(color: ColorsApp.cinzaEscuro, width: 1),
        borderRadius: BorderRadius.circular(8),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 4),
        ],
      ),
      child: Row(
        children: [
          // Imagem do produto
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: ColorsApp.cinza,
              image: item.produto.urlImage.isNotEmpty
                  ? DecorationImage(
                      image: NetworkImage(item.produto.urlImage),
                      fit: BoxFit.cover,
                      onError: (exception, stackTrace) {
                        // Em caso de erro ao carregar a imagem
                      },
                    )
                  : null,
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(8),
                bottomLeft: Radius.circular(8),
              ),
            ),
            child: item.produto.urlImage.isEmpty
                ? Icon(
                    Icons.fastfood,
                    color: ColorsApp.vermelhoEscuro,
                    size: 30,
                  )
                : null,
          ),
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(left: 12, right: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.produto.nome,
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: ColorsApp.preto,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Text(
                    item.descricao,
                    style: TextStyle(
                      fontSize: 11,
                      color: ColorsApp.pretoOpacidade56,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Text(
                          'R\$${item.produto.preco.toStringAsFixed(2).replaceAll('.', ',')} x ${item.quantidade}',
                          style: TextStyle(
                            fontSize: 12,
                            color: ColorsApp.vermelhoEscuro,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Botão de remover
          Column(
            children: [
              IconButton(
                onPressed: () =>
                    _showRemoveConfirmation(context, item, compraProvider),
                icon: Icon(Icons.delete_outline),
                color: Colors.red.shade400,
                tooltip: 'Remover item',
              ),
              // Column(
              //   mainAxisAlignment: MainAxisAlignment.end,
              //   mainAxisSize: MainAxisSize.min,
              //   children: [
              //     InkWell(
              //       onTap: () => compraProvider.incrementarItem(item),
              //       child: Container(
              //         width: 24,
              //         height: 24,
              //         decoration: BoxDecoration(
              //           color: ColorsApp.vermelhoEscuro,
              //           borderRadius: BorderRadius.circular(12),
              //         ),
              //         child: Icon(Icons.add, color: ColorsApp.branco, size: 16),
              //       ),
              //     ),
              //     Container(
              //       margin: EdgeInsets.symmetric(horizontal: 6),
              //       padding: EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              //       decoration: BoxDecoration(
              //         color: ColorsApp.cinza,
              //         borderRadius: BorderRadius.circular(4),
              //       ),
              //       child: Text(
              //         '${item.quantidade}',
              //         style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
              //       ),
              //     ),
              //     InkWell(
              //       onTap: () => compraProvider.decrementarItem(item),
              //       child: Container(
              //         width: 24,
              //         height: 24,
              //         decoration: BoxDecoration(
              //           color: ColorsApp.vermelhoEscuro,
              //           borderRadius: BorderRadius.circular(12),
              //         ),
              //         child: Icon(
              //           Icons.remove,
              //           color: ColorsApp.branco,
              //           size: 16,
              //         ),
              //       ),
              //     ),
              //   ],
              // ),
            ],
          ),
        ],
      ),
    );
  }

  void _showRemoveConfirmation(
    BuildContext context,
    ItemCompra item,
    CompraProvider compraProvider,
  ) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Remover item'),
        content: Text('Deseja remover "${item.produto.nome}" do carrinho?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: Text('Cancelar'),
          ),
          TextButton(
            onPressed: () {
              compraProvider.removerItem(item);
              Navigator.of(context).pop();
            },
            child: Text('Remover', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

class DialogOptionEntrega extends StatefulWidget {
  const DialogOptionEntrega({super.key});

  @override
  State<DialogOptionEntrega> createState() => _DialogOptionEntregaState();
}

class _DialogOptionEntregaState extends State<DialogOptionEntrega> {
  TipoEntrega? tipoSelecionado;

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Container(
        padding: EdgeInsets.all(20),
        width: 250,
        height: 300,
        decoration: BoxDecoration(
          color: ColorsApp.branco,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Tipo de Entrega',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: ColorsApp.vermelhoEscuro,
              ),
            ),
            SizedBox(height: 16),
            RadioListTile<TipoEntrega>(
              title: Text('Delivery'),
              subtitle: Text('Entrega em casa'),
              value: TipoEntrega.delivery,
              groupValue: tipoSelecionado,
              onChanged: (TipoEntrega? value) {
                setState(() {
                  tipoSelecionado = value;
                });
              },
            ),
            RadioListTile<TipoEntrega>(
              title: Text('Retirada'),
              subtitle: Text('Retirar no local'),
              value: TipoEntrega.retirada,
              groupValue: tipoSelecionado,
              onChanged: (TipoEntrega? value) {
                setState(() {
                  tipoSelecionado = value;
                });
              },
            ),
            SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  child: Text(
                    'Cancelar',
                    style: TextStyle(color: ColorsApp.vermelhoEscuro),
                  ),
                ),
                ElevatedButton(
                  onPressed: tipoSelecionado != null
                      ? () {
                          // Aqui você pode processar o tipo selecionado
                          Navigator.of(context).pop(tipoSelecionado);
                        }
                      : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: ColorsApp.vermelhoEscuro,
                    foregroundColor: ColorsApp.branco,
                  ),
                  child: Text('Confirmar'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
