import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CarCountItensComponent extends StatelessWidget {
  const CarCountItensComponent({super.key});

  @override
  Widget build(BuildContext context) {
    final CompraProvider compraProvider = Provider.of(context,listen: false);
    return Material(
      child: InkWell(
        onTap: (){
          compraProvider.setShowCar(!(compraProvider.showCar));
        },
        child: Stack(
          alignment: Alignment.topRight,
          children: [
            Icon(Icons.shopping_cart, size: 28, color: ColorsApp.preto),
            Positioned(
              right: 0,
              top: 0,
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.red,
                  shape: BoxShape.circle,
                ),
                constraints: BoxConstraints(minWidth: 12, minHeight: 12),
                child: Text(
                  compraProvider.itens.length.toString(),
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
