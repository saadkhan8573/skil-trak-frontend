import { Switch, Tooltip, TooltipPosition } from '@components'
import { CommonApi, SubAdminApi } from '@queries'
import { Student } from '@types'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { useNotification } from '@hooks'
import { AlertCircle, Flag, Moon, Star, HelpCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    FlagStudentDialog,
    NotContactableStudentDialog,
    UnflagStudentDialog,
} from './modals'
import { IndustryRequestsActions } from '@partials/sub-admin/ManagerApprovalList/enum'

export const StudentStatusSwitches = ({ student }: { student: Student }) => {
    const role = getUserCredentials()?.role
    const { notification } = useNotification()
    const [activeModal, setActiveModal] = useState<
        'contactable' | 'flag' | 'unflag' | null
    >(null)

    // 1. Profile Priority Logic
    const [makeAsHighPriority, makeAsHighPriorityResult] =
        CommonApi.StudentAssessmentFiles.useMakeAsHighPriority()

    useEffect(() => {
        if (makeAsHighPriorityResult.isSuccess) {
            notification[student?.isHighPriority ? 'warning' : 'success']({
                title: student?.isHighPriority
                    ? 'Priority Removed'
                    : 'Priority Set',
                description: student?.isHighPriority
                    ? `Removed from High Priority`
                    : `Marked As High Priority`,
            })
        }
    }, [makeAsHighPriorityResult.isSuccess])

    // 2. Contact Status Logic
    const [notContactable, notContactableResult] =
        SubAdminApi.Student.useNotContactable()

    useEffect(() => {
        if (notContactableResult.isSuccess) {
            notification.success({
                title: student?.nonContactable
                    ? 'Contactable'
                    : 'Not Contactable',
                description: student?.nonContactable
                    ? 'Student is now contactable.'
                    : 'Student marked as not contactable.',
            })
        }
    }, [notContactableResult.isSuccess])

    const nonContactableRequest = student?.studentUpdateRequests?.find(
        (r) => r?.action === IndustryRequestsActions.NonContactable
    )

    const flagRequest = student?.studentUpdateRequests?.find(
        (r) => r?.action === IndustryRequestsActions.Flagged
    )

    const unflagRequest = student?.studentUpdateRequests?.find(
        (r) => r?.action === IndustryRequestsActions.UnFlagged
    )

    const handlePriorityChange = () => {
        makeAsHighPriority(student.id)
    }

    const handleContactChange = () => {
        if (student.nonContactable) {
            // If already non-contactable, switch back to contactable directly (or maybe API toggles)
            notContactable({ id: student.id })
        } else {
            setActiveModal('contactable')
        }
    }

    const handleFlagChange = () => {
        if (student.hasIssue) {
            setActiveModal('unflag')
        } else {
            setActiveModal('flag')
        }
    }

    const SwitchItem = ({
        icon: Icon,
        label,
        isActive,
        onChange,
        loading,
        disabled,
        request,
        tooltipText,
    }: any) => (
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/40 backdrop-blur-md rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all group min-w-[145px]">
            <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300 ${isActive
                    ? 'bg-amber-100 text-amber-600 shadow-inner'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-500'
                    }`}
            >
                <Icon
                    className={`w-3.5 h-3.5 ${isActive ? 'fill-amber-600/20' : ''
                        }`}
                />
            </div>

            <div className="flex flex-col flex-1">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-0.5">
                    {label}
                </span>
                <span
                    className={`text-[11px] font-bold leading-none ${isActive ? 'text-amber-600' : 'text-slate-600'
                        }`}
                >
                    {isActive
                        ? label === 'Priority'
                            ? 'High'
                            : 'Active'
                        : label === 'Priority'
                            ? 'Normal'
                            : 'Standard'}
                </span>
            </div>

            <div className="flex items-center gap-1 ml-auto">
                {request && (
                    <div className="relative group/tooltip cursor-help mr-1">
                        <HelpCircle className="w-3.5 h-3.5 text-[#044866] opacity-70" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-2.5 bg-slate-900/95 backdrop-blur-sm text-white text-[10px] rounded-xl shadow-2xl z-[100] border border-white/10">
                            {tooltipText}
                        </div>
                    </div>
                )}
                <Switch
                    name={`${label.toLowerCase()}-switch`}
                    customStyleClass="profileSwitch"
                    onChange={onChange}
                    isChecked={isActive}
                    defaultChecked={isActive}
                    loading={loading}
                    disabled={disabled || !!request || loading}
                />
            </div>
        </div>
    )

    return (
        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2">
            <SwitchItem
                icon={Star}
                label="Priority"
                isActive={student?.isHighPriority}
                onChange={handlePriorityChange}
                loading={makeAsHighPriorityResult.isLoading}
                disabled={role === UserRoles.OBSERVER}
            />

            <SwitchItem
                icon={Moon}
                label="Contact"
                isActive={student?.nonContactable}
                onChange={handleContactChange}
                loading={notContactableResult.isLoading}
                disabled={role === UserRoles.OBSERVER}
                request={nonContactableRequest}
                tooltipText="Non-Contactable request already sent for approval"
            />

            <SwitchItem
                icon={Flag}
                label="Flagged"
                isActive={student?.hasIssue}
                onChange={handleFlagChange}
                disabled={role === UserRoles.OBSERVER}
                request={flagRequest || unflagRequest}
                tooltipText={
                    flagRequest
                        ? 'Flag request pending approval'
                        : 'Unflag request pending approval'
                }
            />

            <NotContactableStudentDialog
                open={activeModal === 'contactable'}
                onOpenChange={(open) => !open && setActiveModal(null)}
                studentId={student.id}
            />
            <FlagStudentDialog
                open={activeModal === 'flag'}
                onOpenChange={(open) => !open && setActiveModal(null)}
                studentId={student.id}
            />
            <UnflagStudentDialog
                open={activeModal === 'unflag'}
                onOpenChange={(open) => !open && setActiveModal(null)}
                studentId={student.id}
            />
        </div>
    )
}
