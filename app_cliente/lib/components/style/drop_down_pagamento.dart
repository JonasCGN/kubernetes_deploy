import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class DropDownPagamento extends StatelessWidget {
  const DropDownPagamento({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CompraProvider>(
      builder:
          (BuildContext context, CompraProvider compraProvider, Widget? child) {
            return DropdownButtonFormField<TipoPagamento>(
              value: compraProvider.compraAtual.tipoPagamento,
              dropdownColor: ColorsApp.branco,
              items: [
                DropdownMenuItem(
                  value: TipoPagamento.dinheiro,
                  child: Text("Dinheiro"),
                ),
                DropdownMenuItem(value: TipoPagamento.pix, child: Text("PIX")),
                DropdownMenuItem(
                  value: TipoPagamento.cartao,
                  child: Text("Cartão"),
                ),
              ],
              onChanged: (value) {
                if (value != null) {
                  compraProvider.definirTipoPagamento(value);
                }
              },
              decoration: InputDecoration(
                labelText: 'Forma de pagamento *',
                prefixIcon: Icon(
                  Icons.payment,
                  color: ColorsApp.vermelhoEscuro,
                ),
                floatingLabelStyle: TextStyle(
                  color: ColorsApp.preto
                ),
                focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide()
                ),
                border: OutlineInputBorder(
                  borderSide: BorderSide(),
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: ColorsApp.cinza,
              ),
              validator: (value) {
                if (value == null) {
                  return 'Selecione a forma de pagamento';
                }
                return null;
              },
            );
          },
    );
  }
}
