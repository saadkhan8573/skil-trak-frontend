import { Badge } from '@components'
import { ChevronRight, Clock, MapPin, Eye } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSelectedWorkplace } from '@redux'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'
import { useStatusInfo } from '../hooks/useStatusInfo'
import { useMemo } from 'react'
import { WorkplaceStatusLabels, getUserCredentials } from '@utils'
import { getStatusCategory, latestWpApprovalRequest } from '@partials/rto-v2'
import { useRouter } from 'next/router'
import { UserRoles } from '@constants'
export const WorkplaceSmallCard = ({
    request,
    index,
}: {
    index: number
    request: IWorkplaceIndustries
}) => {
    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(request?.workplaceApprovaleRequest || [])
    }, [request?.workplaceApprovaleRequest])

    const status = getStatusCategory(request?.currentStatus || '')
    const isActive = status === 'active'
    const workIndustry = request?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )
    const industry =
        workIndustry?.industry ||
        request?.studentProvidedWorkplaceRequestApproval?.industry ||
        latestWorkplaceApprovaleRequest?.industry

    const role = getUserCredentials()?.role
    const router = useRouter()

    const onSelectWorkplace = () => {
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

    const getIndustryLink = () => {
        if (!industry?.id) return null

        switch (role) {
            case UserRoles.ADMIN:
                return `/portals/admin/industry/${industry.id}`
            case UserRoles.SUBADMIN:
                return `/portals/sub-admin/users/industries/${industry.id}`
            case UserRoles.RTO:
                return `/portals/rto/manage/industries/${industry.id}/detail`
            default:
                return null
        }
    }

    const industryLink = getIndustryLink()

    const { progressPercent } = useStatusInfo({
        workplace: request,
        workIndustry: workIndustry as WorkplaceWorkIndustriesType,
    })

    const course = request?.courses?.[0]
    const extraHours = course?.extraHours?.[0]

    return (
        <div
            key={request.id}
            onClick={onSelectWorkplace}
            className={`group relative flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                isActive
                    ? 'animate-pulse border-[#044866] bg-gradient-to-br from-[#044866]/5 via-white to-[#044866]/5 shadow-lg shadow-[#044866]/20 ring-2 ring-[#044866]/20'
                    : 'border-slate-400 hover:border-[#044866] bg-gradient-to-br from-slate-50/50 to-slate-100/30 hover:shadow-lg opacity-[0.85] hover:opacity-100'
            }`}
        >
            {/* Active Indicator */}
            {isActive && (
                <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-0.5 h-11 bg-gradient-to-b from-[#F7A619] via-[#F7A619] to-[#F7A619]/50 rounded-r-full shadow-lg shadow-[#F7A619]/50"></div>
            )}

            {/* Number */}
            <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs flex-shrink-0 group-hover:scale-105 transition-transform shadow-md ${
                    isActive
                        ? 'bg-gradient-to-br from-[#F7A619] to-[#F7A619]/80 shadow-[#F7A619]/30'
                        : 'bg-gradient-to-br from-slate-400 to-slate-500 shadow-slate-400/20'
                }`}
            >
                {index + 1}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                    <span
                        className={`text-[11px] ${
                            isActive ? 'text-slate-900' : 'text-slate-600'
                        }`}
                    >
                        {industry?.user?.name ||
                            'Workplace Option Not Provided yet'}
                    </span>
                    {industryLink && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                router.push(industryLink)
                            }}
                            className={`cursor-pointer p-0.5 rounded-md bg-[#044866]/10 hover:bg-[#044866]/20 text-[#044866] transition-colors border border-[#044866]/10 ${
                                isActive ? 'animate-pulse' : ''
                            }`}
                            title="View Industry Profile"
                        >
                            <Eye className="w-3 h-3" />
                        </button>
                    )}

                    {/* {isActive && (
                        <Badge
                            variant="warning"
                            text="⚡ Active"
                            size="xs"
                            className="!h-4 !text-[9px] animate-pulse"
                        />
                    )} */}
                </div>

                {/* Workflow Stage Badge - Prominent */}
                <div className="mb-1.5">
                    <Badge
                        variant={true ? 'primaryNew' : 'secondary'}
                        text={WorkplaceStatusLabels[request?.currentStatus]}
                        Icon={Clock}
                        size="xs"
                        className="!h-5"
                    />
                </div>

                {industry && (
                    <div
                        className={`flex items-center gap-2 text-[10px] ${
                            isActive ? 'text-slate-600' : 'text-slate-500'
                        }`}
                    >
                        <span className="flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            {industry?.addressLine1}
                        </span>

                        <span>•</span>
                        <span>{extraHours?.hours || course?.hours} hours</span>
                    </div>
                )}
            </div>

            {/* Progress Circle */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative w-8 h-8">
                    <svg className="w-8 h-8 transform -rotate-90">
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            className="text-slate-200"
                        />
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 14}`}
                            strokeDashoffset={`${
                                2 * Math.PI * 14 * (1 - progressPercent / 100)
                            }`}
                            className={
                                isActive ? 'text-[#F7A619]' : 'text-slate-400'
                            }
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span
                            className={`text-[9px] ${
                                isActive ? 'text-slate-900' : 'text-slate-600'
                            }`}
                        >
                            {progressPercent}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Arrow */}
            <ChevronRight
                className={`w-4 h-4 group-hover:translate-x-1 flex-shrink-0 transition-all ${
                    isActive
                        ? 'text-[#044866]'
                        : 'text-slate-400 group-hover:text-[#044866]'
                }`}
            />
        </div>
    )
}
