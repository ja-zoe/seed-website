import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-green-300 selection:bg-primary selection:text-primary-foreground bg-green-800/50 border-green-600 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-green-100",
        "focus-visible:border-green-400 focus-visible:ring-green-400/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-400/20 aria-invalid:border-red-400",
        className
      )}
      {...props}
    />
  );
}

export { Input };
