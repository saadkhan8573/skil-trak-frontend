import React, { useState } from 'react'
import { Button, ShowErrorNotifications, usePermissions } from '@components'
import { Tooltip, TooltipTrigger, TooltipContent } from '@components/ui'
import { PermissionType } from '@types'
import { Clock } from 'lucide-react'
import { useAppSelector } from '@redux/hooks'
import { CommonApi } from '@queries'
import { useNotification } from '@hooks'
import { IndustryUnsnoozedModal, SnoozedDatePickerDialog } from '../modals'

export const SnoozedIndustry = () => {
    const [showSnoozedDatePicker, setShowSnoozedDatePicker] = useState(false)
    const [showUnSnoozedModal, setShowUnSnoozedModal] = useState(false)

    const industryDetail = useAppSelector(
        (state) => state.industry.industryDetail
    )

    const hasPermission = usePermissions({
        permission: PermissionType.CAN_PERFORM_INDUSTRY_ACTIONS,
    })

    const [snooze, snoozeResult] = CommonApi.Industries.useUnSnoozeIndustry()

    const { notification } = useNotification()

    const onSnoozedClick = () => {
        if (industryDetail?.isSnoozed) {
            setShowUnSnoozedModal(true)
        } else {
            setShowSnoozedDatePicker(true)
        }
        // snooze({ id: Number(industryDetail?.id) })?.then((res: any) => {
        //     if (res?.data) {
        //         notification.error({
        //             title: `Industry Un Snoozed`,
        //             description: `Industry "${industryDetail?.user?.name}" has been Un Snoozed.`,
        //         })
        //     }
        // })
    }

    return (
        <>
            <ShowErrorNotifications result={snoozeResult} />
            {!hasPermission ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="flex-1 flex">
                            <Button
                                fullHeight
                                onClick={onSnoozedClick}
                                className="h-auto flex-1 py-2.5"
                                outline={!industryDetail?.isSnoozed}
                                disabled={!hasPermission}
                            >
                                <div
                                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                        industryDetail?.isSnoozed
                                            ? 'bg-white/20'
                                            : 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]'
                                    }`}
                                >
                                    <Clock className="w-3 h-3" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="text-[10px] font-semibold">
                                        Snoozed
                                    </span>
                                    {industryDetail?.isSnoozed &&
                                        industryDetail?.snoozedDate && (
                                            <span className="text-[8px] opacity-90 whitespace-nowrap">
                                                {new Date(
                                                    industryDetail?.snoozedAt
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}{' '}
                                                -{' '}
                                                {new Date(
                                                    industryDetail?.snoozedDate
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        )}
                                </div>
                                {industryDetail?.isSnoozed && (
                                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full shadow-sm flex items-center justify-center">
                                        <div className="w-1 h-1 bg-[#F7A619] rounded-full"></div>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>Permission Not granted</TooltipContent>
                </Tooltip>
            ) : (
                <Button
                    fullHeight
                    onClick={onSnoozedClick}
                    className="h-auto flex-1 py-2.5"
                    outline={!industryDetail?.isSnoozed}
                >
                    <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            industryDetail?.isSnoozed
                                ? 'bg-white/20'
                                : 'bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]'
                        }`}
                    >
                        <Clock className="w-3 h-3" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] font-semibold">
                            Snoozed
                        </span>
                        {industryDetail?.isSnoozed &&
                            industryDetail?.snoozedDate && (
                                <span className="text-[8px] opacity-90 whitespace-nowrap">
                                    {new Date(
                                        industryDetail?.snoozedAt
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}{' '}
                                    -{' '}
                                    {new Date(
                                        industryDetail?.snoozedDate
                                    ).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            )}
                    </div>
                    {industryDetail?.isSnoozed && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full shadow-sm flex items-center justify-center">
                            <div className="w-1 h-1 bg-[#F7A619] rounded-full"></div>
                        </div>
                    )}
                </Button>
            )}

            <SnoozedDatePickerDialog
                open={showSnoozedDatePicker}
                industryId={industryDetail?.id!}
                onOpenChange={setShowSnoozedDatePicker}
            />
            <IndustryUnsnoozedModal
                open={showUnSnoozedModal}
                industryId={industryDetail?.id!}
                onOpenChange={setShowUnSnoozedModal}
            />
        </>
    )
}
