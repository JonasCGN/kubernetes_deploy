import 'package:app_cliente/components/style/input_form_field.dart';
import 'package:flutter/material.dart';

class InputFieldNameComponent extends StatelessWidget {
  final String text;
  final Widget? landing;
  final String placeHolder;
  final bool expandedInput;
  final bool? enabled;
  final TextInputType typeKeyboard;
  final TextEditingController? controller;
  const InputFieldNameComponent({
    super.key,
    required this.text,
    required this.placeHolder,
    this.landing,
    this.controller,
    this.typeKeyboard = TextInputType.name,
    this.expandedInput = false,
    this.enabled,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(text),
            ?landing
          ],
        ),
        InputFormField(
          labelText: placeHolder, 
          enabled: enabled,
          controller: controller,
          expandedInput: expandedInput,
          typeKeyboard: typeKeyboard,
        ),
      ],
    );
  }
}