import 'package:app_cliente/web/title_page.dart';

import 'components/component_home_page.dart';
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      setPageTitle("Inicio");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: ComponentHomePage());
  }
}
