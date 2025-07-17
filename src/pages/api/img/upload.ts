/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Error al parsear archivo:', err);
      return res.status(500).json({ error: 'Error al procesar archivo' });
    }

    const file = files.file as any;

    if (!file || !file.filepath) {
      return res.status(400).json({ error: 'Archivo no enviado' });
    }

    const fileStream = fs.createReadStream(file.filepath);
    const fileExt = path.extname(file.originalFilename || '');
    const fileName = `user_${Date.now()}${fileExt}`;

    const {  error } = await supabase.storage
      .from('user-images') // nombre de tu bucket
      .upload(fileName, fileStream, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('🚨 Error al subir archivo:', error.message);
      return res.status(500).json({ error: error.message });
    }

    const { data: urlData } = supabase.storage.from('user-images').getPublicUrl(fileName);

    return res.status(200).json({ url: urlData.publicUrl });
  });
}
