export function getLevelColor(level) {
    switch (level?.toLowerCase()) {
        case "beginner":
            return "bg-green-100 text-green-800"
        case "intermediate":
            return "bg-yellow-100 text-yellow-800"
        case "advanced":
            return "bg-red-100 text-red-800"
        default:
            return "bg-gray-100 text-gray-800"
    }
}
