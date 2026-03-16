import { Check, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface StepperProps {
    currentStep: number
    steps: string[]
}

export const OnboardingStepper = ({ currentStep, steps }: StepperProps) => {
    return (
        <div className="sticky top-0 z-50 glass shadow-lg border-b border-white/20">
            <div className="max-w-260 mx-auto px-6 py-6">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const stepNumber = index + 1
                        const isActive = stepNumber === currentStep
                        const isCompleted = stepNumber < currentStep
                        const isAccessible = stepNumber <= currentStep

                        return (
                            <motion.div
                                key={index}
                                className="flex items-center flex-1"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                }}
                            >
                                <div className="flex items-center">
                                    <motion.div
                                        className={`
                      relative w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all duration-300
                      ${
                          isCompleted
                              ? 'bg-linear-to-br from-green-500 to-green-600 text-white shadow-lg'
                              : isActive
                                ? 'bg-linear-to-br from-primaryNew to-primaryNew text-white shadow-lg animate-pulse-success'
                                : 'bg-white/80 text-[#475569] border border-border/50'
                      }
                    `}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {isCompleted ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                            >
                                                <Check className="w-5 h-5" />
                                            </motion.div>
                                        ) : isActive ? (
                                            <motion.div className="flex items-center justify-center">
                                                <span>{stepNumber}</span>
                                                <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-[#F7A619] animate-pulse" />
                                            </motion.div>
                                        ) : (
                                            <span>{stepNumber}</span>
                                        )}

                                        {/* Animated ring for active step */}
                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-xl border-2 border-[#F7A619]"
                                                initial={{
                                                    scale: 1,
                                                    opacity: 1,
                                                }}
                                                animate={{
                                                    scale: 1.2,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                }}
                                            />
                                        )}
                                    </motion.div>

                                    <div className="ml-4 min-w-0">
                                        <motion.p
                                            className={`
                        text-xs font-medium uppercase tracking-wide
                        ${
                            isActive
                                ? 'text-primaryNew'
                                : isCompleted
                                  ? 'text-green-600'
                                  : 'text-[#475569]'
                        }
                      `}
                                        >
                                            Step {stepNumber}
                                        </motion.p>
                                        <motion.p
                                            className={`
                        text-sm font-semibold transition-colors duration-300 truncate
                        ${
                            isActive
                                ? 'text-primaryNew linear-text'
                                : isAccessible
                                  ? 'text-foreground'
                                  : 'text-[#475569]'
                        }
                      `}
                                            animate={{
                                                scale: isActive ? 1.02 : 1,
                                            }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {step}
                                        </motion.p>
                                        {isActive && (
                                            <motion.div
                                                className="text-xs text-[#F7A619] font-medium mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                In Progress
                                            </motion.div>
                                        )}
                                        {isCompleted && (
                                            <motion.div
                                                className="text-xs text-green-600 font-medium mt-1"
                                                initial={{ opacity: 0, y: -5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                Completed ✓
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {index < steps.length - 1 && (
                                    <div className="flex items-center mx-8 flex-1">
                                        <motion.div
                                            className={`
                        h-1 rounded-full transition-all duration-500 flex-1
                        ${
                            stepNumber < currentStep
                                ? 'bg-linear-to-r from-green-500 to-green-400'
                                : stepNumber === currentStep
                                  ? 'bg-linear-to-r from-primaryNew to-[#F7A619]'
                                  : 'bg-border'
                        }
                      `}
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: index * 0.1,
                                            }}
                                            style={{ transformOrigin: 'left' }}
                                        />
                                        {stepNumber < currentStep && (
                                            <motion.div
                                                className="w-2 h-2 bg-green-400 rounded-full ml-3"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.1 + 0.3,
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
