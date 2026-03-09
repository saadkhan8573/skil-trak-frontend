import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Progress } from '@components/ui/progress'
import { Dialog, DialogContent } from '@components/ui/dialog'
import { Briefcase, CheckCircle2, Search, Sparkles } from 'lucide-react'

interface ProgressModalProps {
    open: boolean
    onComplete: () => void
}

export const WorkplaceProgressModal = ({
    open,
    onComplete,
}: ProgressModalProps) => {
    const [progress, setProgress] = useState(0)
    const [currentStep, setCurrentStep] = useState(0)

    const steps = [
        {
            icon: Search,
            label: 'Analyzing your preferences',
            color: 'text-[#24556D]',
        },
        {
            icon: Sparkles,
            label: 'Matching requirements',
            color: 'text-[#3a7a9d]',
        },
        {
            icon: Briefcase,
            label: 'Finding perfect workplace',
            color: 'text-[#4d8eb1]',
        },
        {
            icon: CheckCircle2,
            label: 'Workplace ready!',
            color: 'text-[#24556D]',
        },
    ]

    useEffect(() => {
        if (!open) {
            setProgress(0)
            setCurrentStep(0)
            return
        }

        const duration = 5000 // 5 seconds
        const interval = 50 // Update every 50ms
        const increment = (100 / duration) * interval

        const timer = setInterval(() => {
            setProgress((prev) => {
                const next = prev + increment
                if (next >= 100) {
                    clearInterval(timer)
                    setTimeout(() => onComplete(), 300)
                    return 100
                }
                return next
            })
        }, interval)

        return () => clearInterval(timer)
    }, [open, onComplete])

    useEffect(() => {
        // Update step based on progress
        if (progress < 25) setCurrentStep(0)
        else if (progress < 50) setCurrentStep(1)
        else if (progress < 75) setCurrentStep(2)
        else setCurrentStep(3)
    }, [progress])

    return (
        <Dialog open={open}>
            <DialogContent
                className="sm:max-w-md! z-1000000! border-none shadow-2xl overflow-hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
                showCloseButton={false}
            >
                <div className="relative">
                    {/* Animated Background */}
                    <div className="absolute inset-0 bg-linear-to-br from-[#e6f0f5] via-[#d4e5ed] to-[#c2dae5] opacity-50" />
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-[#24556D]/10 via-[#3a7a9d]/10 to-[#4d8eb1]/10"
                        animate={{
                            x: ['-100%', '100%'],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                    />

                    {/* Content */}
                    <div className="relative px-6 py-8">
                        {/* Title */}
                        <motion.h2
                            className="text-2xl font-semibold text-center mb-2 bg-linear-to-r from-[#1a3e52] via-[#24556D] to-[#4d8eb1] bg-clip-text text-transparent"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            Finding Another Suitable Workplace
                        </motion.h2>

                        {/* Message */}
                        <motion.p
                            className="text-center text-gray-600 mb-8 text-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Thank you for your feedback. Please allow us a
                            moment while we identify another suitable workplace
                            that aligns with your requirements.
                        </motion.p>

                        {/* Animated Icons */}
                        <div className="flex justify-center items-center mb-8 h-24">
                            {steps.map((step, index) => {
                                const Icon = step.icon
                                const isActive = index === currentStep
                                const isPast = index < currentStep

                                return (
                                    <motion.div
                                        key={index}
                                        className="relative"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{
                                            opacity:
                                                isActive || isPast ? 1 : 0.3,
                                            scale: isActive ? [1, 1.2, 1] : 1,
                                            x: isActive ? [0, 5, 0, -5, 0] : 0,
                                        }}
                                        transition={{
                                            opacity: { duration: 0.3 },
                                            scale: isActive
                                                ? {
                                                      duration: 0.6,
                                                      repeat: Infinity,
                                                  }
                                                : {},
                                            x: isActive
                                                ? {
                                                      duration: 1,
                                                      repeat: Infinity,
                                                  }
                                                : {},
                                        }}
                                    >
                                        <div
                                            className={`w-16 h-16 rounded-full flex items-center justify-center mx-2 ${
                                                isActive
                                                    ? 'bg-linear-to-br from-[#24556D] to-[#4d8eb1] shadow-lg'
                                                    : isPast
                                                      ? 'bg-[#c2dae5]'
                                                      : 'bg-gray-100'
                                            }`}
                                        >
                                            <Icon
                                                className={`w-8 h-8 ${
                                                    isActive || isPast
                                                        ? 'text-white'
                                                        : 'text-gray-400'
                                                }`}
                                            />
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full border-2 border-[#24556D]"
                                                animate={{
                                                    scale: [1, 1.3, 1],
                                                    opacity: [1, 0, 1],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        )}
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* Current Step Label */}
                        <motion.div
                            key={currentStep}
                            className="text-center mb-6 h-6"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p
                                className={`text-sm font-medium ${steps[currentStep].color}`}
                            >
                                {steps[currentStep].label}
                            </p>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>Processing...</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                        </div>

                        {/* Floating particles effect */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-linear-to-br from-[#24556D] to-[#4d8eb1] rounded-full opacity-20"
                                    initial={{
                                        x: Math.random() * 100 + '%',
                                        y: '100%',
                                    }}
                                    animate={{
                                        y: ['-10%', '-100%'],
                                        x: [
                                            `${Math.random() * 100}%`,
                                            `${Math.random() * 100}%`,
                                        ],
                                    }}
                                    transition={{
                                        duration: 3 + Math.random() * 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
