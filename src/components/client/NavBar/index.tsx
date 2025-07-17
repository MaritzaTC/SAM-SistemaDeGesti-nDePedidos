
import { ShoppingBag, Search, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Cart from "../Cart";
import { useSession, signOut } from "next-auth/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';


import { useState } from "react";
import Link from "next/link";

type UserWithRole = {
  address: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user as UserWithRole | undefined;

  return (
    <>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-playfair font-bold text-gradient">SAM</h1>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#" className="text-foreground hover:text-primary transition-colors duration-200">
                Nuevo
              </Link>
              <Link href="#" className="text-foreground hover:text-primary transition-colors duration-200">
                Mujer
              </Link>
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

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Heart className="h-5 w-5" />
              </Button>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                      </Avatar>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium leading-none">
                          {user.name || "Usuario"}
                        </span>
                        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/customer/profile">Mi Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/customer/orders">Mis Pedidos</Link>
                    </DropdownMenuItem>
                    {(user.role === "ADMIN" || user.role === "EMPLEADO") && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard">Panel de Control</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/api/auth">Iniciar Sesión</Link>
                  </Button>
                </div>
              )}
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

export default Header;
