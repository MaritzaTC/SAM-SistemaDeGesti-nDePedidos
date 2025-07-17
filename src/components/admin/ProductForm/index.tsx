/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

export const ProductForm = ({
  onClose,
  onUpdate,
}: {
  onClose: () => void;
  onUpdate?: () => void;
}) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    discount: '0',
    image: '',
    isNew: false,
    stock: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `products/${fileName}`;

    const { error } = await supabase.storage
      .from('products')
      .upload(filePath, file, { upsert: false });

    if (error) {
      console.error('❌ Error subiendo imagen:', error);
      return null;
    }

    const { data } = supabase.storage.from('products').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const price = parseFloat(form.price);
      const discount = parseFloat(form.discount);
      const stock = parseInt(form.stock);

      if (
        !form.name ||
        !form.category ||
        isNaN(price) ||
        isNaN(discount) ||
        isNaN(stock)
      ) {
        alert('❌ Por favor, completa todos los campos correctamente.');
        setLoading(false);
        return;
      }

      let imageUrl = form.image;
      if (selectedFile) {
        const uploaded = await handleUploadImage(selectedFile);
        if (!uploaded) {
          setLoading(false);
          alert('❌ Error al subir la imagen.');
          return;
        }
        imageUrl = uploaded;
      }

      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price,
          discount,
          stock,
          isNew: form.isNew,
          image: imageUrl,
        }),
      });

      const resData = await res.json();

      if (!res.ok) {
        console.error('❌ Error en la API:', resData);
        throw new Error(resData.error || 'Error al crear producto');
      }

      onClose();
      onUpdate?.();
    } catch (e) {
      console.error(e);
      alert('❌ Error al crear el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Nombre del producto"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Precio"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Descuento %"
        value={form.discount}
        onChange={(e) => setForm({ ...form, discount: e.target.value })}
      />
      <Input
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />

      <Select onValueChange={(val) => setForm({ ...form, category: val })}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar categoría" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Camisetas">Camisetas</SelectItem>
          <SelectItem value="Jeans">Jeans</SelectItem>
          <SelectItem value="Faldas">Faldas</SelectItem>
          <SelectItem value="Buzos">Buzos</SelectItem>
          <SelectItem value="Vestidos">Vestidos</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-4">
        <img
          src={form.image || '/default-product.png'}
          alt="Producto"
          className="w-16 h-16 rounded object-cover"
        />
        <Input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm">¿Es nuevo?</label>
        <input
          type="checkbox"
          checked={form.isNew}
          onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </div>
  );
};
