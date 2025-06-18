// components/ui/table.jsx
import React from "react";

export function Table({ children, className }) {
    return (
        <table className={`min-w-full border-collapse border border-gray-300 ${className || ""}`}>
            {children}
        </table>
    );
}

export function TableHeader({ children, className }) {
    return (
        <thead className={`${className || ""}`}>
        {children}
        </thead>
    );
}

export function TableBody({ children, className }) {
    return (
        <tbody className={`${className || ""}`}>
        {children}
        </tbody>
    );
}

export function TableRow({ children, className }) {
    return (
        <tr className={`${className || ""}`}>
            {children}
        </tr>
    );
}

export function TableCell({ children, className }) {
    return (
        <td className={`border p-4 text-left ${className || ""}`}>
            {children}
        </td>
    );
}

export function TableHead({ children, className }) {
    return (
        <th className={`border-b p-4 text-left font-semibold ${className || ""}`}>
            {children}
        </th>
    );
}
