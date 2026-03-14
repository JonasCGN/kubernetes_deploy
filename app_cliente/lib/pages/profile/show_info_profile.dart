import 'package:app_cliente/pages/profile/content/show_info_profile_content.dart';
import 'package:app_cliente/web/title_page.dart';
import 'package:flutter/material.dart';

class ShowInfoProfile extends StatefulWidget {
  const ShowInfoProfile({super.key});

  @override
  State<ShowInfoProfile> createState() => _ShowInfoProfileState();
}

class _ShowInfoProfileState extends State<ShowInfoProfile> {
  
  @override
  void initState() {
    super.initState();
    setPageTitle("Perfil");
  }
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ShowInfoProfileContent(
      ),
    );
  }
}