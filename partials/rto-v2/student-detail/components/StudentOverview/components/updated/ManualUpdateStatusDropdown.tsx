import { useState } from 'react'
import { Badge } from '@components'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { WorkplaceCurrentStatus, WorkplaceStatusLabels } from '@utils'
import {
    Circle,
    Search,
    User,
    Users,
    ShieldCheck,
    Building2,
    GraduationCap,
    Landmark,
    Calendar,
    FileEdit,
    FileCheck,
    PlayCircle,
    XCircle,
    CheckCircle2,
    Octagon,
    ChevronDown,
} from 'lucide-react'
import { ManualUpdateStatusModal } from '../../modal'

interface ManualUpdateStatusDropdownProps {
    workplaceId: number
    currentStatus: WorkplaceCurrentStatus
}

const STATUS_ICONS: Record<WorkplaceCurrentStatus, any> = {
    [WorkplaceCurrentStatus.NotRequested]: Circle,
    [WorkplaceCurrentStatus.Applied]: Search,
    [WorkplaceCurrentStatus.CaseOfficerAssigned]: User,
    [WorkplaceCurrentStatus.Interview]: Users,
    [WorkplaceCurrentStatus.IndustryEligibility]: ShieldCheck,
    [WorkplaceCurrentStatus.AwaitingWorkplaceResponse]: Building2,
    [WorkplaceCurrentStatus.AwaitingStudentResponse]: GraduationCap,
    [WorkplaceCurrentStatus.AwaitingRtoResponse]: Landmark,
    [WorkplaceCurrentStatus.AppointmentBooked]: Calendar,
    [WorkplaceCurrentStatus.AwaitingAgreementSigned]: FileEdit,
    [WorkplaceCurrentStatus.AgreementSigned]: FileCheck,
    [WorkplaceCurrentStatus.PlacementStarted]: PlayCircle,
    [WorkplaceCurrentStatus.Cancelled]: XCircle,
    [WorkplaceCurrentStatus.Completed]: CheckCircle2,
    [WorkplaceCurrentStatus.NoResponse]: XCircle,
    [WorkplaceCurrentStatus.Rejected]: Octagon,
    [WorkplaceCurrentStatus.Terminated]: Octagon,
    [WorkplaceCurrentStatus.RejectedByStudent]: Octagon,
    [WorkplaceCurrentStatus.RejectedByIndustry]: Octagon,
    [WorkplaceCurrentStatus.RejectedByRto]: Octagon,
}

export function ManualUpdateStatusDropdown({
    workplaceId,
    currentStatus,
}: ManualUpdateStatusDropdownProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] =
        useState<WorkplaceCurrentStatus | null>(null)

    const handleStatusSelect = (status: WorkplaceCurrentStatus) => {
        setSelectedStatus(status)
        setIsModalOpen(true)
    }

    return (
        <>
            <Popover>
                <PopoverTrigger asChild>
                    <div className="group cursor-pointer">
                        <Badge
                            Icon={Search}
                            className="bg-linear-to-r from-[#044866] to-[#0D5468] text-white px-2 py-0.5 shadow-lg shadow-[#044866]/30 group-hover:scale-105 transition-all text-xs flex items-center gap-1.5 pr-1"
                        >
                            {WorkplaceStatusLabels[currentStatus]}
                            <ChevronDown className="w-3 h-3 text-white/70 group-hover:text-white transition-colors" />
                        </Badge>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 bg-white/95 backdrop-blur-md border-slate-200 shadow-2xl rounded-xl z-50">
                    <div className="p-2 mb-2 border-b border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Update Status
                        </p>
                    </div>
                    <div className="grid gap-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                        {Object.entries(WorkplaceStatusLabels).map(
                            ([key, label]) => {
                                const StatusIcon =
                                    STATUS_ICONS[
                                        key as WorkplaceCurrentStatus
                                    ] || Circle
                                const isActive = currentStatus === key

                                return (
                                    <button
                                        key={key}
                                        onClick={() =>
                                            handleStatusSelect(
                                                key as WorkplaceCurrentStatus
                                            )
                                        }
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-200 group/item ${
                                            isActive
                                                ? 'bg-blue-50 text-[#044866]'
                                                : 'hover:bg-slate-50 text-slate-600'
                                        }`}
                                    >
                                        <div
                                            className={`w-7 h-7 rounded-md flex items-center justify-center shadow-sm transition-transform group-hover/item:scale-110 ${
                                                isActive
                                                    ? 'bg-[#044866] text-white'
                                                    : 'bg-slate-100 text-slate-500 group-hover/item:bg-white group-hover/item:text-[#044866]'
                                            }`}
                                        >
                                            <StatusIcon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-semibold">
                                            {label}
                                        </span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#044866] animate-pulse" />
                                        )}
                                    </button>
                                )
                            }
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            <ManualUpdateStatusModal
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
                workplaceId={workplaceId}
                currentStatus={currentStatus}
                newStatus={selectedStatus}
            />
        </>
    )
}
