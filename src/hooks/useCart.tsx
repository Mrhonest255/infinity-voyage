import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  tourId: string;
  tourName: string;
  slug: string;
  price: number;
  currency?: string;
  duration: string | null;
  featuredImage: string | null;
  quantity: number;
  addedAt: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity' | 'addedAt' | 'id'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (tourId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'infinity-voyage-cart';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsedItems = JSON.parse(stored);
        setItems(parsedItems);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity' | 'addedAt' | 'id'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.tourId === item.tourId);
      
      if (existingItem) {
        // Update quantity if already in cart
        toast.success('Cart updated', {
          description: `Increased quantity of ${item.tourName}`,
        });
        return prevItems.map((i) =>
          i.tourId === item.tourId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      
      // Add new item to cart
      const newItem: CartItem = {
        ...item,
        currency: item.currency || 'USD', // Default to USD if not provided
        id: `${item.tourId}-${Date.now()}`,
        quantity: 1,
        addedAt: new Date().toISOString(),
      };
      
      toast.success('Added to cart', {
        description: `${item.tourName} has been added to your cart`,
      });
      
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === itemId);
      if (item) {
        toast.info('Removed from cart', {
          description: `${item.tourName} has been removed`,
        });
      }
      return prevItems.filter((i) => i.id !== itemId);
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.info('Cart cleared', {
      description: 'All items have been removed from your cart',
    });
  };

  const isInCart = (tourId: string) => {
    return items.some((item) => item.tourId === tourId);
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
