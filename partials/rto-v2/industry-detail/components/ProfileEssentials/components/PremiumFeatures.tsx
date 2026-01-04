import {
    ActionButton,
    Button,
    ShowErrorNotifications,
    Switch,
} from '@components'
import { PremiumFeaturesModal } from '../../../../../common/IndustryProfileDetail/modal/PremiumFeaturesModal'
import { useNotification, useSubadminProfile } from '@hooks'
import { CommonApi } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { Shield, CheckCircle } from 'lucide-react'
import { useState, ReactNode } from 'react'
import { ManageFeatureDialog, PremiumFeatureModal } from '@partials/rto-v2/industry-detail/modal'

export function PremiumFeatures() {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const { notification } = useNotification()
    const subadmin = useSubadminProfile()
    const role = getUserCredentials()?.role

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const industryId = industryDetail?.id
    const industryUserId = industryDetail?.user?.id

    const [togglePremium, resultTogglePremium] =
        CommonApi.Industries.useToggleIndustryPremiumFeature()

    // API for toggling specific sub-features
    const [toggleSubFeatures, resultToggleSubFeatures] =
        CommonApi.Industries.useToggleIndustryPremiumSubFeatures()

    const premiumFlag = CommonApi.Industries.usePremiumFeatureFlag(industryId, {
        skip: !industryId,
    })

    const { data: premiumFeaturesList, isLoading: isListLoading } =
        CommonApi.Industries.useIndustryPremiumFeatures(
            {
                params: { id: industryUserId },
            },
            { skip: !industryUserId }
        )

    const onCancelModal = () => setModal(null)

    const onClickManageFeatures = () => {
        setModal(
            <PremiumFeaturesModal
                indId={industryId}
                userId={industryUserId}
                onCancel={onCancelModal}
            />
        )
    }

    const onTogglePremium = async () => {
        const res: any = await togglePremium({ id: industryId })

        if (res?.data) {
            notification.success({
                title: 'Premium Feature',
                description: `Premium feature updated successfully`,
            })
        }
    }

    const onToggleSubFeature = async (featureId: number) => {
        if (!isPremium) return

        await toggleSubFeatures({
            id: industryId,
            body: {
                industry: industryId,
                premiumFeature: featureId,
            },
        })

        notification.success({
            title: 'Feature Updated',
            description: 'Sub-feature updated successfully',
        })
    }

    const isPremium = premiumFlag?.data?.isPremium

    return (
        <div className="bg-gradient-to-br from-[#044866] to-[#0D5468] rounded-xl shadow-lg p-3 flex-1 flex flex-col h-full">
            {modal}
            <ShowErrorNotifications result={resultTogglePremium} />
            <ShowErrorNotifications result={resultToggleSubFeatures} />

            <div className="flex items-center justify-between mb-3">
                <h3 className="text-white flex items-center gap-1.5 text-sm">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-3 h-3 text-white" />
                    </div>
                    Premium Features
                </h3>
                <div className="bg-white/20 px-2 py-0.5 rounded-full flex items-center gap-2">
                    <Switch
                        name="isPremium"
                        customStyleClass="profileSwitch"
                        onChange={onTogglePremium}
                        defaultChecked={isPremium}
                        isChecked={isPremium}
                        value={isPremium}
                        loading={
                            resultTogglePremium?.isLoading ||
                            premiumFlag?.isLoading
                        }
                        disabled={
                            resultTogglePremium?.isLoading ||
                            premiumFlag?.isLoading ||
                            (!subadmin?.canOnPremiumFeature &&
                                role === UserRoles.SUBADMIN)
                        }
                    />
                </div>
            </div>

            <div className="space-y-2 flex-1 overflow-auto custom-scrollbar">
                {premiumFeaturesList?.map((feature: any) => {
                    const isActive =
                        feature?.industryPremiumFeatures?.length > 0 &&
                        feature?.industryPremiumFeatures?.[0]?.isActive
                    const isLoading =
                        resultToggleSubFeatures?.isLoading &&
                        resultToggleSubFeatures.originalArgs?.body
                            ?.premiumFeature === feature.id

                    return (
                        <Button
                            key={feature.id}
                            onClick={() => onToggleSubFeature(feature.id)}
                            variant="secondary"
                            disabled={!isPremium || isLoading}
                            className={`w-full flex items-start gap-2 !px-1.5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer h-auto justify-start border-0
                                ${!isPremium
                                    ? 'opacity-50 cursor-not-allowed hover:bg-white/10'
                                    : ''
                                }
                            `}
                        >
                            <CheckCircle
                                className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-all duration-300 ${isActive && isPremium
                                        ? 'text-[#10B981]'
                                        : 'text-white/30'
                                    }`}
                                fill={
                                    isActive && isPremium
                                        ? 'currentColor'
                                        : 'none'
                                }
                            />
                            <div className="flex-1 space-y-1.5 text-left">
                                <p
                                    className={`text-sm font-medium transition-colors ${isActive && isPremium
                                            ? 'text-white'
                                            : 'text-white/50'
                                        }`}
                                >
                                    {feature.title}
                                </p>
                                {feature.description && (
                                    <p
                                        className={`text-xs transition-colors ${isActive && isPremium
                                                ? 'text-white/80'
                                                : 'text-white/40'
                                            }`}
                                    >
                                        {feature.description}
                                    </p>
                                )}
                            </div>
                        </Button>
                    )
                })}

                {(!premiumFeaturesList || premiumFeaturesList.length === 0) &&
                    !isListLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-white/50 text-xs py-4 text-center">
                            <Shield className="w-8 h-8 mb-2 opacity-30" />
                            <p>No features available</p>
                        </div>
                    )}
            </div>

            <PremiumFeatureModal />
            <ManageFeatureDialog />
        </div>
    )
}
