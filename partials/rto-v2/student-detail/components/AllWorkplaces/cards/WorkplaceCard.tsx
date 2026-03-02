import {
    AuthorizedUserComponent,
    Badge,
    Button,
    InitialAvatar,
} from '@components'
import { Progressbar } from '@partials/rto-v2/components/Progressbar'
import {
    getStatusCategory,
    latestWpApprovalRequest,
} from '@partials/rto-v2/student-detail/utils'
import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import {
    AlertCircle,
    Award,
    BookOpen,
    Building2,
    Calendar,
    CheckCircle2,
    Clock,
    Eye,
    Hourglass,
    Mail,
    MapPin,
    Phone,
    XCircle,
} from 'lucide-react'
import moment from 'moment'
import { ReactElement, useMemo, useState } from 'react'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from '@redux/queryTypes'
import { ComposeEmailModal } from '../../Communications'
import { useRouter } from 'next/router'
import { CancelWpRequest } from '../components/CancelWpRequest'
import { CancelWorkplaceModal, CancelWorkplaceRequestModal } from '../modals'
import { UserRoles } from '@constants'
import { getUserCredentials } from '@utils'
import { ChevronRight } from 'lucide-react'

export const WorkplaceCard = ({
    workplace,
}: {
    workplace: IWorkplaceIndustries
}) => {
    const [modal, setModal] = useState<ReactElement | null>(null)

    const router = useRouter()

    const status = getStatusCategory(workplace?.currentStatus || '')

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return (
                    <Badge
                        variant="success"
                        text="Active Placement"
                        Icon={CheckCircle2}
                        className="gap-[1.35px] border  border-emerald-300"
                        size="xs"
                    />
                )
            case 'completed':
                return (
                    <Badge
                        variant="info"
                        text="Completed"
                        Icon={CheckCircle2}
                        className="gap-[1.35px] border border-blue-300"
                        size="xs"
                    />
                )
            case 'pending':
                return (
                    <Badge
                        variant="warning"
                        text="Pending Approval"
                        Icon={Hourglass}
                        className="gap-[1.35px] bg-white! font-semibold! border border-amber-300"
                        size="xs"
                    />
                )
            case 'withdrawn':
                return (
                    <Badge
                        variant="muted"
                        text="Withdrawn"
                        Icon={XCircle}
                        className="gap-[1.35px] border border-slate-300"
                        size="xs"
                    />
                )
            default:
                return null
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'active':
                return 'from-emerald-500 to-emerald-600'
            case 'completed':
                return 'from-blue-500 to-blue-600'
            case 'pending':
                return 'from-amber-500 to-amber-600'
            case 'withdrawn':
                return 'from-slate-400 to-slate-500'
            default:
                return 'from-[#044866] to-[#0D5468]'
        }
    }

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return latestWpApprovalRequest(
            workplace?.workplaceApprovaleRequest || []
        )
    }, [workplace?.workplaceApprovaleRequest])

    const workIndustry = workplace?.industries?.find(
        (i: WorkplaceWorkIndustriesType) => i?.applied
    )

    const industry =
        latestWorkplaceApprovaleRequest?.industry ||
        workIndustry?.industry ||
        workplace?.studentProvidedWorkplaceRequestApproval?.industry

    const supervisor = industry?.supervisors?.[0]
    const workplaceType = industry?.workplaceType

    const onCancelClicked = () => setModal(null)

    const onComposeMailClicked = () => {
        setModal(
            <ComposeEmailModal
                user={industry?.user}
                onCancel={onCancelClicked}
            />
        )
    }

    const onCancelWPClicked = () => {
        setModal(
            <CancelWorkplaceModal
                open={true}
                onOpenChange={onCancelClicked}
                workplaceId={Number(workplace?.id)}
            />
        )
    }

    const onCancelWPRequestClicked = () => {
        setModal(
            <CancelWorkplaceRequestModal
                open={true}
                onOpenChange={onCancelClicked}
                workplaceId={Number(workplace?.id)}
            />
        )
    }

    const onViewDetailedClicked = () => {
        const role = getUserCredentials()?.role
        if (role === UserRoles.RTO) {
            router.push(
                `/portals/rto/students-and-placements/placement-requests/${workplace.id}/${workplace.student?.id}`
            )
        } else if (role === UserRoles.ADMIN) {
            router.push(
                `/portals/admin/workplaces/${workplace.id}/${workplace.student?.id}`
            )
        } else if (role === UserRoles.SUBADMIN) {
            router.push(
                `/portals/sub-admin/tasks/workplace/${workplace.id}/${workplace.student?.id}`
            )
        }
    }

    const getIndustryLink = () => {
        const role = getUserCredentials()?.role
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

    return (
        <div className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg hover:shadow-2xl transition-all overflow-hidden">
            {modal}

            {/* Header Banner */}
            <div
                className={`bg-linear-to-r ${getStatusIcon(
                    status
                )} px-5 py-3 flex items-center justify-between`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-white">
                                {industry?.user?.name ||
                                    'Industry Not Provided'}
                            </h4>
                            {industryLink && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(industryLink)
                                    }}
                                    className={`cursor-pointer p-1 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors border border-white/10 ${
                                        status === 'active'
                                            ? 'animate-pulse'
                                            : ''
                                    }`}
                                    title="View Industry Profile"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <p className="text-white/80 text-sm">
                            {workplaceType?.name || 'Not Assigned'}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                    {getStatusBadge(status)}
                    <Badge
                        variant="warning"
                        text={WorkplaceStatusLabels[workplace?.currentStatus]}
                        Icon={Clock}
                        size="xs"
                        className="bg-white/20! text-white! border-white/30"
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Key Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#044866]/10 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4 text-[#044866]" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                                Address
                            </p>
                            <p className="text-sm text-slate-900">
                                {industry?.addressLine1 || 'Not Specified'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0D5468]/10 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4 text-[#0D5468]" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                                Workplace Type
                            </p>
                            <p className="text-sm text-slate-900">
                                {workplaceType?.name || 'Not Assigned'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#F7A619]/10 flex items-center justify-center shrink-0">
                            <Calendar className="w-4 h-4 text-[#F7A619]" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 mb-0.5">
                                {/* {workplace.status === 'pending'
                                    ? 'Requested'
                                    : 'Period'} */}
                                Requested
                            </p>
                            <p className="text-sm text-slate-900">
                                {moment(workplace?.createdAt)
                                    .tz('Australia/Melbourne')
                                    .format('ddd DD, MMM, yyyy [at] hh:mm A')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Course Information Section */}
                {workplace?.courses && workplace?.courses?.length > 0 && (
                    <div className="bg-linear-to-br from-[#044866]/5 to-[#0D5468]/5 border border-slate-200/60 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#044866] flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm font-semibold text-slate-900">
                                Assigned Course
                            </p>
                        </div>
                        <div className="space-y-3">
                            {workplace?.courses?.map((course) => (
                                <div
                                    key={course.id}
                                    className="flex items-center justify-between p-2 rounded-lg bg-white/50 border border-slate-100"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm text-slate-900 font-medium">
                                            {course.title}
                                        </span>
                                        <span className="text-[11px] text-slate-500 uppercase tracking-wider">
                                            Code: {course.id}
                                        </span>
                                    </div>
                                    <Badge
                                        variant="primaryNew"
                                        outline
                                        text={`${course.hours} Hours`}
                                        Icon={Award}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Supervisor Info */}
                <div className="bg-linear-to-br from-slate-50 to-blue-50/30 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3">
                        {supervisor?.name && (
                            <InitialAvatar name={supervisor?.name} />
                        )}
                        <div className="flex-1">
                            <p className="text-sm text-slate-900 mb-0.5">
                                {supervisor?.name || 'No Supervisor Assigned'}
                            </p>
                            <p className="text-xs text-slate-600">
                                {supervisor?.qualification ||
                                    'Pending Confirmation'}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a
                                href={`tel:${supervisor?.phone}`}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-[#044866] hover:bg-[#044866]/5 transition-all"
                            >
                                <Phone className="w-3.5 h-3.5 text-[#044866]" />
                            </a>
                            <div
                                onClick={onComposeMailClicked}
                                className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center hover:border-[#044866] hover:bg-[#044866]/5 transition-all"
                            >
                                <Mail className="w-3.5 h-3.5 text-[#044866]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Bar for Active/Completed */}
                {/* {(workplace.status === 'active' ||
                    workplace.status === 'completed') &&
                    workplace.hoursCompleted &&
                    workplace.hoursRequired && (
                        <div className="bg-white border border-slate-200 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-slate-700">
                                    Hours Progress
                                </p>
                                <p className="text-sm text-slate-900">
                                    {workplace.hoursCompleted} /{' '}
                                    {workplace.hoursRequired} hours
                                </p>
                            </div>
                            <Progressbar
                                value={
                                    (workplace.hoursCompleted /
                                        workplace.hoursRequired) *
                                    100
                                }
                                variant={
                                    workplace.status === 'active'
                                        ? 'success'
                                        : 'info'
                                }
                                size="sm"
                                className="h-[7.2px]"
                            />
                            <p className="text-xs text-slate-500 mt-2">
                                {workplace.status === 'active'
                                    ? `${
                                          workplace.hoursRequired -
                                          workplace.hoursCompleted
                                      } hours remaining`
                                    : 'Placement completed successfully'}
                            </p>
                        </div>
                    )} */}

                {/* Pending Status Info */}
                {status === 'pending' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <p className="text-sm text-amber-900">
                                <span className="font-medium">Status:</span>{' '}
                                {
                                    WorkplaceStatusLabels[
                                        workplace?.currentStatus
                                    ]
                                }
                            </p>
                        </div>
                        {/* <p className="text-xs text-amber-700 mt-2">
                            Requires {workplace.hoursRequired} hours of
                            placement
                        </p> */}
                    </div>
                )}

                {workplace?.currentStatus ===
                    WorkplaceCurrentStatus.AwaitingRtoResponse && (
                    <AuthorizedUserComponent roles={[UserRoles.RTO]}>
                        <Button
                            outline
                            fullWidth
                            variant="primaryNew"
                            text="View Details"
                            className="mt-3"
                            onClick={() =>
                                router.push(
                                    `/portals/rto/action-required/approve-placement/${latestWorkplaceApprovaleRequest?.id}`
                                )
                            }
                        />
                    </AuthorizedUserComponent>
                )}

                {/* Cancel Section */}
                {/* {[
                    WorkplaceCurrentStatus.Applied,
                    WorkplaceCurrentStatus.CaseOfficerAssigned,
                    WorkplaceCurrentStatus.Interview,
                    WorkplaceCurrentStatus.AwaitingStudentResponse,
                    WorkplaceCurrentStatus.AwaitingRtoResponse,
                    WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
                    WorkplaceCurrentStatus.AppointmentBooked,
                    WorkplaceCurrentStatus.AwaitingAgreementSigned,
                ].includes(workplace?.currentStatus as WorkplaceCurrentStatus) && ( */}
                <div className="mt-4 border-t border-slate-100">
                    {!workplace?.cancelledRequests?.length ? (
                        [
                            WorkplaceCurrentStatus.Applied,
                            WorkplaceCurrentStatus.CaseOfficerAssigned,
                            WorkplaceCurrentStatus.Interview,
                            WorkplaceCurrentStatus.AwaitingStudentResponse,
                            WorkplaceCurrentStatus.AwaitingRtoResponse,
                            WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
                            WorkplaceCurrentStatus.AppointmentBooked,
                            WorkplaceCurrentStatus.AwaitingAgreementSigned,
                        ].includes(
                            workplace?.currentStatus as WorkplaceCurrentStatus
                        ) && (
                            <CancelWpRequest
                                onCancelWPClicked={onCancelWPClicked}
                                onCancelWPRequestClicked={
                                    onCancelWPRequestClicked
                                }
                            />
                        )
                    ) : (
                        <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                <Clock className="w-4 h-4 text-amber-600" />
                            </div>
                            <p className="text-[11px] text-amber-800 leading-normal">
                                <span className="font-bold block">
                                    Cancellation Pending
                                </span>
                                Sent to Admin for approval.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                    <Button
                        variant="primaryNew"
                        className="flex-1 bg-linear-to-r from-[#044866] to-[#0D5468] hover:from-[#0D5468] hover:to-[#044866] text-white shadow-lg shadow-[#044866]/30 h-10 text-xs font-semibold"
                        onClick={onViewDetailedClicked}
                    >
                        View Detailed Workplace
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
