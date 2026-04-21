import React from 'react'
import { SubAdminApi } from '@redux'
import { useNotification } from '@hooks'
import { UserCheck } from 'lucide-react'
import { useAppSelector } from '@redux/hooks'
import { ShowErrorNotifications, Switch, usePermissions } from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { PermissionType } from '@types'

export const IndustryPartner = () => {
    const [addToPartner, addToPartnerResult] =
        SubAdminApi.Industry.useAddToPartner()

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const hasPermission = usePermissions({
        permission: [PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS],
    })

    const { notification } = useNotification()

    const onAddPartner = () => {
        const res: any = addToPartner({ industry: industryDetail?.id! })
        if (res?.data) {
            notification.success({
                title: industryDetail?.isPartner
                    ? 'Industry Removed from Partner'
                    : 'Industry Added as Partner',
                description: industryDetail?.isPartner
                    ? 'Industry Removed from Partner Successfully'
                    : 'Industry Added as Partner Successfully',
            })
        }
    }
    return (
        <>
            <ShowErrorNotifications result={addToPartnerResult} />
            <div className="group relative flex-1 px-3 py-1.5 rounded-lg border-2 transition-all duration-300 flex items-center justify-between gap-1.5 bg-white border-[#E2E8F0]">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-gradient-to-br from-[#E8F4F8] to-[#D1E7F0]">
                        <UserCheck className="w-3 h-3 text-[#044866]" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#1A2332]">
                        Partner
                    </span>
                </div>
                {!hasPermission ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center">
                                <Switch
                                    name="partner"
                                    onChange={() => onAddPartner()}
                                    customStyleClass="profileSwitch"
                                    isChecked={industryDetail?.isPartner}
                                    loading={addToPartnerResult.isLoading}
                                    disabled={
                                        !hasPermission ||
                                        addToPartnerResult.isLoading
                                    }
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>Permission Not granted</TooltipContent>
                    </Tooltip>
                ) : (
                    <Switch
                        name="partner"
                        onChange={() => onAddPartner()}
                        customStyleClass="profileSwitch"
                        isChecked={industryDetail?.isPartner}
                        loading={addToPartnerResult.isLoading}
                        disabled={addToPartnerResult.isLoading}
                    />
                )}
            </div>
        </>
    )
}
