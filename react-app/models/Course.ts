import { Target } from "./Target"
import { Ball } from "./Ball"
export interface Course{
    id: number,
    EndDistance: number,
    isFinished: boolean,
    target: Target,
    ball: Ball,
    usedShots: number,
    allowedShots: number
}