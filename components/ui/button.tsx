"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";
import * as React from "react";

import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "btn inline-flex items-center justify-center gap-2 font-semibold transition-transform will-change-transform",
  {
    variants: {
      variant: {
        primary: "btn-primary",
        ghost: "btn-ghost",
        outline: "btn-outline",
        subtle: "btn-subtle",
        destructive: "btn-destructive",
        success: "btn-success",
      },
      size: {
        default: "btn-default",
        lg: "btn-lg",
        sm: "btn-sm",
        icon: "btn-icon",
      },
      state: {
        loading: "is-loading",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

type MotionButtonProps = ButtonBaseProps &
  Omit<HTMLMotionProps<"button">, keyof ButtonBaseProps | "asChild" | "ref"> & {
    asChild?: false;
  };

type SlotButtonProps = ButtonBaseProps &
  Omit<React.ComponentPropsWithoutRef<typeof Slot>, keyof ButtonBaseProps | "asChild" | "ref"> & {
    asChild: true;
  };

type MotionButtonExtras = Omit<MotionButtonProps, keyof ButtonBaseProps | "asChild">;
type SlotButtonExtras = Omit<SlotButtonProps, keyof ButtonBaseProps | "asChild">;

export type ButtonProps = MotionButtonProps | SlotButtonProps;

const MotionButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  props,
  ref
) {
  const { className, variant, size, loading, state, disabled, children, asChild, ...rest } = props;
  const isLoading = loading ?? state === "loading";
  const baseClass = cn(buttonVariants({ variant, size }), className, isLoading && "is-loading");

  if (asChild) {
    const slotProps = rest as SlotButtonExtras;

    return (
      <Slot
        ref={ref as unknown as React.Ref<HTMLButtonElement>}
        className={baseClass}
        data-state={isLoading ? "loading" : undefined}
        aria-disabled={disabled || isLoading}
        {...slotProps}
      >
        <span className="btn__content" aria-live="polite">
          {isLoading ? <span className="btn__spinner" aria-hidden /> : null}
          <span className={cn("btn__label", isLoading && "sr-only")}>{children}</span>
        </span>
      </Slot>
    );
  }

  return (
    <motion.button
      ref={ref}
      className={baseClass}
      data-state={isLoading ? "loading" : undefined}
      disabled={disabled || isLoading}
      whileHover={{ y: -2 }}
      whileTap={{ y: 0 }}
      transition={{ duration: 0.12, ease: [0.22, 1, 0.36, 1] }}
      {...(rest as MotionButtonExtras)}
    >
      <span className="btn__content" aria-live="polite">
        {isLoading ? <span className="btn__spinner" aria-hidden /> : null}
        <span className={cn("btn__label", isLoading && "sr-only")}>{children}</span>
      </span>
    </motion.button>
  );
});

export { MotionButtonBase as Button };
