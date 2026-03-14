import 'package:app_cliente/class/color/colors_app.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:app_cliente/database/api_server_supabase.dart';

class StatusLanchoneteComponent extends StatefulWidget {
  const StatusLanchoneteComponent({super.key});

  @override
  State<StatusLanchoneteComponent> createState() =>
      _StatusLanchoneteComponentState();
}

class _StatusLanchoneteComponentState extends State<StatusLanchoneteComponent> {
  bool? aberto;
  String? horarioAbertura;
  String? horarioFechamento;
  String? mensagem;

  @override
  void initState() {
    super.initState();
    verificarStatus();
  }

  Future<void> verificarStatus() async {
    final diasSemana = [
      'Domingo',
      'Segunda',
      'Terça',
      'Quarta',
      'Quinta',
      'Sexta',
      'Sábado',
    ];
    final hoje = DateTime.now();
    final diaSemana = diasSemana[hoje.weekday % 7];

    // Buscar horário do dia atual
    final resultado = await ApiServerSupabase.getHorarioFuncionamento(
      diaSemana,
    );
    if (resultado != null) {
      horarioAbertura = resultado['hora_abertura'];
      horarioFechamento = resultado['hora_fechamento'];
      if (horarioAbertura != null && horarioFechamento != null) {
        final agora = DateFormat('HH:mm').format(hoje);
        aberto = _estaAberto(agora, horarioAbertura!, horarioFechamento!);
        mensagem = aberto == true
            ? 'Aberto das $horarioAbertura às $horarioFechamento'
            : null;
      } else {
        aberto = false;
        mensagem = null;
      }
    } else {
      aberto = false;
      mensagem = null;
    }
    setState(() {});
  }

  bool _estaAberto(String agora, String abertura, String fechamento) {
    final agoraTime = _parseTime(agora);
    final aberturaTime = _parseTime(abertura);
    final fechamentoTime = _parseTime(fechamento);
    if (agoraTime == null || aberturaTime == null || fechamentoTime == null)
      return false;

    int agoraMin = agoraTime.hour * 60 + agoraTime.minute;
    int aberturaMin = aberturaTime.hour * 60 + aberturaTime.minute;
    int fechamentoMin = fechamentoTime.hour * 60 + fechamentoTime.minute;

    if (fechamentoMin <= aberturaMin) {
      // Fecha depois da meia-noite (ex: 22:00 às 02:00)
      return (agoraMin >= aberturaMin) || (agoraMin < fechamentoMin);
    } else {
      return (agoraMin >= aberturaMin) && (agoraMin < fechamentoMin);
    }
  }

  TimeOfDay? _parseTime(String timeStr) {
    try {
      final parts = timeStr.split(":");
      return TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
    } catch (_) {
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    final cor = aberto == true ? ColorsApp.verde : ColorsApp.vermelho;
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Column(
          children: [
            Row(
              spacing: 5,
              children: [
                Text(
                  aberto == null ? '...' : (aberto! ? 'Aberto' : 'Fechado'),
                  style: TextStyle(color: cor),
                ),
                Container(
                  width: 10,
                  height: 10,
                  margin: EdgeInsets.only(right: 5),
                  decoration: BoxDecoration(color: cor, shape: BoxShape.circle),
                ),
              ],
            ),
            if (mensagem != null && aberto == true) ...[
              SizedBox(width: 8),
              Text(
                mensagem!,
                style: TextStyle(fontSize: 12, color: ColorsApp.preto),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
