"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme, ready } = useTheme();
  const label = theme === "dark" ? "وضع الإضاءة" : "الوضع الليلي";
  return (
    <button
      type="button"
      className={`theme-toggle${!ready ? " is-loading" : ""}`}
      onClick={toggleTheme}
      disabled={!ready}
      aria-label={label}
    >
      <span aria-hidden="true" className="theme-toggle__icon">
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 18a6 6 0 1 1 0-12 6.001 6.001 0 0 1 5.292 3.233 7.001 7.001 0 0 0-7.957 9.29c.221.03.445.049.665.049Z"
              fill="currentColor"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path
              d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-10.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Zm0-3.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 1 1-1.5 0v-1.5A.75.75 0 0 1 12 3.75ZM12 18.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 1 1-1.5 0v-1.5a.75.75 0 0 1 .75-.75ZM5.53 5.53a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 0 1-1.06 1.06L5.53 6.59a.75.75 0 0 1 0-1.06Zm10.82 10.82a.75.75 0 0 1 1.06 0l1.06 1.06a.75.75 0 1 1-1.06 1.06l-1.06-1.06a.75.75 0 0 1 0-1.06ZM3.75 12a.75.75 0 0 1 .75-.75h1.5a.75.75 0 1 1 0 1.5H4.5A.75.75 0 0 1 3.75 12Zm12 0a.75.75 0 0 1 .75-.75h1.5a.75.75 0 1 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM5.53 18.47a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1 1.06 1.06L7.65 19.53a.75.75 0 0 1-1.06-1.06Zm10.82-10.82a.75.75 0 0 1 1.06 0l1.06-1.06a.75.75 0 1 1 1.06 1.06l-1.06 1.06a.75.75 0 0 1-1.06-1.06Z"
              fill="currentColor"
            />
          </svg>
        )}
      </span>
      <span className="theme-toggle__label">{ready ? label : "..."}</span>
    </button>
  );
}

export default ThemeToggle;
