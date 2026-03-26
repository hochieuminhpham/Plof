import Ball from "@/models/Ball";

interface Course{
    id: number,
    EndDistance: number,
    isFinished: boolean,
    target: Target,
    ball: Ball,
    usedShots: number,
    allowedShots: number
}

export default Course