import { Button, Select, ShowErrorNotifications } from '@components'
import { useNotification } from '@hooks'
import { CommonApi } from '@queries'
import { Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { TicketAssigneeSelector } from '../TicketAssigneeSelector'
const statusOptions = [
    { value: 'open', label: 'Open', color: 'bg-red-500', icon: AlertTriangle },
    {
        value: 'inProgress',
        label: 'In Progress',
        color: 'bg-[#0D5468]',
        icon: Activity,
    },
    // { value: 'pending', label: 'Pending', color: 'bg-[#F7A619]', icon: Clock },
]

const priorityOptions = [
    { value: 'LOW', label: 'Low', color: 'bg-slate-500' },
    { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-500' },
    { value: 'HIGH', label: 'High', color: 'bg-[#F7A619]' },
    { value: 'CRITICAL', label: 'Critical', color: 'bg-red-500' },
]
export const QuickActionsBar = ({ ticket }: any) => {
    const [resolution, setResolution] = useState('')
    const [showResolveForm, setShowResolveForm] = useState(false)
    const { notification } = useNotification()

    const [updatePriority, updatePriorityResult] =
        CommonApi.Teams.useUpdateAutoTicketPriority()
    const [updateStatus, updateStatusResult] =
        CommonApi.Teams.useUpdateAutoTicketStatus()
    useEffect(() => {
        if (updatePriorityResult.isSuccess) {
            notification.success({
                title: 'Success',
                description: 'Priority updated successfully',
            })
        }
    }, [updatePriorityResult.isSuccess])
    useEffect(() => {
        if (updateStatusResult.isSuccess) {
            notification.success({
                title: 'Success',
                description: 'Ticket Resolved successfully',
            })
            setShowResolveForm(false)
        }
    }, [updateStatusResult.isSuccess])
    //
    const currentStatus = statusOptions.find((s) => s?.value === ticket?.status)

    const selectedPriority = priorityOptions.find(
        (opt) => opt?.value === ticket?.severity
    )

    const onChangePriority = (item: any) => {
        const priority = item?.value

        if (!priority) {
            return
        }

        updatePriority({ id: ticket?.id, params: { severity: priority } })
    }
    const onResolveTicket = () => {
        updateStatus({ id: ticket?.id, body: { resolution: resolution } })
    }
    return (
        <>
            <ShowErrorNotifications
                result={updatePriorityResult || updateStatusResult}
            />
            <div className="bg-white rounded-xl shadow-lg mb-4 p-4 border border-gray-200">
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-[#0D5468]/70 uppercase tracking-wider">
                        Quick Actions:
                    </span>
                    <Select
                        name="status"
                        options={statusOptions}
                        label={'Ticket Status'}
                        placeholder="Change status"
                        showError={false}
                        defaultValue={currentStatus ?? statusOptions?.[0]}
                        disabled={true}
                    />

                    {/* Status Dropdown */}
                    <TicketAssigneeSelector
                        taskId={ticket?.id}
                        teamId={ticket?.supportTeam?.id}
                        member={ticket?.assignedTo}
                    />
                    {/* Priority Dropdown */}
                    <Select
                        name="priority"
                        options={priorityOptions}
                        placeholder="Select priority"
                        label={'Priority'}
                        showError={false}
                        // value={ticket?.severity}
                        defaultValue={selectedPriority ?? null}
                        onChange={(e: any) => {
                            onChangePriority(e)
                        }}
                        loading={updatePriorityResult.isLoading}
                    />
                    {/* Resolve Button */}
                    {!ticket?.resolution && (
                        <button
                            onClick={() => {
                                setShowResolveForm(!showResolveForm)
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm ml-auto ${
                                showResolveForm
                                    ? 'bg-gray-200 text-[#044866]'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            <span>
                                {showResolveForm ? 'Cancel' : 'Resolve Ticket'}
                            </span>
                        </button>
                    )}
                </div>

                {/* Resolve Form */}
                {showResolveForm && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <label className="block text-sm text-[#044866] mb-2">
                            Resolution Details
                        </label>
                        <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Describe how this ticket was resolved..."
                            rows={3}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                        />
                        <Button
                            onClick={onResolveTicket}
                            disabled={
                                !resolution?.trim() ||
                                updateStatusResult.isLoading
                            }
                            loading={updateStatusResult.isLoading}
                            className="mt-2 px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Resolution
                        </Button>
                    </div>
                )}
            </div>
        </>
    )
}
