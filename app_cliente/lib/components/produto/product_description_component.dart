import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ProductDescriptionComponent extends StatelessWidget {
  final String descricao;
  final int maxLines;

  const ProductDescriptionComponent({
    super.key,
    required this.descricao,
    this.maxLines = 2,
  });

  @override
  Widget build(BuildContext context) {
    return Text(
      descricao,
      style: TextStyle(
        fontSize: 12,
        color: ColorsApp.pretoOpacidade56,
      ),
      maxLines: maxLines,
      overflow: TextOverflow.ellipsis,
    );
  }
}
