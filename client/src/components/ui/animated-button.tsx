import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { forwardRef } from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  animation?: 'hover' | 'pulse' | 'bounce' | 'scale' | 'glow';
  children: React.ReactNode;
  className?: string;
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'default', size = 'default', animation = 'hover', children, ...props }, ref) => {
    const animationClasses = {
      hover: 'hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out',
      pulse: 'animate-pulse hover:animate-none hover:scale-105 transition-all duration-200',
      bounce: 'hover:animate-bounce hover:scale-110 transition-all duration-300',
      scale: 'hover:scale-110 active:scale-95 transition-transform duration-150 ease-out',
      glow: 'hover:shadow-cyan-500/25 hover:shadow-lg hover:scale-105 transition-all duration-200',
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "transform-gpu", 
          animationClasses[animation],
          "focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-slate-900",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };