import { motion, AnimatePresence } from "framer-motion";
import { useCart, CartItem } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  X, 
  Minus, 
  Plus, 
  Trash2, 
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

// Cart Button for Navbar
export function CartButton() {
  const { toggleCart, totalItems } = useCart();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleCart}
      className="relative p-2.5 rounded-xl bg-gradient-to-br from-safari-gold/10 to-safari-amber/10 hover:from-safari-gold/20 hover:to-safari-amber/20 transition-all duration-300 border border-safari-gold/20"
      aria-label="Open cart"
    >
      <ShoppingCart className="w-5 h-5 text-safari-brown" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1.5 -right-1.5"
          >
            <Badge className="h-5 min-w-[20px] px-1.5 bg-gradient-to-r from-safari-gold to-safari-amber text-white text-xs font-bold border-2 border-white shadow-lg">
              {totalItems}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Cart Item Component
function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 p-4 bg-white rounded-2xl border border-border/50 shadow-soft"
    >
      {/* Image */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-safari-cream">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-safari-gold/50" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-semibold text-sm text-foreground line-clamp-2">
            {item.title}
          </h4>
          <button
            onClick={() => removeItem(item.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {item.duration && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{item.duration}</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-safari-gold/20 flex items-center justify-center transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-safari-gold/20 flex items-center justify-center transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <span className="font-bold text-safari-gold">
            ${(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Cart Drawer
export function CartDrawer() {
  const { items, isOpen, closeCart, totalItems, totalPrice, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-safari-night/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-safari-cream to-white z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-safari-gold to-safari-amber flex items-center justify-center shadow-gold">
                    <ShoppingBag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold">Your Cart</h2>
                    <p className="text-sm text-muted-foreground">
                      {totalItems} {totalItems === 1 ? "item" : "items"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-safari-gold/10 to-safari-amber/10 flex items-center justify-center mb-6">
                    <ShoppingCart className="w-12 h-12 text-safari-gold/50" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-xs">
                    Explore our amazing tours and add your favorites to the cart
                  </p>
                  <Button
                    onClick={closeCart}
                    asChild
                    className="bg-gradient-to-r from-safari-gold to-safari-amber text-white font-semibold rounded-xl"
                  >
                    <Link to="/safaris">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Explore Tours
                    </Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <CartItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full py-2 text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear all items
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-white/90 backdrop-blur-sm space-y-4">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-display text-2xl font-bold text-safari-gold">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>

                {/* Note */}
                <p className="text-xs text-muted-foreground text-center">
                  Final price may vary based on dates and travelers
                </p>

                {/* Checkout Button */}
                <Button
                  asChild
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-safari-gold to-safari-amber text-safari-night font-bold text-lg rounded-2xl shadow-gold hover:shadow-glow transition-all"
                >
                  <Link to="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                {/* Continue Shopping */}
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={closeCart}
                >
                  Continue Browsing
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Add to Cart Button Component
export function AddToCartButton({
  item,
  variant = "default",
  className = "",
}: {
  item: Omit<CartItem, "quantity">;
  variant?: "default" | "icon" | "outline";
  className?: string;
}) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item);
  };

  if (variant === "icon") {
    return (
      <motion.button
        whileHover={{ scale: 1.15, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleAdd}
        className={`relative p-3.5 rounded-2xl bg-gradient-to-br from-white to-safari-cream border-2 border-safari-gold/30 shadow-lg hover:shadow-gold hover:border-safari-gold group transition-all duration-300 overflow-hidden ${className}`}
        aria-label="Add to cart"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-safari-gold to-safari-amber opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <ShoppingCart className="w-5 h-5 relative z-10 text-safari-gold group-hover:text-white transition-colors duration-300" />
      </motion.button>
    );
  }

  if (variant === "outline") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        className={`relative px-5 py-3 rounded-2xl border-2 border-safari-gold/50 bg-gradient-to-br from-white to-safari-cream/50 text-safari-gold font-bold shadow-md hover:shadow-gold hover:border-safari-gold group transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 ${className}`}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-safari-gold to-safari-amber opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <ShoppingCart className="w-4 h-4 relative z-10 group-hover:text-white transition-colors duration-300" />
        <span className="relative z-10 group-hover:text-white transition-colors duration-300">Add</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleAdd}
      className={`relative px-6 py-3.5 rounded-2xl bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold bg-[length:200%_100%] text-safari-night font-bold shadow-lg hover:shadow-gold group transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 animate-shimmer ${className}`}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {/* Sparkle dots */}
      <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-3 w-1 h-1 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100" />
      <ShoppingCart className="w-5 h-5 relative z-10" />
      <span className="relative z-10">Add to Cart</span>
    </motion.button>
  );
}
