import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Primary #1a3a52, secondary #2563eb — hovers lighten/darken for clear, accessible feedback */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-[8px] text-sm font-semibold ring-offset-background transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]/35 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#1a3a52] text-white shadow-sm hover:bg-[#2a4d6e] hover:shadow-md active:bg-[#152a3d] active:scale-[0.98]",
        destructive:
          "bg-[#dc2626] text-white shadow-sm hover:bg-[#b91c1c] hover:shadow-md active:bg-[#991b1b] active:scale-[0.98]",
        outline:
          "border border-slate-300 bg-white text-[#0f172a] shadow-sm hover:bg-slate-50 hover:border-[#1a3a52]/35 hover:text-[#1a3a52] active:bg-slate-100 active:scale-[0.98]",
        secondary:
          "bg-[#2563eb] text-white shadow-sm hover:bg-[#1d4ed8] hover:shadow-md active:bg-[#1e40af] active:scale-[0.98]",
        ghost:
          "text-[#0f172a] hover:bg-slate-100 hover:text-[#1a3a52] active:bg-slate-200/80 active:scale-[0.98]",
        link: "text-[#2563eb] underline-offset-4 hover:underline hover:text-[#1d4ed8] shadow-none",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-[8px] px-3 text-xs",
        lg: "h-11 rounded-[8px] px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
