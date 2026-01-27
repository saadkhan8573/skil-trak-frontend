import { Button, Select, TextArea, TextInput } from '@components'
import { PlacementCall } from '@types'
import { AlertCircle, TicketPlus, X } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

interface TicketModalProps {
    call: PlacementCall
    onClose: () => void
}

export interface TicketData {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    category: string
}

export const TicketModal = ({ call, onClose }: TicketModalProps) => {
    const methods = useForm<TicketData>({
        mode: 'all',
        defaultValues: {
            priority: 'medium',
            category: '',
        },
    })

    const handleSubmit = (data: any) => {
        // e.preventDefault()
        onClose()
    }
    const selectedPriority = methods.watch('priority')

    const ticketCategoryOptions = [
        { label: 'Follow-up Required', value: 'follow-up' },
        { label: 'Documentation Issue', value: 'documentation' },
        { label: 'Placement Issue', value: 'placement' },
        { label: 'Student Concern', value: 'student-concern' },
        { label: 'Industry Partner Concern', value: 'industry-concern' },
        { label: 'Technical Issue', value: 'technical' },
        { label: 'Other', value: 'other' },
    ] as const

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4 flex items-start justify-between rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                <TicketPlus className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white mb-1">
                                    Create Support Ticket
                                </h2>
                                <p className="text-purple-100 text-sm">
                                    For {call?.student?.user?.name || '---'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>
                    </div>

                    {/* Content */}
                    <FormProvider {...methods}>
                        <form
                            onSubmit={methods.handleSubmit(handleSubmit)}
                            className="p-6 space-y-2"
                        >
                            {/* Call Info Banner */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="text-blue-900 font-medium">
                                            Call Information
                                        </p>
                                        <p className="text-blue-700">
                                            Agent: {call.agentName} | Phone:{' '}
                                            {call.phoneNumber}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Title */}
                            <div>
                                <TextInput
                                    label={'Ticket Title'}
                                    required
                                    name="title"
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <Select
                                    name="category"
                                    options={ticketCategoryOptions}
                                    label={'Category'}
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priority
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['low', 'medium', 'high'] as const).map(
                                        (priority) => (
                                            <button
                                                key={priority}
                                                type="button"
                                                onClick={() =>
                                                    methods.setValue(
                                                        'priority',
                                                        priority
                                                    )
                                                }
                                                className={`px-4 py-2.5 rounded-lg border-2 transition-all ${selectedPriority ===
                                                    priority
                                                    ? priority === 'high'
                                                        ? 'bg-red-50 border-red-500 text-red-700'
                                                        : priority ===
                                                            'medium'
                                                            ? 'bg-yellow-50 border-yellow-500 text-yellow-700'
                                                            : 'bg-green-50 border-green-500 text-green-700'
                                                    : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                                                    }`}
                                            >
                                                {priority
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    priority.slice(1)}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <TextArea
                                    required
                                    label={'Description'}
                                    name="description"
                                    placeholder="Provide detailed information about the issue or follow-up needed..."
                                    rows={6}
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <Button
                                    onClick={onClose}
                                    className="px-6 py-2.5"
                                    text="Cancel"
                                    variant="error"
                                    outline
                                />
                                <Button
                                    submit
                                    className="px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                    Icon={TicketPlus}
                                    text="Create Ticket"
                                />
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </div>
    )
}
