"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mesa_controller_1 = require("../controllers/mesa.controller");
const supabaseAuth_1 = require("../middlewares/supabaseAuth");
const router = (0, express_1.Router)();
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
router.get('/', supabaseAuth_1.requireAuthStaff, mesa_controller_1.listarMesas); // middelware
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
router.get('/:id/ultimo-pedido', supabaseAuth_1.requireAuthStaff, mesa_controller_1.getUltimoPedidoMesa); // middelware
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
router.post('/', supabaseAuth_1.requireAuthStaff, mesa_controller_1.adicionarMesa); // middelware
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
router.patch('/:id/disponibilidade', supabaseAuth_1.requireAuthStaff, mesa_controller_1.atualizarDisponibilidadeMesa); // middelware
exports.default = router;
