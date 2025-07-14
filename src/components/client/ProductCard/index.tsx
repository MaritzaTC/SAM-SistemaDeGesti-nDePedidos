import { Heart, ShoppingBag} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  //rating: number;
  reviews: number;
  discount?: number;
  isNew?: boolean;
  isFavorite?: boolean;
}

const ProductCard = ({
  name,
  price,
  originalPrice,
  image,
  //rating,
  //reviews,
  discount,
  isNew,
  isFavorite = false
}: ProductCardProps) => {
  return (
    <div className="card-product group relative">
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img 
          src={image} 
          alt={name}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-accent text-accent-foreground">
              Nuevo
            </Badge>
          )}
          {discount && (
            <Badge className="bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className={`absolute top-4 right-4 rounded-full transition-all duration-200 ${
            isFavorite 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-white/80 hover:bg-white text-foreground'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button className="btn-hero">
            <ShoppingBag className="h-4 w-4 mr-2" />
            Agregar al carrito
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Rating
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating) 
                    ? 'text-accent fill-accent' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-1">
            ({reviews})
          </span>
        </div> */}

        {/* Product Name */}
        <h3 className="font-medium text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            ${price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Size Options */}
        <div className="flex items-center gap-2 mt-4">
          <span className="text-xs text-muted-foreground">Tallas:</span>
          <div className="flex gap-1">
            {['S', 'M', 'L', 'XL'].map((size) => (
              <span
                key={size}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;