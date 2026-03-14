import { Router } from 'express';
import {
    listarInsumosController,
    adicionarInsumoController,
    editarCamposInsumoController,
    deletarInsumoController
} from '../controllers/insumo.controller';

import { requireAuthStaff, requireAuthProprietario } from '../middlewares/supabaseAuth';

const router = Router();

/**
 * @swagger
 * /insumo:
 *   get:
 *     summary: Lista todos os insumos
 *     tags: [Insumos]
 *     responses:
 *       200:
 *         description: Lista de insumos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insumo'
 *       500:
 *         description: Erro ao buscar insumos
 */
router.get('/', listarInsumosController);

/**
 * @swagger
 * /insumo:
 *   post:
 *     summary: Adiciona um novo insumo
 *     tags: [Insumos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: 'string', example: 'Queijo Mozzarella' }
 *               preco: { type: 'number', format: 'float', example: 10 }
 *               categoria: { type: 'string', example: 'lanche' }
 *     responses:
 *       201:
 *         description: Insumo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: 'integer', example: 123 }
 *       400:
 *         description: Erro ao adicionar insumo
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.post('/', requireAuthStaff, adicionarInsumoController);

/**
 * @swagger
 * /insumo/{id}:
 *   patch:
 *     summary: Edita campos de um insumo
 *     tags: [Insumos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do insumo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: 'string' }
 *               quantidade: { type: 'number', format: 'float' }
 *               unidade: { type: 'string' }
 *     responses:
 *       200:
 *         description: Insumo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar insumo
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.patch('/:id', requireAuthStaff, editarCamposInsumoController);

/**
 * @swagger
 * /insumo/{id}:
 *   delete:
 *     summary: Remove um insumo
 *     tags: [Insumos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do insumo
 *     responses:
 *       200:
 *         description: Insumo removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao deletar insumo
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas proprietários
 */
router.delete('/:id', requireAuthProprietario, deletarInsumoController);

export default router;