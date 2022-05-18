import path from "path"

export default function (location: string) {
    return path.join(process.cwd(), location)
}
