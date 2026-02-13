import React from 'react'
import { GameCard } from './components/GameCard'
import { Gamepad2, Puzzle, LayoutGrid, Zap, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export const Entertainment = () => {
    const games = [
        {
            title: 'Snake Game',
            description:
                'Classic snake game. Eat the apples and grow longer without hitting the walls!',
            icon: Gamepad2,
            route: '/snake-game',
            color: 'bg-green-500',
        },
        {
            title: 'Puzzle Game',
            description:
                'Challenge your brain with our classic sliding puzzle. Piece it all together!',
            icon: Puzzle,
            route: '/puzzle',
            color: 'bg-blue-500',
        },
        {
            title: 'Block Blast',
            description:
                'Strategic block placement game. Clear rows and columns to score high!',
            icon: LayoutGrid,
            route: '/block-blast',
            color: 'bg-purple-500',
        },
        {
            title: 'Endless Runner',
            description:
                'Run as far as you can, jump over obstacles, and collect coins in this fast-paced game!',
            icon: Zap,
            route: '/endless-runner',
            color: 'bg-orange-500',
        },
    ]

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                        <Sparkles size={20} className="text-primary" />
                        <span className="text-primary font-semibold text-sm">
                            Fun & Entertainment
                        </span>
                    </div>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight sm:text-6xl mb-4">
                        Gaming <span className="text-primary">Zone</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Take a break and enjoy these fun games we created just
                        for you. Challenge yourself and set new high scores!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {games.map((game, index) => (
                        <GameCard key={index} {...game} />
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20 p-12 rounded-[3rem] bg-primary/5 border border-primary/10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Gamepad2 size={160} className="text-primary" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4 text-gray-900">
                            More Games Coming Soon!
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                            We are constantly working on new and exciting games
                            to add to your entertainment portal. Stay tuned for
                            the next big challenge!
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
