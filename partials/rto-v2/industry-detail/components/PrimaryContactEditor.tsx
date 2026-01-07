import { Button, TextInput } from '@components'
import { useUpdateIndustryProfileMutation } from '@queries'
import { Edit2, Mail, Phone, Save, User, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface PrimaryContactEditorProps {
    industryUserId: number
    initialData: {
        contactPerson: string
        email: string
        phone: string
    }
}

export function PrimaryContactEditor({
    industryUserId,
    initialData,
}: PrimaryContactEditorProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState(initialData)

    const [updateProfile, { isLoading, isSuccess, reset }] =
        useUpdateIndustryProfileMutation()

    useEffect(() => {
        setFormData(initialData)
    }, [initialData])

    useEffect(() => {
        if (isSuccess) {
            setIsEditing(false)
            reset()
        }
    }, [isSuccess, reset])

    const handleSave = () => {
        if (!industryUserId) return

        updateProfile({
            id: Number(industryUserId),
            body: {
                contactPerson: formData.contactPerson,
                email: formData.email,
                phoneNumber: formData.phone,
            },
        })
    }

    const handleCancel = () => {
        setFormData(initialData)
        setIsEditing(false)
        reset()
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-all">
            <div className="bg-[#F8FAFB] border-b border-[#E2E8F0] p-3 flex items-center justify-between">
                <h3 className="text-[#1A2332] flex items-center gap-2 text-sm font-medium">
                    <User className="w-4 h-4 text-[#64748B]" />
                    Primary Contact
                </h3>
                {!isEditing && (<Button
                    onClick={() => setIsEditing(true)}
                    variant="secondary"
                    className="w-6 h-6 bg-white hover:bg-white text-[#64748B] hover:text-[#044866] border border-[#E2E8F0] hover:border-[#044866]/30 p-0 flex items-center justify-center rounded-md transition-all shadow-sm"
                    title="Edit Contact"
                >
                    <Edit2 className="w-3 h-3" />
                </Button>)}
            </div>

            <div className="p-3 space-y-2">
                {isEditing ? (
                    <div className="space-y-3">
                        <TextInput
                            name="contactPerson"
                            label="Contact Person"
                            value={formData.contactPerson}
                            onChange={(e: any) =>
                                setFormData({
                                    ...formData,
                                    contactPerson: e.target.value,
                                })
                            }
                            placeholder="Contact Person"
                            className="bg-white"
                        />
                        <TextInput
                            name="email"
                            label="Email"
                            value={formData.email}
                            onChange={(e: any) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value,
                                })
                            }
                            placeholder="Email Address"
                            className="bg-white"
                        />
                        <TextInput
                            name="phone"
                            label="Phone"
                            value={formData.phone}
                            onChange={(e: any) =>
                                setFormData({
                                    ...formData,
                                    phone: e.target.value,
                                })
                            }
                            placeholder="Phone Number"
                            className="bg-white"
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
                                onClick={handleSave}
                                className="px-3 py-1.5 h-auto text-xs bg-gradient-to-r from-[#10B981] to-[#059669] text-white"
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                <Save className="w-3.5 h-3.5 mr-1" />
                                Save
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-start gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <div className="flex-1">
                                <p className="text-[#1A2332] text-sm font-medium">
                                    {formData.contactPerson || 'Not provided'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <p className="text-[#1A2332] text-sm font-medium">
                                {formData.email || 'Not provided'}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-lg bg-[#F8FAFB] hover:bg-[#F1F5F9] transition-colors">
                            <div className="w-8 h-8 bg-[#E2E8F0] rounded-lg flex items-center justify-center flex-shrink-0">
                                <Phone className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <p className="text-[#1A2332] text-sm font-medium">
                                {formData.phone || 'Not provided'}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
