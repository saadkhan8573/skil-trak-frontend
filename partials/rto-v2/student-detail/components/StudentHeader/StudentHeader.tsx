import {
    useWorldwideStudentDataRestriction,
    WorldwideStudentDataRestriction,
} from '@components/WorldwideStudentDataRestriction'
import { useAppSelector } from '@redux'
import { Student } from '@types'
import { checkJsxVisibility, maskText } from '@utils'
import { Mail, MapPin, Phone, Smartphone } from 'lucide-react'
import { Activity } from 'react'
import { HeaderQuickActions } from './HeaderQuickActions'
import { StudentQuickInfo } from './StudentQuickInfo'
import { StudentStatusSwitches } from './StudentStatusSwitches'
import { StudentTimeline } from './StudentTimeline'
import { StudentInvoiceStatus } from './components/StudentInvoiceStatus'
import { StudentStatusBanner } from './components/StudentStatusBanner'
import { Badge } from '@components'

export const StudentHeader = ({ student }: { student: Student }) => {
    const rtoDetail = useAppSelector((state) => state.rto.rtoDetail)
    const { hasPermission } = useWorldwideStudentDataRestriction({
        userId: rtoDetail?.user?.id,
    })
    const studentContactInfo = [
        {
            id: 'address',
            icon: MapPin,
            value: student?.addressLine1,
            bgGradient: 'from-[#F7A619]/10 to-[#F7A619]/20',
            iconColor: 'text-[#F7A619]',
            hasHover: false,
        },
    ]
    const studentEmail = [
        {
            id: 'email',
            icon: Mail,
            value: !hasPermission ? student?.user?.email : '***********',
            bgGradient: 'from-[#F7A619]/10 to-[#F7A619]/20',
            iconColor: 'text-[#F7A619]',
            hasHover: false,
        },
    ]

    const studentBadges = [
        {
            id: 'status',
            label: student?.studentStatus,
            variant: 'gradient' as const,
            className:
                'bg-gradient-to-r from-[#044866] to-[#0D5468] text-white shadow-lg shadow-[#044866]/25',
            hasIndicator: true,
            uppercase: true,
        },
        {
            id: 'studentMaskedId',
            label: student?.studentMaskedId || '---',
            variant: 'gradient' as const,
            className:
                'bg-white border border-[#044866]/20 text-[#044866] shadow-sm',
            hasIndicator: true,
            uppercase: true,
        },
        {
            id: 'phone',
            label: !hasPermission ? maskText(student?.phone) : '********',
            variant: 'outlined' as const,
            className:
                'bg-white border border-[#044866]/20 text-[#044866] shadow-sm',
            icon: Phone,
            uppercase: false,
        },
        {
            id: 'location',
            label: student?.isInternational ? 'International' : 'Local',
            variant: 'outlined' as const,
            className:
                'bg-white border border-[#0D5468]/20 text-[#0D5468] shadow-sm',
            emoji: '🌏',
            uppercase: false,
        },
    ]

    const avatarBadges = [
        {
            id: 'online',
            position: 'bottom-right' as const,
            className: 'bg-gradient-to-br from-[#044866] to-[#0D5468]',
            content: 'dot' as const,
        },
        {
            id: 'app-downloaded',
            position: 'bottom-left' as const,
            className: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
            content: 'icon' as const,
            icon: Smartphone,
        },
    ]

    console.log('rtoDetail?.user?.id', rtoDetail)

    return (
        <div className="relative">
            {/* Main Card with Gradient Border Effect */}
            <div className="relative bg-linear-to-r from-[#044866] via-[#0D5468] to-[#044866] p-0.5 rounded-xl shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden space-y-2.5">
                    <StudentStatusBanner />
                    {/* Top Section - Profile & Contact */}
                    <div className="relative bg-linear-to-br from-slate-50 via-white to-blue-50/30 px-3 py-2">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-2">
                            {/* Left: Avatar + Name + Badges */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-linear-to-br from-[#F7A619] via-[#F7A619]/50 to-transparent rounded-full blur-2xl opacity-60"></div>

                                    <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-[#F7A619] to-[#F7A619]/80 flex items-center justify-center text-white text-xl uppercase shadow-2xl ring-4 ring-white">
                                        {student?.user?.name?.substring(0, 2)}
                                    </div>

                                    {/* Avatar Badges */}
                                    {avatarBadges.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className={`absolute ${
                                                badge.position ===
                                                'bottom-right'
                                                    ? 'bottom-0 right-0'
                                                    : 'bottom-0 left-0'
                                            } w-4.5 h-4.5 ${
                                                badge.className
                                            } rounded-full border-3 border-white shadow-lg flex items-center justify-center`}
                                        >
                                            {badge.content === 'dot' ? (
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            ) : badge.icon ? (
                                                <badge.icon className="w-2 h-2 text-white" />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                {/* Name & Badges */}
                                <div className="space-y-1">
                                    <WorldwideStudentDataRestriction
                                        anotherUserId={Number(
                                            rtoDetail?.user?.id
                                        )}
                                        fallbackOptions={{
                                            width: '200px',
                                            height: '25px',
                                        }}
                                    >
                                        <h2 className="text-slate-900 text-lg font-bold">
                                            {student?.user?.name}{' '}
                                            {student?.familyName}
                                        </h2>{' '}
                                    </WorldwideStudentDataRestriction>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                                        {studentBadges.map((badge) => (
                                            <div
                                                key={badge.id}
                                                className={`inline-flex items-center gap-${
                                                    badge.icon ? '1.5' : '2'
                                                } px-${
                                                    badge.icon ? '2' : '2.5'
                                                } py-1 rounded-full ${
                                                    badge.className
                                                }`}
                                            >
                                                {badge.hasIndicator && (
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                )}
                                                {badge.icon && (
                                                    <badge.icon className="w-3 h-3" />
                                                )}
                                                <span
                                                    className={`text-sm ${
                                                        badge.uppercase
                                                            ? 'uppercase'
                                                            : ''
                                                    }`}
                                                >
                                                    {badge.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Contact Info Pills */}
                                    <div className="flex flex-wrap items-center gap-2 ">
                                        {studentContactInfo.map((contact) => (
                                            <div
                                                key={contact.id}
                                                className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-full shadow-sm ${
                                                    contact.hasHover
                                                        ? 'hover:shadow-md transition-all group cursor-pointer'
                                                        : ''
                                                }`}
                                            >
                                                <div
                                                    className={`w-4.5 h-4.5 rounded-full bg-linear-to-br ${
                                                        contact.bgGradient
                                                    } flex items-center justify-center ${
                                                        contact.hasHover
                                                            ? 'group-hover:scale-110 transition-transform'
                                                            : ''
                                                    }`}
                                                >
                                                    <contact.icon
                                                        className={`w-2.5 h-2.5 ${contact.iconColor}`}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-700">
                                                    {contact.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Activity
                                        mode={checkJsxVisibility(
                                            process.env.NEXT_PUBLIC_NODE_ENV ===
                                                'local'
                                        )}
                                    >
                                        {/* Contact Info Pills */}
                                        <div className="flex flex-wrap items-center gap-2 ">
                                            {studentEmail.map((contact) => (
                                                <div
                                                    key={contact.id}
                                                    className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-2.5 py-1 rounded-full shadow-sm ${
                                                        contact.hasHover
                                                            ? 'hover:shadow-md transition-all group cursor-pointer'
                                                            : ''
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-4.5 h-4.5 rounded-full bg-linear-to-br ${
                                                            contact.bgGradient
                                                        } flex items-center justify-center ${
                                                            contact.hasHover
                                                                ? 'group-hover:scale-110 transition-transform'
                                                                : ''
                                                        }`}
                                                    >
                                                        <contact.icon
                                                            className={`w-2.5 h-2.5 ${contact.iconColor}`}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-slate-700">
                                                        {contact.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Activity>
                                    <div className="mt-2">
                                        <StudentInvoiceStatus />
                                    </div>
                                </div>
                            </div>

                            {/* Center/Right: Status Switches */}
                            <div className="space-y-1.5">
                                <HeaderQuickActions student={student} />
                                <StudentStatusSwitches student={student} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section - Info Cards */}
                    <div className="bg-white space-y-4 px-3 pb-3">
                        <StudentQuickInfo />

                        {/* Timeline Banner */}
                        <StudentTimeline />
                    </div>
                </div>
            </div>
        </div>
    )
}
