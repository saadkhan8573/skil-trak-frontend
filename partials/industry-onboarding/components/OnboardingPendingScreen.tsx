import { CheckCircle, Clock, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@components'
import { useRouter } from 'next/router'
export function OnboardingPendingScreen() {
    const router = useRouter()
    return (
        <div className="flex flex-col justify-center items-center gap-y-5 my-8">
            {/* Success Icon */}
            <motion.div
                className="relative mx-auto w-24 h-24"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2,
                }}
            >
                <div className="w-full h-full rounded-full flex items-center justify-center shadow-xl bg-gradient-to-br from-primaryNew via-primaryNew to-primary relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
                    <motion.svg
                        className="w-12 h-12 text-white relative z-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                        />
                    </motion.svg>
                </div>

                {/* Animated rings */}
                <motion.div
                    className="absolute inset-0 border-3 rounded-full border-primary/40"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                    className="absolute inset-0 border-3 rounded-full border-primaryNew/40"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                    className="absolute inset-0 border-2 rounded-full border-primaryNew/30"
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                />
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-3 "
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col items-center justify-center"
                >
                    <h1 className="text-4xl font-bold gradient-text mb-3">
                        Application Submitted!
                    </h1>
                    <motion.div
                        className="inline-block px-4 py-1.5 bg-gradient-to-r from-primary/10 to-primaryNew/10 rounded-full border-2 border-primary/20 text-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <p className="text-sm font-semibold text-primary">
                            🎉 Successfully submitted and under review
                        </p>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* What's Next Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="max-w-4xl mx-auto"
            >
                {/* Section Header */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <motion.div
                        className="w-10 h-10 bg-gradient-to-br from-primaryNew to-primaryNew rounded-xl flex items-center justify-center shadow-lg"
                        animate={{ rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <span className="text-2xl">🚀</span>
                    </motion.div>
                    <h2 className="text-2xl font-bold gradient-text">
                        What's Next?
                    </h2>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {/* Step 1 */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primaryNew/20 to-primaryNew/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative bg-white rounded-2xl p-5 shadow-xl border-2 border-primaryNew/10 hover:border-primaryNew/30 transition-all hover-lift">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-primaryNew to-primaryNew rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-lg font-bold text-white">
                                        1
                                    </span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-primary mb-2">
                                        Expert Review
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Our compliance team will review your
                                        application for sector approval and
                                        verify all submitted information
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative bg-white rounded-2xl p-5 shadow-xl border-2 border-blue-500/10 hover:border-blue-500/30 transition-all hover-lift">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-lg font-bold text-white">
                                        2
                                    </span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">
                                        Email Updates
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        You'll receive status updates at each
                                        review milestone to keep you informed
                                        throughout the process
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-green-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative bg-white rounded-2xl p-5 shadow-xl border-2 border-emerald-500/10 hover:border-emerald-500/30 transition-all hover-lift">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-lg font-bold text-white">
                                        3
                                    </span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-emerald-900 mb-2">
                                        Account Activation
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Your account activates once sectors are
                                        approved, giving you full access to the
                                        platform
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Step 4 */}
                    <motion.div
                        className="relative group"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                        <div className="relative bg-white rounded-2xl p-5 shadow-xl border-2 border-accent/10 hover:border-accent/30 transition-all hover-lift">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-accent to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-lg font-bold text-amber-900 mb-2">
                                        Quick Processing
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Most applications reviewed within 2-3
                                        business days to get you started quickly
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Action Button */}
            {/* <motion.div
                className="pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
            >
                <Button
                    
                    variant="primaryNew"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    Access Your Dashboard
                </Button>
            </motion.div> */}

            {/* Application Details */}
            {/* <motion.div
                className="flex flex-wrap justify-center gap-3 pt-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
            >
                <motion.div
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-primary/20 rounded-xl px-4 py-2 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-gradient-to-r from-primary to-primaryNew shadow-lg"></div>
                    <span className="text-sm font-semibold text-gray-800">
                        Application ID:{' '}
                        <span className="text-primary">#SP-2024-001</span>
                    </span>
                </motion.div>

                <motion.div
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border-2 border-accent/20 rounded-xl px-4 py-2 shadow-lg"
                    whileHover={{ scale: 1.05 }}
                >
                    <span className="text-lg">📧</span>
                    <span className="text-sm font-semibold text-gray-800">
                        Confirmation sent to{' '}
                        <span className="text-accent">
                           
                            primaryContactEmail
                        </span>
                    </span>
                </motion.div>
            </motion.div> */}
        </div>
    )
}
