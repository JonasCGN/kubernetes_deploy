class ConfigApp {
  static final Uri urlApi = Uri.parse(
    const String.fromEnvironment(
      'APP_API_URL',
      defaultValue: 'http://localhost:5000',
    ),
  );
}
