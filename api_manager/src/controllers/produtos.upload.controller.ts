import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';
import sharp from 'sharp';
import path from 'path';
import { atualizarCamposProdutoService } from '../services/produtos.service';

// Remove imagem antiga do storage
async function deleteImageByUrl(url: string | null) {
    if (!url) return;
    try {
        const uri = new URL(url);
        const pathIndex = uri.pathname.indexOf('/object/sign/produtos/');
        let storagePath: string | null = null;
        if (pathIndex !== -1) {
            storagePath = uri.pathname.substring(pathIndex + '/object/sign/produtos/'.length);
        } else {
            const publicIndex = uri.pathname.indexOf('/object/public/produtos/');
            if (publicIndex !== -1) {
                storagePath = uri.pathname.substring(publicIndex + '/object/public/produtos/'.length);
            }
        }
        if (storagePath) {
            await supabase.storage.from('produtos').remove([storagePath]);
        }
    } catch { }
}
export async function uploadImagemProdutoController(req: Request, res: Response) {
    const idProduto = Number(req.params.id);
    if (!idProduto) return res.status(400).json({ error: 'ID inválido' });
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    try {
        // Busca produto atual para deletar imagem antiga
        const { data: produtos, error: getError } = await supabase
            .from('produtos')
            .select('path_image')
            .eq('id_produto', idProduto)
            .limit(1);
        if (getError) return res.status(500).json({ error: 'Erro ao buscar produto', details: getError });
        const oldImage = produtos && produtos[0]?.path_image;

        // Redimensiona/comprime
        const buffer = await sharp(req.file.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .jpeg({ quality: 90 })
            .toBuffer();
        let finalBuffer = buffer;
        let quality = 90;
        while (finalBuffer.length > 500 * 1024 && quality > 10) {
            quality -= 10;
            finalBuffer = await sharp(req.file.buffer)
                .resize({ width: 800, height: 800, fit: 'inside' })
                .jpeg({ quality })
                .toBuffer();
        }

        // Upload
        const ext = path.extname(req.file.originalname) || '.jpg';
        const fileName = `produto_${idProduto}${ext}`;
        const storagePath = `produtos/${fileName}`;
        const { data, error } = await supabase.storage
            .from('produtos')
            .upload(storagePath, finalBuffer, { upsert: true, contentType: req.file.mimetype });
        if (error) return res.status(500).json({ error: 'Erro ao fazer upload', details: error });

        // Atualiza campo no banco
        const { data: urlData } = supabase.storage.from('produtos').getPublicUrl(storagePath);
        const publicUrl = urlData.publicUrl;
        await atualizarCamposProdutoService(idProduto, { urlImage: publicUrl });

        // Remove imagem antiga
        if (oldImage && oldImage !== publicUrl) await deleteImageByUrl(oldImage);

        return res.json({ success: true, url: publicUrl });
    } catch (e: any) {
        return res.status(500).json({ error: 'Erro ao processar imagem', details: e.message });
    }
}
