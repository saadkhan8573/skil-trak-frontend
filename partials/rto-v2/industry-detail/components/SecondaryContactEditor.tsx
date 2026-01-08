import * as Yup from 'yup'
import { Button, TextInput, ShowErrorNotifications } from '@components'
import { useUpdateIndustryDataMutation } from '@queries'
import { useNotification } from '@hooks'
import { Edit2, Mail, Phone, Save, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface SecondaryContactEditorProps {
    industryId: number
    initialData: {
        secondaryContactName: string
        secondaryContactEmail: string
        secondaryContactPersonPhone: string
    }
}

export function SecondaryContactEditor({
    industryId,
    initialData,
}: SecondaryContactEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const { notification } = useNotification()

    const [updateProfile, updateResult] = useUpdateIndustryDataMutation()
    const { isLoading, isSuccess, reset: resetMutation } = updateResult

    const validationSchema = Yup.object({
        secondaryContactName: Yup.string(),
        secondaryContactEmail: Yup.string().email('Invalid email format'),
        secondaryContactPersonPhone: Yup.string(),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: initialData,
        mode: 'all',
    })

    const { handleSubmit, reset, watch } = methods
    const formData = watch()

    useEffect(() => {
        reset(initialData)
    }, [initialData, reset])

    // Reset mutation state when edit mode is toggled off
    useEffect(() => {
        if (!isEditing) {
            resetMutation()
        }
    }, [isEditing, resetMutation])

    const onSubmit = async (data: any) => {
        if (!industryId) return

        try {
            await updateProfile({
                id: Number(industryId),
                body: data,
            }).unwrap()

            notification.success({
                title: 'Success',
                description: 'Secondary contact updated successfully',
            })
            setIsEditing(false)
        } catch (error) {
            // Error handling is managed by ShowErrorNotifications via updateResult
        }
    }

    const handleCancel = () => {
        reset(initialData)
        setIsEditing(false)
        resetMutation()
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all">
            <ShowErrorNotifications result={updateResult} />
            <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-3 flex items-center justify-between">
                <h3 className="text-[#1A2332] flex items-center gap-2 text-sm font-medium">
                    <Users className="w-4 h-4 text-[#64748B]" />
                    Secondary Contact
                </h3>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="secondary"
                        className="w-6 h-6 bg-white hover:bg-white text-[#64748B] hover:text-[#044866] border border-[#E2E8F0] hover:border-[#044866]/30 p-0 flex items-center justify-center rounded-md transition-all shadow-sm"
                        title="Edit Secondary Contact"
                    >
                        <Edit2 className="w-3 h-3" />
                    </Button>
                )}
            </div>

            <div className="p-3 space-y-2">
                {isEditing ? (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                            <TextInput
                                name="secondaryContactName"
                                label="Contact Person"
                                placeholder="Contact Person"
                                className="bg-white"
                                validationIcons
                            />
                            <TextInput
                                name="secondaryContactEmail"
                                label="Email"
                                placeholder="Email Address"
                                className="bg-white"
                                validationIcons
                            />
                            <TextInput
                                name="secondaryContactPersonPhone"
                                label="Phone"
                                placeholder="Phone Number"
                                className="bg-white"
                                validationIcons
                            />
                            <div className="flex gap-2 justify-end pt-2">
                                <Button
                                    onClick={handleCancel}
                                    variant="secondary"
                                    className="px-3 py-1.5 h-auto text-xs"
                                    disabled={isLoading}
                                >
                                    <X className="w-3.5 h-3.5 mr-1" />
                                    Cancel
                                </Button>
                                <Button
                                    submit
                                    className="px-3 py-1.5 h-auto text-xs bg-gradient-to-r from-[#10B981] to-[#059669] text-white"
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    <Save className="w-3.5 h-3.5 mr-1" />
                                    Save
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                ) : (
                    <>
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Users className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[#1A2332] text-sm font-medium">
                                    {formData.secondaryContactName || 'Not provided'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <p className="text-[#1A2332] text-sm font-medium">
                                {formData.secondaryContactEmail || 'Not provided'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <p className="text-[#1A2332] text-sm font-medium">
                                {formData.secondaryContactPersonPhone || 'Not provided'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
