import { useState, useMemo } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
import { getUserCredentials, WorkplaceCurrentStatus } from '@utils'
import { RtoV2Api } from '@queries'
import { useAppSelector } from '@redux/hooks'
import { UserRoles } from '@constants'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { PlacementHistoryItem } from '../types'
import { latestWpApprovalRequest } from '@partials/rto-v2/student-detail/utils'

export const usePlacementRequest = (
    nonActiveWorkplaces: IWorkplaceIndustries[]
) => {
    const { selectedCourse, studentDetail } = useAppSelector(
        (state) => state.student
    )
    const router = useRouter()
    const role = getUserCredentials()?.role

    const selectedCourseId = (
        selectedCourse?.code || selectedCourse?.id
    )?.toString()

    const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
    const [showCanceledCompleted, setShowCanceledCompleted] = useState(true)
    const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(
        null
    )
    const [tooltipPosition, setTooltipPosition] = useState<{
        top: number
        left: number
    } | null>(null)

    const { data: rejectedIndustries, isLoading } =
        RtoV2Api.Students.useGetStudentRejectedIndustries(studentDetail?.id!, {
            skip: !studentDetail?.id,
        })

    const handleMouseEnter = (
        e: React.MouseEvent<HTMLDivElement>,
        requestId: string
    ) => {
        setHoveredCommentId(requestId)
        const rect = e.currentTarget.getBoundingClientRect()
        setTooltipPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
        })
    }

    const handleMouseLeave = () => {
        setHoveredCommentId(null)
        setTooltipPosition(null)
    }

    const activeRequests = useMemo((): PlacementHistoryItem[] => {
        if (!studentDetail?.workplace?.length) return []

        return studentDetail.workplace
            .filter((wp: any) => {
                const isSelectedCourse = wp?.workplaceRequest?.courses?.some(
                    (c: any) => c.id.toString() === selectedCourseId
                )
                const isNotTerminal =
                    wp?.currentStatus !== WorkplaceCurrentStatus.Cancelled &&
                    wp?.currentStatus !== WorkplaceCurrentStatus.Terminated &&
                    wp?.currentStatus !== WorkplaceCurrentStatus.Rejected &&
                    wp?.currentStatus !== WorkplaceCurrentStatus.NoResponse
                return isSelectedCourse && isNotTerminal
            })
            .map((wp: any) => {
                const appliedIndustry = wp?.industries?.find(
                    (i: any) => i.applied
                )
                const industry = appliedIndustry?.industry || wp?.industry

                return {
                    id: wp.id,
                    workplace: industry?.user?.name || 'Unknown',
                    location: industry?.addressLine1 || 'N/A',
                    status: wp.currentStatus,
                    createdDate: moment(wp.createdAt).format('MMM D, YYYY'),
                    lastActionDate: moment(wp.updatedAt).format('MMM D, YYYY'),
                    assignedTo: wp?.subadmin?.user?.name || 'N/A',
                    description:
                        wp?.workplaceRequest?.courses?.[0]?.description ||
                        'Placement Request',
                    progress: 0,
                    nextAction: 'Action required',
                    dueDate: 'TBD',
                    industry: industry,
                    raw: wp,
                }
            })
    }, [studentDetail, selectedCourseId])

    const canceledCompletedRequests = useMemo(() => {
        const items: PlacementHistoryItem[] = []

        if (rejectedIndustries?.data?.length) {
            rejectedIndustries.data.forEach((item: any) => {
                if (item.type === 'student') {
                    items.push({
                        id: item?.id,
                        industry: item?.industry,
                        workplace:
                            item?.industry?.user?.name || 'Unknown Workplace',
                        location: item?.industry?.addressLine1,
                        status:
                            item?.ActionedBy?.role === UserRoles?.RTO
                                ? WorkplaceCurrentStatus.RejectedByRto
                                : WorkplaceCurrentStatus.RejectedByStudent,
                        createdDate: moment(item.createdAt).format(
                            'DD MMM YYYY'
                        ),
                        lastActionDate: moment(item.createdAt).format(
                            'DD MMM YYYY'
                        ),
                        assignedTo: item.ActionedBy?.name || 'System',
                        description: `Rejected for course: ${item.course?.title || 'N/A'}`,
                        progress: 0,
                        nextAction: 'None',
                        cancellationComment: 'Rejected by student',
                    })
                } else if (item.type === 'industry') {
                    items.push({
                        id: item?.id,
                        industry: item?.industry,
                        workplace:
                            item.industry?.user?.name ||
                            'Workplace Option Not Provided',
                        location: item?.industry?.addressLine1,
                        status: WorkplaceCurrentStatus.RejectedByIndustry,
                        createdDate: moment(item.createdAt).format(
                            'DD MMM YYYY'
                        ),
                        lastActionDate: 'N/A',
                        assignedTo: 'System',
                        description: `Workplace request for: ${item.workplaceRequest?.courses?.[0]?.title || 'N/A'}`,
                        progress: 0,
                        nextAction: 'None',
                        cancellationComment: 'Industry Request Rejected',
                    })
                } else {
                    items.push({
                        id: item?.id,
                        industry: item?.industry,
                        workplace:
                            item.industry?.user?.name ||
                            'Workplace Option Not Provided',
                        location: item?.industry?.addressLine1,
                        status:
                            item.rtoApprovalStatus === 'rejected'
                                ? WorkplaceCurrentStatus.RejectedByRto
                                : WorkplaceCurrentStatus.Cancelled,
                        createdDate: moment(item.createdAt).format(
                            'DD MMM YYYY'
                        ),
                        lastActionDate: 'N/A',
                        assignedTo: 'System',
                        description: `Workplace request for: ${item.workplaceRequest?.courses?.[0]?.title || 'N/A'}`,
                        progress: 0,
                        nextAction: 'None',
                        cancellationComment: 'Industry Request Rejected',
                    })
                }
            })
        }

        if (nonActiveWorkplaces?.length) {
            nonActiveWorkplaces.forEach((wp: any) => {
                const appliedIndustry = wp?.industries?.find(
                    (i: any) => i.applied
                )
                const latestWorkplaceApprovaleRequest = latestWpApprovalRequest(
                    wp?.workplaceApprovaleRequest || []
                )
                const industry =
                    appliedIndustry?.industry ||
                    wp?.studentProvidedWorkplaceRequestApproval?.industry ||
                    latestWorkplaceApprovaleRequest?.industry

                items.push({
                    id: wp?.id,
                    workplace:
                        industry?.user?.name || 'Workplace Option Not Provided',
                    location: industry?.addressLine1 || 'N/A',
                    status: wp.currentStatus,
                    createdDate: moment(wp.createdAt).format('MMM D, YYYY'),
                    lastActionDate: moment(wp.updatedAt).format('MMM D, YYYY'),
                    assignedTo: wp?.subadmin?.user?.name || 'N/A',
                    description:
                        wp?.workplaceRequest?.courses?.[0]?.description ||
                        'Placement History',
                    progress: 0,
                    nextAction: 'None',
                    industry: industry,
                    raw: wp,
                })
            })
        }

        return items
    }, [rejectedIndustries, nonActiveWorkplaces])

    const groupedRequests = useMemo(() => {
        return {
            completed: canceledCompletedRequests.filter(
                (r) => r.status === WorkplaceCurrentStatus.Completed
            ),
            cancelled: canceledCompletedRequests.filter(
                (r) => r.status === WorkplaceCurrentStatus.Cancelled
            ),
            rejected: canceledCompletedRequests.filter((r) =>
                [
                    WorkplaceCurrentStatus.RejectedByStudent,
                    WorkplaceCurrentStatus.RejectedByIndustry,
                    WorkplaceCurrentStatus.RejectedByRto,
                    WorkplaceCurrentStatus.Rejected,
                ].includes(r.status as WorkplaceCurrentStatus)
            ),
        }
    }, [canceledCompletedRequests])

    const allRequests = useMemo(() => {
        return [...activeRequests, ...canceledCompletedRequests]
    }, [activeRequests, canceledCompletedRequests])

    const onSelectWorkplace = (request: IWorkplaceIndustries) => {
        if (role === UserRoles.RTO) {
            router.push(
                `/portals/rto/students-and-placements/placement-requests/${request.id}/${request.student?.id}`
            )
        } else if (role === UserRoles.ADMIN) {
            router.push(
                `/portals/admin/workplaces/${request.id}/${request.student?.id}`
            )
        } else if (role === UserRoles.SUBADMIN) {
            router.push(
                `/portals/sub-admin/tasks/workplace/${request.id}/${request.student?.id}`
            )
        }
    }

    const canCreateNewRequest = useMemo(() => {
        if (!allRequests.length) return true
        const first = allRequests[0]
        return (
            first.status === WorkplaceCurrentStatus.PlacementStarted ||
            first.status === WorkplaceCurrentStatus.Cancelled ||
            first.status === WorkplaceCurrentStatus.Completed
        )
    }, [allRequests])

    return {
        selectedCourse,
        studentDetail,
        isLoading,
        selectedRequest,
        setSelectedRequest,
        showCanceledCompleted,
        setShowCanceledCompleted,
        hoveredCommentId,
        tooltipPosition,
        groupedRequests,
        canceledCompletedRequests,
        canCreateNewRequest,
        handleMouseEnter,
        handleMouseLeave,
        onSelectWorkplace,
    }
}
