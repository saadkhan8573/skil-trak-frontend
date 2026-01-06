import { getUserCredentials } from '@utils'
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
import { getDetailedTimeStuck, getProfileUrl } from './helper'

export const UserTicketInfoCard = ({ ticket }: any) => {
    const role = getUserCredentials().role
    const profileUrl = getProfileUrl({
        role,
        origin: ticket?.origin,
        studentId: ticket?.user?.student?.id,
        industryId: ticket?.user?.industry?.id,
    })
    // students-and-placements/all-students/471/detail
    return (
        <div className="bg-white rounded-2xl shadow-xl mb-4 overflow-hidden border border-gray-200">
            <div className="h-2 bg-gradient-to-r from-[#044866] via-[#F7A619] to-[#0D5468]"></div>

            <div className="p-5">
                {/* Student Info and Badges Row */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Link
                        href={`${profileUrl}`}
                        // onClick={() =>
                        //     onViewStudentProfile &&
                        //     onViewStudentProfile(ticket.studentId)
                        // }
                        className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-[#044866] to-[#0D5468] text-white rounded-lg shadow-md hover:shadow-xl transition-all group/student"
                        title="View student profile"
                    >
                        <div className="size-6 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="size-4" />
                        </div>
                        <div>
                            <div className="text-xs flex items-center gap-1.5">
                                {ticket?.user?.name ?? '---'}
                                <ExternalLink className="size-3 opacity-0 group-hover/student:opacity-100 transition-opacity" />
                            </div>
                            <div className="text-white/70 text-xs">
                                {(ticket?.origin === 'STUDENT' &&
                                    ticket?.user?.student?.studentId) ??
                                    '---'}
                            </div>
                        </div>
                    </Link>

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
                {(ticket?.industryName || ticket?.industryType) && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                        {ticket.industryName && (
                            <button
                                // onClick={() => {
                                //     const industryId = getIndustryId(
                                //         ticket.industryName
                                //     )
                                //     if (industryId && onViewIndustryProfile) {
                                //         onViewIndustryProfile(industryId)
                                //     }
                                // }}
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
                                        <div className="text-xs text-[#044866]">
                                            {ticket.industryName}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        )}
                        {ticket.industryType && (
                            <div className="bg-purple-500/10 rounded-lg p-2.5 border border-purple-500/20">
                                <div className="flex items-center gap-2 text-purple-700">
                                    <FileText className="w-4 h-4" />
                                    <div>
                                        <div className="text-xs text-purple-700/70">
                                            Type
                                        </div>
                                        <div className="text-xs text-[#044866]">
                                            {ticket.industryType}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
