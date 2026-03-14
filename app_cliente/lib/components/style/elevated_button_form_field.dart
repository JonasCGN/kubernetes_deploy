import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class ElevatedButtonFormField extends StatelessWidget {
  final String texto;
  final Color? corFundo;
  final Color? corFundoHover;
  final Color? corText;
  final Color? corSplash;
  final BorderSide? borderSide;
  final Function()? onPressed;
  final double width;
  final double height;
  const ElevatedButtonFormField({
    super.key,
    required this.texto,
    this.corFundo,
    this.corFundoHover,
    this.corText,
    this.corSplash,
    this.width = double.infinity,
    this.height = 50,
    this.borderSide = BorderSide.none,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ButtonStyle(
        backgroundColor: WidgetStateProperty.resolveWith<Color>((states) {
          if (states.contains(WidgetState.hovered)) {
            return corFundoHover ?? ColorsApp.amareloEscuro;
          }
          return corFundo ?? ColorsApp.amarelo;
        }),
        foregroundColor: WidgetStateProperty.resolveWith<Color>((states) {
          if (states.contains(WidgetState.hovered)) {
            // Usa corText se fornecido, senão branco
            return corText ?? Colors.white;
          }
          // Usa corText se fornecido, senão preto
          return corText ?? Colors.black;
        }),
        overlayColor: WidgetStateProperty.all<Color>(
          corSplash ??
              ColorsApp.cinza.withAlpha(
                (255 * 0.2).floor(),
              ),
        ),
        shape: WidgetStateProperty.all<RoundedRectangleBorder>(
          RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(5),
            side: borderSide!,
          ),
        ),
        fixedSize: WidgetStateProperty.all<Size>(Size(width, height)),
        mouseCursor: WidgetStateProperty.all<MouseCursor>(
          SystemMouseCursors.click,
        ),
      ),
      child: Text(texto),
    );
  }
}
