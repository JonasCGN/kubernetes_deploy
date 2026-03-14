import 'package:app_cliente/pages/adicionar_endereco/adicionar_endereco.dart';
import 'package:app_cliente/pages/home/home.dart';
import 'package:app_cliente/pages/informacao_pessoal/informacao_pessoal.dart';
import 'package:app_cliente/pages/profile/show_info_profile.dart';
import 'package:app_cliente/pages/unknown/not_found_page.dart';
import 'package:app_cliente/providers/compra_provider.dart';
import 'package:app_cliente/providers/insumos_provider.dart';
import 'package:app_cliente/providers/produtos_provider.dart';
import 'package:flutter_web_plugins/flutter_web_plugins.dart';
import 'package:provider/provider.dart';
import 'routes/routes.dart';
import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  setUrlStrategy(PathUrlStrategy());

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ProdutosProvider()),
        ChangeNotifierProvider(create: (_) => InsumosProvider()),
        ChangeNotifierProvider(create: (_) => CompraProvider()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      navigatorKey: navigatorKey,
      builder: (context, child) => ResponsiveBreakpoints.builder(
        child: child!,
        breakpoints: [
          const Breakpoint(start: 0, end: 600, name: MOBILE),
          const Breakpoint(start: 601, end: 800, name: TABLET),
          const Breakpoint(start: 801, end: 1920, name: DESKTOP),
          const Breakpoint(start: 1921, end: double.infinity, name: '4K'),
        ],
      ),
      initialRoute: Routes.home,
      // home: TestWidget(),
      routes: {
        Routes.home: (context) => HomePage(),
        Routes.adicionarEndereco: (context) => AdicionarEnderecoPage(),
        Routes.adicionarInfoPessoal: (context) => InformacoesPessoaisPage(),
        Routes.dadosSalvos: (context) => ShowInfoProfile(),
      },
      onUnknownRoute: (settings) =>
          MaterialPageRoute(builder: (context) => const NotFoundPage()),
    );
  }
}
