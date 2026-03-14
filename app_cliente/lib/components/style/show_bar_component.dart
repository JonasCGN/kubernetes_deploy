import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ShowBarComponent extends StatelessWidget {
  final String text;
  const ShowBarComponent({
    super.key,
    required this.text
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: 55,
      decoration: BoxDecoration(
        color: ColorsApp.vermelhoEscuro,
        border: Border(
          bottom: BorderSide(
            color: ColorsApp.vermelho,
            width: 5
          )
        ),
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(10),
          topRight: Radius.circular(10),
        )
      ),
      padding: EdgeInsets.all(8),
      child: Text(
        text,
        style: TextStyle(
          color: ColorsApp.branco,
          fontSize: 23
        ),
      ),
    );
  }
}