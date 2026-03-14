import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class DialogProcessamentoPedido extends StatelessWidget {
  const DialogProcessamentoPedido({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        padding: EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: ColorsApp.branco,
          borderRadius: BorderRadius.circular(5),
        ),
        child: Column(
          spacing: 10,
          mainAxisSize: MainAxisSize.min,
          children: [
            Image.asset(
              "assets/images/hamburguer_feliz.png",
              width: 200,
              height: 200,
            ),
            Text(
              "Seu pedido foi processado",
              style: TextStyle(color: ColorsApp.pretoOpacidade56, fontSize: 20),
            ),
            Text(
              "Vamos falar com você via Whatsapp",
              style: TextStyle(color: ColorsApp.pretoOpacidade56, fontSize: 15),
            ),
            ElevatedButtonFormField(
              texto: "Ir para Whatsapp",
              corFundo: ColorsApp.verde,
              corFundoHover: ColorsApp.branco,
              width: 200,
              onPressed: () async {
                const whatsappUrl = "whatsapp://";
                await launchUrl(
                  Uri.parse(whatsappUrl),
                  mode: LaunchMode.externalApplication,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
