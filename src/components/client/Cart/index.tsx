/* eslint-disable @next/next/no-img-element */
import React from "react";
import { X, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useSession, signIn } from "next-auth/react";
import { useCart } from "../CartContext";

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { data: session } = useSession();
  const {
    cartItems,
    removeFromCart,
    updateCartItemQuantity,
  } = useCart();

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      updateCartItemQuantity(id, quantity);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountAmount = cartItems.reduce((sum, item) => {
    if (item.discount) {
      const itemDiscount = (item.price * item.discount / 100) * item.quantity;
      return sum + itemDiscount;
    }
    return sum;
  }, 0);

  const shipping = subtotal >= 150000 ? 0 : 15000;
  const total = subtotal + shipping - discountAmount;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleStripeCheckout = () => {
    if (!session) {
      return signIn("auth0", { callbackUrl: "/admin/checkout/address" });
    }

    sessionStorage.setItem("checkoutTotal", total.toString());
    window.location.href = "/admin/checkout/address";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl animate-slide-in-right pt-16">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-secondary/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-playfair font-semibold text-foreground">Tu carrito</h2>
                <p className="text-sm text-muted-foreground">
                  {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-secondary/50">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Tu carrito está vacío</h3>
                  <p className="text-muted-foreground mb-4">Agrega algunos productos para comenzar</p>
                  <Button onClick={onClose} className="bg-gradient-primary hover:opacity-90">
                    Continuar comprando
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.id} className="bg-card/50 border-border/30">
                    <CardContent className="p-4">
                      <div className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg bg-secondary/20"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-foreground text-sm truncate">
                              {item.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {!item.stock && (
                            <div className="text-xs text-destructive mb-2">Sin stock disponible</div>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <div className="flex items-center space-x-2">
                                <span className="font-semibold text-foreground">
                                  {formatPrice(item.price)}
                                </span>
                                {item.price && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="h-8 w-8"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Summary & Checkout */}
          {cartItems.length > 0 && (
            <div className="border-t border-border/50 p-6 bg-secondary/10">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Descuento</span>
                  <span className="font-medium">{formatPrice(discountAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Envío {shipping === 0 && <span className="text-primary">(¡Gratis!)</span>}
                  </span>
                  <span className="font-medium">
                    {shipping === 0 ? "Gratis" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Envío gratis en compras superiores a {formatPrice(150000)}
                  </p>
                )}
                <Separator />
                <div className="flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-lg text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full bg-primary hover:opacity-90 text-white font-medium py-3"
                onClick={handleStripeCheckout}
              >
                Finalizar la compra
              </Button>

              <Button
                variant="ghost"
                className="w-full mt-2 text-muted-foreground hover:text-foreground"
                onClick={onClose}
              >
                Continuar comprando
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
