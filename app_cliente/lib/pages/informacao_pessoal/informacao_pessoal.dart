import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/components/dialogs/dialog_finalizar_pedido.dart';
import 'package:app_cliente/components/style/drop_down_pagamento.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/storage/local_storage.dart';
import 'package:app_cliente/web/title_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';

class InformacoesPessoaisPage extends StatefulWidget {
  const InformacoesPessoaisPage({super.key});

  @override
  State<InformacoesPessoaisPage> createState() =>
      _InformacoesPessoaisPageState();
}

class _InformacoesPessoaisPageState extends State<InformacoesPessoaisPage> {
  final _formKey = GlobalKey<FormState>();
  final _nomeController = TextEditingController();
  final _telefoneController = TextEditingController();
  bool _isFormValid = false;

  @override
  void initState() {
    super.initState();
    // Carregar dados salvos
    setPageTitle("Informacao Pessoal");
    _carregarDadosSalvos();

    // Escutar mudanças nos campos para validação em tempo real
    _nomeController.addListener(_validateForm);
    _telefoneController.addListener(_validateForm);

    // Validação inicial
    WidgetsBinding.instance.addPostFrameCallback((_) => _validateForm());

  }
  /// Carrega dados salvos no local storage
  Future<void> _carregarDadosSalvos() async {
    final compraProvider = Provider.of<CompraProvider>(context, listen: false);

    // Primeiro, tentar usar dados do provider
    if (compraProvider.compraAtual.nomePessoa.isNotEmpty) {
      _nomeController.text = compraProvider.compraAtual.nomePessoa;
    }
    if (compraProvider.compraAtual.telefone.isNotEmpty) {
      _telefoneController.text = compraProvider.compraAtual.telefone;
    }

    // Se não tiver dados no provider, carregar do storage
    if (_nomeController.text.isEmpty || _telefoneController.text.isEmpty) {
      final nomeSalvo = await LocalStorageHelper.getName();
      final telefoneSalvo = await LocalStorageHelper.getPhone();

      if (nomeSalvo != null &&
          nomeSalvo.isNotEmpty &&
          _nomeController.text.isEmpty) {
        _nomeController.text = nomeSalvo;
      }

      if (telefoneSalvo != null &&
          telefoneSalvo.isNotEmpty &&
          _telefoneController.text.isEmpty) {
        _telefoneController.text = telefoneSalvo;
      }
    }
  }

  @override
  void dispose() {
    _nomeController.removeListener(_validateForm);
    _telefoneController.removeListener(_validateForm);
    _nomeController.dispose();
    _telefoneController.dispose();
    super.dispose();
  }

  void _validateForm() {
    final camposFaltando = _validarCamposObrigatorios();
    final isValid = camposFaltando.isEmpty;

    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  /// Validar campos obrigatórios para retirada
  List<String> _validarCamposObrigatorios() {
    List<String> camposFaltando = [];

    if (_nomeController.text.trim().length < 2) {
      camposFaltando.add('Nome completo (mínimo 2 caracteres)');
    }

    final telefoneNumeros = _telefoneController.text.replaceAll(
      RegExp(r'[^\d]'),
      '',
    );
    if (telefoneNumeros.length < 10) {
      camposFaltando.add('Telefone válido (mínimo 10 dígitos)');
    }

    return camposFaltando;
  }

  /// Mostrar dialog com campos faltando
  void _mostrarCamposFaltando(List<String> camposFaltando) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: ColorsApp.branco,
        title: Row(
          children: [
            Icon(Icons.warning, color: ColorsApp.vermelhoEscuro),
            SizedBox(width: 8),
            Text(
              'Campos Obrigatórios',
              style: TextStyle(
                color: ColorsApp.cinzaEscuro,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: SizedBox(
          width: 350,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Os seguintes campos são obrigatórios para retirada:',
                style: TextStyle(fontSize: 16, color: ColorsApp.cinzaEscuro),
              ),
              SizedBox(height: 12),
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: ColorsApp.vermelhoEscuro.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                    color: ColorsApp.vermelhoEscuro.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: camposFaltando
                      .map(
                        (campo) => Padding(
                          padding: EdgeInsets.symmetric(vertical: 2),
                          child: Row(
                            children: [
                              Icon(
                                Icons.error_outline,
                                size: 16,
                                color: ColorsApp.vermelhoEscuro,
                              ),
                              SizedBox(width: 8),
                              Expanded(
                                child: Text(
                                  campo,
                                  style: TextStyle(
                                    color: ColorsApp.cinzaEscuro,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                      .toList(),
                ),
              ),
            ],
          ),
        ),
        actions: [
          ElevatedButtonFormField(
            texto: 'ENTENDI',
            corFundo: ColorsApp.vermelhoEscuro,
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
    );
  }

  String _formatTelefone(String valor) {
    // Remove todos os caracteres não numéricos
    final numeros = valor.replaceAll(RegExp(r'[^\d]'), '');

    // Aplica a máscara baseada no tamanho
    if (numeros.length <= 10) {
      // Formato: (11) 9999-9999
      if (numeros.length >= 6) {
        return '(${numeros.substring(0, 2)}) ${numeros.substring(2, 6)}-${numeros.substring(6)}';
      } else if (numeros.length >= 2) {
        return '(${numeros.substring(0, 2)}) ${numeros.substring(2)}';
      }
    } else {
      // Formato: (11) 99999-9999
      return '(${numeros.substring(0, 2)}) ${numeros.substring(2, 7)}-${numeros.substring(7, 11)}';
    }
    return numeros;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'Informações Pessoais',
          style: TextStyle(
            color: ColorsApp.branco,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: ColorsApp.vermelhoEscuro,
        iconTheme: IconThemeData(color: ColorsApp.branco),
        elevation: 0,
      ),
      body: Consumer<CompraProvider>(
        builder: (context, compraProvider, child) {
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: ConstrainedBox(
              constraints: BoxConstraints(
                minHeight:
                    MediaQuery.of(context).size.height -
                    MediaQuery.of(context).padding.top -
                    kToolbarHeight -
                    32, // AppBar + padding
              ),
              child: IntrinsicHeight(
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    spacing: 10,
                    children: [
                      // Header com ícone
                      Container(
                        padding: EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          color: ColorsApp.vermelhoEscuro.withValues(
                            alpha: 0.1,
                          ),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          children: [
                            Icon(
                              Icons.person_add,
                              size: 48,
                              color: ColorsApp.vermelhoEscuro,
                            ),
                            SizedBox(height: 12),
                            Text(
                              'Precisamos de algumas informações para finalizar seu pedido:',
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 16,
                                color: ColorsApp.vermelhoEscuro,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      TextFormField(
                        controller: _nomeController,
                        textCapitalization: TextCapitalization.words,
                        decoration: InputDecoration(
                          labelText: 'Nome completo *',
                          prefixIcon: Icon(
                            Icons.person,
                            color: ColorsApp.vermelhoEscuro,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: ColorsApp.vermelhoEscuro,
                              width: 2,
                            ),
                          ),
                          errorBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: ColorsApp.vermelho,
                              width: 2,
                            ),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade50,
                        ),
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Por favor, digite seu nome';
                          }
                          if (value.trim().length < 2) {
                            return 'Nome deve ter pelo menos 2 caracteres';
                          }
                          return null;
                        },
                      ),
                      TextFormField(
                        controller: _telefoneController,
                        decoration: InputDecoration(
                          labelText: 'Telefone/WhatsApp *',
                          prefixIcon: Icon(
                            Icons.phone,
                            color: ColorsApp.vermelhoEscuro,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(
                              color: ColorsApp.vermelhoEscuro,
                              width: 2,
                            ),
                          ),
                          errorBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: BorderSide(color: Colors.red, width: 2),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade50,
                          hintText: '(11) 99999-9999',
                          helperText: 'Com DDD',
                        ),
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.digitsOnly,
                          LengthLimitingTextInputFormatter(11),
                          TextInputFormatter.withFunction((oldValue, newValue) {
                            final formatted = _formatTelefone(newValue.text);
                            return TextEditingValue(
                              text: formatted,
                              selection: TextSelection.collapsed(
                                offset: formatted.length,
                              ),
                            );
                          }),
                        ],
                        validator: (value) {
                          if (value == null || value.trim().isEmpty) {
                            return 'Por favor, digite seu telefone';
                          }
                          final numeroLimpo = value.replaceAll(
                            RegExp(r'[^\d]'),
                            '',
                          );
                          if (numeroLimpo.length < 10) {
                            return 'Telefone deve ter pelo menos 10 dígitos';
                          }
                          if (numeroLimpo.length > 11) {
                            return 'Telefone deve ter no máximo 11 dígitos';
                          }
                          return null;
                        },
                      ),
                      DropDownPagamento(),

                      // Informação sobre o tipo de entrega
                      Container(
                        padding: EdgeInsets.all(12),
                        margin: EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          color: Colors.blue.shade50,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: Colors.blue.shade200),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              compraProvider.compraAtual.tipoEntrega ==
                                      TipoEntrega.delivery
                                  ? Icons.delivery_dining
                                  : Icons.store,
                              color: Colors.blue.shade700,
                            ),
                            SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                compraProvider.compraAtual.tipoEntrega ==
                                        TipoEntrega.delivery
                                    ? 'Entrega: Será solicitado endereço na próxima etapa'
                                    : 'Retirada: Você pode buscar no local',
                                style: TextStyle(
                                  color: Colors.blue.shade700,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Botão Continuar
                      ElevatedButton(
                        onPressed: compraProvider.isLoading
                            ? null
                            : (_isFormValid ? _salvarInformacoes : null),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _isFormValid
                              ? ColorsApp.vermelhoEscuro
                              : Colors.grey,
                          foregroundColor: ColorsApp.branco,
                          padding: EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          elevation: _isFormValid ? 3 : 1,
                        ),
                        child: compraProvider.isLoading
                            ? Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      color: ColorsApp.branco,
                                      strokeWidth: 2,
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  Text('Finalizando pedido...'),
                                ],
                              )
                            : Text(
                                compraProvider.compraAtual.tipoEntrega ==
                                        TipoEntrega.delivery
                                    ? 'Continuar para Endereço'
                                    : 'Finalizar Pedido',
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                      ),

                      if (compraProvider.error != null) ...[
                        SizedBox(height: 16),
                        Container(
                          padding: EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.red.shade300),
                          ),
                          child: Text(
                            compraProvider.error!,
                            style: TextStyle(color: Colors.red.shade700),
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Future<void> _salvarInformacoes() async {
    // Verificar se há campos faltando
    final camposFaltando = _validarCamposObrigatorios();

    if (camposFaltando.isNotEmpty) {
      _mostrarCamposFaltando(camposFaltando);
      return;
    }

    final compraProvider = Provider.of<CompraProvider>(context, listen: false);

    // Extrair apenas números do telefone para salvar
    final telefone = _telefoneController.text.replaceAll(RegExp(r'[^\d]'), '');

    // Salvar as informações no provider
    compraProvider.definirNomePessoa(_nomeController.text.trim());
    compraProvider.definirTelefone(telefone);

    // Salvar dados localmente para próximas compras
    await LocalStorageHelper.saveName(_nomeController.text.trim());
    await LocalStorageHelper.savePhone(telefone);

    // Se for retirada, finalizar o pedido diretamente
    if (compraProvider.compraAtual.tipoEntrega == TipoEntrega.retirada) {
      if(mounted){
        showDialog(
          context: context, 
          builder:(context) {
            return DialogFinalizarPedido();
          },
        );
      }
      // Se houve erro, a mensagem já será exibida pelo Consumer
    } else {
      // Se for delivery, voltar para o fluxo normal
      if (mounted) Navigator.of(context).pop();
    }
  }
}
