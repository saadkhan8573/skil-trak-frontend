import React, { useState } from 'react'
import { Globe, Info, Shield, Target, Plus } from 'lucide-react'
import { Card } from '@components/cards'
import { Button } from '@components/buttons'
import { Alert, AlertDescription } from '@components/ui/alert'
import { PurchaseCreditsModal } from '../modals/PurchaseCreditsModal'
import { RtoV2Api } from '@redux'
import { Badge } from '@components'

export const SkiltrakNetwork = () => {
    const [showCreditPurchaseDialog, setShowCreditPurchaseDialog] =
        useState(false)

    const { data: rtoCredits } = RtoV2Api.RtoCredits.getRtoCredits()
    const { data: wpStats } = RtoV2Api.Dashboard.autoWpCount()
    const { data: counts } = RtoV2Api.Industries.getIndustriesCounts()

    // Defaulting to 50km for display purposes as props are removed
    const [sharedNetworkRadius, setSharedNetworkRadius] = useState<
        '10km' | '25km' | '50km' | 'statewide' | 'australia-wide' | null
    >('50km')

    return (
        <Card
            className="border-accent/30 shadow-premium-lg !bg-primary-light/30"
            noPadding
        >
            <div className="border-b border-accent/20 pb-4 p-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-premium">
                        <Globe className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <div className="text-lg font-semibold">
                            SkilTrak Industries Directory
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {sharedNetworkRadius === '50km'
                                ? 'Access to verified industries within 50km radius'
                                : 'Access to verified industries across Australia'}
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-5">
                <Alert className="border-accent/40 bg-accent/5">
                    <Info className="h-4 w-4 text-accent" />
                    <AlertDescription className="ml-2 text-sm">
                        <span className="font-semibold">Privacy Notice:</span>{' '}
                        You can only see the number of available industries (
                        {sharedNetworkRadius === '50km'
                            ? wpStats?.automatic || '1,247'
                            : '5,000+'}
                        ), not the detailed list. Each workplace request uses 1
                        credit and returns the best matched option through our
                        19-point matching system.
                    </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-3 gap-4">
                    <Card
                        className="border border-primaryNew !bg-primaryNew/10"
                        noPadding
                    >
                        <div className="p-5 text-center">
                            <Globe className="h-10 w-10 text-primaryNew mx-auto mb-2" />
                            <p className="text-2xl font-semibold mb-0.5">
                                {counts?.allPartnerIndustries}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Available Industries
                            </p>
                        </div>
                    </Card>

                    <Card
                        noPadding
                        className="border border-primaryNew !bg-primaryNew/10"
                    >
                        <div className="p-5 text-center">
                            <Shield className="h-10 w-10 text-primaryNew mx-auto mb-2" />
                            <p className="text-2xl font-semibold mb-0.5">
                                {Math.round(
                                    (counts?.skiltrakIndustriesReadyForPlacement! /
                                        counts?.allPartnerIndustries!) *
                                        100
                                )}
                                %
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Verified & Compliant
                            </p>
                        </div>
                    </Card>

                    <Card
                        noPadding
                        className="border border-primaryNew !bg-primaryNew/10"
                    >
                        <div className="p-5 text-center">
                            <Target className="h-10 w-10 text-primaryNew mx-auto mb-2" />
                            <p className="text-2xl font-semibold mb-0.5">
                                {counts?.skiltrakIndustriesReadyForPlacement}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Matching Points
                            </p>
                        </div>
                    </Card>
                </div>

                <Card className="border-border/60" noPadding>
                    <div className="pb-3 p-5 border-b border-border/50">
                        <div className="text-base font-semibold">
                            How It Works
                        </div>
                    </div>
                    <div className="p-5 space-y-3">
                        <div className="flex items-start gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm flex-shrink-0 font-semibold">
                                1
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">
                                    Use a Credit
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Submit a workplace request for your student
                                    using 1 credit
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm flex-shrink-0 font-semibold">
                                2
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">
                                    Industry Matching through Automation
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Our 19-point system finds the best industry
                                    match based on qualification, location, and
                                    requirements
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-primaryNew text-white flex items-center justify-center text-sm flex-shrink-0 font-semibold">
                                3
                            </div>
                            <div>
                                <p className="font-semibold text-sm mb-0.5">
                                    Get Results
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Receive workplace option with all compliance
                                    confirmations and supervisor details
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex items-center justify-between p-4 rounded-xl bg-primary-light border border-accent/20">
                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold text-sm">
                                Need more credits?
                            </p>

                            <Badge
                                className="bg-white"
                                Icon={Plus}
                                text={`${rtoCredits?.token || 0} BALANCE`}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Purchase additional workplace request credits
                        </p>
                    </div>
                    <Button
                        className="gap-2 bg-gradient-to-r from-accent to-warning h-9"
                        onClick={() => setShowCreditPurchaseDialog(true)}
                        variant="secondary"
                        text="Buy Credits"
                        Icon={Plus}
                    />
                </div>
            </div>

            <PurchaseCreditsModal
                open={showCreditPurchaseDialog}
                onOpenChange={setShowCreditPurchaseDialog}
                workplaceCredits={rtoCredits?.token!}
            />
        </Card>
    )
}
