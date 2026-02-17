import { Badge, Button, InitialAvatar, NoData, Typography } from '@components'
import { latestWpApprovalRequest } from '@partials/rto-v2'
import { Supervisor } from '@types'
import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import {
    Award,
    Building2,
    Globe,
    Mail,
    MapPin,
    Phone,
    Plus,
    Star,
    Send
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'
import { ResendApprovalEmailModal } from '../modal/ResendApprovalEmailModal'

export function WorkplaceBio({
    workplace,
    handleAddNewWorkplace,
}: {
    workplace: IWorkplaceIndustries
    handleAddNewWorkplace: () => void
}) {
    const [isResendModalOpen, setIsResendModalOpen] = useState(false)
    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const workIndustry = workplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    const industry =
        workIndustry?.industry || latestWorkplaceApprovaleRequest?.industry || workplace?.studentProvidedWorkplaceRequestApproval?.industry

    const supervisor: Supervisor =
        latestWorkplaceApprovaleRequest?.industry?.supervisors?.[0]

    const course = workplace?.courses?.[0]

    const isCompletedWP = [
        WorkplaceCurrentStatus.Completed,
        WorkplaceCurrentStatus.Cancelled,
        WorkplaceCurrentStatus.Rejected,
        WorkplaceCurrentStatus.Terminated,
        WorkplaceCurrentStatus.NoResponse,
    ].includes(workplace?.currentStatus)

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary shadow-xl shadow-slate-200/50 p-5 hover:shadow-2xl transition-all">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3.5 mb-5">
                    <div className="relative group">
                        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-primaryNew to-primaryNew flex items-center justify-center text-white shadow-xl shadow-primaryNew/30 group-hover:scale-110 transition-transform">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-[#F7A619] rounded-lg border-2 border-white flex items-center justify-center shadow-lg">
                            <Star className="w-2 h-2 text-white fill-white" />
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-slate-900 mb-0.5">
                            Workplace Bio & Details
                        </h2>
                        <p className="text-slate-600 text-sm">
                            Primary Placement Organization
                        </p>
                    </div>
                </div>

                {/*  */}
                {isCompletedWP && (
                    <Button
                        variant="primaryNew"
                        onClick={handleAddNewWorkplace}
                    >
                        <Plus className="w-4 h-4" />
                        Add New Workplace
                    </Button>
                )}
            </div>

            {industry ? (
                <>
                    {/* Organization Name */}
                    <div className="mb-5 bg-linear-to-br from-primaryNew/5 to-primaryNew/5 rounded-xl p-4 border border-primaryNew/10">
                        <div className="flex items-center gap-2">
                            <h3 className="text-slate-900">
                                {industry?.user?.name}
                            </h3>
                            <Award className="w-4 h-4 text-[#F7A619]" />
                        </div>
                    </div>

                    {/* Approval Status */}
                    {latestWorkplaceApprovaleRequest && (
                        <div className="mb-5 bg-linear-to-br from-secondary to-white rounded-xl p-4 border border-secondary">
                            <div className="flex items-center gap-2 mb-2">
                                <Typography variant="title" medium>
                                    Student  Approval Status
                                </Typography>
                                <Badge
                                    variant={
                                        latestWorkplaceApprovaleRequest.status === 'approved'
                                            ? 'success'
                                            : latestWorkplaceApprovaleRequest.status === 'rejected'
                                                ? 'error'
                                                : 'warning'
                                    }
                                    text={
                                        latestWorkplaceApprovaleRequest?.status
                                            ?.charAt(0)
                                            ?.toUpperCase() +
                                        latestWorkplaceApprovaleRequest?.status?.slice(1)
                                    }
                                />
                                {latestWorkplaceApprovaleRequest.status === 'pending' && (
                                    <Button
                                        variant="info"
                                        onClick={() => setIsResendModalOpen(true)}
                                        className="ml-auto"
                                    >
                                        <Send className="w-3 h-3 mr-1" />
                                        Resend Email
                                    </Button>
                                )}
                            </div>
                            {latestWorkplaceApprovaleRequest?.status === 'rejected' &&
                                latestWorkplaceApprovaleRequest.comment && (
                                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">
                                            Rejection Reason:
                                        </p>
                                        <p className="text-sm text-slate-900">
                                            {latestWorkplaceApprovaleRequest.comment}
                                        </p>
                                    </div>
                                )}
                        </div>
                    )}

                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mb-5">
                        <div className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-linear-to-br from-secondary to-white border border-secondary hover:border-primaryNew/30 hover:shadow-lg transition-all cursor-pointer">
                            <MapPin className="w-3.5 h-3.5 text-primaryNew mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="text-sm text-slate-600 mb-0.5">
                                    Address
                                </p>
                                <p className="text-sm text-slate-900">
                                    {industry?.addressLine1}
                                </p>
                            </div>
                        </div>

                        <div className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-linear-to-br from-secondary to-white border border-secondary hover:border-primaryNew/30 hover:shadow-lg transition-all cursor-pointer">
                            <Phone className="w-3.5 h-3.5 text-primaryNew mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="text-sm text-slate-600 mb-0.5">
                                    Contact
                                </p>
                                <p className="text-sm text-slate-900">
                                    {industry?.phoneNumber}
                                </p>
                            </div>
                        </div>

                        <div className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-linear-to-br from-secondary to-white border border-secondary hover:border-primaryNew/30 hover:shadow-lg transition-all cursor-pointer">
                            <Mail className="w-3.5 h-3.5 text-primaryNew mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="text-sm text-slate-600 mb-0.5">
                                    Email
                                </p>
                                <p className="text-sm text-slate-900">
                                    {industry?.user?.email}
                                </p>
                            </div>
                        </div>

                        <div className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-linear-to-br from-secondary to-white border border-secondary hover:border-primaryNew/30 hover:shadow-lg transition-all cursor-pointer">
                            <Globe className="w-3.5 h-3.5 text-primaryNew mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                            <div>
                                <p className="text-sm text-slate-600 mb-0.5">
                                    Website
                                </p>
                                <p className="text-sm text-slate-900">
                                    {industry?.website || '---'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-linear-to-br from-secondary to-white rounded-xl p-4 border border-secondary mb-5">
                        <h4 className="text-slate-900 mb-2.5 flex items-center gap-2">
                            About the Organization
                        </h4>
                        <p
                            className="text-sm text-slate-600 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: industry?.bio || '',
                            }}
                        />
                    </div>

                    {/* Organization Details */}
                    <div className="space-y-4">
                        {/* <div className="bg-gradient-to-br from-secondary to-white rounded-xl p-4 border border-secondary">
                <h4 className="text-slate-900 mb-2.5 flex items-center gap-2">
                    <span>About the Organization</span>
                    <span className="text-xs bg-primaryNew/10 text-primaryNew px-2 py-0.5 rounded border border-primaryNew/20">
                        Est. {moment(industry?.createdAt).format('YYYY')}
                    </span>
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                    Hale Foundation is a leading provider of aged care and
                    disability support services in Victoria. With over 30
                    years of experience, they specialize in person-centered
                    care, community engagement, and innovative support
                    solutions. The organization is committed to providing
                    quality training environments for students pursuing
                    careers in the care sector.
                </p>
            </div> */}

                        {/* Travel Information */}
                        {/* <div className="bg-gradient-to-br from-primaryNew/5 to-primaryNew/5 rounded-xl p-4 border border-primaryNew/20">
                <h4 className="text-slate-900 mb-2.5 flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-primaryNew" />
                    <span>Distance from Student</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primaryNew to-primaryNew flex items-center justify-center shadow-lg shadow-primaryNew/20">
                            <Navigation className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">
                                Distance
                            </p>
                            <p className="text-sm text-slate-900">
                                12.5 km
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-400/20">
                            <Footprints className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">
                                Walking
                            </p>
                            <p className="text-sm text-slate-900">2h 30m</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F7A619] to-[#F7A619]/80 flex items-center justify-center shadow-lg shadow-[#F7A619]/20">
                            <Bus className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">
                                Public Transport
                            </p>
                            <p className="text-sm text-slate-900">
                                45 mins
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-xl p-2 border border-white/40">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primaryNew to-primaryNew flex items-center justify-center shadow-lg shadow-primaryNew/20">
                            <Car className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-600">Car</p>
                            <p className="text-sm text-slate-900">
                                18 mins
                            </p>
                        </div>
                    </div>
                </div>
            </div> */}

                        {/* Supervisor Information */}
                        <div className="relative overflow-hidden bg-linear-to-br from-primaryNew/5 via-primaryNew/5 to-transparent rounded-2xl p-4 border border-primaryNew/20 shadow-inner">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-primaryNew/10 to-transparent rounded-full blur-2xl"></div>
                            <h4 className="text-slate-900 mb-2.5 relative">
                                Workplace Supervisor
                            </h4>
                            <div className="relative flex items-start gap-2.5">
                                {supervisor?.name && (
                                    <InitialAvatar name={supervisor?.name} />
                                )}
                                <div className="flex-1">
                                    <p className="text-[15px] text-slate-900 mb-0.5">
                                        {supervisor?.name}
                                    </p>
                                    <p className="text-slate-600 text-sm mb-2">
                                        {supervisor?.qualification}
                                    </p>
                                    <div className="flex flex-wrap gap-2.5">
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-lg">
                                            <Phone className="w-2.5 h-2.5 text-primaryNew" />
                                            {supervisor?.phone || '---'}
                                        </p>
                                        <p className="text-sm text-slate-600 flex items-center gap-1.5 bg-white/60 px-2.5 py-1 rounded-lg">
                                            <Mail className="w-2.5 h-2.5 text-primaryNew" />
                                            {supervisor?.email || '---'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <div>
                        <Typography variant="title" medium>
                            Current Status
                        </Typography>
                        <Badge
                            variant="primaryNew"
                            text={
                                WorkplaceStatusLabels[workplace?.currentStatus]
                            }
                        />
                    </div>
                    <NoData text="No workplace industry found!" />
                </div>
            )}
            <ResendApprovalEmailModal
                open={isResendModalOpen}
                onOpenChange={setIsResendModalOpen}
                approvalId={latestWorkplaceApprovaleRequest?.id}
            />
        </div>
    )
}
