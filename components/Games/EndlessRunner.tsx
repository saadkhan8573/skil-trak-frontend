import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Typography, Button } from '@components'
import { Trophy, Play, RotateCcw, Zap, Cloud } from 'lucide-react'

interface Obstacle {
    id: number
    x: number
    height: number
}

interface CloudData {
    id: number
    x: number
    y: number
    speed: number
    scale: number
    opacity: number
}

export const EndlessRunner: React.FC = () => {
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [playerY, setPlayerY] = useState(0)
    const [isJumping, setIsJumping] = useState(false)
    const [obstacles, setObstacles] = useState<Obstacle[]>([])
    const [clouds, setClouds] = useState<CloudData[]>([])
    const [gameSpeed, setGameSpeed] = useState(4)

    const velocityRef = useRef(0)
    const obstacleIdRef = useRef(0)
    const cloudIdRef = useRef(0)
    const frameRef = useRef(0)
    const nextObstacleFrameRef = useRef(90)

    const PLAYER_SIZE = 50
    const GROUND_HEIGHT = 80
    const JUMP_VELOCITY = 15
    const GRAVITY = 0.5
    const GAME_WIDTH = 1000
    const GAME_HEIGHT = 450

    useEffect(() => {
        const initialClouds: CloudData[] = Array(6)
            .fill(null)
            .map((_, i) => ({
                id: i,
                x: Math.random() * GAME_WIDTH,
                y: 40 + Math.random() * 150,
                speed: 0.5 + Math.random() * 0.8,
                scale: 0.8 + Math.random() * 1.2,
                opacity: 0.3 + Math.random() * 0.4,
            }))
        setClouds(initialClouds)
        cloudIdRef.current = 6
    }, [])

    useEffect(() => {
        const saved = localStorage.getItem('endlessRunnerHighScore')
        if (saved) {
            setHighScore(parseInt(saved))
        }
    }, [])

    const startGame = useCallback(() => {
        setIsGameStarted(true)
        setIsGameOver(false)
        setScore(0)
        setPlayerY(0)
        setObstacles([])
        setIsJumping(false)
        setGameSpeed(4)
        velocityRef.current = 0
        obstacleIdRef.current = 0
        frameRef.current = 0
        nextObstacleFrameRef.current = 90
    }, [])

    const jump = useCallback(() => {
        if (!isGameStarted && !isGameOver) {
            startGame()
            return
        }
        if (isGameOver) {
            startGame()
            return
        }
        if (playerY === 0 && isGameStarted && !isGameOver) {
            velocityRef.current = JUMP_VELOCITY
            setIsJumping(true)
        }
    }, [isGameStarted, isGameOver, playerY, startGame])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault()
                jump()
            }
        }
        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [jump])

    // Game loop
    useEffect(() => {
        const gameLoop = setInterval(() => {
            frameRef.current += 1

            setPlayerY((prevY) => {
                let newY = prevY + velocityRef.current
                velocityRef.current -= GRAVITY
                if (newY <= 0) {
                    newY = 0
                    velocityRef.current = 0
                    setIsJumping(false)
                }
                return newY
            })

            if (isGameStarted && !isGameOver) {
                setObstacles((prev) => {
                    const updated = prev
                        .map((obs) => ({ ...obs, x: obs.x - gameSpeed }))
                        .filter((obs) => obs.x > -100)
                    return updated
                })

                if (frameRef.current >= nextObstacleFrameRef.current) {
                    const height = 40 + Math.random() * 45
                    setObstacles((prev) => [
                        ...prev,
                        {
                            id: obstacleIdRef.current++,
                            x: GAME_WIDTH,
                            height,
                        },
                    ])
                    const minGap = 50
                    const maxGap = 100
                    const randomGap = minGap + Math.random() * (maxGap - minGap)
                    nextObstacleFrameRef.current = frameRef.current + randomGap
                }
                setScore((prev) => prev + 1)
            }

            setClouds((prev) => {
                const moved = prev.map((c) => ({
                    ...c,
                    x: c.x - c.speed,
                }))
                const filtered = moved.filter((c) => c.x > -150)
                if (filtered.length < 6 && Math.random() < 0.01) {
                    filtered.push({
                        id: cloudIdRef.current++,
                        x: GAME_WIDTH + 100,
                        y: 40 + Math.random() * 180,
                        speed: 0.5 + Math.random() * 0.8,
                        scale: 0.8 + Math.random() * 1.2,
                        opacity: 0.3 + Math.random() * 0.4,
                    })
                }
                return filtered
            })
        }, 1000 / 60)

        return () => clearInterval(gameLoop)
    }, [isGameStarted, isGameOver, gameSpeed])

    const displayScore = Math.floor(score / 6)

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 p-4">
            <div className="w-full max-w-[1100px]">
                <div className="text-center mb-6">
                    <Typography variant="h1" color="text-slate-800" bold>
                        🏃 Endless Runner
                    </Typography>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl">
                            <Typography
                                variant="xxs"
                                bold
                                color="text-slate-400"
                            >
                                SCORE
                            </Typography>
                            <Typography variant="h4" bold>
                                {displayScore}
                            </Typography>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-xl">
                            <Typography
                                variant="xxs"
                                bold
                                color="text-slate-400"
                            >
                                BEST
                            </Typography>
                            <Typography variant="h4" bold>
                                {highScore}
                            </Typography>
                        </div>
                    </div>

                    <div
                        className="relative bg-gradient-to-b from-indigo-900 via-purple-800 to-indigo-700 rounded-2xl overflow-hidden cursor-pointer border-4 border-slate-200 mx-auto shadow-2xl"
                        style={{
                            width: '100%',
                            height: GAME_HEIGHT,
                            maxWidth: GAME_WIDTH,
                        }}
                        onClick={jump}
                    >
                        {clouds.map((cloud) => (
                            <div
                                key={cloud.id}
                                className="absolute text-white pointer-events-none"
                                style={{
                                    left: cloud.x,
                                    top: cloud.y,
                                    transform: `scale(${cloud.scale})`,
                                    opacity: cloud.opacity,
                                }}
                            >
                                <Cloud className="w-12 h-12 fill-white" />
                            </div>
                        ))}

                        <div
                            className="absolute bg-white rounded-xl shadow-lg border-2 border-indigo-200 flex items-center justify-center"
                            style={{
                                width: PLAYER_SIZE,
                                height: PLAYER_SIZE,
                                left: 100,
                                bottom: GROUND_HEIGHT + playerY,
                                transform: isJumping
                                    ? 'rotate(-10deg)'
                                    : 'rotate(0deg)',
                                zIndex: 20,
                            }}
                        >
                            <span className="text-3xl">🚀</span>
                        </div>

                        {obstacles.map((obstacle) => (
                            <div
                                key={obstacle.id}
                                className="absolute bg-rose-500 rounded-lg shadow-lg border-2 border-rose-300"
                                style={{
                                    width: 40,
                                    height: obstacle.height,
                                    left: obstacle.x,
                                    bottom: GROUND_HEIGHT,
                                    zIndex: 15,
                                }}
                            />
                        ))}

                        <div
                            className="absolute bottom-0 w-full bg-slate-900/80 backdrop-blur-md border-t-4 border-indigo-400/50"
                            style={{ height: GROUND_HEIGHT }}
                        />

                        {(!isGameStarted || isGameOver) && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm z-50">
                                <div className="text-center bg-white p-10 rounded-2xl shadow-2xl max-w-sm">
                                    <Typography
                                        variant="h2"
                                        bold
                                        color={
                                            isGameOver
                                                ? 'text-rose-600'
                                                : 'text-slate-800'
                                        }
                                        className="mb-4"
                                    >
                                        {isGameOver ? 'Game Over!' : 'Ready?'}
                                    </Typography>
                                    <Typography
                                        variant="body"
                                        color="text-slate-500"
                                        className="mb-8"
                                    >
                                        {isGameOver
                                            ? `Score: ${displayScore}`
                                            : 'Click or press SPACE to start'}
                                    </Typography>
                                    <Button
                                        onClick={startGame}
                                        variant={
                                            isGameOver ? 'error' : 'primary'
                                        }
                                        fullWidth
                                        text={isGameOver ? 'Retry' : 'Start'}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
