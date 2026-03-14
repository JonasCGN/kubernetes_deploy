import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class SidebarComponent extends StatelessWidget {
  const SidebarComponent({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: double.infinity,
      width: 150,
      color: ColorsApp.vermelhoEscuro,
      // Aqui você pode adicionar os itens do menu lateral
      child: Column(
        children: [
          // Adicione seus itens de menu aqui
        ],
      ),
    );
  }
}
