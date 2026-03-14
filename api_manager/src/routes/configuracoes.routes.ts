import { Router } from 'express';
import { horarioController, horarioDiaController, valorFreteController, salvarValorFreteController, salvarHorariosFuncionamentoController } from '../controllers/configuracao.controller';
import { requireAuthProprietario } from '../middlewares/supabaseAuth';

const router = Router();

/**
 * @swagger
 * /configuracoes/horario:
 *   get:
 *     summary: Busca todos os horários de funcionamento
 *     tags: [Configurações]
 *     responses:
 *       200:
 *         description: Lista de horários de funcionamento
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   dia: { type: 'string', example: 'segunda' }
 *                   abertura: { type: 'string', example: '08:00' }
 *                   fechamento: { type: 'string', example: '22:00' }
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/horario', horarioController);

/**
 * @swagger
 * /configuracoes/horario/{dia}:
 *   get:
 *     summary: Busca horário de funcionamento de um dia específico
 *     tags: [Configurações]
 *     parameters:
 *       - in: path
 *         name: dia
 *         required: true
 *         schema:
 *           type: string
 *         description: Dia da semana (segunda, terca, etc.)
 *     responses:
 *       200:
 *         description: Horário do dia especificado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dia: { type: 'string' }
 *                 abertura: { type: 'string' }
 *                 fechamento: { type: 'string' }
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/horario/:dia', horarioDiaController);

/**
 * @swagger
 * /configuracoes/frete:
 *   get:
 *     summary: Busca o valor atual do frete
 *     tags: [Configurações]
 *     responses:
 *       200:
 *         description: Valor do frete
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valor: { type: 'number', format: 'float', example: 5.50 }
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/frete', valorFreteController);

/**
 * @swagger
 * /configuracoes/frete:
 *   post:
 *     summary: Salva o valor do frete
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               valor: { type: 'number', format: 'float', example: 5.50 }
 *     responses:
 *       200:
 *         description: Frete salvo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao salvar frete
 */
router.post('/frete', requireAuthProprietario, salvarValorFreteController);

/**
 * @swagger
 * /configuracoes/horario:
 *   post:
 *     summary: Salva os horários de funcionamento
 *     tags: [Configurações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               horarios:
 *                 type: object
 *                 properties:
 *                   segunda:
 *                     type: object
 *                     properties:
 *                       abertura:
 *                         type: string
 *                         nullable: true
 *                         example: '08:00'
 *                       fechamento:
 *                         type: string
 *                         nullable: true
 *                         example: '18:00'
 *                   domingo:
 *                     type: object
 *                     properties:
 *                       abertura:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       fechamento:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *     responses:
 *       200:
 *         description: Horários salvos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Success'
 *       400:
 *         description: Erro ao salvar horários
 */
router.post('/horario', requireAuthProprietario, salvarHorariosFuncionamentoController);

export default router;