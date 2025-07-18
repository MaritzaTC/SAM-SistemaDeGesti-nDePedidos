/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
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
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const ProductForm = ({
  product,
  onClose,
  onUpdate,
}: {
    product?: any; 
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
  });useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        discount: product.discount?.toString() || '0',
        image: product.image || '',
        isNew: product.isNew || false,
        stock: product.stock?.toString() || '',
      });
    }
  }, [product]);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
const [alert, setAlert] = useState<{
  type: 'success' | 'error';
  title: string;
  description?: string;
} | null>(null);
useEffect(() => {
  if (alert) {
    const timeout = setTimeout(() => setAlert(null), 5000);
    return () => clearTimeout(timeout);
  }
}, [alert]);
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

   if (!form.name || !form.category || isNaN(price) || isNaN(discount) || isNaN(stock)) {
  setAlert({
    type: 'error',
    title: 'Campos incompletos',
    description: 'Por favor, completa todos los campos correctamente.',
  });
  setLoading(false);
  return;
}

    let imageUrl = form.image;
    if (selectedFile) {
  const uploaded = await handleUploadImage(selectedFile);
  if (!uploaded) {
    setLoading(false);
    setAlert({
      type: 'error',
      title: 'Error al subir la imagen',
      description: 'No se pudo subir la imagen del producto.',
    });
    return;
  }
  imageUrl = uploaded;
}

    const method = product ? 'PATCH' : 'POST' ; 
    const endpoint = product ? `/api/product` : '/api/product';

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
         id: product?.id,
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
      throw new Error(resData.error || 'Error al guardar el producto');
    }
setAlert({
  type: 'success',
  title: 'Producto guardado',
  description: 'El producto se guardó correctamente.',
});
    onClose();
    onUpdate?.();
  } catch (e) {
    console.error(e);
    setAlert({
      type: 'error',
      title: 'Error inesperado',
      description: 'No se pudo guardar el producto.',
    });
  } finally {
    setLoading(false);
  }
};
const handleDelete = async () => {
  if (!product?.id) return;

  

  setLoading(true);
  try {
    const res = await fetch(`/api/product`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: product.id }),
    });

    const resData = await res.json();

   if (!res.ok) {
  console.error('❌ Error al eliminar el producto:', resData);
  setAlert({
    type: 'error',
    title: 'Error al eliminar',
    description: resData.error || 'No se pudo eliminar el producto.',
  });
  return;
}

setAlert({
  type: 'success',
  title: 'Producto eliminado',
  description: 'El producto se eliminó correctamente.',
});

    onClose();
    onUpdate?.();
  } catch (error) {
    console.error(error);
    setAlert({
    type: 'error',
    title: 'Error inesperado',
    description: 'No se pudo eliminar el producto.',
  });
  } finally {
    setLoading(false);
  }
};


  return (
    
    <div className="space-y-4">
        {alert && (
  <Alert variant={alert.type === "error" ? "destructive" : "default"}>
    {alert.type === "error" ? <AlertCircleIcon /> : <CheckCircle2Icon />}
    <div>
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.description && (
        <AlertDescription>{alert.description}</AlertDescription>
      )}
    </div>
  </Alert>
)}

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
          <SelectItem value="Chaquetas">Chaquetas</SelectItem>
          <SelectItem value="Camisetas">Camisetas</SelectItem>
          <SelectItem value="Jeans">Jeans</SelectItem>
          <SelectItem value="Faldas">Faldas</SelectItem>
          <SelectItem value="Buzos">Buzos</SelectItem>
          <SelectItem value="Vestidos">Vestidos</SelectItem>
            <SelectItem value="Corset">Corset</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center gap-4">
        <img
          src={form.image || '/producto.png'}
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

  {product && (
    <>
      <Button
        variant="destructive"
        onClick={() => setShowConfirmDelete(true)}
        disabled={loading}
      >
        {loading ? 'Eliminando...' : 'Eliminar'}
      </Button>

      <Dialog open={showConfirmDelete} onOpenChange={setShowConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar producto?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar este producto?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDelete(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleDelete();
                setShowConfirmDelete(false);
              }}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Confirmar'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )}

  <Button onClick={handleSubmit} disabled={loading}>
    {loading ? 'Guardando...' : 'Guardar Producto'}
  </Button>
</div>

    </div>
  );
};
