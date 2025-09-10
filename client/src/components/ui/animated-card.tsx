import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { forwardRef } from "react";

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'hover' | 'float' | 'glow' | 'scale' | 'none';
  glowColor?: 'cyan' | 'purple' | 'blue' | 'green';
  children: React.ReactNode;
  className?: string;
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = 'hover', glowColor = 'cyan', children, ...props }, ref) => {
    const animationClasses = {
      hover: 'hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out',
      float: 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out',
      glow: `hover:shadow-${glowColor}-500/20 hover:shadow-xl hover:border-${glowColor}-500/50 transition-all duration-300`,
      scale: 'hover:scale-105 transition-transform duration-200 ease-out',
      none: ''
    };

    const glowClasses = {
      cyan: 'hover:shadow-cyan-500/20 hover:border-cyan-500/50',
      purple: 'hover:shadow-purple-500/20 hover:border-purple-500/50', 
      blue: 'hover:shadow-blue-500/20 hover:border-blue-500/50',
      green: 'hover:shadow-green-500/20 hover:border-green-500/50'
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "transform-gpu cursor-pointer",
          animationClasses[animation],
          animation === 'glow' && glowClasses[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };