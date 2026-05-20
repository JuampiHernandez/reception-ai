import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-reception-purple disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-reception-blue text-white hover:bg-blue-600",
        gradient:
          "gradient-bg text-white shadow-lg shadow-reception-purple/20 hover:opacity-90 hover:shadow-reception-purple/30",
        secondary:
          "border border-slate-300 bg-white text-foreground hover:bg-slate-50",
        outline:
          "border border-white/20 bg-transparent text-white hover:bg-white/10",
        ghost: "hover:bg-slate-100 text-foreground",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
