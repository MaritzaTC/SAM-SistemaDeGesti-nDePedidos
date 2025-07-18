/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, {
  AwaitedReactNode,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
  useEffect,
} from 'react';


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Edit, Plus, Search, Shield } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProductForm } from '@/components/admin/ProductForm';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const Index = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
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

  const user = session?.user as UserWithRole & { id?: string | number };

  if (user?.role !== 'ADMIN' && user?.role !== 'EMPLEADO') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            Acceso Denegado
          </h3>
          <p className="text-muted-foreground">
            Solo los administradores pueden gestionar usuarios.
          </p>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        console.error('Error al obtener productos');
      }
    } catch (err) {
      console.error('Error en fetchProducts:', err);
    }
  };
  const getProductStatus = (product: { stock: number; }) => {
    if (product.stock > 2) return "Activo";
    if (product.stock > 0) return "Bajo stock";
    return "Agotado";
  };
  const handleToggleStatus = (productId: string) => {
    setProducts(prev => prev.map(product =>
      product.id === productId
        ? { ...product, enabled: !product.enabled }
        : product
    ));

    const product = products.find(p => p.id === productId);
    toast(`${product?.name} ha sido ${product?.enabled ? 'desactivado' : 'activado'}.`);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' ||
      product.category?.toLowerCase() === filterCategory.toLowerCase();

    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && product.enabled) ||
      (filterStatus === 'inactive' && !product.enabled);

    return matchesSearch && matchesCategory && matchesStatus;
  });


  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
            <p className="text-muted-foreground">
              Gestiona tus productos, stock y precios
            </p>
          </div>
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Agregar Nuevo Producto</DialogTitle>
                <DialogDescription>
                  Completa la información del producto
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                onClose={() => setIsAddProductOpen(false)}
                onUpdate={fetchProducts}
              />
            </DialogContent>
            {/* Edit Product Dialog */}

          </Dialog>
          <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Producto o Eliminar producto</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={selectedProduct}
                onClose={() => setIsEditProductOpen(false)}
                onUpdate={fetchProducts}
              />
            </DialogContent>
          </Dialog>


        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Chaquetas">Chaquetas</SelectItem>
                  <SelectItem value="Camisetas">Camisetas</SelectItem>
                  <SelectItem value="Jeans">Jeans</SelectItem>
                  <SelectItem value="Buzos">Buzos</SelectItem>
                  <SelectItem value="Faldas">Faldas</SelectItem>
                  <SelectItem value="Vestidos">Vestidos</SelectItem>
                  <SelectItem value="Corset">Corset</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>

            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Productos</CardTitle>
            <CardDescription>
              Lista de todos los productos en tu inventario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Stock Total</TableHead>
                    <TableHead>Estado Stock</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {

                    filteredProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex flex-col items-center justify-start space-x-2">
                            <img
                              src={product.image || '/default-user.png.jpg'}
                              alt={`Foto de ${product.name}`}
                              width={60}
                              height={60}
                              className="rounded-[4px] object-cover"
                            />
                            <span className="text-sm text-center w-[80px]break-words">{product.name || 'Sin nombre'}</span>
                          </div>
                        </TableCell>

                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          {product.discount > 0 ? (
                            <div className="flex flex-col items-center">
                              <span className="text-sm font-semibold text-green-600">
                                ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                              </span>
                              <span className="text-xs text-gray-500 line-through">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span>${product.price.toFixed(2)}</span>
                          )}
                        </TableCell>

                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getProductStatus(product) === "Activo"
                                ? "bg-green-100 text-green-700"
                                : getProductStatus(product) === "Bajo stock"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                          >
                            {getProductStatus(product)}
                          </span>
                        </TableCell>
                        <TableCell>

                          <span
                            className={`px-2 py-1 rounded-full text-xs ${product.enabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {product.enabled ? 'Activo' : 'Inactivo'}
                          </span>
                        </TableCell>



                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProduct(product);
                                setIsEditProductOpen(true);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant={product.enabled ? "destructive" : "default"}
                              size="sm"
                              onClick={() => handleToggleStatus(product.id)}
                            >
                              {product.enabled ? 'Desactivar' : 'Activar'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>

              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


Index.getLayout = (
  page:
    | string
    | number
    | bigint
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | Iterable<ReactNode>
    | ReactPortal
    | Promise<AwaitedReactNode>
    | null
    | undefined
) => <DashboardLayout>{page}</DashboardLayout>;

export default Index;
