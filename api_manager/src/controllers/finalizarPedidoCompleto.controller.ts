import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import { ApiEvolution } from '../services/whatsapp.service';
// import { firebaseSendNotification } from '../services/firebase.service';
import { Compra } from '../models/compra.model';
import { Criptografia } from '../services/criptografia.service';
import { Endereco } from '../models/endereco.model';

// Função para criar pedido + itens + notificações (finalização completa)
export async function finalizarPedido(req: Request, res: Response) {
    // Aceita tanto itens: [{produto: {id}, ...}] quanto itens: [{id_produto, ...}]
    const compra = { ...req.body };
    compra.itens = (req.body.itens || []).map((item: any) => {
        if (item.produto && item.produto.id) {
            // já está no formato antigo
            return item;
        }
        // novo formato: {id_produto, quantidade, observacoes}
        console.log(item)
        return {
            produto: { id: item.id_produto },
            quantidade: item.quantidade,
            observacoes: item.observacoes,
        };
    });
    // Validações básicas
    if (!compra || !compra.itens || !Array.isArray(compra.itens) || compra.itens.length === 0) {
        return res.status(400).json({ error: 'Carrinho vazio. Adicione produtos antes de finalizar.' });
    }
    if (!compra.nomePessoa || typeof compra.nomePessoa !== 'string' || !compra.nomePessoa.trim()) {
        return res.status(400).json({ error: 'Nome do cliente é obrigatório.' });
    }
    if (!compra.telefone || typeof compra.telefone !== 'string' || !compra.telefone.trim()) {
        return res.status(400).json({ error: 'Telefone do cliente é obrigatório.' });
    }
    if (compra.tipoEntrega === 'delivery' && !compra.endereco) {
        return res.status(400).json({ error: 'Endereço é obrigatório para delivery.' });
    }
    try {
        // Criptografar telefone e endereco
        const telefoneCripto = await Criptografia.encryptStringToJsonBlob(compra.telefone);
        const enderecoCripto = compra.endereco
            ? await Criptografia.encryptObjectToJsonBlob(compra.endereco)
            : null;
        const pedidoInsert = {
            nome_pessoa: compra.nomePessoa,
            telefone: telefoneCripto,
            pagamento: compra.tipoPagamento,
            status: compra.status,
            entrega: compra.tipoEntrega,
            endereco: enderecoCripto,
            data_pedido: compra.dataPedido
                ? new Date(compra.dataPedido)
                : new Date(new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })),
            // não inclua 'itens' aqui!
        };
        // 1. Inserir pedido
        const { data: pedidoData, error: pedidoError } = await supabase
            .from('pedidos')
            .insert([pedidoInsert])
            .select('id_pedido');
        if (pedidoError || !pedidoData || !pedidoData[0]?.id_pedido) {
            return res.status(500).json({ error: 'Erro ao inserir pedido', details: pedidoError });
        }
        const idPedido = pedidoData[0].id_pedido;
        // 2. Inserir itens do pedido
        for (const item of compra.itens) {
            // console.log(idPedido)
            // console.log(item)
            const { error: itemError } = await supabase.from('pedido_produtos').insert({
                id_pedido: idPedido,
                id_produto: item.produto.id,
                quantidade: item.quantidade,
                observacoes: item.observacoes || '',
            });
            if (itemError) {
                return res.status(500).json({ error: 'Erro ao inserir item do pedido', details: itemError });
            }
        }
        try {
            // Buscar os produtos do banco para garantir nome e preco atualizados
            const idsProdutos = compra.itens.map((item: any) => item.produto.id);
            const { data: produtosDb, error: produtosError } = await supabase
                .from('produtos')
                .select('id_produto, nome, preco')
                .in('id_produto', idsProdutos);
            if (produtosError) {
                throw produtosError;
            }
            // Montar itens com nome e preco do banco
            const itensCompletos = compra.itens.map((item: any) => {
                const produtoDb = produtosDb?.find((p: any) => p.id_produto === item.produto.id);
                return {
                    ...item,
                    produto: {
                        ...item.produto,
                        nome: produtoDb?.nome || item.produto.nome,
                    },
                    precoTotal: produtoDb ? produtoDb.preco * item.quantidade : 0,
                };
            });
            let enderecoInstance = compra.endereco;
            if (compra.tipoEntrega === 'delivery' && compra.endereco && compra.endereco !== null) {
                enderecoInstance = Endereco.fromJson(compra.endereco);
            }
            const compraObj = new Compra({ ...compra, itens: itensCompletos, endereco: enderecoInstance });
            await ApiEvolution.sendMessage(
                compra.telefone,
                compraObj.toString()
            );
        } catch (e) {
            console.error('Erro ao enviar WhatsApp:', e);
        }

        try {
            // await firebaseSendNotification({
            //     topic: 'funcionario',
            //     title: 'Novo pedido',
            //     message: `O ${compra.nomePessoa} fez um pedido!`,
            // });
            // await firebaseSendNotification({
            //     topic: 'proprietario',
            //     title: 'Novo pedido',
            //     message: `O ${compra.nomePessoa} fez um pedido!, avise para os funcionarios`,
            // });
        } catch (e) {
            console.error('Erro ao enviar notificação Firebase:', e);
        }

        return res.status(200).json({ status: 'success', idPedido });
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao finalizar pedido', details: e.message });
    }
}
