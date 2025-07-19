/* eslint-disable @next/next/no-img-element */
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "../CartContext";


interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
  discount?: number;
  isNew?: boolean;
  stock?: number; 
}

const ProductCard = ({
  id,
  name,
  price,
  image,
  quantity = 1,
  discount,
  isNew,
  stock,
}: ProductCardProps) => {
  const { addToCart } = useCart(); 

  const handleAddToCart = () => {
   
    interface ProductToAdd {
      id: string;
      name: string;
      price: number;
      image: string;
      quantity: number;
      discount: number;
      isNew: boolean;
      stock: number;
   
    }

    const product: ProductToAdd = { 
      id, 
      name, 
      price, 
      image, 
      quantity, 
      discount: discount || 0,
      isNew: isNew || false,
      stock: stock ?? 0,
       
    };

    addToCart(product);
 };
  return (
    <div className="card-product group relative">
      <div className="relative overflow-hidden rounded-t-2xl">
        <img 
          src={image} 
          alt={name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && <Badge className="bg-accent text-accent-foreground">Nuevo</Badge>}
          {discount !== undefined && discount > 0 && (
            <Badge className="bg-destructive text-destructive-foreground">-{discount}%</Badge>
          )}
        </div>

        {/* Overlay para agregar al carrito */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button className="btn-hero" onClick={handleAddToCart}>
            <ShoppingBag className="h-4 w-4 mr-2" />
            Agregar al carrito
          </Button>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex flex-col items-start gap-1 mt-2">
          {discount ? (
            <>
              <span className="text-lg font-bold text-green-600">
                ${(price * (1 - discount / 100)).toFixed(2)}
              </span>
              <span className="text-sm line-through text-muted-foreground">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
