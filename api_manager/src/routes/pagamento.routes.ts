import { Router } from 'express';
import { gerarPixController } from '../controllers/pagamento.controller';

const router = Router();

/**
 * @swagger
 * /pagamento/gerar-pix:
 *   post:
 *     summary: Gera QR Code e payload Pix
 *     tags: [Pagamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tipoChave: { type: 'string', example: '02' }
 *               chave: { type: 'string', example: '(89) 9 9999-9999' }
 *               valor: { type: 'number', example: 50.00 }
 *     responses:
 *       200:
 *         description: QR Code e payload Pix gerados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 payload: { type: 'string' }
 *                 qrCodeBase64: { type: 'string' }
 *       400:
 *         description: Campos obrigatórios ausentes
 *       500:
 *         description: Erro ao gerar QR Code
 */
router.post('/gerar-pix', gerarPixController);

export default router;
