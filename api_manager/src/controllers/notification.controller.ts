import { Request, Response } from 'express';
// import { firebaseSendNotification } from '../services/firebase.service';
import { ApiEvolution } from '../services/whatsapp.service';

export async function sendNotificationApp(req: Request, res: Response) {
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
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
}

export async function sendNotificationWhatsapp(req: Request, res: Response) {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Body JSON obrigatório' });
  }
  const { numero, message } = req.body;

  if (!numero || !message) {
    return res.status(400).json({ error: 'numero, message são obrigatórios' });
  }

  try {
    const result = await ApiEvolution.sendMessage(numero, message);
    return res.status(200).json({ status: 'success', result });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
}