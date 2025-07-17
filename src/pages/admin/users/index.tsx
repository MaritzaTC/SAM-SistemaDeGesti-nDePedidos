/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useSession } from "next-auth/react";

import { DashboardLayout } from "@/components/admin/DashboardLayout";
import { ReactElement, JSXElementConstructor, ReactNode, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {  Search, Edit, UserPlus, Shield, User, Crown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { UserForm } from "@/components/admin/UserForm";

const Index = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center mt-20">Cargando sesión...</p>;
  }

  type UserWithRole = {
    id?: string | number;
    address: string;
    role?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };

  // Extend session user type to include 'id'
  const user = session?.user as UserWithRole & { id?: string | number };

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">Acceso Denegado</h3>
          <p className="text-muted-foreground">
            Solo los administradores pueden gestionar usuarios.
          </p>
        </div>
      </div>
    );
  }
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EMPLEADO',
    lastName: '',
    phone: '',
    documentType: '',
    documentNumber: '',
  });

  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      console.error('Error fetching users');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setMessage('✅ Usuario creado correctamente');
      setMessageType('success');
      setFormData({ name: '', email: '', password: '', role: 'EMPLEADO', lastName: '', phone: '', documentType: '', documentNumber: '' });
      setIsCreateUserOpen(false);
      fetchUsers();
      setTimeout(() => {
        setIsCreateUserOpen(false);
      }, 1000);
    } else {
      setMessage('❌ Error al crear usuario');
      setMessageType('error');
    }

    // Ocultar mensaje después de 2 segundos
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 2000);
  };
  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setTimeout(() => {
      setIsEditUserOpen(true);
    }, 0);
  };
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role?.toLowerCase() === filterRole;

    return matchesSearch && matchesRole;
  });
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="h-4 w-4" />;
      case 'EMPLEADO':
        return <Shield className="h-4 w-4" />;
      case 'CLIENTE':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };


  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-chart-4 text-primary-foreground';
      case 'EMPLEADO':
        return 'bg-blue-500 text-white';
      case 'CLIENTE':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  ; useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);






  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">
            Administra usuarios, roles y permisos
          </p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Crear Usuario
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo usuario
              </DialogDescription>
            </DialogHeader>

            {/* Aquí empieza el formulario */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />

              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border rounded"
                required
              />

              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMPLEADO">Empleado</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>

              <DialogFooter>
                <Button type="submit">Crear Usuario</Button>
              </DialogFooter>
              {message && (
                <p
                  className={`text-center text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {message}
                </p>
              )}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-5 w-5 text-chart-4" />
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'ADMIN').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Empleados</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'EMPLEADO').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.filter(u => u.role === 'CLIENTE').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-chart-2" />
              <div>
                <p className="text-sm text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold text-foreground">
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre, email o documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="empleado">Empleado</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* User Table */}
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Lista de todos los usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>

                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow key={user.id || index}>
                  <TableCell>
  <div className="flex flex-col items-center justify-center space-y-1">
    <img
      src={user.image || '/default-user.png.jpg'}
      alt={`Foto de ${user.name}`}
      width={40}
      height={40}
      className="rounded-full object-cover"
    />
    <span className="text-sm text-center">{user.name || 'Sin nombre'}</span>
  </div>
</TableCell>

                      <TableCell>{user.email || '—'}</TableCell>

                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>
                          <span className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </Button>
                      </TableCell>
                      
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron usuarios.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>

            </Table>
          </div>
        </CardContent>
      </Card>
      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              user={selectedUser}
              onClose={() => {
                setIsEditUserOpen(false);
                setSelectedUser(null);
              }}
                onUpdate={fetchUsers}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Tipado para layout de página
Index.getLayout = (
  page: ReactElement<any, string | JSXElementConstructor<any>>
): ReactNode => <DashboardLayout>{page}</DashboardLayout>;

export default Index;
