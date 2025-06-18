// components/ui/label.jsx
import React from "react";

export function Label({ htmlFor, children, className }) {
    return (
        <label htmlFor={htmlFor} className={`block mb-1 font-medium ${className || ""}`}>
            {children}
        </label>
    );
}
