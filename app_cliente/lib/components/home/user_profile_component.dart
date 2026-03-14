import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class UserProfileComponent extends StatelessWidget {
  final String userName;
  
  const UserProfileComponent({
    super.key,
    this.userName = 'Usuário',
  });
  
  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: 'Olá, ',
                style: TextStyle(color: Colors.black),
              ),
              TextSpan(
                text: '$userName!',
                style: TextStyle(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        SizedBox(width: 10),
        CircleAvatar(
          backgroundColor: ColorsApp.cinza,
          radius: 20,
          child: Image.asset(
            'assets/icons/user.png',
            width: 25,
            height: 25,
          ),
        ),
      ],
    );
  }
}
