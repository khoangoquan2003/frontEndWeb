import React from "react"

export function Slider({ min = 0, max = 100, step = 1, value, onValueChange, className = "", id }) {
    const handleChange = (event) => {
        const newValue = parseFloat(event.target.value)
        onValueChange([newValue])
    }

    return (
        <input
            type="range"
            id={id}
            min={min}
            max={max}
            step={step}
            value={value[0]}
            onChange={handleChange}
            className={`w-full ${className}`}
        />
    )
}
