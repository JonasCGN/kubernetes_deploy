import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ProductTitleComponent extends StatelessWidget {
  final String nome;

  const ProductTitleComponent({
    super.key,
    required this.nome,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      nome,
      style: TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.bold,
        color: ColorsApp.preto,
      ),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );
  }
}
