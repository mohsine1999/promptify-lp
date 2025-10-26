import * as React from "react";
import { cn } from "../../lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, ...props },
  ref
) {
  return (
    <div className="field">
      <input ref={ref} className={cn("form-input", error && "has-error", className)} {...props} />
      {error ? (
        <span role="alert" className="field__message">
          {error}
        </span>
      ) : null}
    </div>
  );
});
