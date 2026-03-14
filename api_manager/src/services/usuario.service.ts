import { supabase } from '../utils/supabaseClient';
import { Usuario } from '../models/usuario.model';
import { Criptografia } from './criptografia.service';

export async function getUserByUid(uid: string): Promise<Usuario | null> {
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('uid', uid)
    .single();

  let cpf = data["cpf"];
  try {
    if (cpf) {
      // Se for string JSON, parse antes de descriptografar
      if (typeof cpf === 'string' && cpf.trim().startsWith('{')) {
        cpf = await Criptografia.decryptJsonBlobToString(cpf);
        data["cpf"] = cpf;
      }
    }
  } catch (e) {
    // Se falhar, retorna o valor original
  }

  if (error || !data) return null;
  return Usuario.fromJson(data);
}
