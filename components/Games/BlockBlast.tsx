import React, { useState, useEffect, useRef } from 'react'
import {
    Trophy,
    Zap,
    Star,
    RefreshCw,
    Crown,
    Flame,
    TrendingUp,
} from 'lucide-react'
import { Typography, Button } from '@components'

interface ShapePattern {
    pattern: number[][]
    color: string
    points: number
}

interface Shape extends ShapePattern {
    id: number
}

interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    life: number
    color: string
    size: number
}

type GridCell = string | null
type Grid = GridCell[][]

export const BlockBlast: React.FC = () => {
    const [grid, setGrid] = useState<Grid>(
        Array(10)
            .fill(null)
            .map(() => Array(14).fill(null))
    )
    const [score, setScore] = useState<number>(0)
    const [highScore, setHighScore] = useState<number>(0)
    const [combo, setCombo] = useState<number>(0)
    const [currentShapes, setCurrentShapes] = useState<Shape[]>([])
    const [draggedShape, setDraggedShape] = useState<Shape | null>(null)
    const [previewPosition, setPreviewPosition] = useState<{
        row: number
        col: number
        valid: boolean
    } | null>(null)
    const [particles, setParticles] = useState<Particle[]>([])
    const [gameOver, setGameOver] = useState<boolean>(false)

    const gridRef = useRef<HTMLDivElement>(null)

    const shapes: ShapePattern[] = [
        { pattern: [[1]], color: '#ef4444', points: 1 },
        { pattern: [[1, 1]], color: '#f97316', points: 2 },
        { pattern: [[1], [1]], color: '#f59e0b', points: 2 },
        {
            pattern: [
                [1, 1],
                [1, 0],
            ],
            color: '#eab308',
            points: 3,
        },
        {
            pattern: [
                [1, 1],
                [0, 1],
            ],
            color: '#84cc16',
            points: 3,
        },
        { pattern: [[1, 1, 1]], color: '#14b8a6', points: 3 },
        {
            pattern: [
                [1, 1],
                [1, 1],
            ],
            color: '#0ea5e9',
            points: 4,
        },
    ]

    useEffect(() => {
        const saved = localStorage.getItem('blockBlastHighScore')
        if (saved) setHighScore(parseInt(saved))
        generateNewShapes()
    }, [])

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('blockBlastHighScore', score.toString())
        }
    }, [score, highScore])

    const generateNewShapes = (): void => {
        const newShapes: Shape[] = []
        for (let i = 0; i < 3; i++) {
            const randomShape =
                shapes[Math.floor(Math.random() * shapes.length)]
            newShapes.push({ ...randomShape, id: Date.now() + i })
        }
        setCurrentShapes(newShapes)
    }

    const canPlaceShape = (
        shape: Shape,
        startRow: number,
        startCol: number
    ): boolean => {
        for (let r = 0; r < shape.pattern.length; r++) {
            for (let c = 0; c < shape.pattern[r].length; c++) {
                if (shape.pattern[r][c] === 1) {
                    const gridRow = startRow + r
                    const gridCol = startCol + c

                    if (
                        gridRow < 0 ||
                        gridRow >= 10 ||
                        gridCol < 0 ||
                        gridCol >= 14
                    ) {
                        return false
                    }

                    if (grid[gridRow][gridCol] !== null) {
                        return false
                    }
                }
            }
        }
        return true
    }

    const placeShape = (
        shape: Shape,
        startRow: number,
        startCol: number
    ): void => {
        const newGrid = grid.map((row) => [...row])

        for (let r = 0; r < shape.pattern.length; r++) {
            for (let c = 0; c < shape.pattern[r].length; c++) {
                if (shape.pattern[r][c] === 1) {
                    newGrid[startRow + r][startCol + c] = shape.color
                }
            }
        }

        setGrid(newGrid)

        const updatedShapes = currentShapes.filter((s) => s.id !== shape.id)
        setCurrentShapes(updatedShapes)

        const baseScore = shape.points * 10
        const comboMultiplier = combo > 0 ? 1 + combo * 0.5 : 1
        const earnedScore = Math.floor(baseScore * comboMultiplier)
        setScore((prev) => prev + earnedScore)

        if (updatedShapes.length === 0) {
            setTimeout(() => {
                generateNewShapes()
                setCombo(0)
            }, 800)
        }
    }

    const handleShapeDragStart = (shape: Shape): void => {
        if (gameOver) return
        setDraggedShape(shape)
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!draggedShape || !gridRef.current) return

        const gridRect = gridRef.current.getBoundingClientRect()
        const cellSize = gridRect.width / 14

        const col = Math.floor((e.clientX - gridRect.left) / cellSize)
        const row = Math.floor((e.clientY - gridRect.top) / cellSize)

        if (row >= 0 && row < 10 && col >= 0 && col < 14) {
            if (canPlaceShape(draggedShape, row, col)) {
                setPreviewPosition({ row, col, valid: true })
            } else {
                setPreviewPosition({ row, col, valid: false })
            }
        } else {
            setPreviewPosition(null)
        }
    }

    const handleMouseUp = (): void => {
        if (!draggedShape || !previewPosition || !previewPosition.valid) {
            setDraggedShape(null)
            setPreviewPosition(null)
            return
        }

        placeShape(draggedShape, previewPosition.row, previewPosition.col)
        setDraggedShape(null)
        setPreviewPosition(null)
    }

    const resetGame = (): void => {
        setGrid(
            Array(10)
                .fill(null)
                .map(() => Array(14).fill(null))
        )
        setScore(0)
        setCombo(0)
        setGameOver(false)
        generateNewShapes()
    }

    return (
        <div
            className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="w-full max-w-6xl">
                <div className="text-center mb-6">
                    <Typography
                        variant="h1"
                        color="text-slate-800"
                        bold
                        className="mb-2 flex items-center justify-center gap-3"
                    >
                        <Zap className="w-8 h-8 text-yellow-500" />
                        Block Blast
                    </Typography>
                </div>

                <div className="flex gap-6 flex-wrap lg:flex-nowrap justify-center items-start">
                    <div className="space-y-4 w-full lg:w-48">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                <Typography variant="muted" bold>
                                    SCORE
                                </Typography>
                            </div>
                            <Typography
                                variant="h2"
                                bold
                                color="text-slate-800"
                            >
                                {score}
                            </Typography>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-4 h-4 text-orange-500" />
                                <Typography variant="muted" bold>
                                    BEST
                                </Typography>
                            </div>
                            <Typography
                                variant="h2"
                                bold
                                color="text-slate-800"
                            >
                                {highScore}
                            </Typography>
                        </div>

                        <Button
                            onClick={resetGame}
                            variant="primary"
                            fullWidth
                            className="!h-12 uppercase font-bold"
                            text="New Game"
                            Icon={RefreshCw}
                        />
                    </div>

                    <div className="flex-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                            <div
                                ref={gridRef}
                                className="relative grid gap-1 bg-slate-50 p-2 rounded-xl mx-auto border border-slate-100"
                                style={{
                                    width: '612px',
                                    height: '416px',
                                    gridTemplateColumns: 'repeat(14, 1fr)',
                                }}
                            >
                                {grid.map((row, ri) =>
                                    row.map((cell, ci) => (
                                        <div
                                            key={`${ri}-${ci}`}
                                            className={`w-10 h-10 rounded-md transition-all duration-200
                                                ${cell ? 'shadow-sm border border-white/20' : 'bg-white border border-slate-100'}`}
                                            style={{
                                                backgroundColor:
                                                    cell || undefined,
                                            }}
                                        />
                                    ))
                                )}
                            </div>

                            {gameOver && (
                                <div className="mt-8 text-center">
                                    <div className="bg-red-50 border border-red-100 text-red-700 px-8 py-5 rounded-2xl inline-block">
                                        <Typography variant="title" bold>
                                            Game Over!
                                        </Typography>
                                        <Typography variant="body" bold>
                                            Score: {score}
                                        </Typography>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="w-full lg:w-48">
                        <Typography
                            variant="muted"
                            bold
                            className="text-center mb-4"
                        >
                            NEXT SHAPES
                        </Typography>
                        <div className="flex lg:flex-col gap-4">
                            {currentShapes.map((shape) => (
                                <div
                                    key={shape.id}
                                    className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 cursor-move
                                        transform hover:scale-105 transition-all
                                        ${draggedShape?.id === shape.id ? 'opacity-30 scale-90' : ''}`}
                                    onMouseDown={() =>
                                        handleShapeDragStart(shape)
                                    }
                                >
                                    <div
                                        className="grid gap-1 mx-auto"
                                        style={{
                                            gridTemplateColumns: `repeat(${shape.pattern[0].length}, 24px)`,
                                            width: 'fit-content',
                                        }}
                                    >
                                        {shape.pattern.map((row, ri) =>
                                            row.map((cell, ci) => (
                                                <div
                                                    key={`${ri}-${ci}`}
                                                    className="w-6 h-6 rounded-md"
                                                    style={{
                                                        backgroundColor: cell
                                                            ? shape.color
                                                            : 'transparent',
                                                    }}
                                                />
                                            ))
                                        )}
                                    </div>
                                    <div className="text-center mt-3">
                                        <Typography
                                            variant="xxs"
                                            bold
                                            color="text-slate-400"
                                        >
                                            +{shape.points * 10} PTS
                                        </Typography>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
