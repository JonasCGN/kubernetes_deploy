import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ProductPriceComponent extends StatelessWidget {
  final double preco;
  final TextStyle? customStyle;

  const ProductPriceComponent({
    super.key,
    required this.preco,
    this.customStyle,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      'R\$ ${preco.toStringAsFixed(2).replaceFirst('.', ',')}',
      style: customStyle ?? TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: ColorsApp.preto,
      ),
    );
  }
}
