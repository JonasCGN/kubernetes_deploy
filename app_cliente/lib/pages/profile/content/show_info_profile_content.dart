import 'package:app_cliente/class/color/colors_app.dart';
import 'package:app_cliente/class/endereco/endereco.dart';
import 'package:app_cliente/components/home/top_bar_component.dart';
import 'package:app_cliente/components/style/side_bar_content.dart';
import 'package:app_cliente/pages/home/components/carrinho_compras_content.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/responsive/responsividade.dart';
import 'package:app_cliente/storage/local_storage.dart';
import 'package:flutter/gestures.dart';
import 'package:provider/provider.dart';
import 'package:flutter/material.dart';

class ShowInfoProfileContent extends StatefulWidget {
  const ShowInfoProfileContent({super.key});

  @override
  State<ShowInfoProfileContent> createState() => _ShowInfoProfileContentState();
}

class _ShowInfoProfileContentState extends State<ShowInfoProfileContent> {
  Future<Map<String, dynamic>>? _futureDados;

  @override
  void initState() {
    super.initState();
    _futureDados = carregarDados();
  }

  Future<Map<String, dynamic>> carregarDados() async {
    final nomeSalvo = await LocalStorageHelper.getName();
    final telefoneSalvo = await LocalStorageHelper.getPhone();
    final endereco = await LocalStorageHelper.getAddressAsObject();
    return {
      'nomeSalvo': nomeSalvo,
      'telefoneSalvo': telefoneSalvo,
      'endereco': endereco,
    };
  }

  @override
  Widget build(BuildContext context) {
    final compraProvider = Provider.of<CompraProvider>(context);

    return SideBarContent(
      sideShow: false,
      widgets: [
        Expanded(
          child: Stack(
            children: [
              Column(
                spacing: 10,
                children: [
                  TopBarComponent(userName: 'Usuário', telaInfoUser: true),
                  Expanded(
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: ScrollConfiguration(
                            behavior: MaterialScrollBehavior().copyWith(
                              dragDevices: {
                                PointerDeviceKind.touch,
                                PointerDeviceKind.mouse,
                              },
                            ),
                            child: SingleChildScrollView(
                              child: Container(
                                padding: EdgeInsets.only(
                                  left: 5,
                                  right: 5,
                                  bottom: 20,
                                ),
                                child: FutureBuilder<Map<String, dynamic>>(
                                  future: _futureDados,
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.waiting) {
                                      return Center(
                                        child: CircularProgressIndicator(),
                                      );
                                    } else if (snapshot.hasError) {
                                      return Center(
                                        child: Text(
                                          'Erro ao carregar dados',
                                          style: TextStyle(color: Colors.red),
                                        ),
                                      );
                                    } else {
                                      final nomeSalvo =
                                          snapshot.data?['nomeSalvo']
                                              as String?;
                                      final telefoneSalvo =
                                          snapshot.data?['telefoneSalvo']
                                              as String?;
                                      final endereco =
                                          snapshot.data?['endereco']
                                              as Endereco?;
                                      if (nomeSalvo != null &&
                                          nomeSalvo.isNotEmpty &&
                                          telefoneSalvo != null &&
                                          telefoneSalvo.isNotEmpty) {
                                        return Card(
                                          color: ColorsApp.branco,
                                          elevation: 4,
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),
                                          child: Padding(
                                            padding: const EdgeInsets.all(24.0),
                                            child: Column(
                                              crossAxisAlignment:
                                                  CrossAxisAlignment.start,
                                              children: [
                                                Row(
                                                  children: [
                                                    Icon(
                                                      Icons.person,
                                                      color: Colors.blue,
                                                      size: 28,
                                                    ),
                                                    SizedBox(width: 8),
                                                    Text(
                                                      'Nome:',
                                                      style: TextStyle(
                                                        fontSize: 18,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                        left: 36.0,
                                                        top: 2,
                                                        bottom: 12,
                                                      ),
                                                  child: Text(
                                                    nomeSalvo,
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                ),
                                                Row(
                                                  children: [
                                                    Icon(
                                                      Icons.phone,
                                                      color: Colors.green,
                                                      size: 28,
                                                    ),
                                                    SizedBox(width: 8),
                                                    Text(
                                                      'Telefone:',
                                                      style: TextStyle(
                                                        fontSize: 18,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                                Padding(
                                                  padding:
                                                      const EdgeInsets.only(
                                                        left: 36.0,
                                                        top: 2,
                                                        bottom: 12,
                                                      ),
                                                  child: Text(
                                                    telefoneSalvo,
                                                    style: TextStyle(
                                                      fontSize: 18,
                                                    ),
                                                  ),
                                                ),
                                                if (endereco != null) ...[
                                                  Row(
                                                    children: [
                                                      Icon(
                                                        Icons.home,
                                                        color: Colors.orange,
                                                        size: 28,
                                                      ),
                                                      SizedBox(width: 8),
                                                      Text(
                                                        'Endereço:',
                                                        style: TextStyle(
                                                          fontSize: 18,
                                                          fontWeight:
                                                              FontWeight.bold,
                                                        ),
                                                      ),
                                                    ],
                                                  ),
                                                  Padding(
                                                    padding:
                                                        const EdgeInsets.only(
                                                          left: 36.0,
                                                          top: 2,
                                                        ),
                                                    child: Text(
                                                      endereco.toString(),
                                                      style: TextStyle(
                                                        fontSize: 16,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ],
                                            ),
                                          ),
                                        );
                                      } else {
                                        return Card(
                                          elevation: 2,
                                          
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              12,
                                            ),
                                          ),
                                          color: Colors.red[50],
                                          child: Padding(
                                            padding: const EdgeInsets.all(24.0),
                                            child: Column(
                                              children: [
                                                Icon(
                                                  Icons.info_outline,
                                                  color: Colors.red,
                                                  size: 32,
                                                ),
                                                SizedBox(height: 12),
                                                Text(
                                                  'Nenhuma informação encontrada. Faça uma compra para cadastrar seus dados!',
                                                  style: TextStyle(
                                                    fontSize: 18,
                                                    color: Colors.red,
                                                  ),
                                                  textAlign: TextAlign.center,
                                                ),
                                              ],
                                            ),
                                          ),
                                        );
                                      }
                                    }
                                  },
                                ),
                              ),
                            ),
                          ),
                        ),
                        // Carrinho fixo só em desktop
                        if (compraProvider.showCar &&
                            !Responsividade.isMobile(context))
                          CarrinhoComprasContent(),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }
}
