"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, type HTMLMotionProps } from "framer-motion";
import * as React from "react";
import { cn } from "../../lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

type DragHandlerKeys = "onDrag" | "onDragStart" | "onDragEnd";

type PrimitiveContentProps = Omit<
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "asChild" | "ref" | DragHandlerKeys
>;

type MotionContentProps = Omit<HTMLMotionProps<"div">, "ref" | DragHandlerKeys> &
  Pick<HTMLMotionProps<"div">, DragHandlerKeys>;

export type DialogContentProps = PrimitiveContentProps & MotionContentProps;

export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(function DialogOverlay({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn("dialog-overlay", className)}
      {...props}
    />
  );
});

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(function DialogContent({ className, children, ...props }, ref) {
  const { onDrag, onDragStart, onDragEnd, ...rest } = props;
  const primitiveProps = rest as PrimitiveContentProps;
  const motionProps = rest as MotionContentProps;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content {...primitiveProps} asChild>
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className={cn("dialog-content", className)}
          onDrag={onDrag}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          {...motionProps}
        >
          {children}
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});

export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
