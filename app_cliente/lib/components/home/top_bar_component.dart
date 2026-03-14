import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/components/home/car_count_itens_component.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:app_cliente/routes/routes.dart';
import 'package:provider/provider.dart';

import 'search_bar_component.dart';
import 'user_profile_component.dart';
import 'package:flutter/material.dart';

class TopBarComponent extends StatelessWidget {
  final String userName;
  final bool telaInfoUser;
  const TopBarComponent({
    super.key,
    this.userName = 'Usuário',
    this.telaInfoUser = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 50,
      decoration: BoxDecoration(color: ColorsApp.branco),
      padding: EdgeInsets.all(10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        spacing: 5,
        children: [
          if (telaInfoUser)
            IconButton(
              onPressed: () {
                Navigator.pushReplacementNamed(context,Routes.home);
              },
              icon: Icon(Icons.arrow_back, size: 20),
            ),
          Expanded(
            child: SearchBarComponent(
              onChanged: (value) {
                Provider.of<ProdutosProvider>(
                  context,
                  listen: false,
                ).setBusca(value);
              },
            ),
          ),
          Material(
            color: ColorsApp.branco,
            child: InkWell(
              onTap: !telaInfoUser
                  ? () {
                      Navigator.pushNamed(context, Routes.dadosSalvos);
                    }
                  : null,
              child: UserProfileComponent(userName: userName),
            ),
          ),
          if (Responsividade.isMobile(context)) ...[CarCountItensComponent()],
        ],
      ),
    );
  }
}
