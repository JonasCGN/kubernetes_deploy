import 'package:app_cliente/components/home/sidebar_component.dart';
import 'package:flutter/material.dart';

class SideBarContent extends StatelessWidget {
  final List<Widget> widgets;
  final double spacing;
  final bool sideShow;
  const SideBarContent({
    super.key,
    required this.widgets,
    this.spacing=5.0,
    this.sideShow=true,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;
    
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/background.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Row(
        children: [
          ?(sideShow) ? SidebarComponent() : null,
          ...widgets
        ],
      ),
    );
  }
}