import { BackButton, Button, usePermissionCheck } from '@components'
import { useAppSelector } from '@redux/hooks'
import { IWorkplaceIndustries } from '@redux/queryTypes'
import { PermissionType } from '@types'
import {
    ArrowLeft,
    ArrowRight,
    Briefcase,
    Building2,
    CheckCircle,
    Search,
    Sparkles,
    Target,
} from 'lucide-react'

// ... imports
import { useRouter } from 'next/router'

export function ApplyWorkplaceOverview({
    handleAddNewWorkplace,
    firstWorkplace,
}: {
    firstWorkplace: IWorkplaceIndustries | null
    handleAddNewWorkplace: () => void
}) {
    const router = useRouter()
    const { selectedCourse: course } = useAppSelector((state) => state.student)
    const { checkPermission } = usePermissionCheck({})

    if (!course) return null

    const handleNavigation = (type: 'request' | 'provide') => {
        const currentPath = router.asPath
        // Remove /detail if it exists to get the base path
        const basePath = currentPath.replace(/\/detail$/, '')

        if (type === 'request') {
            router.push(`${basePath}/request-workplace-detail`)
        } else {
            router.push(`${basePath}/provide-workplace-detail`)
        }
        handleAddNewWorkplace()
    }

    const pathwayOptions = [
        {
            id: 1,
            title: 'Need a Workplace?',
            description:
                'Let SkilTrak find the perfect placement match for you based on your course requirements and preferences.',
            icon: Search,
            badge: 'Option 1',
            variant: 'primaryNew' as const,
            colors: {
                border: 'border-[#044866]/20 hover:border-[#044866]',
                shadow: 'hover:shadow-[#044866]/20',
                gradient: 'from-[#044866]/5 via-blue-500/5 to-[#0D5468]/5',
                bgGradient: 'from-blue-50/50 to-white',
                iconBg: 'from-[#044866] to-[#0D5468]',
                iconShadow: 'shadow-[#044866]/30',
                badge: 'bg-[#044866]',
                dot: 'bg-[#044866]',
            },
            features: [
                'AI-powered matching',
                'Verified workplaces',
                'Quick placement process',
            ],
            buttonText: 'Find Workplace with SkilTrak',
            buttonIcon: Search,
            action: () => handleNavigation('request'),
            permission: PermissionType.ALLOW_STUDENT_NEED_WORKPLACE,
        },
        {
            id: 2,
            title: 'Have Your Own Workplace?',
            description:
                'Already employed or have a workplace arranged? Submit your workplace details for approval.',
            icon: Briefcase,
            badge: 'Option 2',
            variant: 'info' as const,
            permission: PermissionType.ALLOW_STUDENT_OWN_WORKPLACE,
            colors: {
                border: 'border-purple-200 hover:border-info',
                shadow: 'hover:shadow-purple-500/20',
                gradient: 'from-purple-500/5 via-violet-500/5 to-purple-500/5',
                bgGradient: 'from-purple-50/50 to-white',
                iconBg: 'bg-info',
                iconShadow: 'shadow-purple-600/30',
                badge: 'bg-info',
                dot: 'bg-info',
            },
            features: [
                'Use current employer',
                'Fast approval process',
                'Flexible scheduling',
            ],
            buttonText: 'Add Own Workplace Details',
            buttonIcon: Briefcase,
            action: () => handleNavigation('provide'),
        },
    ]

    const permittedPathwayOptions = pathwayOptions.filter((pathway) =>
        checkPermission(pathway.permission)
    )

    if (permittedPathwayOptions.length === 0) return null

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 p-6 hover:shadow-2xl transition-all overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-[#044866]/5 to-[#F7A619]/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-purple-500/5 to-blue-500/5 rounded-full blur-3xl -z-10"></div>

            {firstWorkplace && (
                <Button
                    variant="primaryNew"
                    outline
                    onClick={() => handleAddNewWorkplace()}
                    text="Back to Workplace"
                    Icon={ArrowLeft}
                />
            )}
            {/* Header Section */}
            <div className="flex items-center justify-between my-3">
                <div className="flex items-start gap-4">
                    <div className="relative group">
                        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center text-white shadow-2xl shadow-[#044866]/40 group-hover:scale-110 transition-transform duration-300">
                            <Building2 className="w-7 h-7" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-linear-to-br from-[#F7A619] to-amber-500 rounded-xl border-3 border-white flex items-center justify-center shadow-lg animate-pulse">
                            <Sparkles className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-slate-900 mb-1">
                            Workplace Placement
                        </h2>
                        <p className="text-slate-600 text-sm flex items-center gap-1.5">
                            <Target className="w-3.5 h-3.5 text-[#044866]" />
                            Begin your professional journey
                        </p>
                    </div>
                </div>
            </div>
            {/* Progress Alert Banner */}
            <div className="relative mb-5 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-emerald-400/10 to-emerald-500/10 animate-pulse"></div>
                <div className="relative bg-linear-to-br from-emerald-50 via-white to-emerald-50 rounded-2xl p-5 border-2 border-emerald-200 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-xl shadow-emerald-500/40">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-slate-900">
                                    Profile Ready for Placement
                                </h3>
                                <span className="px-3 py-1 text-xs bg-linear-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/30">
                                    ✓ Verified
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 mb-3">
                                Your student profile has been verified and
                                approved. You're all set to begin your workplace
                                placement journey!
                            </p>
                            <div className="inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200">
                                <Sparkles className="w-4 h-4" />
                                <span>Ready to start</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main Call to Action */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-linear-to-r from-[#044866]/10 to-[#0D5468]/10 rounded-xl border border-[#044866]/20 mb-3">
                    <ArrowRight className="w-4 h-4 text-[#044866]" />
                    <span className="text-sm text-slate-700">
                        Choose your placement pathway
                    </span>
                </div>
            </div>
            {/* Pathway Options - Side by Side */}
            <div
                className={`grid gap-4 mb-6 ${
                    permittedPathwayOptions.length > 1
                        ? 'md:grid-cols-2'
                        : 'md:grid-cols-1 max-w-xl mx-auto'
                }`}
            >
                {permittedPathwayOptions.map((pathway) => {
                    const Icon = pathway?.icon
                    const ButtonIcon = pathway?.buttonIcon

                    return (
                        <div
                            key={pathway.id}
                            className={`group relative overflow-hidden rounded-2xl border-2 ${pathway.colors.border} transition-all duration-300 cursor-pointer hover:shadow-2xl ${pathway.colors.shadow} hover:-translate-y-1`}
                        >
                            <div
                                className={`absolute inset-0 bg-linear-to-br ${pathway.colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity`}
                            ></div>
                            <div
                                className={`relative bg-linear-to-br ${pathway.colors.bgGradient} p-6`}
                            >
                                {/* Icon and Badge */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="relative">
                                        <div
                                            className={`w-14 h-14 rounded-2xl bg-linear-to-br ${pathway.colors.iconBg} flex items-center justify-center shadow-xl ${pathway.colors.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                                        >
                                            <Icon className="w-7 h-7 text-white" />
                                        </div>
                                    </div>
                                    <span
                                        className={`px-3 py-1 text-xs ${pathway.colors.badge} text-white rounded-full shadow-lg`}
                                    >
                                        {pathway.badge}
                                    </span>
                                </div>

                                {/* Content */}
                                <h4 className="text-slate-900 mb-2">
                                    {pathway.title}
                                </h4>
                                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                    {pathway.description}
                                </p>

                                {/* Features List */}
                                <div className="space-y-2 mb-5">
                                    {pathway.features.map((feature, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 text-sm text-slate-700"
                                        >
                                            <div
                                                className={`w-1.5 h-1.5 rounded-full ${pathway.colors.dot}`}
                                            ></div>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Button */}
                                <Button
                                    variant={pathway.variant}
                                    className="w-full"
                                    onClick={pathway.action}
                                >
                                    <ButtonIcon className="w-4 h-4 mr-2" />
                                    {pathway.buttonText}
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Help Section - Enhanced */}
            {/* <div className="relative overflow-hidden rounded-2xl border border-[#F7A619]/30 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/50 p-5 hover:shadow-lg transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7A619]/10 rounded-full blur-3xl"></div>
                <div className="relative flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F7A619] to-amber-500 flex items-center justify-center flex-shrink-0 shadow-xl shadow-[#F7A619]/30">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <h5 className="text-slate-900 mb-1.5">
                            Need Assistance?
                        </h5>
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                            Our placement coordinators are here to help you
                            through every step of the process. Get personalized
                            guidance and support.
                        </p>
                        <Button
                            outline
                            variant="primaryNew"
                            className="border-[#044866]/30 text-[#044866] hover:bg-[#044866] hover:text-white hover:border-[#044866] transition-all duration-300 shadow-sm hover:shadow-lg"
                        >
                            <User className="w-4 h-4 mr-2" />
                            Contact Placement Coordinator
                        </Button>
                    </div>
                </div>
            </div> */}
        </div>
    )
}
