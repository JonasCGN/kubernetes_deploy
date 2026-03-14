import { Router } from 'express';
import {
    listarProdutosController,
    listarProdutosComInsumosController,
    atualizarCamposProdutoController,
    atualizarDisponibilidadeProdutoController,
    adicionarProdutoController,
    deletarProdutoController
} from '../controllers/produtos.controller';
import { uploadImagemProdutoController } from '../controllers/produtos.upload.controller';
import multer from 'multer';
const upload = multer({ storage: multer.memoryStorage() });

import { requireAuthStaff, requireAuthProprietario } from '../middlewares/supabaseAuth';

const router = Router();

/**
 * @swagger
 * /produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Produto'
 *       500:
 *         description: Erro ao buscar produtos
 */
router.get('/', listarProdutosController);

/**
 * @swagger
 * /produtos:
 *   post:
 *     summary: Adiciona um novo produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome: { type: 'string', example: 'Pizza Calabresa' }
 *               preco: { type: 'number', format: 'float', example: 28.90 }
 *               categoria: { type: 'string', example: 'Pizza' }
 *               disponibilidade: { type: 'boolean', example: true }
 *               path_image: { type: 'string', example: '/images/pizza_calabresa.jpg' }
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: 'integer', example: 123 }
 *       400:
 *         description: Erro ao adicionar produto
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.post('/', requireAuthStaff, adicionarProdutoController);

/**
 * @swagger
 * /produtos/com-insumos:
 *   get:
 *     summary: Lista produtos com seus insumos associados
 *     tags: [Produtos]
 *     responses:
 *       200:
 *         description: Lista de produtos com insumos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Produto'
 *                   - type: object
 *                     properties:
 *                       insumos:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Insumo'
 *       500:
 *         description: Erro ao buscar produtos com insumos
 */
router.get('/com-insumos', listarProdutosComInsumosController);

/**
 * @swagger
 * /produtos/{id}:
 *   patch:
 *     summary: Atualiza campos de um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
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
 *               nome: { type: 'string' }
 *               preco: { type: 'number', format: 'float' }
 *               categoria: { type: 'string' }
 *               path_image: { type: 'string' }
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar produto
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.patch('/:id', requireAuthStaff, atualizarCamposProdutoController);

/**
 * @swagger
 * /produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto
 *     responses:
 *       200:
 *         description: Produto removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao deletar produto
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas proprietários
 */
router.delete('/:id', requireAuthProprietario, deletarProdutoController);

/**
 * @swagger
 * /produtos/{id}/disponibilidade:
 *   patch:
 *     summary: Atualiza disponibilidade de um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
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
 *               disponibilidade: { type: 'boolean', example: true }
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao atualizar disponibilidade
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.patch('/:id/disponibilidade', requireAuthStaff, atualizarDisponibilidadeProdutoController);

/**
 * @swagger
 * /produtos/{id}/upload:
 *   patch:
 *     summary: Faz upload de imagem para o produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 url: { type: 'string' }
 *       400:
 *         description: Erro no upload
 *       401:
 *         description: Token de autenticação necessário
 *       403:
 *         description: Acesso negado - apenas funcionários ou proprietários
 */
router.patch('/:id/upload', requireAuthStaff, upload.single('file'), uploadImagemProdutoController);


export default router;
