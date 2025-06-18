import React from "react";

export function AlertDialog({ open, onOpenChange, children }) {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white rounded-md shadow-lg max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
                role="alertdialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
}

export function AlertDialogHeader({ children, className = "", ...props }) {
    return (
        <div className={`mb-4 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function AlertDialogTitle({ children, className = "", ...props }) {
    return (
        <h2 className={`text-lg font-semibold ${className}`} {...props}>
            {children}
        </h2>
    );
}

export function AlertDialogDescription({ children, className = "", ...props }) {
    return (
        <p className={`mb-4 text-sm text-gray-600 ${className}`} {...props}>
            {children}
        </p>
    );
}

export function AlertDialogFooter({ children, className = "", ...props }) {
    return (
        <div className={`flex justify-end space-x-2 ${className}`} {...props}>
            {children}
        </div>
    );
}

export function AlertDialogAction({ children, className = "", ...props }) {
    return (
        <button
            className={`bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function AlertDialogCancel({ children, className = "", ...props }) {
    return (
        <button
            className={`bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
export function AlertDialogContent({ children, className = "", ...props }) {
    return (
        <div
            className={`mb-4 max-h-[60vh] overflow-auto ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}