// import { Typography } from '@components'
// import moment from 'moment'
// import React from 'react'

// export const WorkplaceStatusCommunication = ({ item }: { item: any }) => {
//     return (
//         <div
//             id={`pinned-notes-${item?.id}`}
//             className={`relative w-full bg-[#FEF6E6] p-4 rounded-xl shadow-lg `}
//         >
//             <div className={``}>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <Typography variant="label" semibold>
//                             {item?.title ?? item?.subject}{' '}
//                             <span className="text-xs text-gray-400">
//                                 {item?.isInternal ? '(Internal)' : ''}
//                             </span>
//                         </Typography>
//                     </div>
//                 </div>
//                 <div>
//                     <div className={`text-sm mt-1 mb-2`}>
//                         <span
//                             className="block remove-text-bg customTailwingStyles-inline-style customTailwingStyles"
//                             dangerouslySetInnerHTML={{
//                                 __html: item?.description ?? item?.message,
//                             }}
//                         ></span>
//                     </div>

//                     <div className="flex justify-between">
//                         <div className="mr-6">
//                             <p
//                                 className={`text-xs font-medium text-gray-500 capitalize`}
//                             >
//                                 {item?.user?.name ?? item?.assignedTo?.name}{' '}
//                                 <span className="text-[11px] font-medium capitalize">
//                                     (
//                                     {item?.user?.role ?? item?.assignedTo?.role}
//                                     )
//                                 </span>
//                             </p>
//                             <p
//                                 className={`text-[11px] font-medium text-[#BFBF80] `}
//                             >
//                                 {moment(item?.isEnabled!! || item.createdAt!!)
//                                     .tz('Australia/Melbourne')
//                                     .format('ddd DD, MMM, yyyy [at] hh:mm A')}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

import { Badge, useWorldwideStudentDataRestriction } from '@components'
import { UserRoles } from '@constants'
import { useAppSelector } from '@redux'
import {
    Building2,
    Calendar,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Eye,
    EyeOff,
    FileText,
    MessageSquare,
    Users,
    XCircle,
} from 'lucide-react'
import moment from 'moment'
import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
interface PlacementStatusProps {
    item: any
    status?: string
}

function getStatusConfig(status: string, isRejection: boolean) {
    if (isRejection) {
        // Red theming for all rejections
        return {
            icon: XCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
            borderColor: 'border-l-red-500',
            badgeColor: 'bg-red-100 text-red-800 border-red-200',
        }
    }

    // Green theming for all non-rejection status changes
    switch (status.toLowerCase()) {
        case 'waiting for students':
            return {
                icon: Users,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
        case 'waiting for industry':
            return {
                icon: Building2,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
        case 'appointment':
            return {
                icon: Calendar,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
        case 'agreement pending':
            return {
                icon: FileText,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
        case 'agreement signed':
            return {
                icon: CheckCircle,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
        default:
            return {
                icon: Clock,
                color: 'text-green-600',
                bgColor: 'bg-green-50',
                borderColor: 'border-l-green-500',
                badgeColor: 'bg-green-100 text-green-800 border-green-200',
            }
    }
}

export function WorkplaceStatusCommunication({
    status = 'Agreement Signed',
    item,
}: PlacementStatusProps) {
    const [showComments, setShowComments] = useState(true)

    const rtoUserId = useAppSelector((state) => state.rto.rtoDetail?.user?.id)
    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoUserId,
    })

    const isRejection =
        item?.title?.toLowerCase()?.includes('rejected') ||
        item?.title?.toLowerCase()?.includes('cancelled')
    const config = getStatusConfig(status, isRejection)
    const IconComponent = config.icon

    const authorName =
        item?.author?.role === UserRoles.STUDENT && !hasPermission
            ? 'Student'
            : item?.author?.name

    return (
        <div
            className={`w-full mx-auto rounded-xl border-l-4 ${config.borderColor}`}
        >
            <div className={`p-4 ${config.bgColor}`}>
                <div className="pb-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-x-3">
                            <div className="flex items-center gap-2">
                                <IconComponent
                                    className={`h-5 w-5 ${config.color}`}
                                />
                                <div
                                    className={
                                        isRejection
                                            ? 'text-red-600'
                                            : 'text-green-600'
                                    }
                                >
                                    {item?.title}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* <Badge
                                variant="secondary"
                                className={config.badgeColor}
                                text={status}
                            /> */}

                            {item?.body && (
                                <div
                                    onClick={() =>
                                        setShowComments(!showComments)
                                    }
                                    className="cursor-pointer flex items-center gap-2 h-7 px-2 text-xs"
                                >
                                    <div className="flex items-center gap-2 bg-white rounded-md p-1">
                                        {showComments ? (
                                            <EyeOff className="h-3 w-3" />
                                        ) : (
                                            <Eye className="h-3 w-3" />
                                        )}
                                        {showComments
                                            ? 'Hide Comments'
                                            : 'View Comments'}
                                        {showComments ? (
                                            <ChevronUp className="h-3 w-3" />
                                        ) : (
                                            <ChevronDown className="h-3 w-3" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pt-0 pb-3 space-y-3">
                    <div className="flex items-center gap-6 text-[13px] text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                {moment(item?.createdAt).format(
                                    'ddd DD MMM YYYY'
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                {moment(item?.createdAt).format('hh:mm A')}
                            </span>
                        </div>
                        {/* {rejectedBy && (
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Rejected by: {rejectedBy}</span>
                            </div>
                        )} */}
                        {item?.body && !showComments && (
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                <span>Comments available</span>
                            </div>
                        )}
                        {item?.author && (
                            <div className="flex items-center gap-2">
                                <FaUser className="h-4 w-4" />
                                <span>Actioned By:</span>
                                <Badge text={authorName} variant="success" />
                            </div>
                        )}
                    </div>

                    {item?.body && showComments && (
                        <div className="border-t pt-3 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div className="flex-1">
                                    <span className="text-[13px] font-medium text-muted-foreground">
                                        Comments:
                                    </span>
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: item?.body,
                                        }}
                                        className="text-[13px] text-foreground leading-relaxed bg-muted/30 p-2 rounded-md border"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
