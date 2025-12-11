import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { motion, AnimatePresence } from 'framer-motion';

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton = ({ onClick }: CartButtonProps) => {
  const { itemCount } = useCart();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute -top-1 -right-1"
          >
            <Badge
              variant="default"
              className="h-5 min-w-[20px] px-1 flex items-center justify-center text-xs bg-safari-gold text-safari-night font-bold border-2 border-background"
            >
              {itemCount > 99 ? '99+' : itemCount}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};
