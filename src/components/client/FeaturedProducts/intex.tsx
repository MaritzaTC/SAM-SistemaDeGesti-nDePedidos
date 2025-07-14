import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../ProductCard";



const FeaturedProducts = () => {
  // Mock data - En una app real vendría de la API
  const featuredProducts = [
    {
      id: 1,
      name: "Blazer Elegante de Lino",
      price: 89000,
      originalPrice: 120000,
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reviews: 124,
      discount: 25,
      isNew: false,
      isFavorite: false
    },
    {
      id: 2,
      name: "Vestido Midi Floral",
      price: 75000,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      
      reviews: 89,
      isNew: true,
      isFavorite: true
    },
    {
      id: 3,
      name: "Camisa de Seda Premium",
      price: 95000,
      originalPrice: 110000,
      image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reviews: 156,
      discount: 15,
      isNew: false,
      isFavorite: false
    },
    {
      id: 4,
      name: "Pantalón Wide Leg",
      price: 68000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      reviews: 78,
      isNew: true,
      isFavorite: false
    }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
            Productos <span className="text-gradient">Destacados</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestras piezas más populares, cuidadosamente seleccionadas 
            por su calidad excepcional y diseño atemporal.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button className="btn-hero group">
            Ver Toda la Colección
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;