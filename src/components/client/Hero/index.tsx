/* eslint-disable @next/next/no-img-element */
import { ArrowRight,  Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const Hero = () => {
   
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
     
        <img
            src="./heroImage.jpg"
            alt="Hero Background"
            className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-chart-3/20 backdrop-blur-sm border border-accent/30 rounded-full px-4 py-2 mb-6 animate-fade-up">
            <Star className="h-4 w-4 text-chart-4 fill-accent" />
            <span className="text-sm font-medium text-accent-foreground">Nueva Colección </span>
          </div>

          {/* Headline */}
          <h1 className="hero-text mb-6 animate-fade-up">
            Estilo que
            <span className="block text-gradient">define tu esencia</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed animate-fade-in-delay">
            Descubre la nueva colección de moda contemporánea. 
            Piezas únicas que combinan elegancia, comodidad y sostenibilidad 
            para el guardarropa moderno.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay">
        <Link href="/customer/products">
            <Button className="btn-hero group" >
              Explorar Colección
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button></Link>
            
           
          </div>

     
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block animate-float">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-elegant">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
              <Star className="h-6 w-6 text-chart-4 fill-white" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Envío Gratis</div>
              <div className="text-sm text-muted-foreground">En pedidos +$200</div>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;