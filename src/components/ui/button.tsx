import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:shadow-elevated hover:-translate-y-0.5",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        safari: "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground hover:opacity-90 shadow-elevated hover:shadow-luxury hover:-translate-y-0.5",
        gold: "bg-gradient-to-r from-safari-gold via-safari-amber to-safari-gold text-safari-night font-bold shadow-gold hover:shadow-glow hover:scale-[1.02] transition-all duration-500",
        hero: "bg-primary-foreground/10 text-primary-foreground border-2 border-primary-foreground/30 backdrop-blur-sm hover:bg-primary-foreground/20 hover:border-primary-foreground/50",
        heroSolid: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-elevated hover:shadow-luxury",
        luxury: "bg-gradient-to-r from-safari-gold via-safari-sunset to-safari-gold text-safari-night font-bold shadow-gold hover:shadow-glow hover:scale-105 transition-all duration-500",
      },
      size: {
        default: "h-11 px-5 sm:px-6 py-2.5 min-h-[44px]",
        sm: "h-9 sm:h-10 rounded-lg px-3 sm:px-4 min-h-[36px]",
        lg: "h-12 sm:h-13 rounded-xl px-6 sm:px-8 text-sm sm:text-base min-h-[44px]",
        xl: "h-14 sm:h-15 rounded-2xl px-8 sm:px-12 text-base sm:text-lg min-h-[48px]",
        icon: "h-10 w-10 sm:h-11 sm:w-11 min-h-[40px] min-w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
