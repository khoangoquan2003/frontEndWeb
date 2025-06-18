import React from "react";

export function Avatar({ children, className, ...props }) {
    return (
        <div
            className={`inline-flex items-center justify-center rounded-full overflow-hidden bg-gray-100 ${className || ""}`}
            {...props}
            style={{ width: 40, height: 40 }}
        >
            {children}
        </div>
    );
}

export function AvatarImage({ src, alt, className, ...props }) {
    return (
        <img
            src={src}
            alt={alt}
            className={`w-full h-full object-cover ${className || ""}`}
            {...props}
        />
    );
}

export function AvatarFallback({ children, className, ...props }) {
    return (
        <span
            className={`text-gray-500 text-sm font-medium flex items-center justify-center w-full h-full ${className || ""}`}
            {...props}
        >
      {children}
    </span>
    );
}
