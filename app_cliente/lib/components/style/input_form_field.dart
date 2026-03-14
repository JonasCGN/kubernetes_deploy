import '../../class/color/colors_app.dart';
import 'package:flutter/material.dart';

class InputFormField extends StatelessWidget {
  final String labelText;
  final bool expandedInput;
  final bool obscureText;
  final TextInputType typeKeyboard;
  final bool? enabled;
  final TextEditingController? controller;
  const InputFormField({
    super.key,
    required this.labelText,
    this.obscureText = false,
    this.expandedInput = false,
    this.controller,
    this.enabled,
    this.typeKeyboard = TextInputType.name,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      keyboardType: typeKeyboard,
      enabled: enabled,
      minLines: expandedInput
          ? 5
          : null, // Defina o mínimo de linhas (altura inicial)
      maxLines: null, // Permite crescer conforme o texto
      decoration: InputDecoration(
        hintText: labelText,
        border: OutlineInputBorder(borderSide: BorderSide(color: Colors.black)),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: Colors.black),
        ),
        floatingLabelStyle: TextStyle(color: ColorsApp.preto),
        filled: true,
        fillColor: ColorsApp.cinza,
      ),
      cursorColor: ColorsApp.preto,
      obscureText: obscureText,
    );
  }
}
