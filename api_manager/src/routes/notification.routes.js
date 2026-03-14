"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /notifications/sendApp:
 *   post:
 *     summary: Envia notificação via Firebase/App
 *     tags: [Notificações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: 'string', example: 'Pedido Pronto' }
 *               body: { type: 'string', example: 'Seu pedido #123 está pronto!' }
 *               token: { type: 'string', example: 'firebase_token_here' }
 *               data: { type: 'object', example: { pedido_id: '123' } }
 *     responses:
 *       200:
 *         description: Notificação enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 messageId: { type: 'string' }
 *       400:
 *         description: Erro ao enviar notificação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/sendApp', notification_controller_1.sendNotificationApp);
/**
 * @swagger
 * /notifications/sendWhatsapp:
 *   post:
 *     summary: Envia notificação via WhatsApp
 *     tags: [Notificações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone: { type: 'string', example: '5511999999999' }
 *               message: { type: 'string', example: 'Seu pedido foi confirmado!' }
 *     responses:
 *       200:
 *         description: Mensagem WhatsApp enviada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: 'boolean' }
 *                 messageId: { type: 'string' }
 *       400:
 *         description: Erro ao enviar mensagem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/sendWhatsapp', notification_controller_1.sendNotificationWhatsapp);
exports.default = router;
