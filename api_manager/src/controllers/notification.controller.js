"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationApp = sendNotificationApp;
exports.sendNotificationWhatsapp = sendNotificationWhatsapp;
// import { firebaseSendNotification } from '../services/firebase.service';
const whatsapp_service_1 = require("../services/whatsapp.service");
function sendNotificationApp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Body JSON obrigatório' });
        }
        const { title, message, topic } = req.body;
        if (!title || !message || !topic) {
            return res.status(400).json({ error: 'title, message e topic são obrigatórios' });
        }
        try {
            // const result = await firebaseSendNotification({ title, message, topic });
            return res.status(200).json({ status: 'success' });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao enviar notificação' });
        }
    });
}
function sendNotificationWhatsapp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: 'Body JSON obrigatório' });
        }
        const { numero, message } = req.body;
        if (!numero || !message) {
            return res.status(400).json({ error: 'numero, message são obrigatórios' });
        }
        try {
            const result = yield whatsapp_service_1.ApiEvolution.sendMessage(numero, message);
            return res.status(200).json({ status: 'success', result });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao enviar mensagem' });
        }
    });
}
