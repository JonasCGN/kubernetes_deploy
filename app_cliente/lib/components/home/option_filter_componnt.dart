import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class OptionFilterComponent extends StatelessWidget {
  final String name;
  const OptionFilterComponent({
    super.key,
    required this.name
  });

  @override
  Widget build(BuildContext context) {
    return Consumer<ProdutosProvider>(
      builder: (context, produtosProvider, child) {
        final isSelected = produtosProvider.categoriaFiltrada?.toLowerCase() == name.toLowerCase();
        
        return Material(
          color: isSelected ? ColorsApp.amareloEscuro : ColorsApp.branco,
          borderRadius: BorderRadius.circular(8),
          elevation: isSelected ? 2 : 0,
          child: SizedBox(
            height: 50,
            width: 200,
            child: InkWell(
              borderRadius: BorderRadius.circular(8),
              onTap: () {
                // Se já está selecionado, remove o filtro. Senão, aplica o filtro.
                if (isSelected) {
                  produtosProvider.setFiltroCategoria(null);
                } else {
                  produtosProvider.setFiltroCategoria(name);
                }
              },
              child: Center(
                child: Text(
                  name.toUpperCase(),
                  style: TextStyle(
                    color: isSelected ? ColorsApp.branco : ColorsApp.preto,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}