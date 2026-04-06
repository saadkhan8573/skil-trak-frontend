import {
    AddressFieldInput,
    ShowErrorNotifications,
    TextInput,
} from '@components'
import { Button } from '@components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@components/ui/dialog'
import { StudentApi } from '@queries'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

interface EditPreferredAddressModalProps {
    isOpen: boolean
    onClose: () => void
    initialData: { suburb: string; zip: string }
    qId: number | string
    studentId: number | string
    wpId: number | string
}

export const EditPreferredAddressModal = ({
    isOpen,
    onClose,
    initialData,
    qId,
    studentId,
    wpId,
}: EditPreferredAddressModalProps) => {
    const [updateAddress, updateAddressResult] =
        StudentApi.Workplace.useUpdateStudentWorkplaceQuestionMutation()
    const formMethods = useForm({
        defaultValues: {
            addressLine1: initialData.suburb,
            zipCode: initialData.zip,
        },
        mode: 'all',
    })

    const { reset, getValues } = formMethods

    useEffect(() => {
        if (isOpen) {
            reset({
                addressLine1: initialData.suburb,
                zipCode: initialData.zip,
            })
        }
    }, [isOpen, initialData, reset])

    const handleSave = async (values: any) => {
        try {
            await updateAddress({
                qId: qId,
                stdId: studentId,
                wpId: wpId,
                answer: JSON.stringify({
                    suburb: values.addressLine1,
                    zip: values.zipCode,
                }),
            }).unwrap()
            onClose()
        } catch (error) {
            console.error('Failed to update address:', error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <ShowErrorNotifications result={updateAddressResult} />
            <DialogContent
                className="sm:max-w-xl! bg-white border-0 shadow-2xl"
                onPointerDownOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest('.pac-container')) {
                        e.preventDefault()
                    }
                }}
                onInteractOutside={(e) => {
                    const target = e.target as HTMLElement
                    if (target.closest('.pac-container')) {
                        e.preventDefault()
                    }
                }}
            >
                <DialogHeader className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-[#044866]">
                        Edit Preferred Address
                    </DialogTitle>
                </DialogHeader>

                <FormProvider {...formMethods}>
                    <div>
                        <AddressFieldInput
                            label="Address"
                            placeholder="Enter suburb"
                            defaultValue={initialData.suburb}
                        />

                        <TextInput
                            label="Zip Code"
                            name="zipCode"
                            placeholder="Enter postcode"
                            className="bg-slate-50 border-slate-200 focus:border-[#044866]/50 transition-colors"
                        />
                    </div>
                </FormProvider>

                <DialogFooter className="flex gap-3 pt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 h-11 transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={formMethods.handleSubmit(handleSave)}
                        disabled={updateAddressResult.isLoading}
                        className="flex-1 bg-linear-to-r from-[#044866] to-[#0D5468] text-white h-11 shadow-lg shadow-blue-900/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70"
                    >
                        {updateAddressResult.isLoading
                            ? 'Saving...'
                            : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
