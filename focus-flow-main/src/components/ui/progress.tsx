import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'primary' | 'gold';
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, showLabel, variant = 'default', ...props }, ref) => {
  const variantStyles = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    primary: 'bg-gradient-to-r from-primary to-primary-muted',
    gold: 'bg-gradient-to-r from-gold to-warning',
  };

  return (
    <div className="relative">
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full transition-all duration-500 ease-out rounded-full",
            variantStyles[variant],
            indicatorClassName
          )}
          style={{ width: `${value || 0}%` }}
        />
      </ProgressPrimitive.Root>
      {showLabel && (
        <span className="absolute right-0 -top-5 text-xs font-medium text-muted-foreground">
          {value}%
        </span>
      )}
    </div>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
