import { supabase } from "../utils/supabaseClient";

export async function getHorario(): Promise<{ dia_semana: string; hora_abertura: string; hora_fechamento: string }[] | null> {
  const { data, error } = await supabase
    .from('tabela_funcionamento')
    .select('dia_semana, hora_abertura, hora_fechamento');

  if (error) return null;
  return data;
}

export async function getHorarioFuncionamento(
  diaSemana: string
): Promise<{ hora_abertura: string; hora_fechamento: string } | null> {
  // Deixa a primeira letra maiúscula
  const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  const { data, error } = await supabase
    .from('tabela_funcionamento')
    .select('hora_abertura, hora_fechamento')
    .eq('dia_semana', diaSemanaFormatado)
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function getValorFrete(): Promise<number | null> {
  const { data, error } = await supabase
    .from('tabela_frete')
    .select('valor_frete')
    .limit(1)
    .single();

  if (error || !data.valor_frete) return null;

  return parseFloat(data.valor_frete.toString());
}

// Insere ou atualiza o valor do frete na tabela_frete
export async function salvarValorFrete(valorFrete: number): Promise<boolean> {
  try {
    const { data: result, error: selectError } = await supabase
      .from('tabela_frete')
      .select('id, valor_frete');
    if (selectError) throw selectError;
    if (result && result.length > 0) {
      // Atualiza o primeiro registro
      const id = result[0].id;
      const { error: updateError } = await supabase
        .from('tabela_frete')
        .update({ valor_frete: valorFrete })
        .eq('id', id);
      if (updateError) throw updateError;
    } else {
      // Insere novo registro
      const { error: insertError } = await supabase
        .from('tabela_frete')
        .insert({ valor_frete: valorFrete });
      if (insertError) throw insertError;
    }
    return true;
  } catch {
    return false;
  }
}

// Insere ou atualiza horários de funcionamento na tabela_funcionamento
export async function salvarHorariosFuncionamento(horarios: Record<string, { abertura: string | null, fechamento: string | null }>): Promise<boolean> {
  try {
    for (const [dia, horario] of Object.entries(horarios)) {
      const { abertura, fechamento } = horario;
      // Verifica se já existe registro para o dia
      const { data: result, error: selectError } = await supabase
        .from('tabela_funcionamento')
        .select('id')
        .eq('dia_semana', dia);
      if (selectError) throw selectError;
      if (result && result.length > 0) {
        // Atualiza registro existente
        const id = result[0].id;
        const { error: updateError } = await supabase
          .from('tabela_funcionamento')
          .update({
            hora_abertura: abertura,
            hora_fechamento: fechamento,
          })
          .eq('id', id);
        if (updateError) throw updateError;
      } else {
        // Insere novo registro
        const { error: insertError } = await supabase
          .from('tabela_funcionamento')
          .insert({
            dia_semana: dia,
            hora_abertura: abertura,
            hora_fechamento: fechamento,
          });
        if (insertError) throw insertError;
      }
    }
    return true;
  } catch {
    return false;
  }
}