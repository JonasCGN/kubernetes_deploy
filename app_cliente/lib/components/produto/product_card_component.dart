import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/produtos/produtos.dart';
import 'product_availability_component.dart';
import 'product_description_component.dart';
import '../style/product_image_component.dart';
import 'product_price_component.dart';
import 'product_title_component.dart';
import 'package:flutter/material.dart';

class ProductCardComponent extends StatelessWidget {
  final Produto produto;
  final Function()? onTap;
  const ProductCardComponent({super.key, required this.produto, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: ColorsApp.branco,
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: EdgeInsets.all(10),
          height: 150,
          width: 350,
          child: Row(
            spacing: 12,
            children: [
              ProductImageComponent(urlImage: produto.urlImage),
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(top: 5.0, bottom: 5.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            spacing: 4,
                            children: [
                              ProductTitleComponent(
                                nome: produto.nome,
                              ),
                            ],
                          ),
                          ProductDescriptionComponent(
                            descricao: produto.descricao,
                          ),
                        ],
                      ),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          ProductPriceComponent(preco: produto.preco),
                          ProductAvailabilityComponent(
                            disponibilidade: produto.disponibilidade,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
