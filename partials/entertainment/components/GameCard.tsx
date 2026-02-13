import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { useRouter } from 'next/router'

interface GameCardProps {
    title: string
    description: string
    icon: LucideIcon
    route: string
    color: string
}

export const GameCard = ({
    title,
    description,
    icon: Icon,
    route,
    color,
}: GameCardProps) => {
    const router = useRouter()

    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push(route)}
            className="relative group cursor-pointer overflow-hidden rounded-3xl p-1 bg-white border border-gray-100 shadow-premium hover:shadow-premium-xl transition-all duration-300"
        >
            <div
                className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300 ${color}`}
            />

            <div className="relative z-10 p-8 flex flex-col items-center text-center space-y-4">
                <div
                    className={`p-4 rounded-2xl bg-gray-50 shadow-sm text-4xl transform group-hover:rotate-12 transition-transform duration-300 border border-gray-100`}
                >
                    <Icon size={48} className="text-primary" />
                </div>

                <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                <div className="pt-4">
                    <button className="px-8 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-md hover:bg-primary-dark transition-all duration-300">
                        PLAY NOW
                    </button>
                </div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 animate-shimmer" />
            </div>
        </motion.div>
    )
}
