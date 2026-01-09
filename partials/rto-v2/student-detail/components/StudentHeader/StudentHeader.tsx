import { Student } from '@types'
import { maskText } from '@utils'
import { Mail, MapPin, Phone, Smartphone } from 'lucide-react'
import { HeaderQuickActions } from './HeaderQuickActions'
import { StudentQuickInfo } from './StudentQuickInfo'
import { StudentTimeline } from './StudentTimeline'
import { StudentStatusBanner } from './components/StudentStatusBanner'
import { StudentStatusSwitches } from './StudentStatusSwitches'

export const StudentHeader = ({ student }: { student: Student }) => {
    const studentContactInfo = [
        {
            id: 'email',
            icon: Mail,
            value: '*****.com',
            bgGradient: 'from-[#044866]/10 to-[#0D5468]/10',
            iconColor: 'text-[#044866]',
            hasHover: true,
        },
        {
            id: 'phone',
            icon: Phone,
            value: maskText(student?.phone),
            bgGradient: 'from-[#044866]/10 to-[#0D5468]/10',
            iconColor: 'text-[#044866]',
            hasHover: true,
        },
        {
            id: 'address',
            icon: MapPin,
            value: student?.addressLine1,
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
            id: 'contactable',
            label: student?.nonContactable ? 'Non-Contactable' : 'Contactable',
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

    return (
        <div className="relative">
            {/* Main Card with Gradient Border Effect */}
            <div className="relative bg-gradient-to-r from-[#044866] via-[#0D5468] to-[#044866] p-0.5 rounded-xl shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden space-y-4">
                    <StudentStatusBanner />

                    {/* Top Section - Profile & Contact */}
                    <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-3 lg:p-4">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 xl:gap-2">
                            {/* Left: Avatar + Name + Badges */}
                            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className="absolute -inset-2 bg-gradient-to-br from-[#F7A619] via-[#F7A619]/50 to-transparent rounded-full blur-2xl opacity-60"></div>
                                    <div className="relative w-18 h-18 rounded-full bg-gradient-to-br from-[#F7A619] to-[#F7A619]/80 flex items-center justify-center text-white text-2xl uppercase shadow-2xl ring-4 ring-white">
                                        {student?.user?.name?.substring(0, 2)}
                                    </div>

                                    {/* Avatar Badges */}
                                    {avatarBadges.map((badge) => (
                                        <div
                                            key={badge.id}
                                            className={`absolute ${badge.position ===
                                                'bottom-right'
                                                ? 'bottom-0 right-0'
                                                : 'bottom-0 left-0'
                                                } w-5.5 h-5.5 ${badge.className
                                                } rounded-full border-3 border-white shadow-lg flex items-center justify-center`}
                                        >
                                            {badge.content === 'dot' ? (
                                                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                            ) : badge.icon ? (
                                                <badge.icon className="w-2.5 h-2.5 text-white" />
                                            ) : null}
                                        </div>
                                    ))}
                                </div>

                                {/* Name & Badges */}
                                <div>
                                    <h2 className="text-slate-900 mb-2">
                                        {student?.user?.name}{' '}
                                        {student?.familyName}
                                    </h2>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                        {studentBadges.map((badge) => (
                                            <div
                                                key={badge.id}
                                                className={`inline-flex items-center gap-${badge.icon || badge.emoji
                                                    ? '1.5'
                                                    : '2'
                                                    } px-${badge.icon || badge.emoji
                                                        ? '2.5'
                                                        : '3'
                                                    } py-1.5 rounded-full ${badge.className
                                                    }`}
                                            >
                                                {badge.hasIndicator && (
                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                )}
                                                {badge.icon && (
                                                    <badge.icon className="w-3 h-3" />
                                                )}
                                                {badge.emoji && (
                                                    <span className="text-sm">
                                                        {badge.emoji}
                                                    </span>
                                                )}
                                                <span
                                                    className={`text-sm ${badge.uppercase
                                                        ? 'uppercase'
                                                        : ''
                                                        }`}
                                                >
                                                    {badge.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Center/Right: Status Switches */}
                            <div className="flex justify-center xl:flex-1">
                                <StudentStatusSwitches student={student} />
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex justify-center xl:justify-end">
                                <HeaderQuickActions student={student} />
                            </div>
                        </div>

                        {/* Contact Info Pills */}
                        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2 mt-4 xl:mt-2 xl:ml-[87px]">
                            {studentContactInfo.map((contact) => (
                                <div
                                    key={contact.id}
                                    className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full shadow-sm ${contact.hasHover
                                        ? 'hover:shadow-md transition-all group cursor-pointer'
                                        : ''
                                        }`}
                                >
                                    <div
                                        className={`w-4.5 h-4.5 rounded-full bg-gradient-to-br ${contact.bgGradient
                                            } flex items-center justify-center ${contact.hasHover
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
