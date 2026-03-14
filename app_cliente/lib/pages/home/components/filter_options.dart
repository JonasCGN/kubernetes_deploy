import 'dart:ui';
import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/components/home/option_filter_componnt.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FilterOptions extends StatefulWidget {
  const FilterOptions({super.key});

  @override
  State<FilterOptions> createState() => _FilterOptionsState();
}

class _FilterOptionsState extends State<FilterOptions> {
  late TextEditingController _searchController;

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        ScrollConfiguration(
          behavior: const MaterialScrollBehavior().copyWith(
            dragDevices: {PointerDeviceKind.touch, PointerDeviceKind.mouse},
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Consumer<ProdutosProvider>(
              builder: (BuildContext context, ProdutosProvider value, Widget? child) {
                List<String> categorias = value.categorias;
                if (value.isLoading) {
                  // Exibe placeholders de loading (efeito shimmer)
                  return Wrap(
                    spacing: 7,
                    runSpacing: 7,
                    children: List.generate(4, (index) {
                      return Container(
                        width: 200,
                        height: 50,
                        decoration: BoxDecoration(
                          color: Colors.grey.withAlpha((255 * 0.3).floor()),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        margin: const EdgeInsets.symmetric(vertical: 4),
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(12),
                          child: Stack(
                            children: [
                              Positioned.fill(
                                child: AnimatedOpacity(
                                  opacity: 0.7,
                                  duration: const Duration(milliseconds: 800),
                                  child: Container(color: Colors.grey[300]),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  );
                }
                return Row(
                  spacing: 5,
                  children: [
                    // Botão "Todos" para limpar filtros
                    Consumer<ProdutosProvider>(
                      builder: (context, provider, child) {
                        final isAllSelected = provider.categoriaFiltrada == null;
                        return Material(
                          color: isAllSelected ? ColorsApp.amareloEscuro : ColorsApp.branco,
                          borderRadius: BorderRadius.circular(8),
                          elevation: isAllSelected ? 2 : 0,
                          child: SizedBox(
                            height: 50,
                            width: 100,
                            child: InkWell(
                              borderRadius: BorderRadius.circular(8),
                              onTap: () {
                                provider.setFiltroCategoria(null);
                              },
                              child: Center(
                                child: Text(
                                  'TODOS',
                                  style: TextStyle(
                                    color: isAllSelected ? ColorsApp.branco : ColorsApp.preto,
                                    fontWeight: isAllSelected ? FontWeight.bold : FontWeight.normal,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(width: 5),
                    // Filtros por categoria
                    ...categorias.map((categoria) {
                      return OptionFilterComponent(name: categoria);
                    }),
                  ],
                );
              },
            ),
          ),
        ),
      ],
    );
  }
}
