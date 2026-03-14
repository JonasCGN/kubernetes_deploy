
import { Router } from 'express';
import { getUserController } from '../controllers/usuario.controller';

const router = Router();

/**
 * @swagger
 * /users/{uid}:
 *   get:
 *     summary: Busca informações de um usuário por UID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: UID único do usuário (Firebase)
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro ao buscar usuário
 */
router.get('/:uid', getUserController);

export default router;
