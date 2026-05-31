import { type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:scale-100 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm shadow-primary/15 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/15",
        secondary:
          "border border-border/85 bg-card/95 text-foreground shadow-sm hover:border-primary/35 hover:bg-muted/70 dark:border-white/10 dark:bg-card/90 dark:hover:bg-muted",
        ghost: "text-muted-foreground hover:bg-muted/75 hover:text-foreground",
        warning:
          "border border-rose-300/80 bg-rose-50 text-rose-800 shadow-sm hover:bg-rose-100 dark:border-rose-300/40 dark:bg-rose-950/55 dark:text-rose-50 dark:hover:bg-rose-900/70"
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
