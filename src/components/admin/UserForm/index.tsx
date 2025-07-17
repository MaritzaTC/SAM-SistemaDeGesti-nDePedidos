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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UserForm = ({ user, onClose, onUpdate,  }: { user: any; onClose: () => void ; onUpdate?: () => void;}) => {
    const [form, setForm] = useState({
        name: '',
  email: '',
  role: 'CLIENTE',
  lastName: '',
  phone: '',
  documentType: '',
  documentNumber: '',
    });
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
      });
    }
  }, [user]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
  
    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!form.name.trim()) newErrors.name = 'El nombre es obligatorio';
        if (!form.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio';
        if (!form.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
        else if (!/^\d+$/.test(form.phone)) newErrors.phone = 'El teléfono debe contener solo números';

        if (!form.documentType) newErrors.documentType = 'Selecciona el tipo de documento';
        if (!form.documentNumber.trim()) newErrors.documentNumber = 'Número de documento requerido';
        else if (!/^\d+$/.test(form.documentNumber)) newErrors.documentNumber = 'El número de documento debe ser numérico';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdate = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
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

            <Input
                value={form.email}
                placeholder="Correo electrónico"
                disabled
            />

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
                    <SelectItem value="CC">Cédula de Ciudadanía (CC)</SelectItem>
                    <SelectItem value="TI">Tarjeta de Identidad (TI)</SelectItem>
                    <SelectItem value="CE">Cédula de Extranjería (CE)</SelectItem>
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
                <Button variant="outline" onClick={onClose}>
                    Cancelar
                </Button>
                <Button onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
            </div>
        </div>
    );
};
