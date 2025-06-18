import React from 'react'
import { cn } from "../../lib/utils"

export function Alert({ className, children, ...props }) {
    return (
        <div
            className={cn(
                'relative w-full rounded-lg border border-red-300 bg-red-50 p-4 text-red-800 shadow-sm',
                className
            )}
            role="alert"
            {...props}
        >
            {children}
        </div>
    )
}

export function AlertDescription({ className, children, ...props }) {
    return (
        <div className={cn('text-sm', className)} {...props}>
            {children}
        </div>
    )
}
