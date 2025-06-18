import * as React from "react";

export function ScrollArea({ children, className, style }) {
    return (
        <div
            className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${className}`}
            style={style}
        >
            {children}
        </div>
    );
}
