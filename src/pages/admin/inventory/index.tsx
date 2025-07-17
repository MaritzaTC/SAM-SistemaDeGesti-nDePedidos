import React, { AwaitedReactNode, JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ProductForm } from '@/components/admin/ProductForm';

const Index = () => {
     const [isAddProductOpen, setIsAddProductOpen] = useState(false);
     const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  return <div>
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
      <DialogDescription>Completa la información del producto</DialogDescription>
    </DialogHeader>
    <ProductForm onClose={() => setIsAddProductOpen(false)} onUpdate={() => {/* Refetch productos */}} />
  </DialogContent>
</Dialog>
          {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Producto</DialogTitle>
            <DialogDescription>
              Modifica la información del producto
            </DialogDescription>
          </DialogHeader>
          
        </DialogContent>
      </Dialog>
      </div>

       {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                 
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="CAMISETAS">CAMISETAS
</SelectItem>
                <SelectItem value="JEANS">JEANS
</SelectItem>
<SelectItem value="BUZOS">BUZOS

</SelectItem> 
                <SelectItem value="FALDAS
">FALDAS
</SelectItem>
<SelectItem value="VESTIDOS

">VESTIDOS

</SelectItem>
              </SelectContent>
            </Select>
            <Select >
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
          <CardTitle>Productos </CardTitle>
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
           
            </Table>
          </div>
        </CardContent>
      </Card>
        </div>
        
  </div>;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Index.getLayout = (page: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined) => <DashboardLayout>{page}</DashboardLayout>;
export default Index;
