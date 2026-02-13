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

import { CommonApi } from '@queries/common/common.query'
import { useNotification } from '@hooks'

interface AddAgentModalProps {
    isOpen: boolean
    onClose: () => void
}

export const AddAgentModal = ({ isOpen, onClose }: AddAgentModalProps) => {
    const [createAgent, { isLoading }] =
        CommonApi.CallManagement.useCreateAgentMutation()
    const { notification } = useNotification()

    const methods = useForm({
        defaultValues: {
            name: '',
            vapiAgentId: '',
            responsibility: 'Workplace Details Collection',
        },
    })

    const onSubmit = async (data: any) => {
        try {
            await createAgent(data).unwrap()
            notification.success({
                title: 'Success',
                description: 'Agent created successfully',
            })
            methods.reset()
            onClose()
        } catch (error: any) {
            notification.error({
                title: 'Error',
                description: error?.data?.message || 'Failed to create agent',
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl! p-0 border-none shadow-2xl flex flex-col max-h-[90vh] [&>button[data-slot='dialog-close']]:text-white">
                <DialogHeader className="bg-primaryNew px-6 py-2.5 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <Bot className="w-6 h-6 text-white" />
                        </div>
                        <DialogTitle className="text-white text-xl font-bold">
                            Configure New Agent
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-blue-50 text-sm">
                        Set up a new AI voice agent by defining its name, Vapi
                        ID, and responsibility.
                    </DialogDescription>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form
                        onSubmit={methods.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-7 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <TextInput
                                    label="Agent Name"
                                    name="name"
                                    placeholder="e.g., Maria - Workplace Collection"
                                    required
                                />
                                <TextInput
                                    label="Vapi Agent ID"
                                    name="vapiAgentId"
                                    placeholder="e.g., agent_xxx_xxx"
                                    required
                                />
                            </div>
                            <Select
                                label="Responsibility"
                                name="responsibility"
                                options={[
                                    {
                                        label: 'Workplace Details Collection',
                                        value: 'Workplace Details Collection',
                                    },
                                    {
                                        label: 'Student Follow-up',
                                        value: 'Student Follow-up',
                                    },
                                    {
                                        label: 'Placement Status Check',
                                        value: 'Placement Status Check',
                                    },
                                ]}
                                onlyValue
                                required
                                menuPlacement="top"
                            />
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
                                variant="primaryNew"
                                text="Create Agent"
                                Icon={Plus}
                                disabled={isLoading}
                                loading={isLoading}
                            />
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    )
}
