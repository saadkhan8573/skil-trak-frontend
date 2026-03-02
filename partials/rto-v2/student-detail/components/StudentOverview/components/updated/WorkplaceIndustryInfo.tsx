import { Badge, Button } from '@components'
import { Industry, RtoApprovalWorkplaceRequest, Supervisor } from '@types'
import {
    Building2,
    CheckCircle,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    Phone,
    Send,
    Shield,
    Star,
    User,
} from 'lucide-react'
import { ResendApprovalEmailModal } from '../../modal/ResendApprovalEmailModal'
import { ReactElement, useState } from 'react'
import { ComposeEmailModal } from '@partials/rto-v2/student-detail/components'
import { getUserCredentials } from '@utils'
import { UserRoles } from '@constants'
import { useRouter } from 'next/router'

export const WorkplaceIndustryInfo = ({
    industry,
    supervisor,
    latestWorkplaceApprovaleRequest,
}: {
    industry: Industry
    supervisor: Supervisor
    latestWorkplaceApprovaleRequest: RtoApprovalWorkplaceRequest
}) => {
    const [isResendModalOpen, setIsResendModalOpen] = useState(false)
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()

    const onCancelClicked = () => setModal(null)

    const role = getUserCredentials()?.role

    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                user={industry?.user!}
                onCancel={onCancelClicked}
            />
        )
    }

    const getIndustryLink = () => {
        if (!industry?.id) return ''

        switch (role) {
            case UserRoles.ADMIN:
                return `/portals/admin/industry/${industry.id}`
            case UserRoles.SUBADMIN:
                return `/portals/sub-admin/users/industries/${industry.id}`
            case UserRoles.RTO:
                return `/portals/rto/manage/industries/${industry.id}/detail`
            default:
                return ''
        }
    }

    return (
        <div className="space-y-3">
            {modal}
            {/* Workplace Header Card */}
            <div className="relative group/workplace overflow-hidden rounded-xl bg-linear-to-br from-slate-50 via-white to-slate-50 border border-slate-200 p-4 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#044866]/10 to-transparent rounded-full blur-2xl"></div>

                <div className="relative flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                        <div className="relative group/icon">
                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#044866] to-[#0D5468] flex items-center justify-center shadow-2xl shadow-[#044866]/40 group-hover/icon:scale-110 group-hover/icon:rotate-6 transition-all duration-300">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-linear-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                                <Shield className="w-2.5 h-2.5 text-white" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 mb-0.5">
                                {industry?.user?.name}
                            </h3>
                            <div className="grid grid-cols-2 items-center gap-1.5">
                                {industry?.isPartner && (
                                    <Badge
                                        Icon={CheckCircle}
                                        className="bg-linear-to-r from-emerald-500 to-emerald-600 text-white shadow-lg text-xs px-2 py-0.5"
                                    >
                                        Verified Partner
                                    </Badge>
                                )}
                                {latestWorkplaceApprovaleRequest && (
                                    <Badge
                                        variant={
                                            latestWorkplaceApprovaleRequest.status ===
                                            'approved'
                                                ? 'success'
                                                : latestWorkplaceApprovaleRequest.status ===
                                                    'rejected'
                                                  ? 'error'
                                                  : 'warning'
                                        }
                                        text={
                                            latestWorkplaceApprovaleRequest?.status
                                                ?.charAt(0)
                                                ?.toUpperCase() +
                                            latestWorkplaceApprovaleRequest?.status?.slice(
                                                1
                                            )
                                        }
                                    />
                                )}
                                {industry?.isPremium && (
                                    <Badge variant="info" Icon={Star}>
                                        Premium
                                    </Badge>
                                )}
                                {latestWorkplaceApprovaleRequest?.status ===
                                    'pending' && (
                                    <Badge
                                        variant="primaryNew"
                                        onClick={() =>
                                            setIsResendModalOpen(true)
                                        }
                                        Icon={Send}
                                    >
                                        Resend Email
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={() => router.push(getIndustryLink())}
                    >
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover/link:text-[#044866] group-hover/link:rotate-45 transition-all" />
                    </Button>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="group/info p-3 bg-white rounded-lg border border-slate-200 hover:border-[#044866]/30 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg group-hover/info:scale-110 transition-transform">
                                <MapPin className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">
                                    Location
                                </p>
                                <p className="text-xs font-semibold text-slate-900">
                                    {industry?.addressLine1}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="group/info p-3 bg-white rounded-lg border border-slate-200 hover:border-[#6B46C1]/30 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-[#6B46C1] to-[#8B5CF6] flex items-center justify-center shadow-lg group-hover/info:scale-110 transition-transform">
                                <User className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-slate-500">
                                        Supervisor
                                    </p>
                                    {supervisor?.qualification && (
                                        <span className="text-[9px] bg-purple-100 text-[#6B46C1] px-1.5 py-0.5 rounded-full font-medium">
                                            {supervisor.qualification}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs font-semibold text-slate-900">
                                    {supervisor?.name}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="group/info p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover/info:scale-110 transition-transform">
                                <Phone className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">
                                    Contact
                                </p>
                                <p className="text-xs font-semibold text-slate-900">
                                    {supervisor?.phone ||
                                        industry?.phoneNumber ||
                                        '---'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="group/info p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                        <div className="flex items-start gap-2">
                            <div className="w-7 h-7 rounded-lg bg-linear-to-br from-blue-400 to-blue-500 flex items-center justify-center shadow-lg group-hover/info:scale-110 transition-transform">
                                <Globe className="w-3.5 h-3.5 text-white" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-slate-500 mb-0.5">
                                    Website
                                </p>
                                <p className="text-xs font-semibold text-slate-900 truncate">
                                    {industry?.website || '---'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Email Contact - Full Width */}
                <div className="mt-2 group/info p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-linear-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover/info:scale-110 transition-transform">
                            <Mail className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 mb-0.5">
                                Email Address
                            </p>
                            <p className="text-xs font-semibold text-slate-900 truncate">
                                {industry?.user?.email}
                            </p>
                        </div>
                        <Button outline onClick={onComposeMailClicked}>
                            <Mail className="w-3 h-3 mr-0.5" />
                            Send
                        </Button>
                    </div>
                </div>
            </div>
            <ResendApprovalEmailModal
                open={isResendModalOpen}
                onOpenChange={setIsResendModalOpen}
                approvalId={latestWorkplaceApprovaleRequest?.id}
            />
        </div>
    )
}
