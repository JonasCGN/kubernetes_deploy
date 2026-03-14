"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const produtoInsumo_controller_1 = require("../controllers/produtoInsumo.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /produtos/{id}/insumos:
 *   get:
 *     summary: Lista insumos de um produto específico
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Lista de insumos do produto
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insumo'
 *       500:
 *         description: Erro ao buscar insumos do produto
 */
router.get('/:id/insumos', produtoInsumo_controller_1.listarInsumosPorProdutoController);
/**
 * @swagger
 * /produtos/{id}/insumos:
 *   post:
 *     summary: Adiciona múltiplas relações produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
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
 *               insumos:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id_insumo: { type: 'integer', example: 1 }
 *                     quantidade: { type: 'number', format: 'float', example: 0.5 }
 *     responses:
 *       201:
 *         description: Relações criadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao adicionar relações produto
 */
router.post('/:id/insumos', produtoInsumo_controller_1.adicionarProdutoInsumosController); // middelware
/**
 * @swagger
 * /produtos/{id}/insumos/{insumoId}:
 *   delete:
 *     summary: Remove relação específica produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *       - in: path
 *         name: insumoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do insumo
 *     responses:
 *       200:
 *         description: Relação removida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao remover relação produto
 */
router.delete('/:id/insumos/:insumoId', produtoInsumo_controller_1.removerProdutoInsumoController); // middelware
/**
 * @swagger
 * /produtos/{id}/insumos/{insumoId}:
 *   patch:
 *     summary: Atualiza quantidade de um insumo em um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *       - in: path
 *         name: insumoId
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
 *               quantidade: { type: 'number', format: 'float', example: 1.5 }
 *     responses:
 *       200:
 *         description: Quantidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar quantidade
 */
router.patch('/:id/insumos/:insumoId', produtoInsumo_controller_1.atualizarQuantidadeProdutoInsumoController); // middelware
/**
 * @swagger
 * /produtos/{id}/insumos:
 *   delete:
 *     summary: Remove todas as relações de insumos de um produto
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Todas as relações removidas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao remover relações
 */
router.delete('/:id/insumos', produtoInsumo_controller_1.removerTodosInsumosDoProdutoController); // middelware
exports.default = router;
