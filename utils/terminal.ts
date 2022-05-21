import { terminal as term, Terminal } from "terminal-kit"

export const createBadge = (
    badge: string,
    bgColor: string,
    color: string = "white"
): Terminal => (term as any).bold[bgColor]?.[color]?.(` ${badge} `)(" ")

export const moveCursorToStartOfLine = (): Terminal => term("\n").left(0).up(1)
export const promisedGetCursorLocation = (): Promise<{ x: number; y: number }> => {
    return new Promise((resolve, reject) =>
        term.getCursorLocation((err, x, y) => {
            if (err || isNaN(x as any) || isNaN(y as any)) reject(err)
            else resolve({ x: x as number, y: y as number })
        })
    )
}

export default {
    createBadge,
    moveCursorToStartOfLine,
    promisedGetCursorLocation,
}