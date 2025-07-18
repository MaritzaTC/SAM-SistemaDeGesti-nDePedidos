'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AlertCircleIcon, CheckCircle2Icon } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

export type CartItem = {
  discount: number;
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

type AlertState = {
  type: 'success' | 'error' | 'warning';
  message: string;
  description?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  alert: AlertState | null;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [alert, setAlert] = useState<AlertState | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: CartItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity + 1 > product.stock) {
          setAlert({
            type: 'warning',
            message: 'No hay suficiente stock disponible',
          });
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      setAlert({
        type: 'success',
        message: 'Producto añadido al carrito',
      });
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setAlert({
      type: 'success',
      message: 'Producto eliminado del carrito',
    });
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          if (quantity > item.stock) {
            setAlert({
              type: 'warning',
              message: 'Cantidad supera el stock disponible',
            });
            return item;
          }
          setAlert({
            type: 'success',
            message: 'Cantidad actualizada',
          });
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        setCartItems,
        alert,
      }}
    >
      {alert && (
        <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
          <Alert variant={alert.type === 'error' ? 'destructive' : undefined}>
            {alert.type === 'success' && <CheckCircle2Icon />}
            {alert.type === 'warning' && <AlertCircleIcon />}
            {alert.type === 'error' && <AlertCircleIcon />}
            <AlertTitle>{alert.message}</AlertTitle>
            {alert.description && (
              <AlertDescription>{alert.description}</AlertDescription>
            )}
          </Alert>
        </div>
      )}
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
