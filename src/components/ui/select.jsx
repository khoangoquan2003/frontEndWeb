// components/ui/select.jsx
import React from "react";

export function Select({ value, onChange, children, className, ...rest }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ""}`}
            {...rest}
        >
            {children}
        </select>
    );
}

export function SelectTrigger({ children, className }) {
    // Thường dùng để wrap select hoặc làm UI tùy chỉnh
    return <div className={`select-trigger ${className || ""}`}>{children}</div>;
}

export function SelectContent({ children, className }) {
    // Dùng để chứa các SelectItem, ví dụ dropdown list
    return <div className={`select-content ${className || ""}`}>{children}</div>;
}

export function SelectItem({ value, children, className }) {
    // Một item trong dropdown
    return (
        <option value={value} className={className || ""}>
            {children}
        </option>
    );
}

export function SelectValue({ children, className }) {
    // Hiển thị giá trị đã chọn (nếu custom UI)
    return <span className={`select-value ${className || ""}`}>{children}</span>;
}
