import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';

class SearchBarComponent extends StatefulWidget {
  final double fontSize;
  final double sizeIcon;
  final double width;
  final double height;
  final Function(String)? onChanged;
  final VoidCallback? onClear;
  final TextEditingController? controller;
  
  const SearchBarComponent({
    super.key,
    this.fontSize = 13,
    this.sizeIcon = 15,
    this.width = 300,
    this.height = 30,
    this.onChanged,
    this.onClear,
    this.controller,
  });

  @override
  State<SearchBarComponent> createState() => _SearchBarComponentState();
}

class _SearchBarComponentState extends State<SearchBarComponent> {
  late TextEditingController _controller;
  bool _hasText = false;

  @override
  void initState() {
    super.initState();
    _controller = widget.controller ?? TextEditingController();
    _controller.addListener(() {
      setState(() {
        _hasText = _controller.text.isNotEmpty;
      });
    });
  }

  @override
  void dispose() {
    if (widget.controller == null) {
      _controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    Widget searchWidget = SizedBox(
      width: widget.width,
      height: widget.height,
      child: TextField(
        controller: _controller,
        onChanged: widget.onChanged,
        decoration: InputDecoration(
          hintText: 'Pesquisar por nome',
          hintMaxLines: 1,
          hintStyle: TextStyle(
            color: ColorsApp.pretoOpacidade56,
            fontSize: widget.fontSize,
            fontWeight: FontWeight.w400,
          ),
          filled: true,
          fillColor: ColorsApp.cinza,
          prefixIcon: Icon(
            Icons.search,
            size: widget.sizeIcon,
            color: ColorsApp.pretoOpacidade56,
          ),
          suffixIcon: _hasText
              ? IconButton(
                  icon: Icon(
                    Icons.clear,
                    size: widget.sizeIcon,
                    color: ColorsApp.pretoOpacidade56,
                  ),
                  onPressed: () {
                    _controller.clear();
                    widget.onChanged?.call('');
                    widget.onClear?.call();
                  },
                )
              : null,
          contentPadding: EdgeInsets.symmetric(
            vertical: 0,
            horizontal: 10,
          ),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(15),
            borderSide: BorderSide.none,
          ),
        ),
        style: TextStyle(
          color: ColorsApp.preto,
          fontSize: widget.fontSize,
          fontWeight: FontWeight.w400,
        ),
        cursorColor: ColorsApp.vermelhoEscuro,
      ),
    );
    return searchWidget;
  }
}
