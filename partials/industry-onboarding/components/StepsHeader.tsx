import { Building2, Sparkles, Shield, Award } from 'lucide-react'
import { motion } from 'framer-motion'

interface PremiumHeaderProps {
    currentStep: number
    totalSteps: number
}

export const StepsHeader = ({
    currentStep,
    totalSteps,
}: PremiumHeaderProps) => {
    const progress = (currentStep / totalSteps) * 100

    return (
        <div className="relative bg-linear-to-r from-primaryNew via-primaryNew to-primaryNew overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-[#F7A619]/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative max-w-260 mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-white">
                                SkilTrak Partner Portal
                            </h1>
                            <p className="text-white/80 text-sm">
                                Industry Partner Onboarding
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-[#F7A619]" />
                            <span className="text-white text-sm font-medium">
                                Premium Experience
                            </span>
                        </div>

                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4 text-green-400" />
                            <Award className="w-4 h-4 text-[#F7A619]" />
                        </div>
                    </motion.div>
                </div>

                {/* Progress Section */}
                <motion.div
                    className="space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="flex items-center justify-between text-white/90">
                        <span className="text-sm font-medium">
                            Step {currentStep} of {totalSteps}
                        </span>
                        <span className="text-sm">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>

                    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-linear-to-r from-[#F7A619] to-[#F7A619]/80 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
