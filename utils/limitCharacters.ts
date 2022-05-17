export default function(string: string, limit = 40): string {
    return string.slice(0, limit) + (string.length > limit ? "..." : "")
}