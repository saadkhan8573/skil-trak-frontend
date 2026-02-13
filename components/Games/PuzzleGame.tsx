import React, { useState, useEffect } from 'react'
import { Shuffle, RotateCcw, Trophy, Clock, Hash } from 'lucide-react'
import { Typography, Button } from '@components'

interface ColorGradient {
    from: string
    to: string
}

export const PuzzleGame: React.FC = () => {
    const [gridSize, setGridSize] = useState<number>(3)
    const [tiles, setTiles] = useState<number[]>([])
    const [emptyIndex, setEmptyIndex] = useState<number>(0)
    const [moves, setMoves] = useState<number>(0)
    const [time, setTime] = useState<number>(0)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const [isWon, setIsWon] = useState<boolean>(false)
    const [isShuffling, setIsShuffling] = useState<boolean>(false)
    const [lastMovedIndex, setLastMovedIndex] = useState<number | null>(null)

    const colors: ColorGradient[] = [
        { from: '#94a3b8', to: '#64748b' },
        { from: '#818cf8', to: '#6366f1' },
        { from: '#2dd4bf', to: '#0d9488' },
        { from: '#fb923c', to: '#f97316' },
        { from: '#f472b6', to: '#db2777' },
        { from: '#a78bfa', to: '#8b5cf6' },
        { from: '#4ade80', to: '#22c55e' },
        { from: '#60a5fa', to: '#3b82f6' },
        { from: '#f87171', to: '#ef4444' },
    ]

    useEffect(() => {
        initializeGame()
    }, [gridSize])

    useEffect(() => {
        let interval: NodeJS.Timeout
        if (isPlaying && !isWon) {
            interval = setInterval(() => {
                setTime((t) => t + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [isPlaying, isWon])

    useEffect(() => {
        if (isPlaying && checkWin()) {
            setIsWon(true)
            setIsPlaying(false)
        }
    }, [tiles])

    const initializeGame = (): void => {
        const totalTiles = gridSize * gridSize
        const newTiles = Array.from({ length: totalTiles }, (_, i) => i)
        setTiles(newTiles)
        setEmptyIndex(totalTiles - 1)
        setMoves(0)
        setTime(0)
        setIsPlaying(false)
        setIsWon(false)
        setLastMovedIndex(null)
    }

    const shuffleGame = async (): Promise<void> => {
        setIsShuffling(true)
        setIsWon(false)
        setMoves(0)
        setTime(0)

        const totalTiles = gridSize * gridSize
        let currentTiles = Array.from({ length: totalTiles }, (_, i) => i)
        let currentEmpty = totalTiles - 1

        for (let i = 0; i < 100; i++) {
            const validMoves = getValidMoves(currentEmpty, currentTiles)
            const randomMove =
                validMoves[Math.floor(Math.random() * validMoves.length)]

            ;[currentTiles[currentEmpty], currentTiles[randomMove]] = [
                currentTiles[randomMove],
                currentTiles[currentEmpty],
            ]
            currentEmpty = randomMove

            await new Promise((resolve) => setTimeout(resolve, 20))
            setTiles([...currentTiles])
            setEmptyIndex(currentEmpty)
        }

        setIsShuffling(false)
        setIsPlaying(true)
    }

    const getValidMoves = (
        emptyIdx: number,
        tilesArray: number[] = tiles
    ): number[] => {
        const row = Math.floor(emptyIdx / gridSize)
        const col = emptyIdx % gridSize
        const validMoves: number[] = []

        if (row > 0) validMoves.push(emptyIdx - gridSize)
        if (row < gridSize - 1) validMoves.push(emptyIdx + gridSize)
        if (col > 0) validMoves.push(emptyIdx - 1)
        if (col < gridSize - 1) validMoves.push(emptyIdx + 1)

        return validMoves
    }

    const handleTileClick = (index: number): void => {
        if (isShuffling || isWon) return

        const validMoves = getValidMoves(emptyIndex)
        if (validMoves.includes(index)) {
            const newTiles = [...tiles]
            ;[newTiles[emptyIndex], newTiles[index]] = [
                newTiles[index],
                newTiles[emptyIndex],
            ]

            setTiles(newTiles)
            setEmptyIndex(index)
            setMoves(moves + 1)
            setLastMovedIndex(emptyIndex)

            if (!isPlaying) setIsPlaying(true)

            setTimeout(() => setLastMovedIndex(null), 300)
        }
    }

    const checkWin = (): boolean => {
        if (!isPlaying) return false
        return tiles.every((tile, index) => tile === index)
    }

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-6">
                    <Typography
                        variant="h1"
                        color="text-slate-800"
                        bold
                        className="mb-1"
                    >
                        Sliding Puzzle
                    </Typography>
                    <Typography variant="body" color="text-slate-500">
                        Match the numbers in order to win!
                    </Typography>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                        <div className="flex gap-3">
                            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <Typography
                                    variant="label"
                                    bold
                                    color="text-slate-700"
                                >
                                    {formatTime(time)}
                                </Typography>
                            </div>
                            <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-400" />
                                <Typography
                                    variant="label"
                                    bold
                                    color="text-slate-700"
                                >
                                    {moves}
                                </Typography>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={gridSize}
                                onChange={(e) =>
                                    setGridSize(Number(e.target.value))
                                }
                                className="bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-lg cursor-pointer"
                                disabled={isPlaying && !isWon}
                            >
                                <option value={3}>3x3</option>
                                <option value={4}>4x4</option>
                                <option value={5}>5x5</option>
                            </select>

                            <Button
                                onClick={shuffleGame}
                                disabled={isShuffling}
                                variant="primary"
                                outline
                                mini
                                className="!h-9"
                                text="Shuffle"
                                Icon={Shuffle}
                            />
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <div
                            className="grid gap-3 bg-slate-50 p-4 rounded-2xl"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                width: `${gridSize * 70 + (gridSize - 1) * 12}px`,
                            }}
                        >
                            {tiles.map((tile, index) => {
                                const isEmpty = tile === tiles.length - 1
                                const isMovable =
                                    getValidMoves(emptyIndex).includes(index)

                                return (
                                    <div
                                        key={tile}
                                        onClick={() => handleTileClick(index)}
                                        className={`w-[70px] h-[70px] rounded-lg font-bold text-xl flex items-center justify-center transition-all
                                            ${isEmpty ? 'opacity-0' : 'shadow-sm border border-white/20'}
                                            ${isMovable && !isEmpty ? 'cursor-pointer hover:scale-105' : ''}`}
                                        style={{
                                            background: isEmpty
                                                ? 'transparent'
                                                : `linear-gradient(135deg, ${colors[tile % colors.length].from} 0%, ${colors[tile % colors.length].to} 100%)`,
                                        }}
                                    >
                                        {!isEmpty && (
                                            <span className="text-white drop-shadow-sm">
                                                {tile + 1}
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {isWon && (
                        <div className="mt-8 text-center">
                            <div className="inline-flex flex-col items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-700 px-8 py-4 rounded-2xl">
                                <Trophy className="w-8 h-8 text-emerald-500" />
                                <Typography
                                    variant="title"
                                    bold
                                    color="text-emerald-700"
                                >
                                    Puzzle Solved!
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="text-emerald-600"
                                >
                                    {moves} moves, {formatTime(time)}
                                </Typography>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
