import { Router } from 'express';
import {
    adicionarProdutoAoPedido,
    atualizarProdutoDoPedido,
    removerProdutoDoPedido
} from '../controllers/pedidoProduto.controller';
import { requireAuthStaff } from '../middlewares/supabaseAuth';

const router = Router();

/**
 * @swagger
 * /pedido/{id}/produto:
 *   post:
 *     summary: Adiciona um produto ao pedido
 *     tags: [PedidoProduto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_produto: { type: 'integer', example: 1 }
 *               quantidade: { type: 'integer', example: 2 }
 *               observacoes: { type: 'string', example: 'Sem cebola' }
 *     responses:
 *       201:
 *         description: Produto adicionado ao pedido
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado
 */
router.post('/:id/produto', requireAuthStaff, adicionarProdutoAoPedido);

/**
 * @swagger
 * /pedido/{id}/produto/{produtoId}:
 *   patch:
 *     summary: Atualiza um produto do pedido
 *     tags: [PedidoProduto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantidade: { type: 'integer', example: 2 }
 *               observacoes: { type: 'string', example: 'Sem cebola' }
 *     responses:
 *       200:
 *         description: Produto do pedido atualizado
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado
 */
router.patch('/:id/produto/:produtoId', requireAuthStaff, atualizarProdutoDoPedido);

/**
 * @swagger
 * /pedido/{id}/produto/{produtoId}:
 *   delete:
 *     summary: Remove um produto do pedido
 *     tags: [PedidoProduto]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido do pedido
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id/produto/:produtoId', requireAuthStaff, removerProdutoDoPedido);

export default router;
