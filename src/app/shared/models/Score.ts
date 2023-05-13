import { Difficulty } from "./Difficulty"

export interface Score {
    username: string,
    difficulty: Difficulty,
    time: number
}