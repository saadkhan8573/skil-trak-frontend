import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertCircle } from 'lucide-react'
import { Card, Checkbox, Typography } from '@components'

// --- Types ---
interface ConsentData {
    termsAccepted: boolean
    privacyAccepted: boolean
    marketingConsent: boolean
}

interface ConsentCardProps {
    data: ConsentData
    errors: Record<string, string>
    handleInputChange: any
}

const ErrorMessage = ({ message }: { message?: string }) => (
    <AnimatePresence>
        {message && (
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive flex items-center gap-1 ml-9 mt-1"
            >
                <AlertCircle className="w-3.5 h-3.5" /> {message}
            </motion.p>
        )}
    </AnimatePresence>
)

const ConsentSection = ({
    children,
    variant = 'default',
}: {
    children: React.ReactNode
    variant?: 'default' | 'highlight'
}) => {
    const styles =
        variant === 'highlight'
            ? 'bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200/50'
            : 'bg-linear-to-r from-gray-50 to-white border-gray-200/50'

    return (
        <div className={`p-4 rounded-xl border-2 transition-all ${styles}`}>
            {children}
        </div>
    )
}

export const ConsentCard = ({
    handleInputChange,
    data,
    errors,
}: ConsentCardProps) => {
    // Tao: Business logic (mapping handlers) kept clean
    const handleChange =
        (name: keyof ConsentData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleInputChange(name, e.target.checked)
        }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <Card noPadding className="border-0 shadow-xl bg-linear-to-br from-white to-gray-50/30 overflow-hidden">
                <div className="bg-linear-to-r from-green-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <Typography
                                color="gradient-text"
                                className="font-bold"
                            >
                                Consent & Agreements
                            </Typography>
                            <p className="text-sm text-muted-foreground">
                                Please review and accept our terms to proceed
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 p-8">
                    <div className="space-y-4">
                        <div>
                            <ConsentSection>
                                <Checkbox
                                    name="termsAccepted"
                                    label="I accept the Terms of Service"
                                    required
                                    showError={false}
                                    defaultChecked={data.termsAccepted}
                                    onChange={handleChange('termsAccepted')}
                                    helpText="By checking this box, you agree to our terms and conditions for Industry Partners."
                                />
                            </ConsentSection>
                            <ErrorMessage message={errors.termsAccepted} />
                        </div>

                        <div>
                            <ConsentSection>
                                <Checkbox
                                    name="privacyAccepted"
                                    label="I accept the Privacy Policy"
                                    required
                                    showError={false}
                                    defaultChecked={data.privacyAccepted}
                                    onChange={handleChange('privacyAccepted')}
                                    helpText="You consent to our collection and use of your information as outlined in our Policy."
                                />
                            </ConsentSection>
                            <ErrorMessage message={errors.privacyAccepted} />
                        </div>

                        <ConsentSection variant="highlight">
                            <Checkbox
                                showError={false}
                                name="marketingConsent"
                                label="I consent to marketing communications (optional)"
                                defaultChecked={data.marketingConsent}
                                onChange={handleChange('marketingConsent')}
                                helpText="Receive updates about new features and industry insights."
                            />
                        </ConsentSection>
                    </div>

                    {/* Privacy Note Footer */}
                    <footer className="bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 rounded-2xl p-6 relative">
                        <div className="relative flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                                <Shield className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-green-800">
                                    🔐 Your Privacy Matters
                                </h4>
                                <p className="text-sm text-green-700 leading-relaxed">
                                    We take data protection seriously. Your
                                    information is encrypted, stored securely,
                                    and only shared with educational
                                    institutions as part of the placement
                                    process. You can withdraw consent at any
                                    time.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </Card>
        </motion.div>
    )
}
