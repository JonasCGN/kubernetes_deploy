import { ProdutoMap } from '../types/produto';
import { Insumo } from './insumo.model';

export interface ProdutoInsumoQuantidade {
  insumo: Insumo;
  quantidade: number;
}

export class Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
  urlImage: string;
  disponibilidade: boolean;
  insumos: ProdutoInsumoQuantidade[];

  constructor({
    id,
    nome,
    preco,
    categoria,
    urlImage,
    disponibilidade = true,
    insumos = [],
  }: {
    id: number;
    nome: string;
    preco: number;
    categoria: string;
    urlImage: string;
    disponibilidade?: boolean;
    insumos?: ProdutoInsumoQuantidade[];
  }) {
    this.id = id;
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.urlImage = urlImage;
    this.disponibilidade = disponibilidade ?? true;
    this.insumos = insumos ?? [];
  }

  // Factory method para criar Produto a partir de um objeto (map)
  static fromMap(map: ProdutoMap): Produto {
    return new Produto({
      id: map.id_produto ?? 0,
      nome: map.nome ?? '',
      preco: typeof map.preco === 'number' ? map.preco : 0,
      categoria: map.categoria ?? '',
      urlImage: map.path_image ?? '',
      disponibilidade: map.disponibilidade ?? true,
      insumos: [], // Insumos serão carregados separadamente
    });
  }

  // Adiciona insumos ao produto (para quando carregar da relação N:N)
  setInsumos(novosInsumos: ProdutoInsumoQuantidade[]) {
    this.insumos = novosInsumos;
  }

}
