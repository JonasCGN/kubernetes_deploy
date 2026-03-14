import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/routes/routes.dart';
import 'package:flutter/material.dart';

class NotFoundPage extends StatelessWidget {
  const NotFoundPage({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;
    final isMobile = size.width < 600;

    return Scaffold(
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage('assets/images/background.png'),
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: Container(
            width: isMobile ? size.width * 0.9 : 500,
            height: isMobile ? null : 500,
            padding: EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: ColorsApp.branco,
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Image.asset(
                  "assets/images/hamburguer_confuso.png",
                  scale: isMobile ? 6 : 4,
                ),
                SizedBox(height: isMobile ? 16 : 0),
                Column(
                  children: [
                    Text(
                      "404",
                      style: TextStyle(
                        fontSize: isMobile ? 28 : 34,
                        color: ColorsApp.vermelho,
                      ),
                    ),
                    Text(
                      "Rota não Encontrada",
                      style: TextStyle(
                        fontSize: isMobile ? 20 : 28,
                        color: ColorsApp.cinzaEscuro,
                      ),
                    ),
                  ],
                ),
                SizedBox(height: isMobile ? 16 : 0),
                ElevatedButtonFormField(
                  texto: "Voltar ao Início",
                  onPressed: () {
                    Navigator.pushReplacementNamed(context, Routes.home);
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
