import {
    Button,
    GlobalModal,
    Portal,
    ShowErrorNotifications,
    TextArea,
} from '@components'
import { useNotification } from '@hooks'
import { ComposeListingIndustryMail, DoNotDisturbModal } from '@partials/common'
import { AdminApi, CommonApi, SubAdminApi } from '@queries'
import { ellipsisText, getUserCredentials } from '@utils'
import { BellOff, Building2, Ellipsis, Eye, Mail, Phone, X } from 'lucide-react'
import React, { ReactNode, useEffect, useState } from 'react'
import { CallAnsweredOrNot } from './CallAnsweredOrNot'
import { UserRoles } from '@constants'
import Link from 'next/link'

export const FutureIndustryDetailPanelModal = ({
    selectedPartner,
    setSelectedPartner,
}: any) => {
    const [modal, setModal] = useState<ReactNode | null>(null)
    const [isCalled, setIsCalled] = useState(false)
    const [callNotes, setCallNotes] = useState('')
    const [makeCallLog, makeCallLogResult] =
        CommonApi.FindWorkplace.useFutureIndustryCallLog()

    const { notification } = useNotification()
    const role = getUserCredentials()?.role
    const { data, isSuccess, isLoading } =
        CommonApi.FindWorkplace.useGetFutureIndustryDetail(
            selectedPartner?.id,
            {
                skip: !selectedPartner?.id,
            }
        )
    const viewProfile =
        role === UserRoles.ADMIN
            ? `/portals/admin/future-industries/${selectedPartner?.id}`
            : `/portals/sub-admin/tasks/industry-listing/${selectedPartner?.id}`
    const signUp =
        role === UserRoles.ADMIN
            ? `/portals/admin/future-industries/signup-future-industry`
            : `/portals/sub-admin/tasks/industry-listing/signup-future-industry`
    const [contactIndustry, contactIndustryResult] =
        AdminApi.IndustryReadiness.useContactForecastIndustry()
    const getFirstLetter = (name: string) => {
        if (!name) return
        return name.charAt(0).toUpperCase()
    }

    const onCancelComposeMail = () => {
        setModal(null)
    }
    useEffect(() => {
        if (contactIndustryResult.isSuccess) {
            notification.success({
                title: 'Call made industry',
                description: 'Call made successfully ',
            })
        }
    }, [makeCallLogResult.isSuccess, contactIndustryResult.isSuccess])
    const onChangeNotes = (e: any) => setCallNotes(e.target.value)
    const onComposeMail = () => {
        setModal(
            <GlobalModal>
                <ComposeListingIndustryMail
                    industry={selectedPartner}
                    onCancelComposeMail={onCancelComposeMail}
                />
            </GlobalModal>
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
                params: {
                    isListing: true,
                },
            })
        } else setIsCalled(false)
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
    return (
        <>
            {modal && modal}
            <ShowErrorNotifications
                result={contactIndustryResult || makeCallLogResult}
            />
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
                                        selectedPartner?.businessName ?? 'NA'
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-900">
                                        {ellipsisText(
                                            selectedPartner?.businessName,
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

                                {/* <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-[#044866] text-[#044866] rounded-lg hover:bg-[#044866] hover:text-white transition-all font-semibold text-sm">
                                    <Phone className="w-4 h-4" />
                                    Call
                                </button> */}
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
                                    isListing
                                    setShowCall={setIsCalled}
                                />
                            )}

                            {/* Quick Actions */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-700 mb-3">
                                    Quick Actions
                                </h4>
                                <div className="space-y-2">
                                    <button
                                        onClick={() =>
                                            onDoNotDisturbClicked(
                                                selectedPartner
                                            )
                                        }
                                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <BellOff className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">
                                                Do not disturb
                                            </span>
                                        </div>
                                    </button>
                                    <Link
                                        href={signUp ?? '#'}
                                        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                            <span className="font-medium text-slate-700">
                                                Signup
                                            </span>
                                        </div>
                                    </Link>
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
