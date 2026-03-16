import { Button } from '@components'
import { motion } from 'framer-motion'

import {
    Save,
    ArrowLeft,
    ArrowRight,
    Send,
    Shield,
    Sparkles,
    Loader2,
} from 'lucide-react'

interface OnboardingFooterProps {
    currentStep: number
    totalSteps: number
    onBack: () => void
    onContinue: () => void
    canContinue: boolean
    isLastStep?: boolean
    isLoading?: boolean
}

export function OnboardingFooter({
    currentStep,
    totalSteps,
    onBack,
    onContinue,
    canContinue,
    isLastStep = false,
    isLoading = false,
}: OnboardingFooterProps) {
    const handleSaveDraft = () => {
        // toast.success('Draft saved successfully', {
        //     description: 'Your progress has been securely stored',
        //     icon: '💾',
        // })
        alert('Draft saved successfully!') //TODO: Replace with toast in production
    }

    const progress = (currentStep / totalSteps) * 100

    return (
        <motion.div
            className="sticky bottom-0 glass border-t border-white/20 px-6 py-6 z-40 shadow-2xl"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200/50">
                <motion.div
                    className="h-full bg-linear-to-r from-primaryNew via-accent to-primaryNew"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>

            <div className="max-w-260 mx-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {currentStep > 1 && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="secondary"
                                    onClick={onBack}
                                    className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white hover-lift"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </motion.div>
                        )}

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                variant="secondary"
                                onClick={handleSaveDraft}
                                className="bg-white/60 backdrop-blur-sm hover:bg-white/80 hover-lift"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save draft
                            </Button>
                        </motion.div>

                        {/* Step indicator */}
                        <div className="hidden sm:flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2">
                            <div className="flex items-center gap-1">
                                {[...Array(totalSteps)].map((_, index) => (
                                    <motion.div
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                                            index + 1 <= currentStep
                                                ? 'bg-primaryNew'
                                                : 'bg-gray-300'
                                        }`}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700 ml-2">
                                {currentStep} of {totalSteps}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Mobile step indicator */}
                        <div className="sm:hidden text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1">
                            {currentStep}/{totalSteps}
                        </div>

                        {/* Security badge */}
                        <div className="hidden md:flex items-center gap-2 bg-green-50/80 backdrop-blur-sm border border-green-200/50 rounded-full px-3 py-1.5">
                            <Shield className="w-3 h-3 text-green-600" />
                            <span className="text-xs font-medium text-green-700">
                                Secure & Encrypted
                            </span>
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="relative"
                        >
                            <Button
                                onClick={onContinue}
                                disabled={!canContinue || isLoading}
                                className={`
                  relative overflow-hidden font-semibold shadow-lg transition-all duration-300
                  ${
                      isLastStep
                          ? 'bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8'
                          : 'bg-linear-to-r from-primaryNew to-primaryNew hover:from-primaryNew hover:to-primaryNew px-6'
                  }
                  ${!canContinue || isLoading ? 'opacity-50 cursor-not-allowed' : 'hover-lift'}
                `}
                            >
                                {/* Animated background for submit button */}
                                {isLastStep && canContinue && (
                                    <motion.div
                                        className="absolute inset-0 bg-linear-to-r from-green-500 to-emerald-500"
                                        initial={{ x: '-100%' }}
                                        animate={{ x: '100%' }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: 'easeInOut',
                                        }}
                                    />
                                )}

                                <span className="relative flex items-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : isLastStep ? (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit for Approval
                                            <Sparkles className="w-4 h-4 animate-pulse" />
                                        </>
                                    ) : (
                                        <>
                                            Continue
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </span>
                            </Button>

                            {/* Disabled state tooltip */}
                            {!canContinue && (
                                <motion.div
                                    className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    Complete required fields to continue
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
