import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/components/home/top_bar_component.dart';
import 'package:app_cliente/components/style/side_bar_content.dart';
import 'package:app_cliente/pages/adicionar_endereco/content/forms_endereco_content.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

class AdicionarEnderecoContent extends StatelessWidget {
  final TipoEntrega delivery;
  const AdicionarEnderecoContent({
    super.key,
    this.delivery = TipoEntrega.delivery
  });

  @override
  Widget build(BuildContext context) {
    return SideBarContent(
      sideShow: false,
      widgets: [
        Expanded(
          child: Column(
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
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Adicionar seu endereço',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 20,
                                  ),
                                ),
                                FormsEnderecoContent(
                                  delivery: delivery,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                    // CarrinhoComprasContent(),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
