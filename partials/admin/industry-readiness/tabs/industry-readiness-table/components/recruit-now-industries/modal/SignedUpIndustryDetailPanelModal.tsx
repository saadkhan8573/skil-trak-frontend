import { Button, Portal } from '@components'
import { useNotification } from '@hooks'
import { DoNotDisturbModal } from '@partials/common'
import { ComposeMailModal } from '@partials/common/StudentProfileDetail/modals'
import { AdminApi, CommonApi, SubAdminApi } from '@queries'
import { ellipsisText, getUserCredentials } from '@utils'
import { BellOff, Building2, Eye, Mail, Phone, X } from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { CallAnsweredOrNot } from './CallAnsweredOrNot'
import Link from 'next/link'
import { UserRoles } from '@constants'

export const SignedUpIndustryDetailPanelModal = ({
    selectedPartner,
    setSelectedPartner,
}: any) => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [isCalled, setIsCalled] = useState(false)
    const [makeCallLog, makeCallLogResult] =
        CommonApi.FindWorkplace.useFutureIndustryCallLog()
    const [contactIndustry, contactIndustryResult] =
        AdminApi.IndustryReadiness.useContactForecastIndustry()
    const { notification } = useNotification()
    const role = getUserCredentials()?.role
    const viewProfile =
        role === UserRoles.ADMIN
            ? `/portals/admin/industry/${selectedPartner?.id}`
            : `/portals/sub-admin/users/industries/${selectedPartner?.id}?tab=students`
    useEffect(() => {
        if (contactIndustryResult.isSuccess) {
            notification.success({
                title: 'Call made industry',
                description: 'Call made successfully ',
            })
        }
    }, [makeCallLogResult.isSuccess, contactIndustryResult.isSuccess])

    const getFirstLetter = (name: string) => {
        if (!name) return
        return name.charAt(0).toUpperCase()
    }
    const { data, isLoading, isError } =
        SubAdminApi.Workplace.useSubAdminMapSuggestedIndustryDetail(
            { industryId: selectedPartner?.id },
            {
                skip: !selectedPartner?.id,
            }
        )
    const onCancelComposeMail = () => {
        setModal(null)
    }
    const onComposeMail = () => {
        setModal(
            <ComposeMailModal
                userId={Number(selectedPartner?.user?.id)}
                user={selectedPartner?.user}
                onCancel={onCancelComposeMail}
            />
        )
    }
    const onDoNotDisturbClicked = (industry: any) => {
        setModal(
            <Portal>
                <DoNotDisturbModal
                    industry={industry}
                    onCancel={() => setModal(null)}
                />
            </Portal>
        )
    }

    const onCallClicked = () => {
        if (!isCalled) {
            setIsCalled(true)
            makeCallLog({
                params: {
                    receiver: selectedPartner?.id,
                },
            })
            contactIndustry({
                id: selectedPartner?.id,
            })
        } else setIsCalled(false)
    }
    return (
        <>
            {modal && modal}
            {selectedPartner && (
                <div
                    className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setSelectedPartner(null)}
                >
                    <div
                        className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">
                                View industries list
                            </h2>
                            <button
                                onClick={() => setSelectedPartner(null)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-6 py-6">
                            {/* Partner Name */}
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center text-slate-700 font-bold text-lg flex-shrink-0"
                                    style={{ backgroundColor: '#C0C0C0' }}
                                >
                                    {getFirstLetter(
                                        selectedPartner?.user?.name ?? 'NA'
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">
                                        {ellipsisText(
                                            selectedPartner?.user?.name ?? 'NA',
                                            20
                                        )}
                                    </h3>
                                    <span className="inline-block px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded mt-1">
                                        default
                                    </span>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="mb-6">
                                <p className="text-sm text-slate-600">
                                    {selectedPartner?.addressLine1}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <Button
                                    text={isCalled ? 'Hide' : 'Call'}
                                    variant={isCalled ? 'secondary' : 'success'}
                                    loading={makeCallLogResult.isLoading}
                                    disabled={makeCallLogResult.isLoading}
                                    onClick={onCallClicked}
                                    Icon={Phone}
                                />
                                <button
                                    onClick={onComposeMail}
                                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#044866] text-[#044866] rounded-lg hover:bg-[#044866] hover:text-white transition-all font-semibold text-sm"
                                >
                                    <Mail className="w-4 h-4" />
                                    Email
                                </button>
                            </div>
                            {isCalled && (
                                <CallAnsweredOrNot
                                    callLog={
                                        data?.callLog?.[
                                            data?.callLog.length - 1
                                        ]
                                    }
                                    setShowCall={setIsCalled}
                                />
                            )}

                            {/* Quick Actions */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-700 mb-3">
                                    Quick Actions
                                </h4>
                                <div className="space-y-2">
                                    <Button
                                        text="Do not disturb"
                                        Icon={BellOff}
                                        variant="error"
                                        onClick={() =>
                                            onDoNotDisturbClicked(
                                                selectedPartner
                                            )
                                        }
                                        outline
                                    />
                                    {/* <button className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm">
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">
                                                Signup
                                            </span>
                                        </div>
                                    </button> */}
                                    <Link
                                        href={viewProfile ?? '#'}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Eye className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">
                                                View
                                            </span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
