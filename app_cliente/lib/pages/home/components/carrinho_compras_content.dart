import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/pages/home/components/show_compras_content.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';

class CarrinhoComprasContent extends StatelessWidget {
  const CarrinhoComprasContent({super.key});

  @override
  Widget build(BuildContext context) {
    final isMobile = Responsividade.isMobile(context);
    final showCar = Provider.of<CompraProvider>(context).showCar;

    if (!showCar) return const SizedBox.shrink();

    final carrinhoContent = Column(
      children: [
        Flexible(child: ShowComprasContent()),
      ],
    );

    if (isMobile) {
      final height = MediaQuery.of(context).size.height * 0.6;
      return Positioned(
        left: 0,
        right: 0,
        bottom: 0,
        child: Material(
          elevation: 12,
          child: Container(
            height: height,
            width: double.infinity,
            color: ColorsApp.branco,
            padding: EdgeInsets.all(10),
            child: carrinhoContent,
          ),
        ),
      );
    } else {
      return Container(
        width: 300,
        color: ColorsApp.branco,
        padding: EdgeInsets.all(10),
        child: carrinhoContent,
      );
    }
  }
}
