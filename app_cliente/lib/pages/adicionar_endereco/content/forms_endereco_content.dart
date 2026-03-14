import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/compra/compra.dart';
import 'package:app_cliente/class/endereco/endereco.dart';
import 'package:app_cliente/components/dialogs/dialog_finalizar_pedido.dart';
import 'package:app_cliente/components/style/drop_down_pagamento.dart';
import 'package:app_cliente/components/style/elevated_button_form_field.dart';
import 'package:app_cliente/pages/adicionar_endereco/components/input_field_name_component.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:app_cliente/storage/local_storage.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class FormsEnderecoContent extends StatefulWidget {
  final TipoEntrega delivery;
  const FormsEnderecoContent({super.key, this.delivery = TipoEntrega.delivery});

  @override
  State<FormsEnderecoContent> createState() => _FormsEnderecoContentState();
}

class _FormsEnderecoContentState extends State<FormsEnderecoContent> {
  final TextEditingController controllerRua = TextEditingController();
  final TextEditingController controllerNumero = TextEditingController();
  final TextEditingController controllerBairro = TextEditingController();
  final TextEditingController controllerComplemento = TextEditingController();
  final TextEditingController controllerAdicional = TextEditingController();
  final TextEditingController controllerNome = TextEditingController();
  final TextEditingController controllerTelefone = TextEditingController();
  bool numeroEdit = false;
  bool _isFormValid = false;
  String? _bairroSelecionado;
  bool _mostrarCampoOutroBairro = false;
  final List<String> _bairrosDisponiveis = [
    'Canela',
    'Centro',
    'Oeiras Nova',
    'Jureminha',
    'Rosário',
    'Rodagem de Floriano',
    'Rodagem de Picos',
    'Várzea',
    'Arizona',
    'Outros',
  ];

  @override
  void initState() {
    super.initState();
    _carregarDadosSalvos();

    // Adicionar listeners para validação em tempo real
    controllerRua.addListener(_validateForm);
    controllerNumero.addListener(_validateForm);
    controllerBairro.addListener(_validateForm);
    controllerNome.addListener(_validateForm);
    controllerTelefone.addListener(_validateForm);

    // Listener específico para formatação do telefone
    controllerTelefone.addListener(_formatTelefoneListener);
  }

  /// Listener para formatar telefone em tempo real
  void _formatTelefoneListener() {
    final text = controllerTelefone.text;
    final formatted = _formatTelefone(text);

    if (formatted != text) {
      controllerTelefone.removeListener(_formatTelefoneListener);
      controllerTelefone.value = TextEditingValue(
        text: formatted,
        selection: TextSelection.collapsed(offset: formatted.length),
      );
      controllerTelefone.addListener(_formatTelefoneListener);
    }
  }

  /// Carrega dados salvos no local storage
  Future<void> _carregarDadosSalvos() async {
    final compraProvider = Provider.of<CompraProvider>(context, listen: false);

    // Carregar nome e telefone
    final nomeSalvo = await LocalStorageHelper.getName();
    final telefoneSalvo = await LocalStorageHelper.getPhone();

    if (nomeSalvo != null && nomeSalvo.isNotEmpty) {
      controllerNome.text = nomeSalvo;
    } else if (compraProvider.compraAtual.nomePessoa.isNotEmpty) {
      controllerNome.text = compraProvider.compraAtual.nomePessoa;
    }

    if (telefoneSalvo != null && telefoneSalvo.isNotEmpty) {
      controllerTelefone.text = _formatTelefone(telefoneSalvo);
    } else if (compraProvider.compraAtual.telefone.isNotEmpty) {
      controllerTelefone.text = _formatTelefone(
        compraProvider.compraAtual.telefone,
      );
    }

    // Carregar endereço se for delivery
    if (widget.delivery == TipoEntrega.delivery) {
      try {
        final endereco = await LocalStorageHelper.getAddressAsObject();

        String bairroSalvo = '';
        if (endereco != null) {
          controllerRua.text = endereco.rua;
          controllerNumero.text = endereco.numero;
          controllerBairro.text = endereco.bairro;
          bairroSalvo = endereco.bairro;
          controllerComplemento.text = endereco.complemento ?? '';
          controllerAdicional.text = endereco.informacaoAdicional ?? '';

          // Verificar se é sem número
          if (endereco.numero == 'S/N') {
            setState(() {
              numeroEdit = true;
            });
          }
        } else if (compraProvider.compraAtual.endereco != null) {
          final endereco = compraProvider.compraAtual.endereco!;
          controllerRua.text = endereco.rua;
          controllerNumero.text = endereco.numero;
          controllerBairro.text = endereco.bairro;
          bairroSalvo = endereco.bairro;
          controllerComplemento.text = endereco.complemento ?? '';
          controllerAdicional.text = endereco.informacaoAdicional ?? '';
        }

        // Definir valor do dropdown de bairro
        if (bairroSalvo.isNotEmpty) {
          setState(() {
            if (_bairrosDisponiveis.contains(bairroSalvo)) {
              _bairroSelecionado = bairroSalvo;
              _mostrarCampoOutroBairro = false;
            } else {
              _bairroSelecionado = 'Outros';
              _mostrarCampoOutroBairro = true;
              controllerBairro.text = bairroSalvo;
            }
          });
        }
      } catch (e) {
        // ...debugPrint removido...
      }
    }

    // Validar após carregar
    WidgetsBinding.instance.addPostFrameCallback((_) => _validateForm());
  }

  /// Formatar telefone (11) 99999-9999
  String _formatTelefone(String telefone) {
    // Remove tudo que não é número
    String apenasNumeros = telefone.replaceAll(RegExp(r'[^\d]'), '');

    if (apenasNumeros.length >= 11) {
      return '(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 7)}-${apenasNumeros.substring(7, 11)}';
    } else if (apenasNumeros.length >= 10) {
      return '(${apenasNumeros.substring(0, 2)}) ${apenasNumeros.substring(2, 6)}-${apenasNumeros.substring(6, 10)}';
    }
    return telefone;
  }

  /// Validar formulário em tempo real
  void _validateForm() {
    final camposFaltando = _validarCamposObrigatorios();
    final isValid = camposFaltando.isEmpty;

    if (isValid != _isFormValid) {
      setState(() {
        _isFormValid = isValid;
      });
    }
  }

  /// Validar formulário e retornar lista de campos faltando
  List<String> _validarCamposObrigatorios() {
    List<String> camposFaltando = [];

    if (widget.delivery == TipoEntrega.delivery) {
      // Validação para delivery
      if (controllerRua.text.trim().length < 3) {
        camposFaltando.add('Rua/Avenida (mínimo 3 caracteres)');
      }

      if (!numeroEdit && controllerNumero.text.trim().isEmpty) {
        camposFaltando.add('Número da residência');
      }

      if (controllerBairro.text.trim().length < 3) {
        camposFaltando.add('Bairro (mínimo 3 caracteres)');
      }
    }

    // Validação comum (nome e telefone)
    if (controllerNome.text.trim().length < 2) {
      camposFaltando.add('Nome completo (mínimo 2 caracteres)');
    }

    final telefoneNumeros = controllerTelefone.text.replaceAll(
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
                'Os seguintes campos são obrigatórios para ${widget.delivery == TipoEntrega.delivery ? 'delivery' : 'retirada'}:',
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

  @override
  void dispose() {
    // Remover listeners
    controllerRua.removeListener(_validateForm);
    controllerNumero.removeListener(_validateForm);
    controllerBairro.removeListener(_validateForm);
    controllerNome.removeListener(_validateForm);
    controllerTelefone.removeListener(_validateForm);
    controllerTelefone.removeListener(_formatTelefoneListener);

    // Disposed controllers
    controllerRua.dispose();
    controllerNumero.dispose();
    controllerBairro.dispose();
    controllerComplemento.dispose();
    controllerAdicional.dispose();
    controllerNome.dispose();
    controllerTelefone.dispose();
    super.dispose();
  }

  String convertController(TextEditingController controller) {
    return controller.text;
  }

  List<Widget> _buildMobile() {
    return [
      InputFieldNameComponent(
        text: 'Rua / Avenida',
        placeHolder: 'EX : Av. Rui Barbosa',
        controller: controllerRua,
      ),
      StatefulBuilder(
        builder: (context, setState) => Stack(
          alignment: Alignment.topRight,
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                InputFieldNameComponent(
                  text: 'Número',
                  landing: Text("S/N = Sem Número"),
                  placeHolder: 'EX : 231',
                  enabled: !numeroEdit,
                  controller: controllerNumero,
                ),
              ],
            ),
            Positioned(
              top: 30,
              right: 4,
              child: Row(
                spacing: 5,
                children: [
                  Text('S/N'),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        numeroEdit = !numeroEdit;
                      });
                    },
                    child: Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: numeroEdit
                            ? ColorsApp.cinzaEscuro
                            : ColorsApp.cinzaEscuro,
                        border: Border.all(
                          color: ColorsApp.cinzaEscuro,
                          width: 4,
                        ),
                        shape: BoxShape.circle,
                      ),
                      child: numeroEdit
                          ? Container(
                              width: 20,
                              decoration: BoxDecoration(
                                color: ColorsApp.amarelo,
                                shape: BoxShape.circle,
                              ),
                            )
                          : null,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      // Dropdown de bairros
      StatefulBuilder(
        builder: (context, setState) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Bairro', style: TextStyle(fontWeight: FontWeight.bold)),
              DropdownButtonFormField<String>(
                value: _bairroSelecionado,
                dropdownColor: ColorsApp.branco,
                items: _bairrosDisponiveis
                    .map(
                      (bairro) => DropdownMenuItem<String>(
                        value: bairro,
                        child: Text(bairro),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    _bairroSelecionado = value;
                    _mostrarCampoOutroBairro = value == 'Outros';
                    if (!_mostrarCampoOutroBairro) {
                      controllerBairro.text = value ?? '';
                    } else {
                      controllerBairro.text = '';
                    }
                  });
                  _validateForm();
                },
                decoration: InputDecoration(
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: ColorsApp.cinza,
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide()),
                  contentPadding: EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 8,
                  ),
                ),
              ),
              if (_mostrarCampoOutroBairro)
                Padding(
                  padding: const EdgeInsets.only(top: 8.0),
                  child: InputFieldNameComponent(
                    text: 'Digite seu bairro',
                    placeHolder: 'EX : Bairro Novo',
                    controller: controllerBairro,
                  ),
                ),
            ],
          );
        },
      ),
      InputFieldNameComponent(
        text: 'Complemento',
        placeHolder: 'EX : Apartamento 01',
        controller: controllerComplemento,
      ),
    ];
  }

  List<Widget> _buildDesktop() {
    return [
      Row(
        spacing: 16,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: InputFieldNameComponent(
              text: 'Rua / Avenida',
              placeHolder: 'EX : Av. Rui Barbosa',
              controller: controllerRua,
            ),
          ),
          Expanded(
            child: StatefulBuilder(
              builder: (context, setState) => Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      InputFieldNameComponent(
                        text: 'Número',
                        landing: Text("S/N = Sem Número"),
                        placeHolder: 'EX : 231',
                        enabled: !numeroEdit,
                        controller: controllerNumero,
                      ),
                    ],
                  ),
                  Positioned(
                    top: 30,
                    right: 4,
                    child: Row(
                      spacing: 5,
                      children: [
                        Text('S/N'),
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              numeroEdit = !numeroEdit;
                            });
                          },
                          child: Container(
                            width: 24,
                            height: 24,
                            decoration: BoxDecoration(
                              color: numeroEdit
                                  ? ColorsApp.cinzaEscuro
                                  : ColorsApp.cinzaEscuro,
                              border: Border.all(
                                color: ColorsApp.cinzaEscuro,
                                width: 4,
                              ),
                              shape: BoxShape.circle,
                            ),
                            child: numeroEdit
                                ? Container(
                                    width: 20,
                                    decoration: BoxDecoration(
                                      color: ColorsApp.amarelo,
                                      shape: BoxShape.circle,
                                    ),
                                  )
                                : null,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      Row(
        spacing: 16,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Expanded(
            child: StatefulBuilder(
              builder: (context, setState) {
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Bairro'),
                    DropdownButtonFormField<String>(
                      value: _bairroSelecionado,
                      dropdownColor: ColorsApp.branco,
                      items: _bairrosDisponiveis
                          .map(
                            (bairro) => DropdownMenuItem<String>(
                              value: bairro,
                              child: Text(bairro),
                            ),
                          )
                          .toList(),
                      onChanged: (value) {
                        setState(() {
                          _bairroSelecionado = value;
                          _mostrarCampoOutroBairro = value == 'Outros';
                          if (!_mostrarCampoOutroBairro) {
                            controllerBairro.text = value ?? '';
                          } else {
                            controllerBairro.text = '';
                          }
                        });
                        _validateForm();
                      },
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        filled: true,
                        fillColor: ColorsApp.cinza,
                        focusedBorder: OutlineInputBorder(
                          borderSide: BorderSide(),
                        ),
                        contentPadding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                      ),
                    ),
                    if (_mostrarCampoOutroBairro)
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: InputFieldNameComponent(
                          text: 'Digite seu bairro',
                          placeHolder: 'EX : Bairro Novo',
                          controller: controllerBairro,
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
          Expanded(
            child: InputFieldNameComponent(
              text: 'Complemento',
              placeHolder: 'EX : Apartamento 01',
              controller: controllerComplemento,
            ),
          ),
        ],
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    bool salvarInformacoes() {
      // Verificar se há campos faltando
      final camposFaltando = _validarCamposObrigatorios();

      if (camposFaltando.isNotEmpty) {
        _mostrarCamposFaltando(camposFaltando);
        return false;
      }

      if (TipoEntrega.delivery == widget.delivery) {
        Endereco endereco = Endereco(
          rua: convertController(controllerRua),
          numero: numeroEdit ? 'S/N' : convertController(controllerNumero),
          bairro: convertController(controllerBairro),
          complemento: convertController(controllerComplemento),
          informacaoAdicional: convertController(controllerAdicional),
        );

        // Extrair apenas números do telefone para salvar
        String telefone = controllerTelefone.text.replaceAll(
          RegExp(r'[^\d]'),
          '',
        );

        LocalStorageHelper.saveName(convertController(controllerNome));
        LocalStorageHelper.savePhone(telefone);
        LocalStorageHelper.saveAddressFromObject(
          endereco,
        ); // Usar método mais seguro

        Provider.of<CompraProvider>(
          context,
          listen: false,
        ).definirEndereco(endereco);
        Provider.of<CompraProvider>(context, listen: false).definirDadosCliente(
          nome: convertController(controllerNome),
          telefone: telefone,
        );
      } else {
        // Extrair apenas números do telefone para salvar
        String telefone = controllerTelefone.text.replaceAll(
          RegExp(r'[^\d]'),
          '',
        );
        LocalStorageHelper.saveName(convertController(controllerNome));
        LocalStorageHelper.savePhone(telefone);

        Provider.of<CompraProvider>(context, listen: false).definirDadosCliente(
          nome: convertController(controllerNome),
          telefone: telefone,
        );
      }

      return true;
    }

    return Container(
      decoration: BoxDecoration(color: ColorsApp.branco),
      padding: EdgeInsets.fromLTRB(15, 30, 15, 30),
      child: Form(
        child: Column(
          spacing: 16,
          children: [
            if (Responsividade.isMobile(context)) ...[
              ..._buildMobile(),
            ] else ...[
              ..._buildDesktop(),
            ],
            InputFieldNameComponent(
              text: 'Informações adicionais do endereço',
              placeHolder:
                  'EX : Em frente ao mercadinho, casa sem campainha, casa de cor verde',
              expandedInput: true,
              controller: controllerAdicional,
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              spacing: 16,
              children: [
                Text(
                  'Informações de Contato',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20),
                ),
                InputFieldNameComponent(
                  text: 'Nome e sobrenome',
                  placeHolder: '',
                  controller: controllerNome,
                ),
                InputFieldNameComponent(
                  text: 'Telefone',
                  placeHolder: '(11) 99999-9999',
                  typeKeyboard: TextInputType.phone,
                  controller: controllerTelefone,
                ),
                DropDownPagamento(),
              ],
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                SizedBox(
                  width: 300,
                  child: ElevatedButtonFormField(
                    borderSide: BorderSide(),
                    texto: 'CONTINUAR',
                    corFundo: _isFormValid
                        ? ColorsApp.amarelo
                        : ColorsApp.cinza,
                    onPressed: _isFormValid
                        ? () async {
                            bool retorno = salvarInformacoes();
                            if (retorno) {
                              showDialog(
                                context: context,
                                builder: (context) {
                                  return DialogFinalizarPedido();
                                },
                              );
                            }
                            // Se retorno for false, o dialog de campos faltando já foi mostrado
                          }
                        : null,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
