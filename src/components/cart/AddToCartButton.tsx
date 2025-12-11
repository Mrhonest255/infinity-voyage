import { ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AddToCartButtonProps {
  tourId: string;
  tourName: string;
  slug: string;
  price: number;
  currency?: string;
  duration?: string | null;
  featuredImage?: string | null;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  iconOnly?: boolean;
}

export const AddToCartButton = ({
  tourId,
  tourName,
  slug,
  price,
  currency = 'USD',
  duration,
  featuredImage,
  variant = 'default',
  size = 'default',
  className,
  iconOnly = false,
}: AddToCartButtonProps) => {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(tourId);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!inCart) {
      addToCart({
        tourId,
        tourName,
        slug,
        price,
        currency,
        duration,
        featuredImage,
      });
    }
  };

  if (iconOnly) {
    return (
      <Button
        variant={variant}
        size="icon"
        className={cn(
          'relative transition-all',
          inCart && 'bg-safari-gold text-safari-night hover:bg-safari-gold/90',
          className
        )}
        onClick={handleAddToCart}
        disabled={inCart}
        aria-label={inCart ? 'Already in cart' : 'Add to cart'}
      >
        <motion.div
          key={inCart ? 'check' : 'cart'}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {inCart ? (
            <Check className="h-4 w-4" />
          ) : (
            <ShoppingCart className="h-4 w-4" />
          )}
        </motion.div>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        'transition-all',
        inCart && 'bg-safari-gold text-safari-night hover:bg-safari-gold/90',
        className
      )}
      onClick={handleAddToCart}
      disabled={inCart}
    >
      <motion.div
        key={inCart ? 'check' : 'cart'}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="mr-2"
      >
        {inCart ? (
          <Check className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </motion.div>
      {inCart ? 'In Cart' : 'Add to Cart'}
    </Button>
  );
};
