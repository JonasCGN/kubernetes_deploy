import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ProductImageComponent extends StatelessWidget {
  final String urlImage;
  final double width;
  final double height;

  const ProductImageComponent({
    super.key,
    required this.urlImage,
    this.width = 120,
    this.height = 120,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        color: ColorsApp.cinza,
      ),
      child: urlImage.isNotEmpty
          ? ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                urlImage,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Icon(
                    Icons.image_not_supported,
                    color: ColorsApp.preto,
                    size: 30,
                  );
                },
              ),
            )
          : Icon(Icons.image, color: ColorsApp.preto, size: 30),
    );
  }
}
