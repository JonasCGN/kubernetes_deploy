"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pedido_controller_1 = require("../controllers/pedido.controller");
const finalizarPedidoCompleto_controller_1 = require("../controllers/finalizarPedidoCompleto.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /pedido:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de pedidos retornados
 *     responses:
 *       200:
 *         description: Lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro ao buscar pedidos
 */
router.get('/', pedido_controller_1.listarPedidos); // middleware
/**
 * @swagger
 * /pedido:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente_nome: { type: 'string', example: 'João Silva' }
 *               telefone: { type: 'string', example: '(11) 99999-9999' }
 *               endereco: { type: 'object' }
 *               produtos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_produto: { type: 'integer', example: 1 }
 *                     quantidade: { type: 'integer', example: 2 }
 *                     observacoes: { type: 'string', example: 'Sem cebola' }
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_pedido: { type: 'integer', example: 123 }
 *       400:
 *         description: Erro ao criar pedido
 */
router.post('/', pedido_controller_1.criarPedido);
/**
 * @swagger
 * /pedido/hoje:
 *   get:
 *     summary: Lista pedidos do dia atual
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Lista de pedidos de hoje
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *       500:
 *         description: Erro ao buscar pedidos de hoje
 */
router.get('/hoje', pedido_controller_1.listarPedidosHojeController); // lista pedidos de hoje
/**
 * @swagger
 * /pedido/{id_pedido}:
 *   get:
 *     summary: Busca um pedido específico por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id_pedido
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Dados do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido não encontrado
 *       500:
 *         description: Erro ao buscar pedido
 */
router.get('/:id', pedido_controller_1.buscarPedidoPorId); // middleware
/**
 * @swagger
 * /pedido/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um pedido
 *     tags: [Pedidos]
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
 *               status: { type: 'string', enum: ['pendente', 'preparando', 'pronto', 'entregue', 'cancelado'], example: 'preparando' }
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar status
 */
router.patch('/:id/status', pedido_controller_1.atualizarStatusPedidoController); // atualiza status
/**
 * @swagger
 * /pedido/{id_pedido}:
 *   patch:
 *     summary: Atualiza campos de um pedido
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id_pedido
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
 *               nomePessoa: { type: 'string', example: 'João Silva' }
 *               telefone: { type: 'string', example: '(11) 99999-9999' }
 *               tipoPagamento: { type: 'string', example: 'dinheiro' }
 *               status: { type: 'string', example: 'pendente' }
 *               tipoEntrega: { type: 'string', example: 'retirada' }
 *               endereco: { type: 'object' }
 *               dataPedido: { type: 'string', format: 'date-time', example: '2025-08-04T12:00:00Z' }
 *               idMesa: { type: 'integer', example: 1 }
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar pedido
 *       404:
 *         description: Pedido não encontrado
 */
router.patch('/:id', pedido_controller_1.atualizarPedidoController);
/**
 * @swagger
 * /pedido/finalizar-completo:
 *   post:
 *     summary: Finaliza completamente um pedido (processamento completo)
 *     tags: [Pedidos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido: { type: 'integer', example: 123 }
 *               forma_pagamento: { type: 'string', example: 'cartao' }
 *               valor_pago: { type: 'number', format: 'float', example: 45.90 }
 *     responses:
 *       200:
 *         description: Pedido finalizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao finalizar pedido
 */
router.post('/finalizar-completo', finalizarPedidoCompleto_controller_1.finalizarPedido);
exports.default = router;
