import { Badge, Button } from '@components'
import { Supervisor } from '@types'
import { WorkplaceCurrentStatus } from '@utils'
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    FileText,
    Mail,
    MapPin,
    Phone,
} from 'lucide-react'
import moment from 'moment'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedWorkplace } from '@redux'
import {
    IWorkplaceIndustries,
    WorkplaceWorkIndustriesType,
} from 'redux/queryTypes'
import { useStatusInfo } from '../hooks/useStatusInfo'
import { getStatusCategory } from '@partials/rto-v2/student-detail/utils'

export const WorkplaceInfoDetails = ({
    selectedWorkplace,
}: {
    selectedWorkplace: IWorkplaceIndustries
}) => {
    const dispatch = useDispatch()

    const onSelectWorkplace = () => {
        dispatch(setSelectedWorkplace(null))
    }

    const workIndustry = selectedWorkplace?.industries?.[0]
    const industry = workIndustry?.industry

    const latestWorkplaceApprovaleRequest = useMemo(() => {
        return selectedWorkplace?.workplaceApprovaleRequest?.reduce(
            (latest: any, current: any) =>
                new Date(current?.createdAt) > new Date(latest?.createdAt)
                    ? current
                    : latest,
            selectedWorkplace?.workplaceApprovaleRequest?.[0]
        )
    }, [selectedWorkplace?.workplaceApprovaleRequest])

    const supervisor: Supervisor =
        latestWorkplaceApprovaleRequest?.industry?.supervisors?.[0]

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'in-progress':
                return {
                    color: 'bg-blue-500',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-700',
                    icon: Clock,
                    label: 'In Progress',
                }
            case 'pending':
                return {
                    color: 'bg-yellow-500',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-700',
                    icon: AlertCircle,
                    label: 'Pending',
                }
            case 'approved':
                return {
                    color: 'bg-emerald-500',
                    bgColor: 'bg-emerald-50',
                    borderColor: 'border-emerald-200',
                    textColor: 'text-emerald-700',
                    icon: CheckCircle,
                    label: 'Approved',
                }
            default:
                return {
                    color: 'bg-slate-500',
                    bgColor: 'bg-slate-50',
                    borderColor: 'border-slate-200',
                    textColor: 'text-slate-700',
                    icon: Clock,
                    label: 'Unknown',
                }
        }
    }

    const statusMapping = {
        [WorkplaceCurrentStatus.NotRequested]: 'Student Added',
        [WorkplaceCurrentStatus.Applied]: 'Industry sourcing',
        [WorkplaceCurrentStatus.CaseOfficerAssigned]: 'Industry sourcing',
        [WorkplaceCurrentStatus.Interview]: 'Industry Sourcing',
        [WorkplaceCurrentStatus.AwaitingStudentResponse]: 'Waiting for Student',
        [WorkplaceCurrentStatus.AwaitingRtoResponse]: 'Waiting for RTO',
        [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]:
            'Waiting for Industry',
        [WorkplaceCurrentStatus.AppointmentBooked]: 'Appointment',
        [WorkplaceCurrentStatus.AwaitingAgreementSigned]: 'Agreement Pending',
        [WorkplaceCurrentStatus.AgreementSigned]: 'Agreement Signed',
        [WorkplaceCurrentStatus.PlacementStarted]: 'Placement Started',
        [WorkplaceCurrentStatus.Completed]: 'Schedule Completed',
        [WorkplaceCurrentStatus.Cancelled]: 'Cancelled',
        [WorkplaceCurrentStatus.NoResponse]: 'No Response',
        [WorkplaceCurrentStatus.Rejected]: 'Rejected',
        [WorkplaceCurrentStatus.Terminated]: 'Terminated',
    }

    const statusOrder = [
        WorkplaceCurrentStatus.NotRequested,
        WorkplaceCurrentStatus.Applied,
        WorkplaceCurrentStatus.CaseOfficerAssigned,
        WorkplaceCurrentStatus.Interview,
        WorkplaceCurrentStatus.AwaitingStudentResponse,
        WorkplaceCurrentStatus.AwaitingRtoResponse,
        WorkplaceCurrentStatus.AwaitingWorkplaceResponse,
        WorkplaceCurrentStatus.AppointmentBooked,
        WorkplaceCurrentStatus.AwaitingAgreementSigned,
        WorkplaceCurrentStatus.AgreementSigned,
        WorkplaceCurrentStatus.PlacementStarted,
        WorkplaceCurrentStatus.Completed,
    ]

    // Function to get completed and pending status arrays
    const getStatusArrays = (
        currentStatus: WorkplaceCurrentStatus
    ): {
        completed: string[]
        pending: string[]
    } => {
        const currentIndex = statusOrder.indexOf(currentStatus)

        if (currentIndex === -1) {
            return {
                completed: [],
                pending: statusOrder.map(
                    (s: WorkplaceCurrentStatus) =>
                        statusMapping[s as keyof typeof statusMapping]
                ),
            }
        }

        const completed = statusOrder
            .slice(0, currentIndex + 1) // Include current status in completed
            .map(
                (status: WorkplaceCurrentStatus) =>
                    statusMapping[status as keyof typeof statusMapping]
            )

        const pending = statusOrder
            .slice(currentIndex + 1) // All statuses after current
            .map(
                (status: WorkplaceCurrentStatus) =>
                    statusMapping[status as keyof typeof statusMapping]
            )

        return { completed, pending }
    }

    // Usage example:
    const currentStatus = selectedWorkplace?.currentStatus
    const { completed, pending } = getStatusArrays(currentStatus)

    const statusCategory = getStatusCategory(
        selectedWorkplace?.currentStatus || ''
    )

    const { progressPercent, nextStep } = useStatusInfo({
        workplace: selectedWorkplace,
        workIndustry: workIndustry as WorkplaceWorkIndustriesType,
    })

    return (
        <div className="p-4">
            <Button
                outline
                variant="secondary"
                onClick={onSelectWorkplace}
                className="mb-4 text-xs"
            >
                <ChevronRight className="w-3 h-3 mr-1 rotate-180" />
                Back
            </Button>

            <div className="space-y-4">
                {/* Header */}
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-slate-900">
                                    {industry?.user?.name}
                                </h4>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    const statusConfig = getStatusConfig(
                                        selectedWorkplace?.currentStatus
                                    )
                                    const StatusIcon = statusConfig.icon
                                    return (
                                        <Badge
                                            variant={
                                                statusCategory === 'in-progress'
                                                    ? 'info'
                                                    : statusCategory ===
                                                        'pending'
                                                        ? 'warning'
                                                        : 'success'
                                            }
                                            text={statusCategory}
                                            Icon={StatusIcon}
                                            size="xs"
                                        />
                                    )
                                })()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">
                                {nextStep?.label}
                            </span>
                            <span className="text-primaryNew font-medium">
                                {progressPercent}%
                            </span>
                        </div>
                        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-primaryNew to-primaryNew rounded-full transition-all duration-500"
                                style={{
                                    width: `${progressPercent}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                        <Calendar className="w-4 h-4 text-[#044866]" />
                        <div>
                            <p className="text-xs text-slate-500">Requested</p>
                            <p className="text-slate-900">
                                {moment(selectedWorkplace?.createdAt).format(
                                    'DD MMM, YYYY'
                                )}
                            </p>
                        </div>
                    </div>
                    {/* <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                        <Clock className="w-4 h-4 text-[#F7A619]" />
                        <div>
                            <p className="text-xs text-slate-500">Due Date</p>
                            <p className="text-slate-900">
                                {selectedWorkplace.dueDate}
                            </p>
                        </div>
                    </div> */}
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                        <MapPin className="w-4 h-4 text-[#0D5468]" />
                        <div>
                            <p className="text-xs text-slate-500">Location</p>
                            <p className="text-slate-900">
                                {industry?.addressLine1}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg p-3 text-sm">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <div>
                            <p className="text-xs text-slate-500">Hours</p>
                            <p className="text-slate-900">
                                {selectedWorkplace?.courses?.[0]?.hours}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Supervisor */}
                {supervisor && (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-900 mb-3 font-medium">
                            Supervisor: {supervisor?.name}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Mail className="w-3 h-3" />
                                {supervisor?.email || '--'}
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Phone className="w-3 h-3" />
                                {supervisor?.phone || '--'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Steps */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                        <p className="text-xs text-slate-900 mb-2 font-medium">
                            Completed ({completed?.length})
                        </p>
                        <div className="space-y-1">
                            {completed?.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-slate-600"
                                >
                                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs text-slate-900 mb-2 font-medium">
                            Pending ({pending?.length})
                        </p>
                        <div className="space-y-1">
                            {pending?.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-2 text-xs text-slate-600"
                                >
                                    <Clock className="w-3 h-3 text-blue-600" />
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
