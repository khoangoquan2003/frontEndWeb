import * as React from "react";

export function Dialog({ open, onOpenChange, children, className }) {
    React.useEffect(() => {
        function onKeyDown(e) {
            if (e.key === "Escape") {
                onOpenChange(false);
            }
        }
        if (open) window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => onOpenChange(false)}
        >
            <div
                className={`bg-white rounded-lg shadow-lg max-w-lg w-full p-6 ${className}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                {children}
            </div>
        </div>
    );
}

export function DialogHeader({ className, ...props }) {
    return <div className={`mb-4 ${className}`} {...props} />;
}

export function DialogTitle({ className, ...props }) {
    return (
        <h2 className={`text-lg font-semibold ${className}`} {...props} />
    );
}

export function DialogContent({ className, ...props }) {
    return <div className={`space-y-4 ${className}`} {...props} />;
}
export function DialogFooter({ className, ...props }) {
    return (
        <div
            className={`flex justify-end space-x-2 mt-4 ${className}`}
            {...props}
        />
    );
}

