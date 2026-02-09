import React from 'react'
import { Button, Select, TextInput } from '@components'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { Bot, Plus } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'
import { AgentAction, CallReason, CALL_REASON_ACTIONS, AVAILABLE_ACTIONS } from '../types'

interface AddAgentModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (data: any) => void
}

export const AddAgentModal = ({ isOpen, onClose, onAdd }: AddAgentModalProps) => {
    const methods = useForm({
        defaultValues: {
            name: '',
            callReason: 'Workplace Details Collection' as CallReason,
            actions: CALL_REASON_ACTIONS['Workplace Details Collection'] as AgentAction[],
        }
    })

    const { watch, setValue } = methods
    const selectedActions = watch('actions')

    const handleReasonChange = (reason: any) => {
        const castReason = reason as CallReason
        setValue('actions', CALL_REASON_ACTIONS[castReason])
    }

    const toggleAction = (action: AgentAction) => {
        if (selectedActions.includes(action)) {
            setValue('actions', selectedActions.filter(a => a !== action))
        } else {
            setValue('actions', [...selectedActions, action])
        }
    }

    const onSubmit = (data: any) => {
        onAdd(data)
        onClose()
    }

    const reasonOptions = Object.keys(CALL_REASON_ACTIONS).map(reason => ({
        label: reason,
        value: reason
    }))

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl! p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh] [&>button[data-slot='dialog-close']]:text-white">
                <DialogHeader className="bg-primaryNew px-6 py-2.5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-white text-xl font-bold">Configure New Agent</DialogTitle>
                    </div>
                    <DialogDescription className="text-blue-50 text-sm">
                        Set up a new AI voice agent by defining its name, purpose, and allowed actions.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="px-6 overflow-y-auto">
                            <TextInput
                                label="Agent Name (AI)"
                                name="name"
                                placeholder="e.g., Maria - Workplace Collection"
                                required
                            />

                            <Select
                                label="Call Reason"
                                name="callReason"
                                options={reasonOptions}
                                onlyValue={true}
                                onChange={handleReasonChange}
                                required
                            />

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                    Agent Actions (Select one or more)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {AVAILABLE_ACTIONS.map(action => (
                                        <button
                                            key={action}
                                            type="button"
                                            onClick={() => toggleAction(action)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${selectedActions.includes(action)
                                                ? 'bg-primaryNew border-primaryNew text-white shadow-md translate-y-[-1px]'
                                                : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/50'
                                                }`}
                                        >
                                            {action}
                                        </button>
                                    ))}
                                </div>
                                {selectedActions.length === 0 && (
                                    <p className="text-red-500 text-[10px] mt-2 font-medium">At least one action is required.</p>
                                )}
                            </div>
                        </div>

                        <DialogFooter className="px-6 py-2.5 border-t border-gray-100 shrink-0 sm:justify-end gap-3 bg-gray-50/50">
                            <Button
                                onClick={onClose}
                                text="Cancel"
                                variant="error"
                                outline
                            />
                            <Button
                                submit
                                variant='primaryNew'
                                text="Create Agent"
                                Icon={Plus}
                                disabled={selectedActions.length === 0}
                            />
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
