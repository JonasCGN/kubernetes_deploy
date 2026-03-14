import { Insumo } from "../models/insumo.model";
import { Produto } from "../models/produto.model";
import { supabase } from "../utils/supabaseClient";

export async function getProdutos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select('id_produto, nome, preco, categoria, path_image, disponibilidade')
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true });

  if (error) throw error;

  return data.map(p => new Produto({
    id: p.id_produto,
    nome: p.nome,
    preco: p.preco,
    categoria: p.categoria,
    disponibilidade: p.disponibilidade,
    urlImage: p.path_image,
    insumos: [],
  }));
}

export async function getInsumosByProduto(id_produto: number): Promise<Insumo[]> {
  const { data, error } = await supabase
    .from('produto_insumos')
    .select('insumos(id_insumo, nome)')
    .eq('id_produto', id_produto);

  if (error) throw error;

  return (data ?? []).map(d => {
    const insumo = Array.isArray(d.insumos) ? d.insumos[0] : d.insumos;
    return new Insumo({
      id: insumo.id_insumo,
      nome: insumo.nome,
    });
  });
}

export async function getProdutosComInsumos(): Promise<Produto[]> {
  const { data, error } = await supabase
    .from('produtos')
    .select(`
      id_produto,
      nome,
      preco,
      categoria,
      path_image,
      disponibilidade,
      produto_insumos(
        quantidade_insumos,
        insumos:insumos(
          id_insumo,
          nome
        )
      )
    `)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true });

  if (error) throw error;

  return (data ?? []).map(p => {
    const insumosArr = (p.produto_insumos ?? []).map((pi: any) => {
      const insumo = pi.insumos;
      return {
        insumo: new Insumo({
          id: insumo?.id_insumo,
          nome: insumo?.nome,
        }),
        quantidade: pi.quantidade_insumos
      };
    });
    const produto = new Produto({
      id: p.id_produto,
      nome: p.nome,
      preco: p.preco,
      categoria: p.categoria,
      disponibilidade: p.disponibilidade,
      urlImage: p.path_image,
      insumos: insumosArr
    });
    return produto;
  });
}

export async function atualizarCamposProdutoService(idProduto: number, campos: Partial<Produto>): Promise<boolean> {
  // Mapeia campos do objeto Produto para os campos da tabela
  const camposTabela: any = {};
  if (campos.nome !== undefined) camposTabela['nome'] = campos.nome;
  if (campos.preco !== undefined) camposTabela['preco'] = campos.preco;
  if (campos.categoria !== undefined) camposTabela['categoria'] = campos.categoria;
  if (campos.urlImage !== undefined) camposTabela['path_image'] = campos.urlImage;
  if (campos.disponibilidade !== undefined) camposTabela['disponibilidade'] = campos.disponibilidade;

  if (Object.keys(camposTabela).length === 0) return false;

  const { error } = await supabase
    .from('produtos')
    .update(camposTabela)
    .eq('id_produto', idProduto);
  if (error) return false;
  return true;
}

export async function atualizarDisponibilidadeProdutoService(idProduto: number, disponibilidade: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('produtos')
    .update({ disponibilidade })
    .eq('id_produto', idProduto);
  if (error) return false;
  return true;
}

export async function adicionarProdutoService(produto: Produto): Promise<number | null> {
  const { data, error } = await supabase
    .from('produtos')
    .insert({
      nome: produto.nome,
      preco: produto.preco,
      categoria: produto.categoria,
      path_image: produto.urlImage,
      disponibilidade: produto.disponibilidade,
    })
    .select('id_produto');
  if (error || !data || !data[0]?.id_produto) return null;
  return data[0].id_produto;
}

export async function deletarProdutoService(idProduto: number): Promise<boolean> {
  // Remove todas as relações produto-insumo primeiro
  await supabase.from('produto_insumos').delete().eq('id_produto', idProduto);
  // Depois remove o produto
  const { data, error } = await supabase
    .from('produtos')
    .delete()
    .eq('id_produto', idProduto)
    .select('id_produto');
  if (error) return false;
  return !!(data && data.length > 0);
}
