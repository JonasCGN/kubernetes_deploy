import 'dart:ui';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'package:app_cliente/components/produto/product_card_component.dart';
import 'package:app_cliente/pages/home/dialog/adicionar_produto.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ProdutosOptions extends StatefulWidget {
  const ProdutosOptions({super.key});

  @override
  State<ProdutosOptions> createState() => _ProdutosOptionsState();
}

class _ProdutosOptionsState extends State<ProdutosOptions> {
  @override
  void initState() {
    super.initState();
    // Carrega produtos com insumos após o widget ser inicializado
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<ProdutosProvider>(context, listen: false).carregarProdutos();
    });
  }

  @override
  Widget build(BuildContext context) {
    return ScrollConfiguration(
      behavior: MaterialScrollBehavior().copyWith(
        dragDevices: {PointerDeviceKind.touch, PointerDeviceKind.mouse},
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.vertical,
        child: Consumer<ProdutosProvider>(
          builder:
              (BuildContext context, ProdutosProvider value, Widget? child) {
                if (value.isLoading) {
                  return Wrap(
                    spacing: 7,
                    runSpacing: 7,
                    children: List.generate(4, (index) {
                      return Container(
                        width: 350,
                        height: 180,
                        decoration: BoxDecoration(
                          color: Colors.grey.withAlpha((255 * 0.3).floor()),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Stack(
                            children: [
                              Positioned.fill(
                                child: AnimatedOpacity(
                                  opacity: 0.7,
                                  duration: const Duration(milliseconds: 800),
                                  child: Container(color: Colors.grey[300]),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  );
                }
                Map<int, Produto> produtos = value.produtos;
                return Wrap(
                  spacing: 7,
                  runSpacing: 7,
                  children: produtos.values.map((produto) {
                    return ProductCardComponent(
                      produto: produto,
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (dialogContext) =>
                              AdicionarProduto(produto: produto),
                        );
                      },
                    );
                  }).toList(),
                );
              },
        ),
      ),
    );
  }
}
