/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserForm = ({ user, onClose, onUpdate }: { user: any; onClose: () => void; onUpdate?: () => void }) => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'CLIENTE',
    lastName: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    image: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'CLIENTE',
        lastName: user.lastName || '',
        phone: user.phone || '',
        documentType: user.documentType || '',
        documentNumber: user.documentNumber || '',
        image: user.image || '',
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!form.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
    if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    else if (!/^\d+$/.test(form.phone)) newErrors.phone = 'El teléfono debe contener solo números';
    if (!form.documentType) newErrors.documentType = 'Selecciona el tipo de documento';
    if (!form.documentNumber.trim()) newErrors.documentNumber = 'Número de documento requerido';
    else if (!/^\d+$/.test(form.documentNumber)) newErrors.documentNumber = 'Debe ser numérico';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `public/${fileName}`; // Carpeta accesible públicamente

    const { error } = await supabase.storage
      .from('users')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Error subiendo archivo a Supabase:', error);
      return null;
    }

    // Obtener URL pública después de subida exitosa
    const { data } = supabase.storage.from('users').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    return publicUrl;
  };





  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      let imageUrl = form.image;

      // Si seleccionó una imagen nueva, subirla
      if (selectedFile) {
        const uploadedUrl = await handleUploadImage(selectedFile); // ✅ pasa el archivo aquí
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }


      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, image: imageUrl }),
      });

      if (!res.ok) throw new Error('Error al actualizar usuario');
      onClose();
      onUpdate?.();
    } catch (err) {
      console.error(err);
      alert('Error actualizando el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={form.name}
        placeholder="Nombre"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}

      <Input
        value={form.lastName}
        placeholder="Apellido"
        onChange={(e) => setForm({ ...form, lastName: e.target.value })}
      />
      {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}

      <Input value={form.email} placeholder="Correo electrónico" disabled />

      <div className="flex items-center gap-4">

        <img
          src={form.image || '/default-user.png.jpg'}
          alt="Usuario"
          className="w-16 h-16 rounded-full object-cover"
        />
        <Input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
      </div>

      <Input
        value={form.phone}
        placeholder="Teléfono"
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}

      <Select
        value={form.documentType}
        onValueChange={(value) => setForm({ ...form, documentType: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Tipo de documento" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
          <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
          <SelectItem value="CE">Cédula de Extranjería</SelectItem>
          <SelectItem value="NIT">NIT</SelectItem>
        </SelectContent>
      </Select>
      {errors.documentType && <p className="text-sm text-red-500">{errors.documentType}</p>}

      <Input
        value={form.documentNumber}
        placeholder="Número de documento"
        onChange={(e) => setForm({ ...form, documentNumber: e.target.value })}
      />
      {errors.documentNumber && <p className="text-sm text-red-500">{errors.documentNumber}</p>}

      <Select
        value={form.role}
        onValueChange={(value) => setForm({ ...form, role: value })}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="EMPLEADO">Empleado</SelectItem>
          <SelectItem value="CLIENTE">Cliente</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </div>
  );
};
