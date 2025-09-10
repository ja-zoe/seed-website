import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-green-300 selection:bg-primary selection:text-primary-foreground bg-green-800/50 border-green-600 flex min-h-[60px] w-full min-w-0 rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm text-green-100",
        "focus-visible:border-green-400 focus-visible:ring-green-400/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-400/20 aria-invalid:border-red-400",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
