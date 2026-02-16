import { Button, InitialAvatar } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { PlacementCall } from '@types'
import { cn } from '@utils'
import {
    BookOpen,
    Building2,
    Calendar,
    Clock,
    FileText,
    Headphones,
    Phone,
    Trash2,
    User,
} from 'lucide-react'
import { useState } from 'react'
import { StatusBadge } from '../components'
import { formatDate, formatTime } from '../utils'
import { CallAudioModal } from './CallAudioModal'
import { DeleteCallModal } from './DeleteCallModal'

interface CallDetailModalProps {
    call: PlacementCall
    onClose: () => void
}

interface InfoCardProps {
    icon: React.ElementType
    label: string
    value: string
    className?: string
}

function InfoCard({ icon: Icon, label, value, className }: InfoCardProps) {
    return (
        <div className={cn("bg-gray-50/50 rounded-lg p-2 border border-gray-100", className)}>
            <div className="flex items-center gap-1.5 text-gray-500 mb-0.5">
                <Icon className="w-3 h-3" />
                <span className="text-xs font-medium uppercase">{label}</span>
            </div>
            <p className="text-sm text-gray-900 font-medium truncate">
                {value}
            </p>
        </div>
    )
}

export function CallDetailModal({ call, onClose }: CallDetailModalProps) {
    const [audioModalOpen, setAudioModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    return (
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl! w-full p-0 overflow-hidden border-none shadow-2xl rounded-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <DialogHeader className="bg-white border-b border-gray-100 px-5 py-2.5 flex-row items-start justify-between z-10 space-y-0 shrink-0">
                    <div className="flex-1">
                        <DialogTitle className="text-gray-900 font-semibold">
                            Call Details
                        </DialogTitle>
                        <DialogDescription className="text-gray-500 text-xs mt-0.5">
                            Complete information about this call
                        </DialogDescription>
                    </div>
                    <div className="flex items-center gap-2 pr-6">
                        <Button
                            variant="secondary"
                            onClick={() => setDeleteModalOpen(true)}
                            className="hover:bg-red-50 group h-8 w-8 p-0"
                            title="Delete Call"
                        >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                        </Button>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-5 space-y-4 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200">
                    {/* Student Information */}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            {call?.student?.user?.name && <InitialAvatar name={call?.student?.user?.name} />}
                            <div>
                                <h3 className="text-gray-900 font-semibold text-sm mb-0">
                                    {call?.student?.user?.name ?? '---'}
                                </h3>
                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                    <Phone className="w-3 h-3" />
                                    {call?.student?.phone ?? '---'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Call Status - Prominent Display */}
                    <div className="bg-linear-to-br from-gray-50 to-blue-50 rounded-xl p-3 border border-gray-100">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5 font-medium">
                                    Call Status
                                </p>
                                <StatusBadge
                                    status={call?.status ?? 'pending'}
                                    size="sm"
                                />
                            </div>
                            {call.priority && (
                                <div
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${call?.priority === 'high'
                                        ? 'bg-red-100 text-red-700'
                                        : call.priority === 'medium'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-green-100 text-green-700'
                                        }`}
                                >
                                    {call?.priority} Priority
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Call Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <InfoCard
                            icon={Calendar}
                            label="Date"
                            value={formatDate(call?.createdAt as any)}
                        />
                        <InfoCard
                            icon={Clock}
                            label="Time & Duration"
                            value={`${formatTime(call?.createdAt as any)} (${call?.callDuration ?? '---'})`}
                        />
                        <InfoCard
                            icon={User}
                            label="Agent"
                            value="AI Agent"
                        />
                        <InfoCard
                            icon={BookOpen}
                            label="Course"
                            value={call?.course?.title || 'Not specified'}
                            className="lg:col-span-2"
                        />
                        {/* <InfoCard
                            icon={Building2}
                            label="Industry"
                            value={call?.industry?.user?.name || 'Not specified'}
                        /> */}
                    </div>

                    {/* Placement Company */}
                    {call?.placementCompany && (
                        <div className="bg-sky-50/50 rounded-lg p-2.5 border border-sky-100">
                            <div className="flex items-center gap-2 text-sky-700 mb-0.5">
                                <Building2 className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">
                                    Placement Company
                                </span>
                            </div>
                            <p className="text-xs text-sky-900 font-medium">
                                {call?.placementCompany}
                            </p>
                        </div>
                    )}

                    {/* Call Recording */}
                    {call?.callId && (
                        <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-lg p-3 border border-purple-100">
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-purple-900 mb-0.5">
                                        <Headphones className="w-3.5 h-3.5" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">
                                            Recording
                                        </span>
                                    </div>
                                    <p className="text-xs text-purple-600">
                                        Full AI communication session
                                    </p>
                                </div>
                                <Button
                                    variant='primaryNew'
                                    onClick={() => setAudioModalOpen(true)}
                                >
                                    <Headphones className="w-3 h-3 mr-1.5" />
                                    Play Recording
                                </Button>
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2 text-gray-700 mb-2">
                            <FileText className="w-3.5 h-3.5" />
                            <span className="text-xs font-semibold">Call Summary</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                {call?.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-3 flex justify-end shrink-0">
                    <Button
                        variant='primaryNew'
                        onClick={onClose}
                        className="bg-[#044866] text-white hover:bg-[#0D5468] px-8 h-9 text-xs font-bold uppercase tracking-wider"
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>

            {/* Audio Modal */}
            {audioModalOpen && (
                <CallAudioModal
                    call={call as any}
                    onClose={() => setAudioModalOpen(false)}
                />
            )}

            {/* Delete Modal */}
            {deleteModalOpen && (
                <DeleteCallModal
                    item={call}
                    onCancel={() => setDeleteModalOpen(false)}
                />
            )}
        </Dialog>
    )
}
