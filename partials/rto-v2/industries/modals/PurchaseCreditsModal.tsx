import { Typography } from '@components'
import { Alert, AlertDescription } from '@components/ui/alert'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { ScrollArea } from '@components/ui/scroll-area'
import { useAppSelector } from '@redux'
import { Info, Sparkles, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { RtoPurchaseCreditCard } from '../card'
import { PaymentStatus } from './components/PaymentStatus'
import { StripePaymentFlow } from './components/StripePaymentFlow'
import { WorkplaceTokenPlan } from '@types'

export interface CreditPackage {
    credits: number
    price: number
    popular: boolean
    plan: WorkplaceTokenPlan
}

interface PurchaseCreditsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    workplaceCredits: string
}

const CREDIT_PACKAGES: CreditPackage[] = [
    { credits: 10, price: 99, popular: false, plan: WorkplaceTokenPlan.BASIC },
    {
        credits: 50,
        price: 449,
        popular: true,
        plan: WorkplaceTokenPlan.STANDARD,
    },
    {
        credits: 100,
        price: 799,
        popular: false,
        plan: WorkplaceTokenPlan.PREMIUM,
    },
]

export const PurchaseCreditsModal = ({
    open,
    onOpenChange,
    workplaceCredits,
}: PurchaseCreditsModalProps) => {
    const rto = useAppSelector((state) => state.rto.rtoDetail)

    const [clientSecret, setClientSecret] = useState<string | null>(null)
    const [selectedPkg, setSelectedPkg] = useState<CreditPackage | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)

    const resetPaymentState = () => {
        setClientSecret(null)
        setSelectedPkg(null)
        setShowSuccess(false)
    }

    const handleSuccess = () => {
        if (selectedPkg) {
            setShowSuccess(true)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                onOpenChange(val)
                if (!val) {
                    // Slight delay to avoid layout jump during exit animation
                    setTimeout(resetPaymentState, 300)
                }
            }}
        >
            <DialogContent className="!max-w-2xl !w-full max-h-[90vh] flex flex-col p-0 overflow-hidden border-primaryNew/20 bg-white shadow-premium-lg">
                {!showSuccess && (
                    <DialogHeader className="p-4 pb-0">
                        <DialogTitle className="text-lg flex items-center gap-2 text-primaryNew">
                            <div className="h-8 w-8 rounded-lg bg-primaryNew flex items-center justify-center shadow-premium">
                                <Zap className="h-4 w-4 text-white" />
                            </div>
                            {clientSecret
                                ? 'Secure Checkout'
                                : 'Purchase Credits'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground mt-1">
                            {clientSecret
                                ? `Complete your purchase for ${selectedPkg?.credits} credits`
                                : 'Each credit = 1 AI-matched workplace request from the SkilTrak Network'}
                        </DialogDescription>
                    </DialogHeader>
                )}

                <ScrollArea className="flex-1 px-4 max-h-[450px] overflow-y-auto">
                    <div className="space-y-4 py-4">
                        {showSuccess ? (
                            <PaymentStatus
                                status="success"
                                title="Payment Successful!"
                                description={`Successfully added ${selectedPkg?.credits} credits to your account. You can now use them to match with industry partners.`}
                                action={{
                                    text: 'Awesome, Thanks!',
                                    onClick: () => onOpenChange(false),
                                }}
                            />
                        ) : !clientSecret ? (
                            <>
                                <div className="relative overflow-hidden rounded-xl bg-primaryNew/5 border border-primaryNew/10 p-3.5 group transition-all duration-300 hover:bg-primaryNew/10">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-primaryNew/10 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-primaryNew/20 transition-colors"></div>
                                    <div className="relative flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                            <Sparkles className="h-5 w-5 text-primaryNew" />
                                        </div>
                                        <div>
                                            <Typography
                                                variant="label"
                                                className="text-primaryNew font-bold text-[10px] uppercase tracking-wider"
                                            >
                                                Current Balance
                                            </Typography>
                                            <h2 className="text-2xl font-black text-primaryNew leading-none mt-0.5">
                                                {workplaceCredits}{' '}
                                                <span className="text-[10px] font-medium opacity-60 uppercase">
                                                    Credits
                                                </span>
                                            </h2>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-3">
                                    {CREDIT_PACKAGES.map((pkg) => (
                                        <RtoPurchaseCreditCard
                                            pkg={pkg}
                                            key={pkg.credits}
                                            onSecretReceived={(secret, p) => {
                                                setClientSecret(secret)
                                                setSelectedPkg(p)
                                            }}
                                        />
                                    ))}
                                </div>

                                <Alert className="border-border/50 bg-secondary/5 rounded-lg border-dashed p-3">
                                    <Info className="h-3.5 w-3.5 text-secondary mt-0.5" />
                                    <AlertDescription className="text-[10px] text-muted-foreground leading-relaxed ml-1">
                                        <span className="font-bold text-gray-500 mr-1">
                                            Expert Tip:
                                        </span>
                                        Credits never expire. Each credit
                                        provides one high-quality matched
                                        workplace option.
                                    </AlertDescription>
                                </Alert>
                            </>
                        ) : clientSecret && rto ? (
                            <StripePaymentFlow
                                clientSecret={clientSecret}
                                amount={selectedPkg?.price || 0}
                                credits={selectedPkg?.credits.toString() || '0'}
                                plan={selectedPkg?.plan!}
                                rto={rto}
                                onSuccess={handleSuccess}
                                onCancel={resetPaymentState}
                            />
                        ) : null}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
