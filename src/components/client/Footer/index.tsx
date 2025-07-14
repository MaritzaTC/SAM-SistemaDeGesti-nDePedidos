import {  Instagram, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-foreground to-foreground/90 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-playfair font-bold mb-4 text-gradient bg-gradient-to-r from-accent to-primary-glow bg-clip-text text-transparent">
              SAM
            </h3>
            <p className="text-white/80 mb-6 leading-relaxed">
              Redefiniendo la moda contemporánea con piezas únicas que combinan 
              elegancia, sostenibilidad y comodidad para el guardarropa moderno.
            </p>
            
            
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Tienda</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Nueva Colección</a></li>
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Mujer</a></li>
           
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Accesorios</a></li>
            <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Redes sociales:</a></li>
            </ul>
            {/* Social Media */}
            <div className="">
              <Button size="icon" variant="ghost" className="hover:bg-white/10 text-white hover:text-accent">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Atención al Cliente</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/80 hover:text-accent transition-colors">Centro de Ayuda</a></li>
            </ul>
            
            {/* Opening Hours */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h5 className="font-medium text-accent mb-2">Horarios de Atención</h5>
              <div className="text-sm text-white/80 space-y-1">
                <div>Lun - Vie: 9:00 AM - 7:00 PM</div>
                <div>Sáb: 10:00 AM - 6:00 PM</div>
                <div>Dom: 12:00 PM - 5:00 PM</div>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-accent">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-white/80">
                 Tienda 100% virtual<br />
                 Medellín, Colombia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-white/80">+57 (1) 234-5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-white/80">SAM@gmail.com</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-white/60 text-sm">
              © 2025 SAM. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;