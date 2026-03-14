import 'package:flutter/material.dart';
import 'package:responsive_framework/responsive_framework.dart';

class Responsividade {
  static bool isMobile(BuildContext context) {
    final breakpoint = ResponsiveBreakpoints.of(context).breakpoint.name;
    
    return breakpoint == MOBILE;
  }

  static bool isTablet(BuildContext context) {
    final breakpoint = ResponsiveBreakpoints.of(context).breakpoint.name;
    
    return breakpoint == MOBILE;
  }

  static bool isDesktop(BuildContext context) {
    final breakpoint = ResponsiveBreakpoints.of(context).breakpoint.name;
    
    return breakpoint == DESKTOP;
  }

  static bool is4k(BuildContext context) {
    final breakpoint = ResponsiveBreakpoints.of(context).breakpoint.name;
    
    return breakpoint == "4K";
  }
}