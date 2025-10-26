import * as React from "react";
import { cn } from "../../lib/utils";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="field">
        <textarea ref={ref} className={cn("form-textarea", error && "has-error", className)} {...props} />
        {error ? (
          <span role="alert" className="field__message">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);
