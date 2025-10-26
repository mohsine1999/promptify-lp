"use client";

import * as CommandPrimitive from "cmdk";
import * as React from "react";
import { cn } from "../../lib/utils";

export const Command = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof CommandPrimitive.Command>>(
  function Command({ className, ...props }, ref) {
    return <CommandPrimitive.Command ref={ref} className={cn("command", className)} {...props} />;
  }
);

export const CommandInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Command.Input>
>(function CommandInput({ className, ...props }, ref) {
  return <CommandPrimitive.Command.Input ref={ref} className={cn("command__input", className)} {...props} />;
});

export const CommandList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Command.List>
>(function CommandList({ className, ...props }, ref) {
  return <CommandPrimitive.Command.List ref={ref} className={cn("command__list", className)} {...props} />;
});

export const CommandEmpty = CommandPrimitive.Command.Empty;
export const CommandItem = CommandPrimitive.Command.Item;
export const CommandGroup = CommandPrimitive.Command.Group;
