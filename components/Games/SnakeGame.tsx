import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Typography, Button } from '@components'
import {
    Trophy,
    Play,
    RotateCcw,
    Zap,
    Settings,
    ArrowRight,
    Target,
    Flame,
} from 'lucide-react'

interface Position {
    x: number
    y: number
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameSpeed = 'SLOW' | 'MEDIUM' | 'FAST'

export const SnakeGame: React.FC = () => {
    const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }])
    const [food, setFood] = useState<Position>({ x: 15, y: 15 })
    const [bonusFood, setBonusFood] = useState<Position | null>(null)
    const [bonusTimer, setBonusTimer] = useState(0)
    const [direction, setDirection] = useState<Direction>('RIGHT')
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [isGameOver, setIsGameOver] = useState(false)
    const [showSpeedSelect, setShowSpeedSelect] = useState(true)
    const [selectedSpeed, setSelectedSpeed] = useState<GameSpeed>('MEDIUM')
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(0)
    const [foodsEaten, setFoodsEaten] = useState(0)

    const directionRef = useRef<Direction>('RIGHT')
    const GRID_SIZE = 20
    const CELL_SIZE = 25
    const BONUS_DURATION = 100

    useEffect(() => {
        const saved = localStorage.getItem('snakeHighScore')
        if (saved) {
            setHighScore(parseInt(saved))
        }
    }, [])

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('snakeHighScore', score.toString())
        }
    }, [score, highScore])

    const getSpeedDelay = (speedLevel: GameSpeed): number => {
        switch (speedLevel) {
            case 'SLOW':
                return 180
            case 'MEDIUM':
                return 120
            case 'FAST':
                return 70
        }
    }

    const generateFood = useCallback(
        (snakeBody: Position[], existingBonus?: Position | null): Position => {
            let newFood: Position = { x: 0, y: 0 }
            let isOnSnake = true

            while (isOnSnake) {
                newFood = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE),
                }

                isOnSnake =
                    snakeBody.some(
                        (segment) =>
                            segment.x === newFood.x && segment.y === newFood.y
                    ) ||
                    (existingBonus
                        ? newFood.x === existingBonus.x &&
                        newFood.y === existingBonus.y
                        : false)
            }

            return newFood
        },
        []
    )

    const generateBonusFood = useCallback(
        (snakeBody: Position[], regularFood: Position): Position => {
            let newBonus: Position = { x: 0, y: 0 }
            let isValid = false

            while (!isValid) {
                newBonus = {
                    x: Math.floor(Math.random() * GRID_SIZE),
                    y: Math.floor(Math.random() * GRID_SIZE),
                }

                isValid =
                    !snakeBody.some(
                        (segment) =>
                            segment.x === newBonus.x && segment.y === newBonus.y
                    ) &&
                    (newBonus.x !== regularFood.x ||
                        newBonus.y !== regularFood.y)
            }

            return newBonus
        },
        []
    )

    const resetGame = useCallback(() => {
        const initialSnake = [{ x: 10, y: 10 }]
        setSnake(initialSnake)
        setFood(generateFood(initialSnake))
        setBonusFood(null)
        setBonusTimer(0)
        setDirection('RIGHT')
        directionRef.current = 'RIGHT'
        setScore(0)
        setFoodsEaten(0)
        setIsGameOver(false)
        setIsGameStarted(true)
        setShowSpeedSelect(false)
    }, [generateFood])

    const checkCollision = useCallback(
        (head: Position, snakeBody: Position[]): boolean => {
            if (
                head.x < 0 ||
                head.x >= GRID_SIZE ||
                head.y < 0 ||
                head.y >= GRID_SIZE
            ) {
                return true
            }

            for (let i = 1; i < snakeBody.length; i++) {
                if (head.x === snakeBody[i].x && head.y === snakeBody[i].y) {
                    return true
                }
            }

            return false
        },
        []
    )

    const moveSnake = useCallback(() => {
        if (!isGameStarted || isGameOver) return

        if (bonusFood && bonusTimer > 0) {
            setBonusTimer((prev) => {
                if (prev <= 1) {
                    setBonusFood(null)
                    return 0
                }
                return prev - 1
            })
        }

        setSnake((prevSnake) => {
            const head = prevSnake[0]
            let newHead: Position

            switch (directionRef.current) {
                case 'UP':
                    newHead = { x: head.x, y: head.y - 1 }
                    break
                case 'DOWN':
                    newHead = { x: head.x, y: head.y + 1 }
                    break
                case 'LEFT':
                    newHead = { x: head.x - 1, y: head.y }
                    break
                case 'RIGHT':
                    newHead = { x: head.x + 1, y: head.y }
                    break
                default:
                    newHead = { x: head.x, y: head.y }
            }

            if (checkCollision(newHead, prevSnake)) {
                setIsGameOver(true)
                return prevSnake
            }

            let newSnake = [newHead, ...prevSnake]
            let foodEaten = false

            if (newHead.x === food.x && newHead.y === food.y) {
                setScore((prev) => prev + 10)
                setFoodsEaten((prev) => {
                    const newCount = prev + 1
                    if (newCount % 5 === 0) {
                        const bonus = generateBonusFood(newSnake, food)
                        setBonusFood(bonus)
                        setBonusTimer(BONUS_DURATION)
                    }
                    return newCount
                })
                setFood(generateFood(newSnake, bonusFood))
                foodEaten = true
            }

            if (
                bonusFood &&
                newHead.x === bonusFood.x &&
                newHead.y === bonusFood.y
            ) {
                setScore((prev) => prev + 50)
                setBonusFood(null)
                setBonusTimer(0)
                foodEaten = true
            }

            if (!foodEaten) {
                newSnake.pop()
            }

            return newSnake
        })
    }, [
        isGameStarted,
        isGameOver,
        food,
        bonusFood,
        bonusTimer,
        score,
        checkCollision,
        generateFood,
        generateBonusFood,
    ])

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (showSpeedSelect) {
                if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault()
                    setSelectedSpeed((prev) => {
                        if (prev === 'FAST') return 'MEDIUM'
                        if (prev === 'MEDIUM') return 'SLOW'
                        return 'FAST'
                    })
                } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault()
                    setSelectedSpeed((prev) => {
                        if (prev === 'SLOW') return 'MEDIUM'
                        if (prev === 'MEDIUM') return 'FAST'
                        return 'SLOW'
                    })
                } else if (e.key === 'Enter') {
                    e.preventDefault()
                    resetGame()
                }
                return
            }

            if (isGameOver) {
                if (e.key === 'Enter') {
                    resetGame()
                }
                return
            }

            if (!isGameStarted) {
                if (
                    [
                        'ArrowUp',
                        'ArrowDown',
                        'ArrowLeft',
                        'ArrowRight',
                    ].includes(e.key)
                ) {
                    resetGame()
                }
                return
            }

            const key = e.key
            const currentDirection = directionRef.current

            if (key === 'ArrowUp' && currentDirection !== 'DOWN') {
                directionRef.current = 'UP'
                setDirection('UP')
                e.preventDefault()
            } else if (key === 'ArrowDown' && currentDirection !== 'UP') {
                directionRef.current = 'DOWN'
                setDirection('DOWN')
                e.preventDefault()
            } else if (key === 'ArrowLeft' && currentDirection !== 'RIGHT') {
                directionRef.current = 'LEFT'
                setDirection('LEFT')
                e.preventDefault()
            } else if (key === 'ArrowRight' && currentDirection !== 'LEFT') {
                directionRef.current = 'RIGHT'
                setDirection('RIGHT')
                e.preventDefault()
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [isGameStarted, isGameOver, showSpeedSelect, resetGame])

    useEffect(() => {
        if (!isGameStarted || isGameOver) return

        const gameInterval = setInterval(
            moveSnake,
            getSpeedDelay(selectedSpeed)
        )
        return () => clearInterval(gameInterval)
    }, [isGameStarted, isGameOver, selectedSpeed, moveSnake])

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 p-2 lg:p-4">
            <div className="w-full max-w-4xl">
                <div className="text-center mb-4 lg:mb-6">
                    <Typography
                        variant="h1"
                        color="text-slate-800"
                        bold
                        className="flex items-center justify-center gap-3"
                    >
                        🐍 Cyber Snake
                    </Typography>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-4 lg:p-8">
                    <div className="flex flex-wrap lg:flex-nowrap gap-8 items-start justify-center">
                        <div className="flex flex-col gap-4 w-full lg:w-48 order-2 lg:order-1">
                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm">
                                <Typography
                                    variant="xxs"
                                    bold
                                    color="text-slate-400"
                                    uppercase
                                    className="mb-1 flex items-center gap-1"
                                >
                                    <Target className="w-3 h-3" /> Score
                                </Typography>
                                <Typography
                                    variant="h2"
                                    bold
                                    color="text-slate-800"
                                >
                                    {score}
                                </Typography>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl shadow-sm">
                                <Typography
                                    variant="xxs"
                                    bold
                                    color="text-slate-400"
                                    uppercase
                                    className="mb-1 flex items-center gap-1"
                                >
                                    <Trophy className="w-3 h-3" /> Best
                                </Typography>
                                <Typography
                                    variant="h2"
                                    bold
                                    color="text-slate-800"
                                >
                                    {highScore}
                                </Typography>
                            </div>

                            <Button
                                onClick={() => {
                                    setIsGameStarted(false)
                                    setIsGameOver(false)
                                    setShowSpeedSelect(true)
                                }}
                                variant="secondary"
                                fullWidth
                                className="!h-12 uppercase font-bold text-xs tracking-widest mt-2"
                                text="Settings"
                                Icon={Settings}
                                outline
                            />
                        </div>

                        <div className="relative order-1 lg:order-2">
                            <div
                                className="relative bg-slate-900 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-200"
                                style={{
                                    width: GRID_SIZE * CELL_SIZE,
                                    height: GRID_SIZE * CELL_SIZE,
                                }}
                            >
                                {snake.map((segment, index) => (
                                    <div
                                        key={index}
                                        className={`absolute rounded-sm transition-all duration-100`}
                                        style={{
                                            left: segment.x * CELL_SIZE,
                                            top: segment.y * CELL_SIZE,
                                            width: CELL_SIZE,
                                            height: CELL_SIZE,
                                            backgroundColor:
                                                index === 0
                                                    ? '#4ade80'
                                                    : '#22c55e',
                                            boxShadow:
                                                index === 0
                                                    ? '0 0 20px rgba(74, 222, 128, 0.6)'
                                                    : 'none',
                                        }}
                                    />
                                ))}

                                <div
                                    className="absolute bg-rose-500 rounded-full animate-bounce"
                                    style={{
                                        left: food.x * CELL_SIZE + 2,
                                        top: food.y * CELL_SIZE + 2,
                                        width: CELL_SIZE - 4,
                                        height: CELL_SIZE - 4,
                                    }}
                                />

                                {bonusFood && (
                                    <div
                                        className="absolute bg-amber-400 rounded-lg flex items-center justify-center"
                                        style={{
                                            left: bonusFood.x * CELL_SIZE - 2,
                                            top: bonusFood.y * CELL_SIZE - 2,
                                            width: CELL_SIZE + 4,
                                            height: CELL_SIZE + 4,
                                            opacity:
                                                bonusTimer < 20
                                                    ? bonusTimer % 2 === 0
                                                        ? 1
                                                        : 0.4
                                                    : 1,
                                        }}
                                    >
                                        <Typography
                                            variant="xxs"
                                            bold
                                            color="text-amber-900"
                                        >
                                            {Math.ceil(bonusTimer / 10)}
                                        </Typography>
                                    </div>
                                )}

                                {(showSpeedSelect ||
                                    !isGameStarted ||
                                    isGameOver) && (
                                        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-30 p-8">
                                            {showSpeedSelect && (
                                                <div className="text-center w-full max-w-xs">
                                                    <Typography
                                                        variant="h2"
                                                        bold
                                                        color="text-white"
                                                        className="mb-6"
                                                    >
                                                        Select Speed
                                                    </Typography>
                                                    <div className="flex flex-col gap-3 mb-8">
                                                        {(
                                                            [
                                                                'SLOW',
                                                                'MEDIUM',
                                                                'FAST',
                                                            ] as GameSpeed[]
                                                        ).map((speed) => (
                                                            <button
                                                                key={speed}
                                                                onClick={() =>
                                                                    setSelectedSpeed(
                                                                        speed
                                                                    )
                                                                }
                                                                className={`py-3 rounded-xl font-bold transition-all border-2
                                                                ${selectedSpeed ===
                                                                        speed
                                                                        ? 'bg-emerald-500 border-emerald-400 text-white scale-105'
                                                                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                                                    }`}
                                                            >
                                                                {speed}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        onClick={resetGame}
                                                        variant="primary"
                                                        fullWidth
                                                        className="!h-14 uppercase font-bold tracking-widest"
                                                        text="Start Mission"
                                                        Icon={Play}
                                                    />
                                                </div>
                                            )}

                                            {isGameOver && !showSpeedSelect && (
                                                <div className="text-center w-full max-w-xs animate-in fade-in zoom-in duration-300">
                                                    <div className="mb-6">
                                                        <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <RotateCcw className="w-10 h-10 text-rose-500" />
                                                        </div>
                                                        <Typography
                                                            variant="h2"
                                                            bold
                                                            color="text-white"
                                                        >
                                                            Game Over
                                                        </Typography>
                                                        <Typography
                                                            color="text-slate-400"
                                                            className="mt-2"
                                                        >
                                                            Your final score
                                                        </Typography>
                                                        <Typography
                                                            variant="h1"
                                                            bold
                                                            color="text-rose-500"
                                                            className="mt-1"
                                                        >
                                                            {score}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <Button
                                                            onClick={resetGame}
                                                            variant="primary"
                                                            fullWidth
                                                            className="!h-14 uppercase font-bold tracking-widest"
                                                            text="Try Again"
                                                            Icon={RotateCcw}
                                                        />
                                                        <Button
                                                            onClick={() =>
                                                                setShowSpeedSelect(
                                                                    true
                                                                )
                                                            }
                                                            variant="primary"
                                                            fullWidth
                                                            className="!h-14 uppercase font-bold tracking-widest bg-slate-700 border-slate-600 hover:bg-slate-600"
                                                            text="Change Speed"
                                                            Icon={Settings}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
