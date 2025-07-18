/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import ProductCard from "@/components/client/ProductCard";
import Link from "next/link";



const FeaturedProducts = () => {

   const [products, setProducts] = useState<any[]>([]);
   const [visibleCount, setVisibleCount] = useState(10);
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
  return (
    <section className="py-16 bg-gradient-subtle">
        <Link href={"/"} className="p-20">
        <Button>
             ← Volver atrás
        </Button>
        </Link>
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
          {products.filter(product => product.isNew === true).slice(0, visibleCount).map((product, index) => (
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
  {visibleCount < products.length ? (
    <Button
      onClick={() => setVisibleCount(prev => prev + 10)}
      className="btn-hero group"
    >
      Ver más productos
      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Button>
  ) : (
    <p className="text-muted-foreground">No hay más productos para mostrar</p>
  )}
</div>
      </div>
    </section>
  );
};

export default FeaturedProducts;