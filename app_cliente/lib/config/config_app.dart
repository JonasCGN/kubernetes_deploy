class ConfigApp {
  static final Uri urlApi = Uri.parse(
    const String.fromEnvironment(
      'API_URL',
      defaultValue: 'http://localhost:5000',
    ),
  );
}
