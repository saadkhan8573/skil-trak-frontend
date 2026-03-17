import { MapPin, Users2, Calendar, User } from 'lucide-react'
import { format } from 'date-fns'
import { Actions } from '@partials/common/StudentProfileDetail/components/Workplace/components/IndustryDetail/components/onViewMapIndustriesInRadius/contactHistoryTab/Actions'
import moment from 'moment'
interface SignedUpIndustryRowItemProps {
    industry: any
    index: number
    setSelectedindustry: any
}

export const SignedUpIndustryRowItem = ({
    industry,
    index,
    setSelectedindustry,
}: SignedUpIndustryRowItemProps) => {
    console.log('signed up industry', industry)
    const getAvatarColor = (index: number) => {
        const colors = [
            '#C0C0C0',
            '#A8A8A8',
            '#909090',
            '#B8B8B8',
            '#D0D0D0',
            '#989898',
        ]
        return colors[index % colors.length]
    }

    const getInitial = (name?: string) => {
        if (!name) return '?'
        return name.charAt(0).toUpperCase()
    }

    const name =
        industry?.businessName || industry?.contactPerson || 'Unknown Business'

    return (
        <div className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
                {/* Avatar */}

                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-slate-700"
                    style={{ backgroundColor: getAvatarColor(index) }}
                >
                    {getInitial(name)}
                </div>

                {/* Info */}

                <div
                    onClick={() => setSelectedindustry(industry)}
                    className="flex-1 min-w-0"
                >
                    <h3 className="text-sm font-semibold text-slate-900 truncate">
                        {name}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />

                        <span className="truncate max-w-[250px]">
                            {industry?.addressLine1 ?? 'Address not available'}
                        </span>
                    </div>

                    {/* Meta */}

                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-teal-600" />
                            {industry?.contactPerson ?? 'No Contact'}
                        </div>

                        <div className="flex items-center gap-1">
                            <Users2 className="w-3.5 h-3.5 text-blue-500" />
                            {industry?.enrolledStudents ?? 0} Students
                        </div>

                        {industry?.createdAt && (
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                Joined{' '}
                                {format(
                                    new Date(industry.createdAt),
                                    'dd MMM yyyy'
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Completion */}

                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Profile</span>

                    <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500"
                            style={{
                                width: `${industry?.profileCompletionPercentage ?? 0}%`,
                            }}
                        />
                    </div>
                </div>
                {/* Status Badges */}
                <div className="flex flex-col justify-center items-center gap-y-4">
                    {industry?.studentIndustryContact?.length > 0 && (
                        // <Actions
                        //     industry={industry?.studentIndustryContact?.at(-1)}
                        // />
                        <Actions
                            alreadyContacted={industry?.studentIndustryContact}
                            int={
                                industry?.studentIndustryContact?.[0]?.intrested
                            }
                            contactId={
                                industry?.studentIndustryContact?.[0]?.id
                            }
                        />
                    )}
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="flex flex-col gap-1 items-end">
                            <span
                                className={`
                                                            inline-flex justify-center
                                                            text-[10px] font-semibold
                                                            px-3 py-1.5 rounded-md
                                                            ${
                                                                industry
                                                                    ?.studentIndustryContact
                                                                    ?.length > 0
                                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                            }
                                                        `}
                            >
                                {industry?.studentIndustryContact?.length > 0
                                    ? 'Contacted'
                                    : 'Not Contacted'}
                            </span>

                            {industry?.studentIndustryContact?.length > 0 && (
                                <span className="text-[11px] text-slate-500 text-right">
                                    {moment(
                                        industry?.studentIndustryContact?.[0]
                                            ?.updatedAt
                                    ).format('DD MMM YYYY, hh:mm A')}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 items-end">
                            <span
                                className={`
                                                            inline-flex justify-center
                                                            text-[10px] font-semibold
                                                            px-3 py-1.5 rounded-md
                                                            ${
                                                                industry?.user
                                                                    ?.emails
                                                                    ?.length > 0
                                                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                                                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                            }
                                                        `}
                            >
                                {industry?.user?.emails?.length > 0
                                    ? 'Email Sent'
                                    : 'No Email Sent'}
                            </span>

                            {industry?.user?.emails?.length > 0 && (
                                <span className="text-[11px] text-slate-500 text-right">
                                    {moment(
                                        industry?.user?.emails?.[0]?.updatedAt
                                    ).format('DD MMM YYYY, hh:mm A')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
