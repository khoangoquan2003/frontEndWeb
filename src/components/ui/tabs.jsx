import * as React from "react";

export function Tabs({ children, defaultValue, onValueChange, className }) {
    const [value, setValue] = React.useState(defaultValue);

    React.useEffect(() => {
        if (onValueChange) onValueChange(value);
    }, [value, onValueChange]);

    return (
        <div className={className}>
            {React.Children.map(children, (child) =>
                React.cloneElement(child, { value, setValue })
            )}
        </div>
    );
}

export function TabsList({ children, className }) {
    return (
        <div
            className={`inline-flex border-b border-gray-300 ${className}`}
            role="tablist"
        >
            {children}
        </div>
    );
}

export function TabsTrigger({ value: tabValue, value: currentValue, setValue, children, className }) {
    const selected = currentValue === tabValue;

    return (
        <button
            role="tab"
            aria-selected={selected}
            onClick={() => setValue(tabValue)}
            className={`px-4 py-2 -mb-px border-b-2 ${
                selected ? "border-blue-600 font-semibold" : "border-transparent hover:border-gray-400"
            } ${className}`}
        >
            {children}
        </button>
    );
}

export function TabsContent({ value: tabValue, value: currentValue, children, className }) {
    if (tabValue !== currentValue) return null;
    return (
        <div role="tabpanel" className={className}>
            {children}
        </div>
    );
}
