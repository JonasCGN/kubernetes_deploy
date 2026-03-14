import { Router, Request, Response } from 'express';

import {
    listarMesas,
    adicionarMesa,
    atualizarDisponibilidadeMesa,
    getUltimoPedidoMesa
} from '../controllers/mesa.controller';
import { requireAuthStaff } from '../middlewares/supabaseAuth';

const router = Router();

/**
 * @swagger
 * /mesa:
 *   get:
 *     summary: Lista todas as mesas
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mesas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mesa'
 *       500:
 *         description: Erro ao buscar mesas
 */
router.get('/', requireAuthStaff, listarMesas); // middelware

/**
 * @swagger
 * /mesa/{id}/ultimo-pedido:
 *   get:
 *     summary: Busca o último pedido da mesa
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mesa
 *     responses:
 *       200:
 *         description: Último pedido da mesa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Nenhum pedido encontrado para esta mesa
 *       500:
 *         description: Erro ao buscar pedido da mesa
 */
router.get('/:id/ultimo-pedido', requireAuthStaff, getUltimoPedidoMesa); // middelware

/**
 * @swagger
 * /mesa:
 *   post:
 *     summary: Adiciona uma nova mesa
 *     tags: [Mesas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Mesa criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: 'integer', example: 123 }
 *       400:
 *         description: Erro ao adicionar mesa
 */
router.post('/', requireAuthStaff, adicionarMesa); // middelware

/**
 * @swagger
 * /mesa/{id}/disponibilidade:
 *   patch:
 *     summary: Atualiza disponibilidade da mesa
 *     tags: [Mesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da mesa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               disponibilidade: { type: 'boolean', example: false }
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Disponibilidade deve ser boolean
 *       500:
 *         description: Erro ao atualizar disponibilidade da mesa
 */
router.patch('/:id/disponibilidade', requireAuthStaff, atualizarDisponibilidadeMesa); // middelware

export default router;
