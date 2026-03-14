import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/pages/home/components/status_lanchonete_component.dart';
import 'package:flutter/material.dart';

class InformationLanchoneteContent extends StatelessWidget {
  const InformationLanchoneteContent({super.key});

  @override
  Widget build(BuildContext context) {
    String? image = '';
    const double borderWidth = 75;
    const double containerHeight = 250;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        Container(
          height: containerHeight,
          decoration: image.isNotEmpty
              ? BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage(image),
                    fit: BoxFit.cover,
                  ),
                  border: Border(
                    bottom: BorderSide(color: ColorsApp.branco, width: borderWidth),
                  ),
                )
              : BoxDecoration(
                  color: Colors.grey,
                  border: Border(
                    bottom: BorderSide(color: ColorsApp.branco, width: borderWidth),
                  ),
                ),
        ),
        Positioned(
          bottom: 0, // Posiciona a imagem exatamente em cima do border
          left: 0,
          right: 0,
          child: Center(
            child: Column(
              children: [
                Image.asset(
                  'assets/images/logo.png',
                  height: 130,
                ),
                StatusLanchoneteComponent()
              ],
            ),
          ),
        ),
      ],
    );
  }
}
