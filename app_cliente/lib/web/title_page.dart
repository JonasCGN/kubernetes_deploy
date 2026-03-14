import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:web/web.dart' as web;

void setPageTitle(String title) {
  if (kIsWeb) {
    web.window.document.title = title;
  }
}