import 'package:app_cliente/components/home/top_bar_component.dart';
import 'package:app_cliente/components/style/side_bar_content.dart';
import 'package:app_cliente/pages/home/components/carrinho_compras_content.dart';
import 'package:app_cliente/pages/home/components/information_lanchonete_content.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:flutter/gestures.dart';
import 'package:provider/provider.dart';
import 'filter_options.dart';
import 'produtos_options.dart';
import 'package:flutter/material.dart';

class ComponentHomePage extends StatefulWidget {
  const ComponentHomePage({super.key});

  @override
  State<ComponentHomePage> createState() => _ComponentHomePageState();
}

class _ComponentHomePageState extends State<ComponentHomePage> {
  @override
  void initState() {
    super.initState();
    Future.delayed(Duration.zero, () {
      if (mounted) {
        final compraProvider = Provider.of<CompraProvider>(
          context,
          listen: false,
        );
        if (Responsividade.isMobile(context)) {
          compraProvider.setShowCar(false);
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final compraProvider = Provider.of<CompraProvider>(context);

    return SideBarContent(
      sideShow: false,
      widgets: [
        Expanded(
          child: Stack(
            children: [
              Column(
                spacing: 10,
                children: [
                  TopBarComponent(userName: 'Usuário'),
                  Expanded(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: ScrollConfiguration(
                            behavior: MaterialScrollBehavior().copyWith(
                              dragDevices: {
                                PointerDeviceKind.touch,
                                PointerDeviceKind.mouse,
                              },
                            ),
                            child: SingleChildScrollView(
                              child: Container(
                                padding: EdgeInsets.only(
                                  left: 5,
                                  right: 5,
                                  bottom: 20,
                                ),
                                child: Column(
                                  spacing: 10,
                                  children: [
                                    InformationLanchoneteContent(),
                                    FilterOptions(),
                                    ProdutosOptions(),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ),
                        // Carrinho fixo só em desktop
                        if (compraProvider.showCar &&
                            !Responsividade.isMobile(context))
                          CarrinhoComprasContent(),
                      ],
                    ),
                  ),
                ],
              ),
              if (compraProvider.showCar && Responsividade.isMobile(context))
                CarrinhoComprasContent(),
            ],
          ),
        ),
      ],
    );
  }
}
