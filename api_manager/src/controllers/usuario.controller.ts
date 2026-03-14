import { Request, Response } from 'express';
import { getUserByUid } from '../services/usuario.service';

export async function getUserController(req: Request, res: Response) {
    const { uid } = req.params;

    if (!uid || Array.isArray(uid)) return res.status(400).json({ error: 'uid deve ser uma string' });

    const usuario = await getUserByUid(uid);

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(usuario);
}
