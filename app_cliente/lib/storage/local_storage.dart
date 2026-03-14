import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:app_cliente/class/endereco/endereco.dart';

class LocalStorageHelper {
  // Salvar nome
  static Future<void> saveName(String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('name', name);
  }

  // Ler nome
  static Future<String?> getName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('name');
  }

  // Salvar telefone
  static Future<void> savePhone(String phone) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('phone', phone);
  }

  // Ler telefone
  static Future<String?> getPhone() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('phone');
  }

  // Salvar endereço (pode ser JSON stringificado)
  static Future<void> saveAddress(String addressJson) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('address', addressJson);
  }

  // Salvar endereço a partir do objeto Endereco (mais seguro)
  static Future<void> saveAddressFromObject(Endereco endereco) async {
    final prefs = await SharedPreferences.getInstance();
    final addressJson = jsonEncode(endereco.toJson());
    await prefs.setString('address', addressJson);
  }

  // Ler endereço
  static Future<String?> getAddress() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('address');
  }

  // Ler endereço como objeto (mais seguro)
  static Future<Endereco?> getAddressAsObject() async {
    final prefs = await SharedPreferences.getInstance();
    final addressJson = prefs.getString('address');
    
    if (addressJson == null || addressJson.isEmpty) {
      return null;
    }
    
    try {
      final addressMap = jsonDecode(addressJson);
      return Endereco.fromJson(addressMap);
    } catch (e) {
      // Se der erro, limpar dados corrompidos
      await prefs.remove('address');
      return null;
    }
  }

  // Opcional: remover dados
  static Future<void> clearAll() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('name');
    await prefs.remove('phone');
    await prefs.remove('address');
  }

  // Método para debug - verificar quais dados estão salvos
  static Future<Map<String, String?>> getAllSavedData() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'name': prefs.getString('name'),
      'phone': prefs.getString('phone'),
      'address': prefs.getString('address'),
    };
  }
}
