import { Badge, Button } from '@components'
import { RtoV2Api, useAppSelector } from '@redux'
import {
    Building2,
    FileCheck,
    Lock,
    Globe,
    Plus,
    Settings,
    Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import {
    AddIndustryModal,
    IndustryTermsModal,
    PurchaseCreditsModal,
} from '../modals'
import { ChoosePlacementNetworkModal } from '../modals'

export const IndustryHeader = () => {
    const rto = useAppSelector((state) => state.rto.rtoDetail)

    // --- State ---
    const [networkType, setNetworkType] = useState<'private' | 'shared'>(
        rto?.rtoNetwork === 'shareable' ? 'shared' : 'private'
    )

    const [addIndustryOpen, setAddIndustryOpen] = useState(false)
    const [showTermsDialog, setShowTermsDialog] = useState(false)
    const [showCreditPurchaseDialog, setShowCreditPurchaseDialog] =
        useState(false)
    const [showChooseNetworkModal, setShowChooseNetworkModal] = useState(false)

    const { data: rtoCredits } = RtoV2Api.RtoCredits.getRtoCredits()

    useEffect(() => {
        if (rto?.rtoNetwork) {
            setNetworkType(
                rto.rtoNetwork === 'shareable' ? 'shared' : 'private'
            )
        }
    }, [rto?.rtoNetwork])

    return (
        <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-primaryNew p-6 shadow-premium-lg">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    {/* Main Header Content */}
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-premium border border-white/30">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white mb-1.5">
                                        Industry Partners
                                    </h1>
                                    <p className="text-white/90">
                                        Manage partnerships and expand your
                                        placement network
                                    </p>
                                </div>
                            </div>

                            {/* Network Status Badges */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <Badge
                                    Icon={
                                        networkType === 'private' ? Lock : Globe
                                    }
                                    className="bg-white/20 text-white border-white/40 backdrop-blur-sm px-3 py-1.5"
                                    text={
                                        networkType === 'private'
                                            ? 'Private Network'
                                            : 'Shared Network'
                                    }
                                >
                                    <div className="h-2.5 w-2.5 rounded-full bg-success shadow-sm shadow-success/50 animate-pulse"></div>
                                    {networkType === 'private'
                                        ? 'Private Network'
                                        : 'Shared Network'}
                                </Badge>

                                {networkType === 'shared' && (
                                    <Badge
                                        Icon={Globe}
                                        className="bg-white/20 text-white border-white/40 backdrop-blur-sm px-3 py-1.5"
                                    >
                                        Australia-Wide
                                    </Badge>
                                )}

                                {networkType === 'shared' && (
                                    <Button
                                        variant="secondary"
                                        outline
                                        className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm"
                                        onClick={() => setShowTermsDialog(true)}
                                    >
                                        <FileCheck className="h-3.5 w-3.5 mr-1.5" />
                                        View Terms
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons - Right Side */}
                        <div className="flex flex-col gap-2.5">
                            <Button
                                onClick={() => setAddIndustryOpen(true)}
                                variant="action"
                            >
                                <Plus className="h-5 w-5" />
                                Add Industry Partner
                            </Button>

                            <div className="flex gap-2">
                                {networkType === 'shared' && (
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/20 backdrop-blur-sm border border-white/30 shadow-sm">
                                        <Zap className="h-4 w-4 text-warning" />
                                        <div className="text-left">
                                            <p className="text-xs text-white/80 leading-none mb-0.5">
                                                Credits
                                            </p>
                                            <p className="font-bold text-white leading-none">
                                                {rtoCredits?.token || 0}
                                            </p>
                                        </div>
                                        <Button
                                            variant="secondary"
                                            outline
                                            className="h-7 text-white hover:bg-white/20 ml-1 !min-w-[40px] px-2"
                                            onClick={() =>
                                                setShowCreditPurchaseDialog(
                                                    true
                                                )
                                            }
                                        >
                                            <Plus className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                )}
                                <Button
                                    variant="secondary"
                                    outline
                                    className="text-white hover:bg-white/20 border border-white/30 backdrop-blur-sm gap-2"
                                    onClick={() =>
                                        setShowChooseNetworkModal(true)
                                    }
                                >
                                    <Settings className="h-3.5 w-3.5" />
                                    Switch
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Network Description Banner */}
                    <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <p className="text-white/95 text-sm leading-relaxed flex items-start gap-3">
                            <span className="text-2xl mt-0.5">
                                {networkType === 'private' ? '🔒' : '⚡'}
                            </span>
                            <span>
                                {networkType === 'private'
                                    ? 'Using only your uploaded industry partners for maximum control and privacy'
                                    : 'Smart token system: Your Training Organisation industries are prioritized first, then Australia-wide SkilTrak network as backup'}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {addIndustryOpen && (
                <AddIndustryModal onClose={() => setAddIndustryOpen(false)} />
            )}

            <IndustryTermsModal
                isOpen={showTermsDialog}
                onClose={() => setShowTermsDialog(false)}
            />

            <PurchaseCreditsModal
                open={showCreditPurchaseDialog}
                onOpenChange={setShowCreditPurchaseDialog}
                workplaceCredits={rtoCredits?.token!}
            />

            <ChoosePlacementNetworkModal
                open={showChooseNetworkModal}
                onOpenChange={setShowChooseNetworkModal}
                credits={rtoCredits?.token || 0}
                onSelect={(type) => {
                    setNetworkType(type)
                }}
                onPurchaseCredits={() => setShowCreditPurchaseDialog(true)}
            />
        </div>
    )
}
