import 'package:flutter/material.dart';

class ProductAvailabilityComponent extends StatelessWidget {
  final bool disponibilidade;

  const ProductAvailabilityComponent({
    super.key,
    required this.disponibilidade,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          disponibilidade ? 'Disponível' : 'Indisponível',
          style: TextStyle(
            color: disponibilidade ? Colors.green : Colors.red,
            fontSize: 10,
            fontWeight: FontWeight.w500,
          ),
        ),
        SizedBox(width: 4),
        Icon(
          disponibilidade ? Icons.check : Icons.block,
          color: disponibilidade ? Colors.green : Colors.red,
          size: 15,
        ),
      ],
    );
  }
}
