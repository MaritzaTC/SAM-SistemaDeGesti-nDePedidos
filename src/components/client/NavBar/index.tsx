/* eslint-disable react-hooks/rules-of-hooks */
import { ShoppingBag, User, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Cart from "../Cart";
import { useState } from "react";

const index = () => {
   const [isCartOpen, setIsCartOpen] = useState(false);
  return (
    <>
     <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-playfair font-bold text-gradient">
              SAM
            </h1>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-foreground hover:text-primary transition-colors duration-200">
              Nuevo
            </a>
            <a href="#" className="text-foreground hover:text-primary transition-colors duration-200">
              Mujer
            </a>
            
           
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
              <Search className="h-5 w-5" />
            </Button>

             {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hover:bg-secondary/50 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              <Badge 
                variant="secondary" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
              >
                3
              </Badge>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden hover:bg-secondary/50">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default index;