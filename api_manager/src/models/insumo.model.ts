import { InsumoMap } from "../types/insumo";

export class Insumo {
  id: number;
  nome: string;
  categoria: string;
  preco: number;

  constructor({ id, nome, categoria = '', preco = 2 }: { id: number; nome: string; categoria?: string; preco?: number }) {
    this.id = id;
    this.nome = nome;
    this.categoria = categoria ?? '';
    this.preco = preco ?? 2;
  }

  // Factory method para criar Insumo a partir de um objeto (map)
  static fromMap(map: InsumoMap): Insumo {
    return new Insumo({
      id: map.id_insumo ?? 0,
      nome: map.nome ?? '',
      categoria: map.categoria ?? '',
      preco: map.preco ?? 2,
    });
  }

  // Factory method para compatibilidade com JSON
  static fromJson(json: InsumoMap): Insumo {
    return Insumo.fromMap(json);
  }

  // Converte para objeto (para salvar no banco)
  toMap(): InsumoMap {
    return {
      id_insumo: this.id,
      nome: this.nome,
      categoria: this.categoria,
      preco: this.preco,
    };
  }
}