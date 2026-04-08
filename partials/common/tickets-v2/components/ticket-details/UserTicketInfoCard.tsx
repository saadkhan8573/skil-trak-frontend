import { ellipsisText, getUserCredentials } from '@utils'
import {
    Activity,
    Building2,
    Calendar,
    Clock,
    ExternalLink,
    FileText,
    User,
    Users,
    Zap,
} from 'lucide-react'
import Link from 'next/link'
import {
    getDetailedTimeStuck,
    getPlacementProfileUrl,
    getProfileUrl,
} from './helper'
import { UserRoles } from '@constants'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@components/ui'

export const UserTicketInfoCard = ({ ticket }: any) => {
    console.log({ ticket })
    const role = getUserCredentials().role
    const studentId =
        ticket?.origin === 'STUDENT'
            ? ticket?.user?.student?.id
            : ticket?.relatedUser?.student?.id
    const industryId =
        ticket?.origin === 'INDUSTRY'
            ? ticket?.user?.industry?.id
            : ticket?.relatedUser?.industry?.id

    const studentUrl =
        ticket?.workplaceRequestId && studentId
            ? getPlacementProfileUrl({
                  role,
                  origin: 'STUDENT',
                  workplaceRequestId: ticket?.workplaceRequestId,
                  studentId,
              })
            : getProfileUrl({
                  role,
                  origin: 'STUDENT',
                  studentId,
              })

    const industryUrl = getProfileUrl({
        role,
        origin: 'INDUSTRY',
        industryId,
    })

    return (
        <div className="bg-white rounded-2xl shadow-xl mb-4 overflow-hidden border border-gray-200">
            <div className="h-2 bg-linear-to-r from-[#044866] via-[#F7A619] to-[#0D5468]"></div>

            <div className="p-5">
                {/* Student Info and Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    {(ticket?.origin === 'STUDENT' ||
                        ticket?.relatedUser?.role === UserRoles.STUDENT) && (
                        <div className="inline-flex items-center gap-4 px-4 py-2 bg-linear-to-r from-[#044866] to-[#0D5468] text-white rounded-lg shadow-md group/student">
                            <div className="flex items-center gap-3">
                                <div className="size-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <User className="size-5" />
                                </div>
                                <div>
                                    <div className="text-xs font-medium">
                                        {ticket?.origin === 'STUDENT'
                                            ? ticket?.user?.name
                                            : ticket?.relatedUser?.name ??
                                              '---'}
                                    </div>
                                    <div className="text-white/60 text-[10px]">
                                        {ellipsisText(
                                            ticket?.origin === 'STUDENT'
                                                ? ticket?.user?.student
                                                      ?.studentId
                                                : ticket?.relatedUser?.student
                                                      ?.studentId,
                                            10
                                        ) ?? '---'}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Link
                                            href={studentUrl}
                                            className="size-7 bg-white/20 hover:bg-white/40 border border-white/30 rounded-md flex items-center justify-center transition-all hover:scale-110"
                                        >
                                            <User className="size-3.5 text-white" />
                                        </Link>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                        Student Profile
                                    </TooltipContent>
                                </Tooltip>

                                {industryId && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href={industryUrl}
                                                className="size-7 bg-white/20 hover:bg-white/40 border border-white/30 rounded-md flex items-center justify-center transition-all hover:scale-110"
                                            >
                                                <Building2 className="size-3.5 text-white" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="top">
                                            Industry Profile
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                    )}

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/30 text-purple-700 rounded-lg">
                        <Zap className="size-3" />
                        <span className="text-[10px]">Auto-Escalated</span>
                    </span>

                    {ticket?.createdAt && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F7A619]/10 border border-[#F7A619]/30 text-[#F7A619] rounded-lg">
                            <Clock className="size-3" />
                            <span className="text-[10px]">
                                Stuck {getDetailedTimeStuck(ticket?.createdAt)}
                            </span>
                        </span>
                    )}

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#044866]/10 border border-[#044866]/20 text-[#044866] rounded-lg ml-auto">
                        <User className="size-3" />
                        <span className="text-[10px]">
                            Assigned: {ticket?.assignedTo?.user?.name ?? '---'}
                        </span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-sm text-[#044866] mb-3 leading-tight">
                    {ticket?.title}
                </h1>

                {/* Ticket ID & Metadata */}
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="px-3 py-1.5 bg-[#044866]/10 border border-[#044866]/20 rounded-lg">
                            <div className="text-xs text-[#044866]/60 mb-0.5">
                                Ticket ID
                            </div>
                            <div className="text-[#044866] text-xs">
                                TKT-{ticket?.id}
                            </div>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

                    <div className="flex items-center gap-2 text-[#0D5468]/70 text-xs">
                        <Calendar className="size-3" />
                        <span>
                            Created{' '}
                            {new Date(ticket?.createdAt).toLocaleString()}
                        </span>
                    </div>

                    {ticket?.updatedAt && (
                        <>
                            <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
                            <div className="text-xs text-[#0D5468]/50">
                                Updated{' '}
                                {new Date(ticket?.updatedAt).toLocaleString()}
                            </div>
                        </>
                    )}
                </div>

                {/* Quick Status Bar */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                    <div className="bg-[#044866]/10 rounded-lg p-2.5 border border-[#044866]/20">
                        <div className="flex items-center gap-2 text-[#044866]">
                            <Users className="w-4 h-4" />
                            <div>
                                <div className="text-xs text-[#044866]/60">
                                    Team
                                </div>
                                <div className="text-xs capitalize">
                                    {ticket?.supportTeam?.name ?? '---'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0D5468]/10 rounded-lg p-2.5 border border-[#0D5468]/20">
                        <div className="flex items-center gap-2 text-[#0D5468]">
                            <Activity className="w-4 h-4" />
                            <div>
                                <div className="text-xs text-[#0D5468]/60">
                                    Phase
                                </div>
                                <div className="text-xs capitalize">
                                    {ticket?.referredObjectStatus ?? '---'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F7A619]/10 rounded-lg p-2.5 border border-[#F7A619]/20">
                        <div className="flex items-center gap-2 text-[#F7A619]">
                            <Activity className="w-4 h-4" />
                            <div>
                                <div className="text-xs text-[#F7A619]/70">
                                    Stage
                                </div>
                                <div className="text-xs">
                                    {ticket?.referredObjectStatus ?? '---'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industry Info (if available) */}
                {ticket?.origin === 'INDUSTRY' && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        <Link
                            href={`${industryUrl}`}
                            className="bg-[#F7A619]/10 rounded-lg p-2.5 border border-[#F7A619]/20 hover:bg-[#F7A619]/20 transition-colors group/industry"
                            title="View industry profile"
                        >
                            <div className="flex items-center gap-2 text-[#F7A619]">
                                <Building2 className="w-4 h-4" />
                                <div className="text-left flex-1">
                                    <div className="text-xs text-[#F7A619]/70 flex items-center gap-1">
                                        Industry
                                        <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/industry:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="text-[#044866] font-semibold">
                                        {ticket?.user?.name ?? 'NA'}
                                    </div>
                                </div>
                            </div>
                        </Link>
                        <div className="bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/20">
                            <div className="flex items-center gap-2 text-purple-700">
                                <FileText className="w-4 h-4" />
                                <div>
                                    <div className="text-xs text-purple-700/70">
                                        Type
                                    </div>
                                    <div className="text-xs text-[#044866]">
                                        {ticket?.user?.industryType ?? 'NA'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {ticket?.relatedUser &&
                    ticket?.relatedUser?.role === UserRoles.INDUSTRY && (
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <Link
                                href={`${industryUrl}`}
                                className="bg-[#F7A619]/10 rounded-lg p-2.5 border border-[#F7A619]/20 hover:bg-[#F7A619]/20 transition-colors group/industry"
                                title="View industry profile"
                            >
                                <div className="flex items-center gap-2 text-[#F7A619]">
                                    <Building2 className="w-4 h-4" />
                                    <div className="text-left flex-1">
                                        <div className="text-xs text-[#F7A619]/70 flex items-center gap-1">
                                            Industry
                                            <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover/industry:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="text-[#044866] font-semibold">
                                            {ticket?.relatedUser?.name ?? 'NA'}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                            <div className="bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/20">
                                <div className="flex items-center gap-2 text-purple-700">
                                    <FileText className="w-4 h-4" />
                                    <div>
                                        <div className="text-xs text-purple-700/70">
                                            Type
                                        </div>
                                        <div className="text-xs text-[#044866]">
                                            {ticket?.industryType ?? 'NA'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}
