// models
export type SubjectInfluence = {
    [key: string]: Range<0, 1>
}

export type AnswerType = string | boolean | null

export interface Question {
    statement?: string
    influence?: SubjectInfluence
    answer: AnswerType | AnswerType[]
}

export type Questionnaire = Question[]
export type Answers = AnswerType[]

// question types
export type ABCDAnswer =
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G"
    | "H"
    | "I"
    | "J"
    | "K"
    | "L"
    | "M"
    | "N"
    | "O"
    | "P"
    | "Q"
    | "R"
    | "S"
    | "T"
    | "U"
    | "V"
    | "W"
    | "X"
    | "Y"
    | "Z"

// other
export type Enumerate<
    N extends number,
    Acc extends number[] = []
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>

export type Range<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
>