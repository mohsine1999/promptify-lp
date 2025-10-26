import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string;
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, error, ...props },
  ref
) {
  return (
    <div className={cn("field", "select-field", error && "has-error")}>
      <select ref={ref} className={cn("form-select", className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden className="select-field__icon" />
      {error ? (
        <span role="alert" className="field__message">
          {error}
        </span>
      ) : null}
    </div>
  );
});
