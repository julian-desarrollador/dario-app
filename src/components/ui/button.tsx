import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils.ts";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full text-sm font-semibold transition outline-none focus-visible:ring-2 focus-visible:ring-[var(--moss)] disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default: "bg-[var(--moss)] text-white hover:bg-[var(--forest)]",
        secondary: "bg-white text-[var(--ink)] ring-1 ring-[var(--ink)]/12 hover:bg-[var(--mist)]",
        ghost: "text-[var(--ink)] hover:bg-[var(--mist)]",
        destructive: "bg-[#f7e8df] text-[var(--alert)] hover:bg-[#f3d9cc]",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        icon: "size-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

export { Button, buttonVariants };
