import * as Yup from 'yup'
import { Button, TextArea, ShowErrorNotifications } from '@components'
import { useUpdateIndustryDataMutation } from '@queries'
import { useNotification } from '@hooks'
import { Building, Edit2, FileText, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

interface IndustryBioEditorProps {
    industryId: number
    initialBio: string
    updatedAt?: string
}

export function IndustryBioEditor({
    industryId,
    initialBio,
    updatedAt,
}: IndustryBioEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const { notification } = useNotification()

    const [updateProfile, updateResult] = useUpdateIndustryDataMutation()
    const { isLoading, reset: resetMutation } = updateResult

    const validationSchema = Yup.object({
        bio: Yup.string().required('Biography is required'),
    })

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            bio: initialBio,
        },
        mode: 'all',
    })

    const { handleSubmit, reset, watch } = methods
    const bioValue = watch('bio')

    useEffect(() => {
        reset({ bio: initialBio })
    }, [initialBio, reset])

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
                body: {
                    bio: data.bio,
                },
            }).unwrap()

            notification.success({
                title: 'Success',
                description: 'Biography updated successfully',
            })
            setIsEditing(false)
        } catch (error) {
            // Error handling is managed by ShowErrorNotifications via updateResult
        }
    }

    const handleCancel = () => {
        reset({ bio: initialBio })
        setIsEditing(false)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all h-full flex flex-col">
            <ShowErrorNotifications result={updateResult} />
            <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-3 flex items-center justify-between shrink-0">
                <h3 className="text-[#1A2332] flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    Industry Biography
                </h3>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        variant="secondary"
                        className="w-6 h-6 bg-white hover:bg-white text-[#64748B] hover:text-[#044866] border border-[#E2E8F0] hover:border-[#044866]/30 p-0 flex items-center justify-center rounded-md transition-all shadow-sm"
                        title="Edit Biography"
                    >
                        <Edit2 className="w-3 h-3" />
                    </Button>
                )}
            </div>

            <div className="p-3 flex-1 flex flex-col">
                {isEditing ? (
                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col gap-3"
                        >
                            <TextArea
                                name="bio"
                                placeholder="Enter industry biography..."
                                rows={8}
                                className="flex-1 min-h-[150px]"
                            />
                            <div className="flex gap-2 justify-end mt-auto pt-2">
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
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                ) : (
                    <>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFB] border border-[#E2E8F0] flex-1">
                            <div className="w-10 h-10 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Building className="w-5 h-5 text-[#64748B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm leading-relaxed text-[#1A2332] whitespace-pre-wrap">
                                    {bioValue || 'No biography provided yet.'}
                                </p>
                            </div>
                        </div>
                        {updatedAt && (
                            <div className="mt-3 flex items-center gap-2 text-xs text-[#64748B] shrink-0">
                                <FileText className="w-3 h-3" />
                                <span>
                                    Last updated:{' '}
                                    {new Date(updatedAt).toLocaleDateString(
                                        'en-AU',
                                        {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        }
                                    )}
                                </span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
