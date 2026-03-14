import { Request, Response } from 'express';
import { getHorario, getHorarioFuncionamento, getValorFrete, salvarValorFrete, salvarHorariosFuncionamento } from '../services/configuracao.service';

export async function horarioController(req: Request, res: Response) {
  try {
    const horario = await getHorario();
    res.json(horario ?? {});
  } catch {
    res.status(500).json({ error: 'Erro ao buscar horário de funcionamento' });
  }
}

export async function horarioDiaController(req: Request, res: Response) {
  try {
    const diaParam = req.params.dia;
    if (!diaParam || Array.isArray(diaParam)) {
      return res.status(400).json({ error: 'dia deve ser uma string' });
    }
    const horario = await getHorarioFuncionamento(diaParam);
    res.json(horario ?? {});
  } catch {
    res.status(500).json({ error: 'Erro ao buscar horário de funcionamento' });
  }
}

export async function valorFreteController(_req: Request, res: Response) {
  try {
    const valor = await getValorFrete();
    res.json({ valor });
  } catch {
    res.status(500).json({ error: 'Erro ao buscar valor do frete' });
  }
}

export async function salvarValorFreteController(req: Request, res: Response) {
  try {
    const { valor } = req.body;
    if (typeof valor !== 'number') {
      return res.status(400).json({ error: 'valor Frete deve ser um número' });
    }
    const ok = await salvarValorFrete(valor);
    if (ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erro ao salvar valor do frete' });
    }
  } catch {
    res.status(500).json({ error: 'Erro ao salvar valor do frete' });
  }
}

export async function salvarHorariosFuncionamentoController(req: Request, res: Response) {
  try {
    let { horarios } = req.body;
    if (!horarios || typeof horarios !== 'object' || Array.isArray(horarios)) {
      return res.status(400).json({ error: 'horarios deve ser um objeto com os dias como chaves' });
    }

    let horariosObj: Record<string, { abertura: string | null, fechamento: string | null }> = {};
    function formatTime(val: any) {
      if (val === null || val === undefined || val === '') return null;
      if (typeof val === 'string' && /^\d{2}:\d{2}$/.test(val)) return val;
      if (typeof val === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(val)) return val.slice(0, 5);
      if (val instanceof Date) {
        return val.toTimeString().slice(0, 5);
      }
      return null;
    }

    for (const [dia, value] of Object.entries(horarios)) {
      if (value && typeof value === 'object') {
        const v = value as any;
        let diaKey = dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (diaKey === 'sabado' || diaKey === 'sábado') diaKey = 'sabado';
        horariosObj[diaKey] = {
          abertura: formatTime(v.abertura),
          fechamento: formatTime(v.fechamento ?? v.fechamentos)
        };
      }
    }

    const ok = await salvarHorariosFuncionamento(horariosObj);
    if (ok) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Erro ao salvar horários de funcionamento' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Erro ao salvar horários de funcionamento' });
  }
}
