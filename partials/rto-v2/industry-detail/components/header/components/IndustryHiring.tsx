import React from 'react'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { Briefcase } from 'lucide-react'
import { useAppSelector } from '@redux/hooks'
import { ShowErrorNotifications, Switch, usePermissions } from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { PermissionType } from '@types'

export const IndustryHiring = () => {
    const [isHiring, isHiringResult] =
        CommonApi.Industries.useIsIndustryHiring()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const hasPermission = usePermissions({
        permission: PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS,
    })

    const { notification } = useNotification()

    const onJobHiring = () => {
        isHiring(industryDetail?.user?.id)?.then((res: any) => {
            if (res?.data) {
                notification.success({
                    title: industryDetail?.isHiring ? 'Not Hiring' : 'Hiring',
                    description: industryDetail?.isHiring
                        ? 'Not Hiring'
                        : 'Hiring',
                })
            }
        })
    }
    return (
        <>
            <ShowErrorNotifications result={isHiringResult} />
            <div className="group relative flex-1 px-3 py-1.5 rounded-lg border-2 transition-all duration-300 flex items-center justify-between gap-1.5 bg-white border-[#E2E8F0]">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
                        <Briefcase className="w-3 h-3 text-[#10B981]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#1A2332]">
                        Hiring
                    </span>
                </div>
                {!hasPermission ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center">
                                <Switch
                                    name="hiring"
                                    onChange={() => onJobHiring()}
                                    customStyleClass="profileSwitch"
                                    isChecked={industryDetail?.isHiring}
                                    loading={isHiringResult.isLoading}
                                    disabled={
                                        !hasPermission ||
                                        isHiringResult.isLoading
                                    }
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Permission Not granted</TooltipContent>
                    </Tooltip>
                ) : (
                    <Switch
                        name="hiring"
                        onChange={() => onJobHiring()}
                        customStyleClass="profileSwitch"
                        isChecked={industryDetail?.isHiring}
                        loading={isHiringResult.isLoading}
                        disabled={isHiringResult.isLoading}
                    />
                )}
            </div>
        </>
    )
}
