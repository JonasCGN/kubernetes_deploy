import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/class/endereco/endereco.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:flutter/material.dart';

class DialogConfirmarDados extends StatelessWidget {
  final String nome;
  final String telefone;
  final Endereco? endereco;
  final TipoEntrega tipoEntrega;
  final VoidCallback onConfirmar;
  final VoidCallback onAlterar;

  const DialogConfirmarDados({
    super.key,
    required this.nome,
    required this.telefone,
    this.endereco,
    required this.tipoEntrega,
    required this.onConfirmar,
    required this.onAlterar,
  });

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      backgroundColor: ColorsApp.branco,
      title: Row(
        children: [
          Icon(Icons.person, color: ColorsApp.amarelo),
          SizedBox(width: 8),
          Text(
            'Confirmar Dados',
            style: TextStyle(
              color: ColorsApp.cinzaEscuro,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
      content: SizedBox(
        width: 400,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Encontramos seus dados salvos:',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
              ),
            ),
            SizedBox(height: 16),
            
            // Card com os dados
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: ColorsApp.amarelo.withAlpha((255 * 0.1).floor()),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: ColorsApp.amarelo.withAlpha((255 * 0.3).floor())),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildDadoItem('Nome:', nome),
                  SizedBox(height: 8),
                  _buildDadoItem('Telefone:', telefone),
                  
                  if (tipoEntrega == TipoEntrega.delivery && endereco != null) ...[
                    SizedBox(height: 8),
                    _buildDadoItem('Endereço:', 
                      '${endereco!.rua}, ${endereco!.numero}\n'
                      '${endereco!.bairro}'
                      '${endereco!.complemento?.isNotEmpty == true ? '\n${endereco!.complemento}' : ''}'
                    ),
                  ],
                ],
              ),
            ),
            
            SizedBox(height: 16),
            Text(
              'Deseja usar estes dados ou alterá-los?',
              style: TextStyle(
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
      actions: [
        Row(
          children: [
            Expanded(
              child: ElevatedButtonFormField(
                texto: 'ALTERAR',
                corFundo: ColorsApp.vermelho,
                corFundoHover: ColorsApp.vermelhoEscuro,
                onPressed: () {
                  Navigator.of(context).pop();
                  onAlterar();
                },
              ),
            ),
            SizedBox(width: 12),
            Expanded(
              child: ElevatedButtonFormField(
                texto: 'USAR DADOS',
                corFundo: ColorsApp.amarelo,
                corText: ColorsApp.preto,
                onPressed: () {
                  Navigator.of(context).pop();
                  onConfirmar();
                },
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildDadoItem(String label, String valor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontWeight: FontWeight.bold,
            color: ColorsApp.preto,
            fontSize: 12,
          ),
        ),
        SizedBox(height: 2),
        Text(
          valor,
          style: TextStyle(
            color: ColorsApp.preto,
            fontSize: 14,
          ),
        ),
      ],
    );
  }
}
