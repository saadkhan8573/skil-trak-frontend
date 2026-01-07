import {
    Badge,
    Button,
    GlobalModal,
    ShowErrorNotifications,
    TextArea,
} from '@components'
import { useNotification } from '@hooks'
import { RtoApi } from '@queries'
import { ellipsisText } from '@utils'
import {
    AlertTriangle,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Flag,
    GraduationCap,
    MessageSquare,
    User,
    X,
} from 'lucide-react'
import React, { useState, useEffect } from 'react'

type ResolveIssuesCompletedModalProps = {
    onCancel: () => void
    student: any
    view?: boolean
}
export const ResolveIssuesCompletedModal = ({
    onCancel,
    student,
    view = false,
}: any) => {
    const [resolution, setResolution] = useState('')
    const { notification } = useNotification()
    const [resolveIssue, resolveIssueResult] =
        RtoApi.Students.useRtoResolveIssue()

    const getPriorityBadge = (priority: 'critical' | 'high' | 'medium') => {
        const config = {
            critical: {
                className:
                    'bg-destructive/10 text-destructive border-destructive/20',
                icon: AlertTriangle,
                label: 'Critical',
            },
            high: {
                className: 'bg-warning/10 text-warning border-warning/20',
                icon: Flag,
                label: 'High',
            },
            medium: {
                className: 'bg-primary/10 text-primary border-primary/20',
                icon: Flag,
                label: 'Medium',
            },
        }
        const { className, icon: Icon, label } = config[priority]
        return (
            <div
                className={`${className} border rounded-md px-2 py-1 inline-flex items-center text-xs font-medium`}
            >
                <Icon className="h-3 w-3 mr-1" />
                {label}
            </div>
        )
    }

    useEffect(() => {
        if (resolveIssueResult.isSuccess) {
            notification.success({
                title: 'Issue Resolved',
                description:
                    'The issue has been marked as resolved successfully.',
            })
            onCancel()
        }
    }, [resolveIssueResult.isSuccess])
    const onClickResolve = () => {
        resolveIssue({ id: student.id, body: { note: resolution } })
    }

    return (
        <>
            <ShowErrorNotifications result={resolveIssueResult} />
            <GlobalModal>
                <div className="max-w-3xl max-h-[90vh] overflow-y-auto p-6 space-y-6 bg-white rounded-xl shadow-md relative">
                    <div className="flex justify-end absolute top-4 right-0">
                        <X onClick={onCancel} className="cursor-pointer" />
                    </div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-4">
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold">
                                {student?.title}
                            </h2>
                            {/* <p className="text-sm text-gray-500">
                            Issue #{student.id.padStart(4, '0')}
                            Issue #
                        </p> */}
                        </div>
                        {getPriorityBadge(student?.priority)}
                    </div>

                    {/* Issue Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Student Information */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-blue-600" />
                                Student Information
                            </h4>
                            <div className="space-y-3 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Student Name
                                    </p>
                                    <p className="font-medium">
                                        {student?.student?.user?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Course
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <GraduationCap className="h-3 w-3 text-gray-500" />
                                        <p className="text-sm">
                                            {student?.workplaceRequest
                                                ?.courses?.[0]?.title ?? 'NA'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Industry Partner
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-3 w-3 text-gray-500" />
                                        <p className="text-sm">
                                            {student?.workplaceRequest
                                                ?.industries?.[0]?.industry
                                                ?.user?.name ?? 'NA'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Issue Timeline */}
                        <div className="space-y-4">
                            <h4 className="font-semibold flex items-center gap-2">
                                <Clock className="h-4 w-4 text-amber-500" />
                                Issue Timeline
                            </h4>
                            <div className="space-y-3 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Category
                                    </p>
                                    <span className="inline-flex items-center px-2 py-1 text-xs border border-gray-300 rounded-md bg-gray-50 capitalize">
                                        {student.category}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Reported By
                                    </p>
                                    <p className="font-medium text-sm">
                                        {student?.requestedBy?.name}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Reported Date
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-3 w-3 text-gray-500" />
                                        <p className="text-sm">
                                            {/* {selectedIssue.reportedDate} */}
                                            date
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">
                                        Days Open
                                    </p>
                                    <span className="inline-flex items-center px-2 py-1 text-xs border border-amber-200 text-amber-600 rounded-md bg-amber-50">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {/* {selectedIssue.daysOpen} days */}
                                        days
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Issue Description */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-blue-600" />
                            Issue Description
                        </h4>
                        <div className="p-4 rounded-xl overflow-auto max-h-40 bg-gray-50 border border-gray-200">
                            <p className="text-sm leading-relaxed ">
                                {student?.comment ??
                                    'No reported notes provided.'}
                            </p>
                        </div>
                    </div>

                    {/* Resolution Notes */}
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                        <h4 className="font-semibold flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Resolution Notes
                        </h4>
                        {view ? (
                            <p className="text-sm leading-relaxed overflow-auto max-h-60 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                {student?.resolutionNote ??
                                    'No resolution notes provided.'}
                            </p>
                        ) : (
                            <TextArea
                                name="note"
                                placeholder="Describe how this issue was resolved, including actions taken and outcomes..."
                                value={resolution}
                                onChange={(e: any) =>
                                    setResolution(e.target.value)
                                }
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                            />
                        )}
                    </div>

                    {/* Footer Buttons */}
                    {!view && (
                        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onClickResolve}
                                disabled={!resolution.trim()}
                                className={`px-4 py-2 text-sm rounded-lg text-white flex items-center gap-2 transition ${
                                    resolution.trim()
                                        ? 'bg-gradient-to-r from-successNew to-emerald-600 hover:bg-gradient-to-r hover:from-primaryNew hover:to-emerald-600 hover:opacity-90'
                                        : 'bg-gray-300 cursor-not-allowed'
                                }`}
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                Mark as Resolved
                            </button>
                        </div>
                    )}
                </div>
            </GlobalModal>
        </>
    )
}
