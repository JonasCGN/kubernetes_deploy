import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/produtos/insumos.dart';
import 'package:flutter/material.dart';

class InsumosWithSelection {
  final Insumos insumo;
  bool isSelected;

  InsumosWithSelection({required this.insumo, required this.isSelected});
}

class ShowInfosInsumosComponent extends StatelessWidget {
  final List<Insumos> insumos;
  const ShowInfosInsumosComponent({super.key, required this.insumos});

  @override
  Widget build(BuildContext context) {
    List<InsumosWithSelection> insumosSelected = insumos
        .map(
          (insumo) => InsumosWithSelection(insumo: insumo, isSelected: false),
        )
        .toList();

    return ListView.separated(
      itemBuilder: (context, index) {
        return Container(
          decoration: BoxDecoration(
            color: ColorsApp.branco,
            border: Border.all(width: 1),
            borderRadius: BorderRadius.circular(5),
          ),
          child: StatefulBuilder(
            builder: (context, setState) {
              return Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () {
                    setState(() {
                      insumosSelected[index].isSelected =
                          !insumosSelected[index].isSelected;
                    });
                  },
                  child: ListTile(
                    title: Text(insumosSelected[index].insumo.nome),
                    trailing: Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: insumosSelected[index].isSelected
                            ? ColorsApp.cinzaEscuro
                            : ColorsApp.cinzaEscuro,
                        border: Border.all(
                          color: ColorsApp.cinzaEscuro,
                          width: 4,
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: insumosSelected[index].isSelected
                          ? Container(
                              width: 20,
                              decoration: BoxDecoration(
                                color: ColorsApp.amarelo,
                                shape: BoxShape.circle,
                              ),
                            )
                          : null,
                    ),
                  ),
                ),
              );
            },
          ),
        );
      },
      separatorBuilder: (context, index) => const SizedBox(height: 5),
      itemCount: insumos.length,
      shrinkWrap: true,
      physics: NeverScrollableScrollPhysics(),
    );
  }
}
