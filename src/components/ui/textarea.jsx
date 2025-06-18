// components/ui/Textarea.jsx
import * as React from "react";

export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => {
    return (
        <textarea
            ref={ref}
            className={`flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";
